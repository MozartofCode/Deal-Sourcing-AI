# DealSourcer2 — Claude Instructions

## Tech Stack

| Layer     | Technology                                        |
|-----------|---------------------------------------------------|
| Frontend  | Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend   | Next.js API Routes (App Router route handlers)    |
| Database  | Supabase (PostgreSQL, Auth, Storage)              |
| State     | React built-ins only (useState, useContext, useReducer) |
| Testing   | Vitest + React Testing Library                    |
| Package   | npm                                               |

---

## Project Structure

```
DealSourcer2/
├── frontend/                  # Next.js app (frontend + backend API routes live here)
│   ├── app/                   # App Router pages and layouts
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Root page
│   │   └── api/               # Backend API route handlers
│   ├── components/            # Reusable UI components
│   │   └── ui/                # shadcn/ui generated components (do not edit manually)
│   ├── lib/                   # Utility functions, Supabase client, helpers
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # Shared TypeScript types and interfaces
│   ├── public/                # Static assets
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
```

---

## How to Run

### First-time setup

```bash
cd DealSourcer2/frontend
npm install
```

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Required env vars:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Development

```bash
npm run dev
```

App runs at `http://localhost:3000`.

### Build and production

```bash
npm run build
npm start
```

### Tests

```bash
npm run test          # run all tests
npm run test:watch    # watch mode
```

---

## Frontend Conventions

### Image-to-UI Replication

When given an image or screenshot to replicate:

- Match the layout, spacing, typography, and colors **exactly** as shown in the image.
- Use Tailwind utility classes for all styling — no inline styles, no CSS modules, no styled-components.
- Use shadcn/ui components wherever a component fits (Button, Card, Input, Dialog, etc.) rather than building from scratch.
- If shadcn/ui doesn't have a matching component, build it from scratch with Tailwind.
- Prefer `flex` and `grid` layouts. Use `gap-*` instead of margins between siblings.
- Use Tailwind's default color palette and spacing scale unless specific hex values are provided in the prompt.
- Use `font-sans` (Inter or system-ui) as the default font unless otherwise specified.
- Make all layouts **responsive by default**: design mobile-first, use `sm:`, `md:`, `lg:` breakpoints.

### Component Rules

- All components are functional components with TypeScript.
- Use named exports, not default exports, for components (except page files which must be default exports for Next.js).
- One component per file. File and component name must match (PascalCase).
- Props must have explicit TypeScript interfaces defined above the component.
- Keep components small and focused. Extract sub-components when a component exceeds ~80 lines.

```tsx
// Good
interface CardProps {
  title: string;
  description: string;
}

export function Card({ title, description }: CardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
```

### Tailwind Rules

- Never use arbitrary values (`w-[347px]`) unless the image requires a very specific measurement that has no Tailwind equivalent.
- Group Tailwind classes in this order: layout → sizing → spacing → typography → color → border → effects.
- Use `cn()` from `lib/utils.ts` (the shadcn/ui helper) for conditional class merging.

### File Naming

| Type            | Convention          | Example               |
|-----------------|---------------------|-----------------------|
| Pages           | `page.tsx`          | `app/dashboard/page.tsx` |
| Layouts         | `layout.tsx`        | `app/layout.tsx`      |
| Components      | PascalCase          | `DealCard.tsx`        |
| Hooks           | camelCase `use*`    | `useDeals.ts`         |
| Utilities       | camelCase           | `formatCurrency.ts`   |
| Types           | PascalCase          | `Deal.ts`             |

---

## Backend Conventions (Next.js API Routes)

- All API routes live under `app/api/`.
- Use Next.js Route Handlers (`route.ts`) with named HTTP method exports (`GET`, `POST`, `PATCH`, `DELETE`).
- Always return typed `NextResponse` objects.
- Use Supabase server client (with service role key) inside route handlers, not the public anon client.
- Keep business logic in `lib/` functions; route handlers should only handle request parsing and response shaping.

```ts
// app/api/deals/route.ts
import { NextResponse } from "next/server";
import { getDeals } from "@/lib/deals";

export async function GET() {
  const deals = await getDeals();
  return NextResponse.json(deals);
}
```

### Supabase

- Public/anon client: `lib/supabase/client.ts` — used in client components.
- Server client: `lib/supabase/server.ts` — used in server components and API routes.
- Never expose the service role key to the client.

---

## State Management

- Use `useState` for local component state.
- Use `useContext` + `useReducer` for shared global state (create contexts in `lib/context/`).
- Do not add Zustand, Redux, or any external state library unless explicitly asked.
- For server data fetching, use Next.js Server Components or `useEffect` with Supabase queries — do not add React Query unless explicitly asked.

---

## TypeScript Rules

- Strict mode is enabled (`"strict": true` in tsconfig).
- No `any` types. Use `unknown` and narrow, or define proper interfaces.
- All async functions must have explicit return types.
- All API response shapes must have TypeScript interfaces in `types/`.

---

## Testing

- Test files live next to the source file: `DealCard.test.tsx` alongside `DealCard.tsx`.
- Tests use Vitest and React Testing Library.
- Test behavior, not implementation. No snapshot tests.
- Run before committing: `npm run test`.

---

## Git Workflow

Stage and commit changes with a meaningful message:

```bash
git add .
git commit -m "[meaningful message]"
git push
```

### Commit message conventions

| Prefix     | When to use                                      |
|------------|--------------------------------------------------|
| `feat:`    | New feature or new UI component                  |
| `fix:`     | Bug fix                                          |
| `style:`   | Visual/CSS-only change, no logic change          |
| `refactor:`| Code restructure with no behavior change         |
| `chore:`   | Config, dependencies, tooling                    |
| `test:`    | Adding or updating tests                         |
| `docs:`    | Documentation only                               |

**Examples:**

```bash
git commit -m "feat: add DealCard component matching Figma design"
git commit -m "fix: correct padding on mobile nav"
git commit -m "feat: add Supabase deals API route"
git commit -m "style: update button hover states to match design"
```

---

## Do Not

- Do not use CSS Modules, styled-components, or emotion.
- Do not use class components.
- Do not add libraries not in this document without asking first.
- Do not use `any` in TypeScript.
- Do not hardcode Supabase credentials — always use env vars.
- Do not edit files inside `components/ui/` manually — use the shadcn CLI to add/update components.
