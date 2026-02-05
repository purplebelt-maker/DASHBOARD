# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint via Next.js
```

No test runner is configured in this project.

## Architecture Overview

This is a **Next.js 14 App Router** dashboard that displays Polymarket prediction market events. It pulls event data from a backend API (`https://api.predictionmarketedge.com/api/`) and renders them in filterable, sortable table and grid views.

### Path Alias

All imports use the `@/` alias, which resolves to the project root (configured in `tsconfig.json`).

### State Management — Two Systems

1. **Redux Toolkit** (`redux/`) — owns event/market data fetched from the API.
   - Single slice: `eventReducer.ts` with `setEventsSuccess` / `setEventsFailure` actions.
   - Async thunk `getEvents()` in `redux/actions/eventsAction.ts` builds query params from `EventsQueryParams` and dispatches results into the slice. A second thunk `submitSuggesstion()` posts feedback to the same backend.
   - The Axios instance (`BackendInstance`) is created there with the base URL; reuse it for any new backend calls rather than creating ad-hoc instances.
   - Selector: `eventsSelector` in `eventReducer.ts`.

2. **ThemeContext** (`contexts/ThemeContext.tsx`) — owns dark/light preference, persisted to `localStorage`. Exposes the `useTheme()` hook. The `dark` class on `<html>` drives Tailwind's `dark:` variants.

Both providers are composed in `providers.tsx` and mounted once in `app/layout.tsx`.

### The IEvent → Market Mapping Layer

The backend returns `IEvent` objects (see `types/events/state.ts`). The UI components consume a `Market` type (see `types/index.ts`). The function `eventToMarket()` in `lib/mappers/eventToMarket.ts` bridges the two: it extracts category from `tagIds`, parses Yes/No probabilities from the first market's JSON `outcomes`/`outcomePrices` fields, and maps volume/liquidity fields. All components work against `Market`; if you need to add a new field from the backend, update the mapper here.

### Category IDs

`EventCategory` enum values (in `types/events/filters.ts`) are the backend's numeric category IDs, **not** sequential indices. They are passed directly as `categoryId` query params. The `EventCategorySlug` map converts them to display strings.

### Page & Component Structure

- `app/page.tsx` is the single page. It owns all local filter/pagination state, dispatches `getEvents()` on every filter change via `useEffect`, and conditionally renders `EventsTable` (TanStack React Table) or `EventsGrid` (card layout) based on a view toggle.
- `components/` holds all UI: `EventCard` (grid item), `EventsTable`, `EventsGrid`, `ProbabilityBar`, and several dashboard chrome components (`Header`, `Footer`, `ControlBar`, `ViewToggle`, `ThemeToggle`, etc.).
- All page-level and component files are client components (`"use client"`).

### API Route (Legacy)

`app/api/markets/route.ts` is a server-side Next.js route that fetched directly from the Polymarket Gamma API and returned top-25 markets. The app now fetches events via the backend API through Redux instead. This route still exists but is not called by the current UI.

### Styling Conventions

- TailwindCSS with class-based dark mode (`dark:` prefix).
- Global transitions and scrollbar styles live in `app/globals.css`.
- Custom colors are CSS variables set in `globals.css`; `tailwind.config.ts` wires them up as `background` and `foreground`.
- Responsive grid breakpoints for the cards grid are defined in `globals.css` (`.markets-grid`), not inline Tailwind classes.
