

export function POST(request: Request) {
    return new Response(null, {
        status: 302,
        headers: {
            "Set-Cookie": "token=abc123; HttpOnly; Secure; Path=/; SameSite=Lax",
            "Location": "/"
        }
    });
}