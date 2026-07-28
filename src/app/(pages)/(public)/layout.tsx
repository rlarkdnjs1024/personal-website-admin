import { courierPrime } from "@/fonts/fonts";
import {APIProvider} from '@vis.gl/react-google-maps';
import "../../globals.css";
import {GoogleMapProvider} from "@/providers/GoogleMapProvider";

export default function PublicRootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={courierPrime.className}>
            <body className="w-full max-w-[1400px] m-auto h-screen flex flex-col border border-gray-200">
                <header className="bg-[#4a6248d4] text-white text-xl font-bold">
                    gawon's website
                </header>
                <div className="flex-1 min-h-0 h-full text-sm">
                    <main className="h-full">
                        <GoogleMapProvider>
                            {children}
                        </GoogleMapProvider>
                    </main>
                </div>
            </body>
        </html>
    );
}
