<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User; // Pastikan ini mengarah ke model User kamu
use App\Models\Redemption; // Jika kamu ingin menyimpan riwayat penukaran

class RedeemController extends Controller
{
    /**
     * Handle the item redemption request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function redeem(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'item_id' => 'required|integer',
            'points_cost' => 'required|integer|min:0',
        ]);

        $user = $request->user();

        // Ambil data item dari backend
        $cardsData = [
            ['id' => 1, 'title' => 'Gas LPG 3 kg', 'point' => 6],
            ['id' => 2, 'title' => 'Minyak 1 liter', 'point' => 3],
            ['id' => 3, 'title' => 'Beras 10 kg', 'point' => 10],
            ['id' => 4, 'title' => 'Indomie 1 dus', 'point' => 8],
            ['id' => 5, 'title' => 'Telor 1 kg', 'point' => 5],
            ['id' => 6, 'title' => 'Kecap 500 ml', 'point' => 2],
            ['id' => 7, 'title' => 'Gula 1kg', 'point' => 2],
            ['id' => 8, 'title' => 'Kompor', 'point' => 20],
            ['id' => 9, 'title' => 'Motor', 'point' => 100],
        ];
        $selectedItemBackend = collect($cardsData)->firstWhere('id', $request->item_id);
        if (!$selectedItemBackend) {
            return response()->json([
                'success' => false,
                'message' => 'Item tidak ditemukan di server.'
            ], 404);
        }
        $pointsToDeduct = $selectedItemBackend['point'];
        $itemName = $selectedItemBackend['title'];

        // Cek cukup/tidak, tapi JANGAN kurangi poin di sini!
        if ($user->total_points < $pointsToDeduct) {
            return response()->json([
                'success' => false,
                'message' => 'Poin Anda tidak cukup untuk menukar item ini.',
                'total_points' => $user->total_points,
            ], 422);
        }

        // Tidak ada pengurangan poin di sini!
        // Hanya return sukses agar dialog alamat bisa muncul di frontend
        return response()->json([
            'success' => true,
            'message' => 'Silakan isi alamat pengiriman hadiah.',
            'item_id' => $request->item_id,
            'points_cost' => $pointsToDeduct,
            'total_points' => $user->total_points,
        ]);
    }

    /**
     * Menerima dan menyimpan alamat penerima hadiah ke tabel redemptions
     */
    public function saveAddress(Request $request)
    {
        $request->validate([
            'item_id' => 'required|integer',
            'address' => 'required|string|max:255',
        ]);

        $user = $request->user();

        // Ambil data item dari backend
        $cardsData = [
            ['id' => 1, 'title' => 'Gas LPG 3 kg', 'point' => 6],
            ['id' => 2, 'title' => 'Minyak 1 liter', 'point' => 3],
            ['id' => 3, 'title' => 'Beras 10 kg', 'point' => 10],
            ['id' => 4, 'title' => 'Indomie 1 dus', 'point' => 8],
            ['id' => 5, 'title' => 'Telor 1 kg', 'point' => 5],
            ['id' => 6, 'title' => 'Kecap 500 ml', 'point' => 2],
            ['id' => 7, 'title' => 'Gula 1kg', 'point' => 2],
            ['id' => 8, 'title' => 'Kompor', 'point' => 20],
            ['id' => 9, 'title' => 'Motor', 'point' => 100],
        ];
        $selectedItemBackend = collect($cardsData)->firstWhere('id', $request->item_id);
        if (!$selectedItemBackend) {
            return response()->json([
                'success' => false,
                'message' => 'Item tidak ditemukan di server.'
            ], 404);
        }
        $pointsToDeduct = $selectedItemBackend['point'];
        $itemName = $selectedItemBackend['title'];

        // Cek cukup/tidak sebelum kurangi poin
        if ($user->total_points < $pointsToDeduct) {
            return response()->json([
                'success' => false,
                'message' => 'Poin Anda tidak cukup untuk menukar item ini.',
                'total_points' => $user->total_points,
            ], 422);
        }

        // Kurangi poin user di sini!
        $user = \App\Models\User::find($user->id);
        $user->total_points -= $pointsToDeduct;
        $user->save();

        // Simpan alamat ke tabel redemptions
        $redemption = Redemption::create([
            'user_id' => $user->id,
            'item_id' => $request->item_id,
            'address' => $request->address,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Alamat berhasil disimpan dan poin berhasil dikurangi.',
            'redemption' => $redemption,
            'total_points' => $user->total_points,
        ]);
    }
}