import argon2 from "argon2";
import {cookies} from "next/headers";
import {supabase} from "@/lib/supabase.server";
import {NextResponse} from "next/server";
import {randomBytes, createHash} from "crypto";

export async function hashPassword(password: string) {
    return await argon2.hash(password);
}

export async function verifyPassword(inputPassword: string, storedHashedPassword: string) {
    return await argon2.verify(storedHashedPassword, inputPassword);
}

export function generateSessionId() {
    return randomBytes(32).toString("hex");
}

export function hashSessionId(sessionId: string) {
    return createHash("sha256").update(sessionId).digest("hex");
}

type SignInError = {
    message: string;
    code: number;
}

export async function signIn({email, password}: {email: string, password: string}): Promise<SignInError|null> {
    try {
        const {data: user, error: selectUserError} = await supabase.from("tb_user")
            .select("seq, password")
            .eq("email", email)
            .maybeSingle();

        if (selectUserError) {
            return {
                message: "Internal Server Error",
                code: 500,
            }
        }

        //입력된 이메일에 대응되는 계정이 없으면 user는 null이 된다.
        if (user === null) {
            return {
                message: "Invalid email or password",
                code: 401,
            }
        }

        const isPasswordCorrect = await verifyPassword(password, user.password);

        if (!isPasswordCorrect) {
            return {
                message: "Invalid email or password",
                code: 401,
            }
        }

        const cookieStore = await cookies();

        const sessionId = generateSessionId();
        const hashedSessionId = hashSessionId(sessionId);

        //세션의 유효기간은 24시간이다.
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const { error: insertSessionError } = await supabase.from("tb_session")
            .insert({
                session_id_hashed: hashedSessionId,
                user_seq: user.seq,
                expires_at: expiresAt.toISOString()
            });

        if (insertSessionError) {
            return {
                message: "Internal Server Error",
                code: 500,
            }
        }

        cookieStore.set("session_id", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: expiresAt, // Date 객체
        });

        return null;

    } catch (err) {
        console.error("[@/lib/auth/signIn()] Unexpected error", err);
        return {
            message: "Internal Server Error",
            code: 500,
        }
    }





}
