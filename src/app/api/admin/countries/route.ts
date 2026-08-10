import {NextRequest, NextResponse} from "next/server";
import {supabaseServerClient} from "@/lib/supabase.server";

export async function GET(request: NextRequest) {
    try {
        const { data: countryList, error } = await supabaseServerClient
            .from("tb_country")
            .select()
            .order("name");

        if (error) {
            console.error(error.message);
            return NextResponse.json({message: "Network Error", status: 500});
        }

        return NextResponse.json({message: "Success", data: countryList, status: 200});

    } catch (e) {
        console.error(e);
        return NextResponse.json({message: "Network Error", status: 500});
    }

}