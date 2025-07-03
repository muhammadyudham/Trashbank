import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@headlessui/react";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface UserWithRole {
    id: number;
    name: string;
    email: string;
    role?: string;
    // ...tambahkan properti lain jika perlu
}

export default function Feedback({ auth }: PageProps & { auth: { user: UserWithRole } }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [feedbacks, setFeedbacks] = useState<{ id: number; name: string; email: string; message: string; created_at: string }[]>([]);
    const [showFeedbacks, setShowFeedbacks] = useState(false);

    // Tambahkan tipe untuk response agar lint error hilang
    interface FeedbackResponse {
        success?: boolean;
        message?: string;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");
        try {
            const response = await fetch(route("feedback.store"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                },
                credentials: "same-origin",
                body: JSON.stringify({ name, email, message })
            });
            let data: FeedbackResponse = {};
            try {
                data = await response.json();
            } catch (jsonErr) {
                setError("Gagal mengirim feedback. (Respon tidak valid)");
                setLoading(false);
                return;
            }
            if (response.ok && data.success) {
                setSuccess("Feedback berhasil dikirim!");
                setName(""); setEmail(""); setMessage("");
            } else {
                setError(data.message || "Gagal mengirim feedback.");
            }
        } catch (err) {
            setError("Gagal mengirim feedback.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth.user && auth.user.role === 'admin') {
            fetch("/api/feedback/all", { credentials: "same-origin" })
                .then(res => res.json())
                .then(data => setFeedbacks(data));
        } else {
            fetch("/api/feedback", { credentials: "same-origin" })
                .then(res => res.json())
                .then(data => setFeedbacks(data));
        }
    }, [auth.user]);

    // Fungsi untuk sensor email
    function maskEmail(email: string) {
        const [user, domain] = email.split("@");
        if (user.length <= 2) return "*".repeat(user.length) + "@" + domain;
        return user[0] + "*".repeat(user.length - 2) + user.slice(-1) + "@" + domain;
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-green-900 leading-tight">
                    Feedback
                </h2>
            }
        >
            <Head title="Feedback" />
            <div className="py-6 min-h-screen bg-green-50">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Feedback Form</CardTitle>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                        <CardContent className="grid gap-4">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Your Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <Label htmlFor="feedback">Feedback</Label>
                            <textarea
                                id="feedback"
                                className="border rounded p-2 min-h-[80px]"
                                placeholder="Your Feedback"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                required
                            />
                            {success && <div className="text-green-600 text-sm">{success}</div>}
                            {error && <div className="text-red-600 text-sm">{error}</div>}
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? "Mengirim..." : "Submit Feedback"}
                            </Button>
                        </CardFooter>
                        </form>
                    </Card>

                    {/* Riwayat Feedback */}
                    <Card className="w-full mt-8">
                        <CardHeader className="flex flex-row items-center justify-between cursor-pointer select-none" onClick={() => setShowFeedbacks(v => !v)}>
                            <CardTitle>
                                {auth.user && auth.user.role === 'admin' ? 'Riwayat Feedback Seluruh User' : 'Riwayat Feedback Anda'}
                            </CardTitle>
                            <span>{showFeedbacks ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
                        </CardHeader>
                        {showFeedbacks && (
                        <CardContent>
                            {feedbacks.length === 0 ? (
                                <div className="text-gray-500">Belum ada feedback.</div>
                            ) : (
                                <ul className="divide-y">
                                    {feedbacks.map(f => (
                                        <li key={f.id} className="py-2">
                                            <div className="font-semibold">{f.name} ({maskEmail(f.email)})</div>
                                            <div>{f.message}</div>
                                            <div className="text-xs text-gray-400">{new Date(f.created_at).toLocaleString()}</div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                        )}
                    </Card>
                </div>
            </div>
            <footer className="py-6 text-center text-xs sm:text-sm text-green-900 bg-green-200 border-t border-green-300 mt-8">
                ©2025 TrashBank | All rights reserved.
            </footer>
        </AuthenticatedLayout>
    );
}
