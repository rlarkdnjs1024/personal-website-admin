"use client"

import {useState} from "react";

export default function LoginForm() {
    const [id, setId] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    return (
        <form
            action="/api/auth/login"
            method="POST"
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
                        <div>ID</div>
                        <input
                            type="text"
                            name="id"
                            value={id}
                            maxLength={30}
                            onChange={(e) =>setId(e.target.value)}
                            className="w-full border border-gray-800 focus:outline-none rounded-md mb-1"
                        />
                        <div>Password</div>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            maxLength={30}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-800 focus:outline-none rounded-md mb-"
                        />
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



        </form>
    )
}