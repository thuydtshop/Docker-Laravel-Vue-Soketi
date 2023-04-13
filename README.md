# Docker-Laravel-Vue-Soketi

Configuration Laravel with Soketi on Docker.

You can create a subdomain then point it to a port for soketi container. It can be used for chat application.

- If you are using localhost, you can use **localhost:6001** for soketi port and define **127.0.0.1** as **VITE_PUSHER_HOST** in **.env** file.

- If you are using subdomain, you can use **subdomain.com:[port]** for soketi port and define **subdomain.com** as **VITE_PUSHER_HOST** in **.env** file, and set empty value for **VITE_PUSHER_PORT** in **.env** file.

- Make sure you have set **VITE_PUSHER_SCHEME** to **http**

## Requirements
- Docker
- Installed Laravel Sail
- Installed Laravel Sanctum (optional)
- Installed Laravel Echo
- Installed Laravel Pusher


## Installation
- Refer https://laravel.com/docs/10.x/broadcasting#open-source-alternatives-node
- Refer https://docs.soketi.app/getting-started/installation/laravel-sail-docker


## Setup
- Update .env file
```bash
SOKETI_PORT=6001
SOKETI_METRICS_SERVER_PORT=9601
```
You can refer to the **.env.example** file

- Update **docker-compose.yml** file
```bash
soketi:
  image: 'quay.io/soketi/soketi:latest-16-alpine'
  environment:
    SOKETI_DEBUG: '0'
    SOKETI_METRICS_SERVER_PORT: '9601'
  ports:
    - '${SOKETI_PORT:-6001}:6001'
    - '${SOKETI_METRICS_SERVER_PORT:-9601}:9601'
  depends_on:
    - redis
  networks:
    - sail
```

- Update **broadcasting.php** file
```bash
'pusher' => [
  'driver' => 'pusher',
  'key' => env('PUSHER_APP_KEY', 'app-key'),
  'secret' => env('PUSHER_APP_SECRET', 'app-secret'),
  'app_id' => env('PUSHER_APP_ID', 'app-id'),
  'options' => [
    'host' => env('PUSHER_HOST', '127.0.0.1'),
    'port' => env('PUSHER_PORT', 6001),
    'scheme' => env('PUSHER_SCHEME', 'http'),
    'encrypted' => true,
    'useTLS' => env('PUSHER_SCHEME') === 'https',
  ],
],
```

- Update **bootstrap.js** file
```bash
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
  wsHost: import.meta.env.VITE_PUSHER_HOST ? import.meta.env.VITE_PUSHER_HOST : `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
  wsPort: import.meta.env.VITE_PUSHER_PORT,
  wssPort: import.meta.env.VITE_PUSHER_PORT,
  forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
  encrypted: true,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
  authorizer: (channel, options) => {
    return {
      authorize: (socketId, callback) => {
        axios.post('/api/broadcasting/auth', {
          socket_id: socketId,
          channel_name: channel.name
        })
        .then(response => {
          callback(false, response.data);
        })
        .catch(error => {
          callback(true, error);
        });
      }
    };
  }
});
```

- Update **api.php** file
```bash
Broadcast::routes(['middleware' => ['auth:sanctum']]);

Route::middleware(['auth:sanctum'])->group(function () {
  Route::post('/chat', [ ChatController::class, 'send' ]);
});
```

- Add route to **channels.php** file
```bash
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
```