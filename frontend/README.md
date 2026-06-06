# BasketCompare — Angular Frontend

## Tech Stack
| | |
|---|---|
| Framework | Angular 17 (standalone components) |
| Styling | SCSS + CSS custom properties (auto dark mode) |
| Icons | Tabler Icons (CDN, free) |
| HTTP | Angular HttpClient + interceptor |
| State | RxJS BehaviorSubject (no NgRx needed at this scale) |

## Project Structure
```
src/app/
├── core/
│   ├── models/
│   │   └── comparison.models.ts     ← all TypeScript interfaces
│   ├── services/
│   │   ├── comparison.service.ts    ← POST /api/v1/compare
│   │   ├── pincode.service.ts       ← pincode state + localStorage
│   │   └── loading.service.ts       ← global loading spinner state
│   └── interceptors/
│       └── loading.interceptor.ts   ← auto show/hide spinner on HTTP
├── features/
│   ├── search/
│   │   └── search.component.ts      ← search bar + pincode input
│   ├── baskets/
│   │   ├── basket-item.component.ts ← single product row in a basket
│   │   ├── basket-card.component.ts ← one basket column (cheapest/balanced/fewest)
│   │   └── baskets-grid.component.ts← 3 cards side by side
│   └── comparison/
│       ├── comparison-table.component.ts ← price breakdown table per item
│       └── results-tabs.component.ts     ← Baskets | Price breakdown tabs
├── shared/
│   ├── components/
│   │   ├── navbar.component.ts
│   │   ├── loading-spinner.component.ts
│   │   ├── error-banner.component.ts
│   │   ├── empty-state.component.ts
│   │   ├── stats-bar.component.ts
│   │   └── not-found-chips.component.ts
│   └── pipes/
│       ├── inr.pipe.ts              ← formats numbers as ₹ Indian Rupee
│       └── platform-name.pipe.ts   ← 'zepto' → 'Zepto'
├── home.component.ts                ← page-level orchestration
├── app.component.ts                 ← root shell (navbar + router-outlet)
├── app.routes.ts
└── app.config.ts
```

## Setup & Run

### Prerequisites
- Node.js 18+
- Angular CLI: `npm install -g @angular/cli`

### Steps
```bash
# 1. Install dependencies
npm install

# 2. Start dev server (proxies /api → localhost:8080)
ng serve --proxy-config proxy.conf.json
# Open http://localhost:4200
```

### Production build
```bash
ng build --configuration production
# Output in dist/price-comparison-ui/
# Serve with nginx or copy into Spring Boot's static/ folder
```

## API Integration
All API calls go through `ComparisonService`:
```
POST http://localhost:8080/api/v1/compare
Body: { userInput: "milk, coconut oil", pincode: "110001" }
```
The `proxy.conf.json` forwards `/api/*` to the backend during development — no CORS issues.

## Features
- **3-basket grid** — Cheapest / Smart Pick / One-Stop Shop
- **Price breakdown tab** — all platforms compared per item side-by-side
- **Stats bar** — items found, platforms checked, max saving, scan time
- **Not-found chips** — items with zero results highlighted in amber
- **Image fallback** — package icon if product image fails to load
- **Dark mode** — automatic via `prefers-color-scheme`
- **Responsive** — stacks to single column on mobile
- **Loading overlay** — spinner on every API call via HTTP interceptor

## Adding a New Platform
Only `comparison.models.ts` needs updating:
```ts
export const PLATFORM_COLORS: Record<string, string> = {
  zepto:   '#8B5CF6',
  blinkit: '#F59E0B',
  your_new_platform: '#YOUR_COLOR',  // ← add here
};
```
Everything else (cards, tables, pills) is dynamic — no other changes needed.
