import {getSessionId, getUser, isAdmin} from "@/lib/auth";
import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";
import {supabaseServerClient} from "@/lib/supabase.server";
import {createPhoto, parsePayload} from "@/feature/photo/create-photo";

export async function POST(request: NextRequest) {
    const sessionId = getSessionId(request)!;
    const user = await getUser(sessionId);

    if (!user) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    if (!isAdmin(user)) {
        return NextResponse.json({message: "Forbidden"}, {status: 403});
    }

    let json;
    try {
        json = await request.json();
    } catch {
        return NextResponse.json(
            {message: "Request body is not valid JSON."},
            {status: 400},
        );
    }

    const parseResult = parsePayload(json);

    if (!parseResult.success) {
        return NextResponse.json({message: "Invalid input.", errors: z.flattenError(parseResult.error)}, {status: 400});}

    try {
        const photoSeq = await createPhoto(parseResult.data, user.seq);
        return new NextResponse(null, {status: 204});

    } catch (error) {
        console.error("[POST /api/admin/photos] DB insert error:", error);
        return NextResponse.json(
            {message: "An error occurred while creating the user."},
            {status: 500},
        );
    }
}