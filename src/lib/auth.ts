import argon2 from "argon2";
import {cookies} from "next/headers";
import {supabase} from "@/lib/supabase.server";
import {randomBytes, createHash} from "crypto";
import {UserType} from "@/providers/auth-provider";
import {NextRequest} from "next/server";

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
            .eq("deleted_yn", false)
            .maybeSingle();

        if (selectUserError) {
            console.error("[@/lib/session/signIn()] DB error while selecting tb_user", selectUserError.message);
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
            console.error("[@/lib/session/signIn()] DB error while inserting in tb_user", insertSessionError.message);
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
        console.error("[@/lib/session/signIn()] Unexpected error", err);
        return {
            message: "Internal Server Error",
            code: 500,
        }
    }
}

export async function signOut(): Promise<SignInError|null> {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get("session_id")?.value;


        //브라우저에 sessionId가 없는 상태여도 로그아웃 성공으로 간주한다.
        if (!sessionId) {
            return null;
        }

        const hashedSessionId = hashSessionId(sessionId);
        const {error: deleteSessionError} = await supabase
            .from("tb_session")
            .delete()
            .eq("session_id_hashed", hashedSessionId);

        if (deleteSessionError) {
            console.error("[@/lib/session/signOut()] DB error while deleting from tb_user", deleteSessionError.message);
            return {
                message: "Internal Server Error",
                code: 500,
            }
        }
        cookieStore.delete("session_id");

        return null;

    } catch (err) {
        console.error("[@/lib/session/signOut()] Unexpected error", err);
        return {
            message: "Internal Server Error",
            code: 500,
        }
    }
}

export function getSessionId(request: NextRequest) {
    return request.cookies.get("session_id")?.value;
}

export async function getUser(sessionId: string): Promise<UserType|null> {
    try {
        const hashedSessionId = hashSessionId(sessionId);

        const {data, error} = await supabase
            .from("tb_session")
            .select("tb_user!inner(seq, name, email, role_seq)")
            .eq("session_id_hashed", hashedSessionId)
            .eq("tb_user.deleted_yn", false)
            .gt("expires_at", new Date().toISOString())
            .maybeSingle();

        if (error) {
            throw error;
        }

        const user = data?.tb_user;

        if (!user) {
            return null;
        }

        return {
            seq: user.seq,
            name: user.name,
            email: user.email,
            roleSeq: user.role_seq,
        };

    } catch (error) {
        throw error;
    }
}

export function isAdmin(user: UserType) {
    return [1, 2].includes(user.roleSeq);
}
