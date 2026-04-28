# Poshn Frontend

## Local Dev

Start the frontend:

```powershell
npm run dev
```

The dev server runs on `http://localhost:5173` and proxies `/api` requests to the backend on `http://localhost:8080`.

## Production Env

Set this in your deployed frontend environment:

```env
VITE_API_BASE_URL=https://<your-backend>.onrender.com
```

Do not add `/api` to `VITE_API_BASE_URL`, because the app already calls paths like `/api/auth/...`.

## Mobile Testing

The Vite server is configured to listen on your local network, so you can open it from your phone while keeping API calls on the backend proxy.

1. Start the backend on your laptop.
2. Start the frontend:

```powershell
npm run dev:mobile
```

3. Find your laptop's Wi-Fi IP address.
4. Open this on your phone while both devices are on the same network:

```text
http://YOUR_LAPTOP_IP:5173
```

Because the frontend uses the local `/api` proxy, the phone does not need direct access to `localhost:8080`.
