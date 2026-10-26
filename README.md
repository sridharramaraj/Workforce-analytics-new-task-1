# Rosterly — Workforce Analytics Dashboard

React 18 + TypeScript + Vite, Material UI 5, Recharts. Mock data only.

## Setup
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm test         # unit tests for the data layer
```

## Preview states
Append to the URL: `?state=error` (error state) or `?state=empty` (empty state). Filters trigger the loading skeleton.

## Features
- Sidebar (full ≥1200px, icon rail 900–1199px, drawer <900px) and sticky top bar
- Five KPI cards: headcount, present today, attendance rate, on leave, late arrivals
- Attendance trend (area + line), department bars, workforce donut
- Recent activity feed
- Date range, department, location and status filters with reset
- Light/dark theme (persisted, follows OS preference on first visit)
- Loading skeletons, empty and error states with recovery actions
- Accessibility: skip link, landmarks, aria-labels and text summaries on charts, visible focus, `aria-current` nav

## Structure
```
src/data.ts          mock data, types, compute() and simulated fetch
src/theme.ts         light/dark MUI themes
src/components/      Shell, Filters, Kpi, Charts, Activity, States
```
Swap `fetchDashboard` in `data.ts` for a real API call when the backend is ready.

## Deliverables checklist
Screenshots: capture at 1440px, 1024px and 390px in both themes (browser DevTools → device toolbar).
Testing: paste `npm test` and `npm run build` output into your submission.
