<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Events\ChatEvent;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'data' => 'required|array',
        ]);

        $data = $request->input('data');
        $user = Auth::user()->id;

        broadcast(new ChatEvent($user, $data));

        return response()->json([
            'message' => 'success',
        ]);
    }
}
