import {NextRequest, NextResponse} from "next/server";
import {getSessionId} from "@/lib/auth";

export function proxy(request: NextRequest) {
    const nextUrl = request.nextUrl;
    const pathname = nextUrl.pathname;

    if (pathname.startsWith("/admin")) {
        const sessionId = getSessionId(request);

        //토큰이 없으면 /login으로 리다이렉트 시킨다.
        if (!sessionId) {
            const loginUrl = nextUrl.clone();
            const redirectTo = pathname + nextUrl.search;

            loginUrl.pathname = "/login";
            loginUrl.search = "";
            loginUrl.searchParams.set("redirectTo", redirectTo)

            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    if (pathname.startsWith("/api/admin")) {
        const sessionId = request.cookies.get("session_id");

        if (!sessionId) {
            return NextResponse.json({message: "Unauthorized. Please login"}, {status: 401})
        }

        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"]
}