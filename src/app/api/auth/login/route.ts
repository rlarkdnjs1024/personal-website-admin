import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {

    const json = await request.json();
    const email = json.email;
    const password = json.password;

    if (!email || !password) {
        throw new Error("Invalid email");
    }

    //session 방식으로 DB를 조회해서 session을 만들고

    return new Response(null, {
        status: 200,
        headers: {
            "Set-Cookie": "token=abc123; HttpOnly; Secure; Path=/; SameSite=Lax"
        }
    });
}