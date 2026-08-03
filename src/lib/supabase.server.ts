import "server-only";
import { createClient } from "@supabase/supabase-js";
import {Database} from "@/lib/database.types";


export const supabaseServerClient = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
);