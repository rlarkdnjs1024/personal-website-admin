import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";
import {signIn, signOut} from "@/lib/auth";
import {cookies} from "next/headers";


//session을 생성하는 로그인
export async function POST(request: NextRequest) {
    let json;
    try {
        json = await request.json();
    } catch {
        return NextResponse.json(
            {message: "Request body is not valid JSON."},
            {status: 400},
        );
    }

    const requestSchema = z.object({
        email: z.email(),
        password: z.string()
    })

    const parseResult = requestSchema.safeParse(json);

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

    const {email, password} = parseResult.data;

    //아이디 비번 검사 후 일치하는 유저가 있으면 session을 만들고 id를 반환한다.
    //session 방식으로 DB를 조회해서 session을 만들고
    const error = await signIn({email, password});

    if (error) {
        return NextResponse.json({message: error.message}, {status: error.code});
    }

    return new NextResponse(null, {status: 204});
}

//session을 삭제하는 로그아웃
export async function DELETE() {
    const error = await signOut();

    if (error) {
        return NextResponse.json({message: error.message}, {status: error.code});
    }

    return new NextResponse(null, {status: 204});

}





















