"use client"
import {useState} from "react";
import {useRouter} from "next/navigation";

type Props = {
    redirectTo?: string;
}

export default function LoginForm({redirectTo}: Props) {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [emailError, setEmailError] = useState<string|null>(null);
    const [passwordError, setPasswordError] = useState<string|null>(null);
    const router = useRouter();

    async function handleSubmit() {
        if (!email) {
            setEmailError("Please enter your email.");
            return;
        }

        if (!password) {
            setPasswordError("Please enter your password.");
            return;
        }

        try {
            const result = await fetch(
                "/api/session",
                {
                    method: "POST",
                    body: JSON.stringify({email: email, password: password, redirectTo: redirectTo})
                }
            )
            if (result.ok) {
                window.location.href = redirectTo ?? "/"
            } else {
                const {message} = await result.json();
                window.alert(message);
            }
        } catch {
            window.alert("Network Error")
        }
    }

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center"
        >
            <div className={"m-auto  w-[30%]"}>
                <div className={"mb-5"}>
                    <div className="font-bold text-2xl mb-3">
                        Welcome!
                    </div>
                    <div>
                        Hello, I am Gawon Kim. Thank you for visiting. This place was created for my {" "}
                        <span className={"underline"}>
                        personal use only.
                    </span>
                        {" "}However, it is open to friends and family. Login with your guest account or
                        contact {" "}
                        <span className={"underline"}>
                    gawon.grove@gmail.com
                    </span>
                        {" "}for one.
                    </div>
                </div>

                <div className={"box-border shadow-md bg-[#] p-3 rounded-xl"}>
                    <div className="flex flex-col gap-1 mb-3">
                        <div>E-mail</div>
                        <input
                            type="text"
                            name="email"
                            value={email}
                            maxLength={30}
                            onChange={(e) =>setEmail(e.target.value)}
                            onFocus={() => setEmailError(null)}
                            className="w-full border border-gray-800 focus:outline-none rounded-md mb-1"
                        />
                        {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                        <div>Password</div>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            maxLength={30}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setPasswordError(null)}
                            className="w-full border border-gray-800 focus:outline-none rounded-md mb-"
                        />
                        {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                    </div>

                    <div className="w-full text-center">
                        <button
                            type="button"
                            className="bg-gray-100 p-2 rounded-md shadow hover:cursor-pointer"
                            onClick={handleSubmit}
                        >Sign in
                        </button>
                    </div>
                </div>

            </div>



        </div>
    )
}