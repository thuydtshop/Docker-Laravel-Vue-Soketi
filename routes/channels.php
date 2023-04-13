<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// public channel
Broadcast::channel('Chat.Room', function ($user) {
    Auth::check();

    return $user->role === 'admin';
});

// private channel
Broadcast::channel('Chat.Room.{id}', function ($user, $id) {
    Auth::check();

    // correct
    return (int)$user->id === (int)$id;
});
