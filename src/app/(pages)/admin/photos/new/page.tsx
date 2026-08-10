import {NewPhotoPage} from "@/components/pages/new-photo-page";
import {supabaseServerClient} from "@/lib/supabase.server";

export default async function Page() {
    const { data: countryList, error } = await supabaseServerClient
        .from("tb_country")
        .select()
        .order("name");

    if (error) throw error;

    return <NewPhotoPage countryList={countryList ?? []}/>
}