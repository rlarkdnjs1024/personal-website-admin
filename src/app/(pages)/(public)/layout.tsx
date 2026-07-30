import "../../globals.css";
import {Header} from "@/components/common/header";

export default function PublicRootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <Header/>
            <div className="flex-1 min-h-0 h-full text-sm">
                <main className="h-full">
                        {children}
                </main>
            </div>
        </>

    );
}
