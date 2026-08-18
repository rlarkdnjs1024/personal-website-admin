import {Form} from "@/feature/photo/components/form";
import {supabaseServerClient} from "@/lib/supabase.server";

export default async function Page() {
    const { data: countryList, error } = await supabaseServerClient
        .from("tb_country")
        .select()
        .order("name");

    if (error) throw error;

    return <Form countryList={countryList ?? []}/>
}