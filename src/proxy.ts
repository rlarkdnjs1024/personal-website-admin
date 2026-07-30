import {NextRequest, NextResponse} from "next/server";

export function proxy(request: NextRequest) {
    const nextUrl = request.nextUrl;
    const pathname = nextUrl.pathname;

    if (pathname.startsWith("/admin")) {
        const token = request.cookies.get("token");

        //토큰이 없으면 /login으로 리다이렉트 시킨다.
        if (!token) {
            const loginUrl = nextUrl.clone();
            const redirectTo = pathname + nextUrl.search;

            loginUrl.pathname = "/login";
            loginUrl.search = "";
            loginUrl.searchParams.set("redirectTo", redirectTo)

            return NextResponse.redirect(loginUrl);
        }
    }
}

export const config = {
    matcher: ["/admin/:path*"]
}