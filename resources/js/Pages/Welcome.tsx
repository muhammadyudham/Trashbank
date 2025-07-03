import { Link, Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { useEffect, useRef, useState } from "react";

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    // Typewriter effect
    const titleText = "Selamat Datang di TrashBank";
    const descText =
        "Bersama TrashBank, wujudkan lingkungan yang lebih hijau dan sehat dengan mengelola sampah secara bijak. Dapatkan insentif, edukasi, dan kemudahan dalam pelaporan serta penukaran sampah Anda!";
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setTitle("");
        setDesc("");
        setShowCursor(true);

        async function typeText(text: string, setter: (s: string) => void, delay: number) {
            let result = "";
            for (let i = 0; i < text.length; i++) {
                if (!isMounted) return;
                result += text[i];
                setter(result);
                await new Promise((res) => setTimeout(res, delay));
            }
        }

        (async () => {
            await typeText(titleText, setTitle, 70);
            await new Promise((res) => setTimeout(res, 600));
            await typeText(descText, setDesc, 40);
            setShowCursor(false);
        })();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-green-50 flex flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
                        alt="Hero TrashBank"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-green-600/80 to-green-200/80" />
                </div>
                <div className="relative z-10 w-full max-w-2xl px-6 py-16 flex flex-col items-center">
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white text-center drop-shadow-lg mb-4 min-h-[56px]">
                        {title}
                        {showCursor && <span className="animate-pulse text-green-100">|</span>}
                    </h1>
                    <p className="text-lg sm:text-2xl text-green-50 text-center mb-8 max-w-xl drop-shadow min-h-[80px]">
                        {desc}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="bg-white/90 hover:bg-green-100 text-green-800 font-bold px-8 py-3 rounded-lg shadow transition"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("register")}
                                    className="bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-3 rounded-lg shadow transition"
                                >
                                    Daftar Sekarang
                                </Link>
                                <Link
                                    href={route("login")}
                                    className="bg-white/90 hover:bg-green-100 text-green-800 font-bold px-8 py-3 rounded-lg shadow transition"
                                >
                                    Masuk
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <footer className="relative z-10 py-6 text-center text-green-900 text-xs sm:text-sm bg-green-200/80 w-full border-t border-green-300 mt-8">
                    ©2025 TrashBank | All rights reserved.
                </footer>
            </div>
        </>
    );
}
