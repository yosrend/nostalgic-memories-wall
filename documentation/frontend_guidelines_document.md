# Frontend Guideline Document

## 1. Frontend Architecture

Our frontend is built on Next.js 15 with the App Router, using React and TypeScript for type-safe, component-driven development. Tailwind CSS is our utility-first styling solution, extended by both `shadcn/ui` and Aceternity UI for pre-built and animated components. We use `next-themes` to toggle between light and dark ("night mode") themes.

How it supports the project:

• Scalability: Next.js App Router and file-based routing let us add pages and API routes in a predictable folder structure. Component isolation and TypeScript types keep our codebase easy to extend.

• Maintainability: A clear `app/` (pages & API), `components/`, `lib/`, and `public/` directory split concerns. Reusable UI elements in `components/ui/` reduce duplication.

• Performance: Next.js handles server-side rendering (SSR) and static-site generation (SSG) for fast initial loads. Tailwind’s built-in purge process removes unused CSS. We also leverage Next.js Image optimization and code splitting via dynamic imports.

## 2. Design Principles

1. Usability: Clean, minimal interfaces. Clear form labels, large click targets, and immediate feedback (e.g., toast messages).

2. Accessibility: Semantic HTML (`<button>`, `<form>`, `<nav>`), ARIA attributes on modals and custom components, focus-trap in dialogs, alt text for all images.

3. Responsiveness: Mobile-first layout with Tailwind’s responsive utilities. Fluid grids and flexible image containers ensure a smooth experience on any screen.

4. Consistency: Standardized spacing, font sizes, and color usage enforced by design tokens in Tailwind’s config.

Application examples:

• Memory cards collapse gracefully on small screens and expand on larger viewports.
• Form inputs highlight on focus, meeting WCAG color-contrast requirements.

## 3. Styling and Theming

### Styling Approach

• Tailwind CSS (utility-first) with a custom configuration in `tailwind.config.js`.
• No BEM or SMACSS—rely on atomic classes and occasional CSS variables for theme overrides.
• `shadcn/ui` for standard UI elements (buttons, modals, inputs). Aceternity UI for animated cards and special effects.

### Theming

We define CSS variables for core tokens (colors, shadows, border radii) and switch them via `next-themes`. Light and dark palettes ensure a nostalgic and a “night-mode” experience.

### Visual Style

• Overall Style: Flat, scrapbook‐inspired collage with paper textures and Polaroid borders. Small touches of motion (fade-in, slide) courtesy of Aceternity UI.

### Color Palette

– Background (light): #F4ECE1 (aged paper)  
– Background (dark): #2E2E2E  
– Accent 1: #A8CBB7 (mint chalk)  
– Accent 2: #E8B3B3 (faded pink)  
– Text (dark mode): #E0E0E0  
– Text (light mode): #3C3C3C  
– Border (Polaroid): #FFFFFF  

### Typography

– Headings: “Patrick Hand” (Google Font), for a handwritten, nostalgic feel.  
– Body: “Inter” or system sans-serif fallback. Simple and legible.

## 4. Component Structure

Our component folder is organized by feature and type:

`components/`  
├─ `ui/` – Atomic and shared UI controls (Button, Input, Modal)  
├─ `MemoryCard/` – `MemoryCard.tsx`, styles, types  
├─ `PostForm/` – `PostForm.tsx`, form logic, validation hooks  
├─ `ReactionButtons/` – reaction UI and logic  
├─ `SocialConnectModal/` – modal for social linking  

Benefits of this approach:

• Reusability: Core UI pieces live under `components/ui/` and are imported by feature components.
• Maintainability: Each feature’s logic, styles, and tests sit in its own folder.
• Clear boundaries: Components declare explicit props and avoid side effects.

## 5. State Management

We keep state simple:

• Local state with React’s `useState` and `useReducer` for form inputs and UI toggles.  
• Global state via React Context for auth status and theme (provided by `next-themes`).  
• Real-time subscriptions: Supabase client’s `onSnapshot` pattern or listener hooks push updates for posts and reactions.

Data fetching and caching:

• Next.js Server Components for initial data load (e.g., approved posts).  
• Client Components use fetch or a custom hook wrapping Supabase queries.  
• Optional: SWR (or React Query) can be integrated for automatic revalidation and caching.

## 6. Routing and Navigation

• Next.js App Router handles all routes under `app/`:
  – `/` – Public wall of approved memories.  
  – `/reunion` – Static reunion info page.  
  – `/sign-in` – Admin login page.  
  – `/dashboard` – Protected admin curation dashboard.  

• API Routes in `app/api/`:
  – `auth/[...all]/route.ts` – Supabase Auth callbacks.  
  – `posts/route.ts` – Submit and list posts.  
  – `reactions/route.ts` – Record emoji reactions.  
  – `comments/route.ts` – Post and fetch comments.

• Route Protection: Middleware checks Supabase session cookie; redirects non-admins from `/dashboard` back to `/sign-in`.

## 7. Performance Optimization

1. Code Splitting: Dynamic imports (`next/dynamic`) for heavy components (e.g., Aceternity UI).  
2. Image Optimization: Next.js `<Image>` component with lazy loading and sizing.  
3. Lazy Loading: Defer off-screen components (modals, galleries) until needed.  
4. Asset Minification: Tailwind’s purge, CSS minification, and gzipped JS bundles.  
5. Caching & CDN: Vercel edge caching for static assets and ISR revalidation.

These measures keep time-to-interactive low and memory usage minimal, ensuring a snappy, engaging wall experience.

## 8. Testing and Quality Assurance

### Unit Tests

• Jest + React Testing Library: Test rendering, props, and small component logic (e.g., `MemoryCard`, `ReactionButtons`).

### Integration Tests

• Combine component and API logic: Test `PostForm` submission flows against mock API handlers.

### End-to-End (E2E) Tests

• Cypress or Playwright: Simulate user journeys — submit a memory, approve it in the dashboard, see it appear on the wall, react with an emoji.

### Linting & Formatting

• ESLint with TypeScript rules.  
• Prettier for consistent code style.  
• Husky pre-commit hooks to run `eslint --fix` and unit tests.

### Accessibility Audits

• axe-core or Lighthouse CI to catch contrast or ARIA issues early.

## 9. Conclusion and Overall Frontend Summary

This document captures the key elements of the Wall of Memories frontend: a scalable, maintainable architecture built on Next.js 15, React, TypeScript, and Tailwind CSS; clear design principles for usability and nostalgia; a modular component structure; simple yet effective state management; and robust testing and optimization strategies.

By following these guidelines, any developer—regardless of their background—can understand how to navigate, extend, and maintain the frontend. The unique scrapbook-style UI, real-time updates via Supabase, and clean separation of concerns set this project apart, delivering a modern, performant, and deeply nostalgic user experience.