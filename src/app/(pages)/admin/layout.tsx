import {courierPrime} from "@/fonts/fonts";
import {GoogleMapProvider} from "@/providers/GoogleMapProvider";
import {getUser} from "@/lib/auth";
import {cookies} from "next/headers";
import {AuthProvider} from "@/providers/auth-provider";
import {Header} from "@/components/ui/header";

export default async function AdminLayout({children,}: Readonly<{ children: React.ReactNode; }>) {

    return (
        <div className="h-full flex">
            <aside className="h-full w-[15%] bg-gray-400">
                사이드바 영역
            </aside>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
