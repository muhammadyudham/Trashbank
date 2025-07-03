<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:100',
            'message' => 'required|string|max:1000',
        ]);

        $feedback = Feedback::create([
            'user_id' => Auth::id(),
            'name' => $request->name,
            'email' => $request->email,
            'message' => $request->message,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Feedback berhasil dikirim!'
        ]);
    }

    public function index(Request $request)
    {
        // Ambil feedback milik user login saja jika user login, jika tidak tampilkan semua
        if (Auth::check()) {
            $feedbacks = Feedback::where('user_id', Auth::id())
                ->orderByDesc('created_at')
                ->get();
        } else {
            $feedbacks = Feedback::orderByDesc('created_at')->get();
        }
        return response()->json($feedbacks);
    }

    public function all(Request $request)
    {
        // Ambil semua feedback, terbaru di atas
        $feedbacks = Feedback::orderByDesc('created_at')->get();
        return response()->json($feedbacks);
    }
}
