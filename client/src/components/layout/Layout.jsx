import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
    return (
        <div className="dark min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8 font-sans overflow-x-hidden relative selection:bg-blue-500/30">
            <Toaster richColors position="top-right" theme="dark" />
            {/* Background Ambience placeholder - can be improved later */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[100px] animate-blob"></div>
            </div>

            <div className="z-10 w-full max-w-4xl flex flex-col gap-8 min-h-screen">
                <Header />
                <main className="flex-1">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
}
