# TechStore MERN MVP

TechStore is now a MERN MVP with:

- `client/`: React + Vite storefront (product listing, filters/search/sort, product detail, cart drawer/page)
- `server/`: Express + Mongoose API (`/api/health`, `/api/products`, `/api/products/:slug`)
- Cart persistence using `localStorage` key `techstore_cart_v1`

## 1. Local setup

### Prerequisites

- Node.js 20+ (Node 22 tested)
- MongoDB Atlas connection string

### Install dependencies

PowerShell on this machine blocks `npm` script shims, so use `npm.cmd`:

```powershell
npm.cmd install
npm.cmd --prefix server install
npm.cmd --prefix client install
```

### Configure environment variables

```powershell
Copy-Item server/.env.example server/.env
Copy-Item client/.env.example client/.env
```

Update:

- `server/.env`
  - `MONGODB_URI`
  - `MONGODB_DB`
  - `CORS_ORIGIN` (for local client: `http://localhost:5173`)
- `client/.env`
  - `VITE_API_BASE_URL` (for local API: `http://localhost:5000`)

### Seed products

```powershell
npm.cmd run seed
```

### Run locally

```powershell
npm.cmd run dev
```

Client: `http://localhost:5173`  
API: `http://localhost:5000`

## 2. API contract

### `GET /api/products`

Returns:

```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "category": "string",
      "priceInr": 0,
      "image": "string",
      "badge": "HOT | SALE | NEW | null",
      "stock": 0,
      "featured": true
    }
  ]
}
```

Query params:

- `search`
- `category`
- `sort` (`newest`, `price_asc`, `price_desc`)

### `GET /api/products/:slug`

- Returns `{ item: ... }` for valid slug
- Returns `404` with `{ "message": "Product not found" }` when missing

## 3. Testing

```powershell
npm.cmd run test
```

- Backend integration tests: health, list/filter/sort, product detail + 404
- Frontend tests: product rendering, search/filter/sort calls, cart add/update/remove, localStorage rehydration

## 4. Launch instructions

### MongoDB Atlas

1. Create cluster + DB user.
2. Whitelist Render outbound access or allow all IPs initially.
3. Copy connection string to `MONGODB_URI`.

### Render (backend)

1. Create new Web Service from this repository with `rootDir=server`.
2. Use build command `npm install`, start command `npm start`.
3. Set env vars:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `MONGODB_URI=<atlas-uri>`
   - `MONGODB_DB=techstore`
   - `CORS_ORIGIN=<your-vercel-url>`
4. Deploy and verify:
   - `https://<render-app>/api/health`

### Vercel (frontend)

1. Import repository and set project root to `client`.
2. Add env var:
   - `VITE_API_BASE_URL=https://<render-app>`
3. Deploy and verify storefront routes:
   - `/`
   - `/product/wireless-headphones`
   - `/cart`

## 5. Post-deploy smoke test

1. Home page loads product list from API.
2. Search/category/sort updates product grid.
3. Product detail page loads by slug.
4. Add to cart works and count updates.
5. Refresh keeps cart state.
