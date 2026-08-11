import {NextRequest, NextResponse} from "next/server";
import {supabaseServerClient} from "@/lib/supabase.server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get("search");

        const { data, error } = await supabaseServerClient.rpc("get_distinct_cities");

        if (error) {
            console.error(error.message);
            return NextResponse.json({message: "Network Error", status: 500});
        }

        const result = data
            .map(x => x.city_name)
            .filter(x => !search || x.toLowerCase().startsWith(search));


        return NextResponse.json({message: "Success", data: result, status: 200});

    } catch (e) {
        console.error(e);
        return NextResponse.json({message: "Network Error", status: 500});
    }

}