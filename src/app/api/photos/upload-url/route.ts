import {getSessionId, getUser} from "@/lib/auth";
import {NextRequest} from "next/server";

export async function POST(request: NextRequest) {
    const sessionId = getSessionId(request);

    if (!sessionId) {
        return;
    }

    const user = await getUser(sessionId);
    // const isAdmin = isAdmin(sessionId);


}