# AGENTS.md

This file provides context and rules for AI agents operating in this repository. 
Agents must follow these guidelines to ensure code consistency, reliability, and maintainability.

## 1. Project Overview

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Icons**: lucide-react
- **Content**: MDX with next-mdx-remote
- **State Management**: React Context + Hooks (useState, useTransition)

## 2. Operational Commands

### Development
- **Start Dev Server**: `npm run dev` (Runs on http://localhost:3000)
- **Lint Code**: `npm run lint` (Uses eslint-config-next)
- **Build Production**: `npm run build`
- **Start Production**: `npm run start`

### Testing
*Note: No formal test runner (Jest/Vitest) is currently configured.*
- If asked to run tests, verify if a test runner has been added.
- If adding tests, prefer **Vitest** + **React Testing Library**.

## 3. Code Style & Guidelines

### Imports
- **Path Aliases**: ALWAYS use `@/` for internal imports (configured in `tsconfig.json`).
  - ✅ `import { cn } from "@/lib/utils"`
  - ❌ `import { cn } from "../../lib/utils"`
- **Grouping**:
  1. External packages (e.g., `react`, `next/*`)
  2. Internal components/lib (using `@/`)
  3. Styles (if any specific CSS files)
- **Type Imports**: Use `import type` when importing types/interfaces to aid tree-shaking.

### Naming Conventions
- **Components**: PascalCase (e.g., `PostCard.tsx`, `Comments.tsx`)
- **Functions/Variables**: camelCase (e.g., `getPosts`, `isAuthenticated`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `AUTH_COOKIE_NAME`, `MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (e.g., `PostMeta`, `CommentProps`)
- **Files**:
  - Components/Pages: PascalCase usually, or kebab-case for route folders (App Router convention `app/blog/[slug]/page.tsx`).
  - Utilities/Lib: camelCase (e.g., `utils.ts`, `auth.ts`).

### TypeScript Rules
- **Strict Mode**: Enabled. NO `any` or `unknown` unless absolutely unavoidable.
- **Props**: Define component props using `interface` (e.g., `interface PostCardProps { ... }`).
- **Inference**: Rely on type inference for obvious primitives, but explicit types for function returns and complex objects.
- **Asynchrony**: Always type Promise returns, e.g., `Promise<Post[]>`.

### React & Next.js Patterns
- **Server Actions**: Use for data mutations. Define in `app/actions.ts` or specific action files.
- **Client Components**: Add `"use client";` at the very top of files using hooks (`useState`, `useEffect`, etc.).
- **Server Components**: Default. Prefer Server Components for data fetching and layout.
- **Hooks**: Use `useTransition` for pending states during Server Action execution.
- **Routing**: Use `next/navigation` (`useRouter`, `redirect`, `notFound`).
- **Image Optimization**: ALWAYS use `next/image` for images.

### Styling (Tailwind CSS)
- **Utility Classes**: Use standard Tailwind v4 classes.
- **Conditional Classes**: Use `cn()` utility (wrapper around `clsx` and `tailwind-merge`) for dynamic class names.
  - ✅ `className={cn("bg-white", isDark && "bg-black")}`
- **Dark Mode**: Support dark mode using `dark:` prefix.
- **Design Tokens**: Re-use existing color variables if defined, or standard Tailwind palette (e.g., `orange-600` for accents).

### Error Handling
- **Async/Await**: Wrap async calls in `try/catch`.
- **User Feedback**: Use `alert()` sparingly; prefer toast notifications or UI error states if available.
- **Logging**: `console.error` for caught exceptions.
- **Server Actions**: Return `{ error: string }` or similar structure to handle server-side errors on the client gracefully.

## 4. Directory Structure

- `src/app/`: App Router pages and layouts.
- `src/components/`: Reusable React components.
  - `src/components/ui/`: Generic UI components (buttons, cards).
- `src/lib/`: Utility functions, business logic, data fetching (e.g., `posts.ts`, `auth.ts`).
- `src/context/`: React Context providers (e.g., `LanguageContext.tsx`).
- `content/`: Markdown/MDX files for blog posts.
- `public/`: Static assets (images, fonts).

## 5. Agent Workflow Rules

1. **Analysis First**: Before modifying code, read relevant files to understand context.
2. **Minimal Changes**: Do not refactor unrelated code unless requested.
3. **Verify**: Run `npm run lint` and `npm run build` after significant changes to ensure no regressions.
4. **Docs**: If adding a new feature, update `README.md` if necessary.
5. **Types**: Ensure all new code is strictly typed.
6. **Deps**: Do not add new npm packages unless strictly necessary. Use existing libraries (`date-fns`, `lucide-react`) first.

## 6. Common Patterns (Copy-Paste Ready)

**Component Template:**
```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface MyComponentProps {
  title: string;
  className?: string;
}

export function MyComponent({ title, className }: MyComponentProps) {
  return (
    <div className={cn("p-4 border rounded", className)}>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}
```

**Server Action Pattern:**
```ts
"use server";

import { revalidatePath } from "next/cache";

export async function myAction(formData: FormData) {
  try {
    // validate and mutate
    revalidatePath("/path");
    return { success: true };
  } catch (error) {
    console.error("Action failed:", error);
    throw new Error("Failed to perform action");
  }
}
```
