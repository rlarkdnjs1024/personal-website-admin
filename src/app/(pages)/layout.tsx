import "../globals.css";
import {courierPrime} from "@/fonts/fonts";
import {GoogleMapProvider} from "@/providers/GoogleMapProvider";
import {getUser} from "@/lib/auth";
import {cookies} from "next/headers";
import {AuthProvider} from "@/providers/auth-provider";
import {Header} from "@/components/ui/header";

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
                        <header className="bg-[#4a6248d4] text-white text-xl font-bold flex justify-between">
                            <Header/>
                        </header>
                        <div className="flex-1 min-h-0 h-full text-sm">
                            <main className="h-full">
                                {children}
                            </main>
                        </div>
                    </GoogleMapProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
