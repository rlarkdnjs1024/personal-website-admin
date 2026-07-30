import {TextInput} from "@/components/common/input/text-input";
import LoginForm from "@/components/pages/login-form";
import {SearchParams} from "next/dist/server/request/search-params";

export default async function LoginPage({searchParams,}: {
    searchParams: Promise<{
        redirectTo?: string;
    }>;
}) {
    const {redirectTo} = await searchParams;
    console.log("서버 컴포넌트입니다.")
    return (
        <LoginForm redirectTo={redirectTo}/>
    )
}