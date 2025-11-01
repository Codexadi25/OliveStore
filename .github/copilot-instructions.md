## OliveStore — Copilot instructions

Purpose: help AI coding assistants be productive quickly in this repository. Use these notes to orient changes, suggest edits, and generate code that fits project conventions.

High-level architecture
- Monolithic Node.js + Express server with an EJS web UI and a JSON REST API (single codebase).
- Entry point: `server.js` (root of project). It connects MongoDB (`config/db.js`), sets EJS views (`views/`), serves static content from `public/`, and mounts API routes under `/api/*`.
- Web UI routes (admin/dashboard) live under `web/webRoutes.js` and EJS views in `views/` (examples: `dashboard.ejs`, `admin_panel.ejs`).
- API routes are defined in `routes/` and handled by `controllers/`. Models live in `models/` (Mongoose).
- File uploads: `middleware/uploadMiddleware.js` uses multer memory storage; controllers (e.g., `controllers/productController.js`) upload buffers to Cloudinary via `cloudinary.uploader.upload_stream`.

Developer workflows & commands (discoverable)
- Install deps: `npm install` (package.json lists runtime deps such as `express`, `mongoose`, `cloudinary`, `aws-sdk`).
- Start: `npm run start` or `npm run dev`. Note: current `dev` = `node server.js` (no nodemon by default). For live reload during development use `npx nodemon server.js` locally.
- Create admin user: `npm run make-admin` runs `scripts/makeAdmin.js` (requires DB + env variables).

Required environment variables (from `.env` and code references)
- `MONGO_URI` — MongoDB connection used in `config/db.js`.
- `JWT_SECRET` — used by `controllers/authController.js` and `middleware/authMiddleware.js`.
- Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (see `controllers/productController.js`).
- AWS S3 (optional if used): `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME`, `AWS_REGION` (project contains S3-related deps and a `.env` template).
- Other optional keys appear in `.env` (e.g., SupaBase keys) — set only if relevant to the task.

Auth and API conventions (important)
- API routes are mounted under `/api/*` in `server.js`. Example: product endpoints are under `/api/products` (`routes/productRoutes.js` -> `controllers/productController.js`).
- Authentication uses JWTs. `middleware/authMiddleware.js`'s `protect` accepts either:
  - `Authorization: Bearer <token>` header, or
  - cookie named `token` (web GUI uses this flow).
- Roles: `merchant`, `staff`, `admin` are used in `authMiddleware` guards (`isMerchant`, `isStaffOrAdmin`, `isAdmin`). Respect role checks when editing APIs.

Upload handling pattern
- `middleware/uploadMiddleware.js` sets multer to memory storage. Controllers expect `req.file.buffer` and stream it to Cloudinary (see `productController.createProduct` and `updateProduct`). When modifying upload logic, keep the memory->stream pattern or update both middleware and callers together.

Code & naming conventions (observed)
- Models: singular, capitalized files in `models/` (e.g., `User.js`, `Product.js`).
- Controllers: `controllers/*Controller.js` export named functions and use `express-async-handler` for async errors.
- Routes: `routes/*Routes.js` define express.Router and import controller functions. Keep API routes JSON-focused; web routes render EJS.
- Views: EJS files in `views/` — naming pattern like `*_list.ejs`, `*_edit.ejs`, `*_new.ejs`.
- Static assets in `public/` and `public/css/` (styles split by feature).

Testing / linting
- There are no automated tests or linters in this repository. Avoid adding large testing infra unless requested — prefer small, focused tests or scripts.

Integration and external systems
- MongoDB (required). `config/db.js` uses `process.env.MONGO_URI`.
- Cloudinary is used for image uploads (see `controllers/productController.js`).
- AWS S3 related tooling is present (dependencies + `.env` entries) — confirm whether S3 is enabled before editing upload code.

Quick examples (what to generate)
- To add a new API endpoint: add a route file entry in `routes/` that calls a function in `controllers/`. Follow existing controllers' style (asyncHandler + JSON responses + status codes).
- When editing file upload flow, update `middleware/uploadMiddleware.js` and all controllers that read `req.file.buffer`.
- For auth-protected endpoints, add `protect` (and role checks) from `middleware/authMiddleware.js`.

When in doubt
- Mirror existing patterns (controllers -> routes -> router mount) and prefer minimal, backward-compatible changes.
- Reference these files when generating code: `server.js`, `config/db.js`, `routes/*`, `controllers/*`, `models/*`, `middleware/*`, `views/*`.

Please review this guidance and tell me if you'd like more detail on any area (examples, common request/response shapes, or environment setup for CI/deployment).
