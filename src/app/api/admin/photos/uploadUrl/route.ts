import {NextRequest, NextResponse} from "next/server";
import {supabaseServerClient} from "@/lib/supabase.server";
import {z} from "zod";


export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const takenAt = searchParams.get("takenAt");
    const parseResult = z.iso.datetime({local: true}).safeParse(takenAt);


    if (!parseResult.success) {
        return NextResponse.json({message: "Invalid search parameter 'takenAt' "}, {status: 400});
    }

    const year = getFullYear(parseResult.data);

    const extension = "webp";
    const path = `${year}/${crypto.randomUUID()}.${extension}`;

    try {
        const {data, error} = await supabaseServerClient.storage
            .from("images")
            .createSignedUploadUrl(path, {upsert: false});

        if (error) {
            console.error("Failed to create Supabase signed url", error.message);
            return NextResponse.json({message: "Internal server error."}, {status: 500});
        }

        return NextResponse.json({
            path: data.path,
            token: data.token,
            signedUrl: data.signedUrl,
        }, {
            status: 200
        });

    } catch (err) {
        console.error("Failed to create Supabase signed url", err);
        return NextResponse.json({message: "Internal server error."}, {status: 500});
    }
}

function getFullYear(takenAt: string) {
    return takenAt.slice(0, 4);
}