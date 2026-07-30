import {courierPrime} from "@/fonts/fonts";
import {GoogleMapProvider} from "@/providers/GoogleMapProvider";
import {getUser} from "@/lib/auth";
import {cookies} from "next/headers";
import {AuthProvider} from "@/providers/auth-provider";

export default async function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    let user = null;
    if (sessionId) {
        user = await getUser(sessionId);
    }

    return (
        <html lang="en" className={courierPrime.className}>
            <body className="w-full max-w-[1400px] m-auto h-screen flex flex-col border border-gray-200">
                <AuthProvider user={user}>
                    <GoogleMapProvider>
                        {children}
                    </GoogleMapProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
