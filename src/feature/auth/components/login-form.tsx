"use client"
import React, {useState} from "react";

type Props = {
    redirectTo?: string;
}

export default function LoginForm({redirectTo}: Props) {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [emailError, setEmailError] = useState<string|null>(null);
    const [passwordError, setPasswordError] = useState<string|null>(null);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {

        e.preventDefault();
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
                window.location.replace(redirectTo ?? "/");
            } else {
                const {message} = await result.json();
                window.alert(message);
            }
        } catch {
            window.alert("Network Error");
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full h-full flex flex-col items-center justify-center">
            <div className={"m-auto  w-[30%]"}>
                <div className={"mb-5"}>
                    <div className="font-bold text-2xl mb-3">
                        Welcome!
                    </div>
                    {/*<div>
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
                    </div>*/}
                </div>

                <div className={"box-border shadow-md bg-[#] p-3 rounded-xl"}>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <div>
                                <div className="border-b-gray-300 border-b-1 focus-within:border-b-[#4a6248d4]">
                                    <div>E-mail</div>
                                    <input
                                        type="text"
                                        name="email"
                                        value={email}
                                        maxLength={30}
                                        onChange={(e) =>setEmail(e.target.value)}
                                        onFocus={() => setEmailError(null)}
                                        className="w-[90%] focus:outline-none mb-1"
                                    />
                                </div>
                                {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                            </div>

                            <div>
                                <div className="border-b-gray-300 border-b-1 focus-within:border-b-[#4a6248d4]">
                                    <div>Password</div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={password}
                                        maxLength={30}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setPasswordError(null)}
                                        className="w-[90%] focus:outline-none mb-1"
                                    />
                                </div>
                                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                            </div>
                        </div>

                        <div className="w-full text-center">
                            <button
                                type="submit"
                                className="bg-gray-100 p-2 rounded-md shadow hover:cursor-pointer"
                            >Sign in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}