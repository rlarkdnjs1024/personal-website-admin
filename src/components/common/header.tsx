"use client"

import {useUser} from "@/providers/auth-provider";

export function Header() {
    const user = useUser();
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

    return (
        <header className="bg-[#4a6248d4] text-white text-xl font-bold flex justify-between">
            <div>
                gawon's website
            </div>
            {userName && (
                <div className="text-sm">
                    <span>
                        welcome! {" "}{userName}{" "}
                    </span>
                    <button className="underline" onClick={logout}>
                        log out
                    </button>
                </div>
            )}
        </header>
    )
}