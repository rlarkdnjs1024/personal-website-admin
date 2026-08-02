import LoginForm from "@/components/pages/login-form";

export default async function LoginPage({searchParams,}: {
    searchParams: Promise<{
        redirectTo?: string;
    }>;
}) {
    const {redirectTo} = await searchParams;
    console.log(redirectTo);
    console.log("서버 컴포넌트입니다.")
    return (
        <LoginForm redirectTo={redirectTo}/>
    )
}