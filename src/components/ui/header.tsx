"use client"

import {useUser} from "@/providers/auth-provider";
import {useRouter} from "next/navigation";

export function Header() {
    const user = useUser();
    const router = useRouter();
    const userName = user?.name;

    async function logout() {
        try {
            const result = await fetch("/api/session", {method: "DELETE"});
            if (result.ok) {
                window.location.href = "/"
            } else {
                const {message} = await result.json();
                window.alert(message);
            }
        } catch {
            window.alert("Network Error")
        }
    }

    function handleLogin() {
        router.push("/login");
    }

    return (
        <>
            <div>
                gawon's website
            </div>
            {userName === undefined ? (
                <div className="text-sm">
                    <button className="underline" onClick={handleLogin}>
                        login
                    </button>
                </div>
            ): (
                <div className="text-sm">
                    <span>
                        welcome! {" "}{userName}{" "}
                    </span>
                    <button className="underline" onClick={logout}>
                        log out
                    </button>
                </div>
            )}
        </>

    )
}