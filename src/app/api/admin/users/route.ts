import {NextRequest, NextResponse} from "next/server";
import {supabase} from "@/lib/supabase.server"
import {z} from "zod";
import {hashPassword} from "@/lib/auth";

const createUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name is required.")
        .max(30, "Name must be 30 characters or fewer."),
    // zod v4에서 string().email()은 deprecated이며 z.email()을 쓰라고 안내합니다.
    // (node_modules/zod/v4/classic/schemas.d.ts 참고)
    email: z
        .email("Invalid email format.")
        .trim()
        .max(256, "Email must be 256 characters or fewer."),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters.")
        .max(100, "Password is too long."),
    roleSeq: z
        .number()
        .int("Role number must be an integer.")
        .positive("Role number must be positive."),
    adminMemo: z
        .string()
        .trim()
        .max(100, "Admin memo must be 100 characters or fewer.")
        .nullable()
        .optional()
        // 공백만 입력하거나 빈 문자열을 보낸 경우 DB에는 NULL로 저장되도록 통일.
        .transform((value) => (value ? value : null)),
});



// 관리자가 직접 회원 테이블에 회원을 추가할 때 사용하는 API
export async function POST(request: NextRequest) {
    // 1) 요청 body가 JSON으로 파싱 가능한지 확인.
    //    request.json()은 body가 비어있거나 JSON이 아니면 예외를 던진다.
    let json;
    try {
        json = await request.json();
    } catch {
        return NextResponse.json(
            {message: "Request body is not valid JSON."},
            {status: 400},
        );
    }

    // 2) 스키마 검증. 이 시점에는 JSON 파싱은 이미 성공했으므로,
    //    실패 메시지는 "Invalid JSON"이 아니라 "입력값이 올바르지 않다"는 의미로 표기.
    const parseResult = createUserSchema.safeParse(json)

    if (!parseResult.success) {
        return NextResponse.json(
            {
                message: "Invalid input.",
                errors: z.flattenError(parseResult.error)
            },
            {
                status: 400,
            },
        );
    }

    const {name, email, password, roleSeq, adminMemo} = parseResult.data;

    // 3) 비밀번호 해싱과 DB insert를 하나의 try/catch로 묶어
    //    hashPassword가 실패하는 경우까지 함께 처리한다.
    //    (해싱 실패를 밖에 두면 처리되지 않은 예외로 500이 던져지고
    //     여기서 만든 통일된 에러 응답 형식을 벗어나게 된다.)
    try {
        const hashedPassword = await hashPassword(password);

        const {error} = await supabase
            .from("tb_user")
            .insert({
                name: name,
                email: email,
                password: hashedPassword,
                role_seq: roleSeq,
                admin_memo: adminMemo,
            });

        if (error) {
            // Postgres unique violation(23505) → 이메일 중복으로 판단해 명확한 메시지 전달.
            if (error.code === "23505") {
                return NextResponse.json(
                    {message: "This email is already registered."},
                    {status: 409},
                );
            }

            // 그 외 DB 에러는 원문(error.message)을 그대로 클라이언트에 노출하지 않는다.
            // 테이블/컬럼명, 제약조건 이름 등 내부 스키마 정보가 노출될 수 있기 때문.
            // 서버 로그에만 상세 내용을 남기고, 클라이언트에는 일반화된 메시지를 반환.
            console.error("[POST /api/admin/users] DB insert error:", error);
            return NextResponse.json(
                {message: "An error occurred while creating the user."},
                {status: 500},
            );
        }

        return NextResponse.json({message: "User added successfully."}, {status: 201});

    } catch (err) {
        // hashPassword 실패, 네트워크 단절 등 예기치 못한 예외.
        // 원인 파악을 위해 서버 로그에는 남기되, 클라이언트에는 일반화된 메시지만 전달.
        console.error("[POST /api/admin/users] Unexpected error:", err);
        return NextResponse.json({message: "An internal server error occurred."}, {status: 500});
    }
}


