import { courierPrime } from "@/fonts/fonts";
import "../globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={courierPrime.className}>
      <body className="w-full max-w-[1400px] m-auto h-screen flex flex-col border border-gray-200">
        <header className="bg-[#4a6248d4] text-white text-xl font-bold">
            gawon's website (admin)
        </header>
        <div className="flex flex-1 min-h-0">
            <aside className="bg-gray-400 w-[15%] overflow-y-auto">
              사이드바
            </aside>
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
        </div>
      </body>
    </html>
  );
}
