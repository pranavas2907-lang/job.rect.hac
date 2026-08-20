# JobNest — Modern Job Recruitment Portal

A polished, production-feeling MVP inspired by LinkedIn / Naukri.com. Built for hackathon demos.

## � Features

- **Smart Job Discovery** — Browse / search / filter jobs with rich detail pages, save for later
- **Candidate Profile + Resume Upload** — 3-step onboarding, drag-and-drop PDF resume, persistent profile
- **Application Tracking Dashboard** — Apply to jobs, track application status pipeline, manage saved jobs & profile

## 🚀 Quick start

```bash
cd job-portal
npm install
npm run dev
```

Open http://localhost:5173

## 🛠 Tech stack

- **React 18** + **TypeScript** (Vite)
- **Tailwind CSS** for styling
- **React Router** for routing
- **localStorage** for persistence (no backend needed for MVP)
- Inline SVG icons (no icon library bloat)

## 📦 Project structure

```
src/
├── components/   # Header, Footer, JobCard, CompanyCard, JobFilters, Toast, Loader
├── pages/        # Home, Jobs, JobDetail, Companies, CompanyDetail, Register, Dashboard
├── context/      # AppContext — global state, persistence
├── data/         # Mock jobs + companies
├── types/        # TypeScript types
└── App.tsx
```

## 🌐 Environment variables

None required for the MVP. All data is bundled. Add an `.env` if you wire up an API:

```
VITE_API_BASE_URL=https://api.example.com
```

## 🎬 Demo flow

1. Land on **Home** → search "React" or click a trending tag
2. Browse **Jobs** → toggle filters (category, type, experience, salary slider, remote)
3. Open a **Job** detail → save it, click "Apply now"
4. If you haven't registered → redirected to **Register** (3 steps: basics, about, resume)
5. Drag in a PDF resume → submit
6. Land in **Dashboard** → see pipeline, applications, saved jobs, profile
7. Visit **Companies** → open a company page → see all its jobs

## ⚠ Known limitations

- Data is mocked (12 jobs, 10 companies) — replace `src/data/*.ts` with API calls
- Profile stored in localStorage only (per-browser)
- Resume stored as base64 in localStorage (5MB cap) — wire to S3/Cloudinary for real use
- No real authentication — this is intentionally out of scope for MVP
- No pagination — fine for demo size; add when job count grows
- Status updates are not push-based (employer side is not modeled)
