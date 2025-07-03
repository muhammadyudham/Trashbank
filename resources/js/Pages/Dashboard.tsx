"use client";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";

import { TrendingUp } from "lucide-react";
import {
    CartesianGrid,
    Line,
    LineChart,
    XAxis,
    Label,
    Pie,
    PieChart,
} from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";
import React from "react";
const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
];
const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

const chartData2 = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 190, fill: "var(--color-other)" },
];
const chartConfig2 = {
    visitors: {
        label: "Visitors",
    },
    chrome: {
        label: "Chrome",
        color: "hsl(var(--chart-1))",
    },
    safari: {
        label: "Safari",
        color: "hsl(var(--chart-2))",
    },
    firefox: {
        label: "Firefox",
        color: "hsl(var(--chart-3))",
    },
    edge: {
        label: "Edge",
        color: "hsl(var(--chart-4))",
    },
    other: {
        label: "Other",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig;

export default function Dashboard({ auth }: PageProps) {
    const totalVisitors = React.useMemo(() => {
        return chartData2.reduce((acc, curr) => acc + curr.visitors, 0);
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-green-900 leading-tight">
                    About Trashbank
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="py-6 min-h-screen bg-green-50">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    <Card className="w-full bg-green-100 border-green-300 shadow-lg rounded-lg">
                        <CardHeader className="bg-green-200 border-b border-green-300 rounded-t-lg p-4 sm:p-6">
                            <CardTitle className="text-green-900 text-lg sm:text-xl">
                                Tentang TrashBank
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6">
                            <CardDescription className="text-green-800 text-sm sm:text-base">
                                <div className="mb-2">
                                    TrashBank adalah layanan pemerintah yang
                                    bertujuan untuk membuat planet kita lebih
                                    hijau. Misi kami adalah mempromosikan
                                    praktik pengelolaan sampah dan daur ulang
                                    yang berkelanjutan di kalangan masyarakat.
                                    Kami percaya bahwa melalui upaya bersama,
                                    kita dapat mengurangi polusi lingkungan
                                    secara signifikan dan membuat dunia kita
                                    menjadi tempat yang lebih bersih dan sehat
                                    untuk ditinggali.
                                </div>
                                <div className="mb-2">
                                    Layanan kami mencakup pengumpulan sampah,
                                    pemilahan, dan daur ulang, memastikan bahwa
                                    bahan-bahan sampah diproses dengan cara yang
                                    ramah lingkungan. Kami juga menyediakan
                                    edukasi dan sumber daya untuk membantu
                                    individu dan organisasi mengadopsi praktik
                                    pengelolaan sampah yang lebih baik.
                                </div>
                                <div>
                                    Bergabunglah dengan kami dalam misi kami
                                    untuk menciptakan planet yang lebih hijau.
                                    Bersama-sama, kita bisa membuat perbedaan!
                                </div>
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <footer className="py-6 text-center text-xs sm:text-sm text-green-900 bg-green-200 border-t border-green-300 mt-8">
                ©2025 TrashBank | All rights reserved.
            </footer>
        </AuthenticatedLayout>
    );
}
