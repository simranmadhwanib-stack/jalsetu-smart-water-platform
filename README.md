# JalSetu 💧

AI-Powered Smart Water Distribution & Transparency Platform for citizens and government authorities.

JalSetu is a modern, mobile-first web application that improves transparency in urban water distribution. It helps citizens view supply schedules, receive alerts, track tankers, submit photo complaints, and request emergency water support while giving government teams a command center for schedules, tankers, complaints, analytics, and AI forecasts.

## Feature Highlights

### Citizen
- Register/login with JWT authentication.
- Select area/ward and view today's supply timing, next supply, duration, alerts, and history.
- Track water tankers on OpenStreetMap with ETA, capacity, status, and QR verification.
- Submit complaints with image upload and track AI-categorized status.
- View announcements, notifications, water availability, water-saving tips, and emergency SOS water request.

### Government/Admin
- Secure admin dashboard.
- Create/update schedules, publish announcements, assign tankers, manage complaints, view users and areas.
- Transparency dashboard for allocated vs delivered water, tankers dispatched, areas served, and reports.
- Analytics charts for consumption trends, supply efficiency, complaints, and tanker utilization.

### AI Features
- Area-wise demand forecasting.
- Shortage risk prediction.
- Smart complaint categorization and priority scoring.
- AI JalMitra chatbot for citizen questions.
- Water usage forecasting from analytics history.

### Bonus UX
- English + Hindi interface toggles.
- Dark mode.
- QR-based tanker verification.
- Water-saving tips.
- Emergency SOS water request API.

## Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Recharts, OpenStreetMap iframe, QRCode React.
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Multer image uploads.
- **Notifications:** Firebase-ready environment variables and notification collection.
- **Design:** Blue/white government-grade responsive dashboard UI.

## Project Structure

```text
jalsetu-smart-water-platform/
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── config/db.js
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/aiService.js
│       ├── seed.js
│       └── server.js
├── frontend/
│   ├── .env.example
│   ├── package.json
│   ├── index.html
│   ├── tailwind.config.js
│   └── src/
│       ├── components/
│       ├── context/
│       ├── data/mockData.js
│       ├── pages/
│       ├── styles/index.css
│       ├── utils/api.js
│       └── main.jsx
├── package.json
└── README.md
```

## Database Collections

- `Users`
- `Areas`
- `WaterSchedules`
- `Tankers`
- `Complaints`
- `Notifications`
- `Announcements`
- `Analytics`

## REST API Summary

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Citizen/Admin Platform
- `GET /api/areas`
- `GET /api/dashboard`
- `GET /api/schedules`
- `GET /api/tankers`
- `GET /api/tanker/verify/:code`
- `GET /api/complaints`
- `POST /api/complaints` with `multipart/form-data` image field named `image`
- `GET /api/announcements`
- `GET /api/notifications`
- `GET /api/analytics`
- `GET /api/ai/forecast`
- `POST /api/chat`
- `POST /api/sos`

### Admin Only
- `POST /api/schedules`
- `PUT /api/schedules/:id`
- `POST /api/tankers`
- `PUT /api/tankers/:id`
- `PATCH /api/complaints/:id`
- `POST /api/announcements`
- `GET /api/admin/users`

## Environment Setup

### Backend

```bash
cp backend/.env.example backend/.env
```

Required values:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/jalsetu
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
UPLOAD_DIR=uploads
```

Optional Firebase/OpenAI hooks:

```env
OPENAI_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### Frontend

```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_URL=http://localhost:5000/api
VITE_OPENSTREETMAP_ATTRIBUTION=© OpenStreetMap contributors
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Local Development

### One-command combined setup

From the repository root, create both environment files and install backend and frontend dependencies:

```bash
npm run setup
```

If you already installed packages and only need `.env` files, run:

```bash
npm run setup:env
```

### Start MongoDB

Use an existing MongoDB instance, MongoDB Atlas, or the included Compose file:

```bash
docker compose up -d mongo
```

The default backend connection string is `mongodb://127.0.0.1:27017/jalsetu`. Update `backend/.env` if you use Atlas or another database URL.

