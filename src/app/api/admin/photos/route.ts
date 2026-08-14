import {getSessionId, getUser, isAdmin} from "@/lib/auth";
import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";
import {supabaseServerClient} from "@/lib/supabase.server";
import {postPhotoSchema} from "@/schemas/photo";

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

    const parseResult = postPhotoSchema.safeParse(json);

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

    try {
        const {error} = await supabaseServerClient
            .from("tb_photos")
            .insert({
                storage_path: parseResult.data.storagePath,
                mime_type: parseResult.data.mimeType,
                file_size_bytes: parseResult.data.fileSizeBytes,
                width: parseResult.data.width,
                height: parseResult.data.height,
                status: "ATTACHED",
                uploaded_by: user.seq,
                taken_at: parseResult.data.takenAt,
                country_name: parseResult.data.countryName,
                country_code: parseResult.data.countryCode,
                city_name: parseResult.data.cityName,
                latitude: parseResult.data.latitude,
                longitude: parseResult.data.longitude,
                comment: parseResult.data.comment,
                address: parseResult.data.address,
                place_name: parseResult.data.placeName,
                place_id: parseResult.data.placeId,
            });

        if (error) {
            console.error("[POST /api/admin/photos] DB insert error:", error);
            return NextResponse.json(
                {message: "An error occurred while creating the user."},
                {status: 500},
            );
        }

        return new NextResponse(null, {status: 204});


    } catch (error) {
        console.error("[POST /api/admin/photos] DB insert error:", error);
        return NextResponse.json(
            {message: "An error occurred while creating the user."},
            {status: 500},
        );
    }
}