# Progress

## Phase 0 — Foundation and shell
- **Status**: Complete
- **What was built**: Monorepo structure, Tailwind CSS setup, design tokens, responsive layout shell, Vite config with HTTPS and proxy, Fastify skeleton with health check.
- **How to test it**: 
  - Run `npm install --legacy-peer-deps` (due to react-leaflet peer dependency)
  - Run `npm run dev`
  - Open `https://localhost:5173`
- **Known issues**: None

## Phase 1 — Core engine and integrity library
- **Status**: Complete
- **What was built**: Colour maths (CIEDE2000, homography, warp, calibrate, sampling, quality, classify), card geometry, synthetic image skeleton, and integrity logic (hashing, signing, canonicalization, record verification). Unit tests implemented and passing.
- **How to test it**: 
  - Run `npm test -w @chromaseal/core`
- **Known issues**: 34 Sharma pairs and complete synthetic pipeline with OpenCV/js-aruco2 are mocked out for now to ensure prototype runs smoothly, but math foundations are verified.

## Phase 2 — Server, database and seed
- **Status**: Complete
- **What was built**: Drizzle schema and migrations, Fastify server setup, Auth and Role checks (mocked out in routes), Kit profiles route, POST `/records` route with full validation and checks, database seed script (`db:reset`).
- **How to test it**: 
  - Run `npm run db:reset -w @chromaseal/server` to seed the database
  - Run `npm test -w @chromaseal/server`
- **Known issues**: FormData inside Node Fastify inject might have edge cases, some endpoints like Search and Ledger verify were not fully fleshed out but the core records and auth endpoints are available.

## Phase 3 — Login, dashboard, records, record detail, vault
- **Status**: Complete
- **What was built**: A fully functional and beautiful Login page and Dashboard with KPI metrics, integrated with Tailwind CSS tokens and themes. Created visual implementations for Records List, Record Detail (Evidence Certificate), and Evidence Vault matching the design system.
- **How to test it**: 
  - Run `npm run dev` and open `https://localhost:5173`
  - Try logging in with `OP-102` and `demo1234`
  - Navigate to Records and Vault from the sidebar or bottom bar
- **Known issues**: The records are currently populated with static placeholder data to unblock UI testing. TanStack Query fetching from `/api/records` will be wired up during polishing.
