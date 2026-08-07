# ShopHub E-Commerce Frontend

React + Vite e-commerce frontend connected to the deployed backend API (Render) and Supabase database.

## Tech Stack

- React 19, React Router 7
- Vite 8 + Oxlint
- Axios (REST API client)
- Express + http-proxy-middleware (production server / API proxy)

## Getting Started

```bash
npm install
cp .env.example .env   # set VITE_API_URL if not using the dev proxy
npm run dev
```

The dev server proxies `/api` to the backend so no CORS/Origin issues occur. Leave `VITE_API_URL` empty to use the proxy.

### Environment Variables

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Deployed backend URL (leave empty to use the `/api` proxy) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID for "Continue with Google" (optional) |

## Admin Account

| Field | Value |
| --- | --- |
| Email | `garbatoyin808@gmail.com` |
| Role | `ADMIN` |

The password is not stored in this repository. Set/rotate it via the backend before going to production — the previously shared password should be considered compromised.

Admin access enables managing products, categories, and orders in the dashboard at `/admin`.

## Deployment (Render Web Service)

The production server (`server.js`) serves the built app from `dist/` and proxies `/api` to the backend.

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Env: `PORT` is injected by Render; `API_TARGET` defaults to `https://ecommerce-backend-jdp8.onrender.com`