### Seed sample data

```bash
npm run seed
```

### Run frontend and backend together

```bash
npm run dev
```

This no longer requires a root `concurrently` install; the root script starts the backend and frontend with a small Node helper.

This single command starts:

- Backend API: <http://localhost:5000>
- Frontend app: <http://localhost:5173>

### Run links

After `npm run dev` is running, use these local links in your browser:

- **Open JalSetu app:** <http://localhost:5173>
- **Backend health check:** <http://localhost:5000/health>
- **Backend API base:** <http://localhost:5000/api>

If you use VS Code/Codespaces/Gitpod or another cloud IDE, open/forward ports `5173` and `5000`, then use the forwarded URL for port `5173` as the app link. The backend URL configured in `frontend/.env` should point to the forwarded port `5000` API URL ending in `/api`.

You can also run them separately in two terminals:

```bash
npm run dev:api
npm run dev:web
```

Open:

- Frontend: <http://localhost:5173>
- Backend health: <http://localhost:5000/health>

### Production combined serving option

For a single-server deployment, build the frontend and let Express serve `frontend/dist`:

```bash
npm run build
SERVE_FRONTEND=true npm start
```

With `SERVE_FRONTEND=true`, the backend serves API routes under `/api` and falls back to the React app for browser routes.


## Localhost Troubleshooting

If `http://localhost:5173` does not open, run the built-in diagnostics from the repository root:

```bash
npm run doctor
```

Common fixes:

1. **Dependencies are missing:** run `npm run setup` or run `npm --prefix backend install` and `npm --prefix frontend install` manually. If npm shows HTTP 403, fix your registry/proxy first because packages were not downloaded.
2. **MongoDB is not running:** run `docker compose up -d mongo` or start your local MongoDB service.
3. **Backend is not running:** run `npm run dev:api` and confirm <http://localhost:5000/health> returns JSON.
4. **Frontend is not running:** run `npm run dev:web` and open <http://localhost:5173>.
5. **You are in Codespaces/Gitpod/cloud IDE:** `localhost` on your laptop will not point to the remote container. Forward ports `5173` and `5000`, then open the forwarded `5173` URL. Update `frontend/.env` so `VITE_API_URL` uses the forwarded `5000` URL ending with `/api`.
6. **Port conflict:** stop the process using ports `5173` or `5000`, or change `PORT` in `backend/.env` and `VITE_API_URL` in `frontend/.env`.

A clean local restart usually looks like this:

```bash
npm run setup:env
npm --prefix backend install
npm --prefix frontend install
docker compose up -d mongo
npm run seed
npm run dev
```

If Docker is not available, start MongoDB with your system service instead of `docker compose up -d mongo`.

## Demo Credentials

After running the seed script:

- **Admin:** `admin@jalsetu.gov` / `Admin@123`
- **Citizen:** `citizen@jalsetu.gov` / `Citizen@123`

## Deployment Instructions

### Backend
1. Provision MongoDB Atlas or a managed MongoDB service.
2. Deploy `backend/` to Render, Railway, Fly.io, AWS ECS, or Azure App Service.
3. Set backend environment variables, especially `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`.
4. Persist or externalize uploads using S3/Cloudinary for production.

### Frontend
1. Set `VITE_API_URL` to the deployed backend API URL.
2. Run `npm --prefix frontend run build`.
3. Deploy `frontend/dist` to Vercel, Netlify, Cloudflare Pages, or an object-storage CDN.

### Production Hardening Checklist
- Rotate a strong JWT secret.
- Use HTTPS everywhere.
- Configure CORS to only allowed domains.
- Add Firebase Admin SDK for real push delivery.
- Replace demo AI heuristics with an approved model provider or internal forecasting service.
- Add audit logs for admin actions.
- Add object storage for uploaded complaint photos.
- Add CI tests and monitoring.

## License

MIT
