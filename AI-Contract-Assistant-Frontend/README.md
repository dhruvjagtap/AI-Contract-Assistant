# AI Contract Assistant

A production-quality, frontend-only UI for an AI-powered contract review tool — built with React 19, TypeScript, Vite, Tailwind CSS v4, and Radix primitives, styled in a minimal enterprise aesthetic (Linear/Vercel/Stripe-inspired).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173. Login is mocked — any email/password or the Google button will sign you in.

## Build

```bash
npm run build
npm run preview
```

## What's included

- **Login → Dashboard → Documents → Document Details → AI Chat → Source Viewer** — the full primary workflow
- Drag-and-drop upload with simulated progress and a live AI processing pipeline (upload → read → extract → chunk → embed → index)
- Document-centric chat with markdown answers (tables, code blocks, lists), citation chips, and a right-side source drawer that highlights the cited passage
- Document summary cards, recent activity, settings, and profile screens
- Fully mocked data and service layer (`src/services`, `src/mock`) — swap in real API calls without touching components
- Responsive layout with a collapsing sidebar on mobile
- Accessible: keyboard navigation, focus states, ARIA labels on icon-only buttons

## Structure

```
src/
  components/{layout,ui,documents,chat}
  pages/{Login,Dashboard,Documents,DocumentDetails,Chat,Settings,Profile}
  services/   mock API + prepared axios client
  hooks/      useAuth
  routes/     ProtectedRoute
  types/      shared TS interfaces
  mock/       realistic mock data
```
