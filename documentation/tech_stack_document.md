# Tech Stack Document

This document outlines the technology choices for the **"Wall of Memories"** project. It explains each technology in everyday language, clarifying how they fit together to build a reliable, interactive, and nostalgic web application.

## Frontend Technologies

Our frontend is all about delivering a snappy, colorful, and intuitive user interface. Here’s what we use:

- **Next.js 15 (App Router)**
  - The core framework for building pages, API routes, and handling server-side rendering or static generation.
  - Makes it easy to organize public pages (the Wall, Reunion page) and protected pages (Admin Login, Dashboard).

- **React**
  - Powers our component-based UI: every memory card, button, form, and modal is a reusable React component.

- **TypeScript**
  - Adds type safety, catching errors early and keeping our code predictable—especially useful when talking to the database or handling API data.

- **Tailwind CSS**
  - A utility-first styling framework that lets us rapidly build custom designs without writing large CSS files.
  - Underpins both **shadcn/ui** and **Aceternity UI** components, ensuring a consistent look and feel.

- **shadcn/ui**
  - A collection of pre-built, accessible UI components (buttons, inputs, modals) that plug directly into our Tailwind setup.

- **Aceternity UI**
  - Provides the animated, nostalgic “Polaroid card” components and gallery layouts that make the wall come alive.

- **next-themes**
  - Enables light/dark mode toggling so we can offer a “daytime hallway” look and a moody “night mode” that mimics walking past a bulletin board under soft lights.

## Backend Technologies

Our backend handles data storage, authentication, and real-time updates, all through Next.js API routes and Supabase services.

- **Next.js API Routes**
  - Serve as our serverless functions for handling form submissions, file uploads, comment/reaction management, and admin actions.

- **Supabase JavaScript SDK**
  - Replaces traditional ORMs and auth libraries.
  - Offers:
    - **Auth** (sign-up, sign-in, JWT token management)
    - **Database** (managed PostgreSQL with built-in CRUD functions)
    - **Realtime** (listening to changes in posts or reactions)
    - **Storage** (managing image uploads with access policies)

- **Supabase Auth Helpers for Next.js**
  - Simplifies integrating Supabase Auth into Next.js middleware, API routes, and client code.

- **PostgreSQL (Supabase managed)**
  - Our single source of truth for storing memory posts, reactions, comments, and user roles.

## Infrastructure and Deployment

To keep the project stable, up-to-date, and easy to share, we rely on these infrastructure tools:

- **Vercel**
  - Hosts both frontend and backend (API routes) seamlessly.
  - Automatically builds and deploys every time we push to GitHub.
  - Manages environment variables (Supabase URL, API keys) securely in its dashboard.

- **Git and GitHub**
  - Version control system and code hosting platform for collaboration, code review, and pull-request based workflows.

- **CI/CD Pipeline** (built into Vercel)
  - Runs tests on every push.
  - Generates preview deployments for feature branches.
  - Deploys the main branch to production once tests pass.

- **Docker (optional for local development)**
  - Provides a consistent local environment by connecting to a shared Supabase development project.

- **Environment Variables**
  - Stored in `.env.local` (development) and set in Vercel (preview/production) using a `.env.example` template.

## Third-Party Integrations

We integrate several external services to enrich functionality and speed up development:

- **Supabase**
  - All-in-one backend: Auth, Database, Storage, Realtime.

- **Aceternity UI**
  - Animated UI components for cards, galleries, and dialogs.

- **Map Embedding** (e.g., Google Maps or Leaflet)
  - Shows reunion locations on an interactive map (can be embedded via iframe or a lightweight JS library).

- **Optional Analytics**
  - You can connect Vercel Analytics or another tool (e.g., Plausible, Google Analytics) to track page visits and user interactions.

## Security and Performance Considerations

We take both security and speed seriously, ensuring visitors have a smooth experience and data remains protected.

- **Row-Level Security (RLS)** in Supabase
  - Public users can only read `approved` posts.
  - Only admins (via JWT roles) can update or delete posts and manage reactions/comments.

- **JWT-Based Authentication**
  - Supabase issues secure tokens for every logged-in admin, used to guard protected routes and API calls.

- **API Route Validation**
  - Each endpoint checks input data, file sizes, and formats before writing to the database or storage, returning friendly error messages on failure.

- **Next.js Image Optimization**
  - Automatically serves appropriately sized images and uses modern formats (WebP), improving load times for memory photos.

- **Tailwind CSS Purge**
  - Strips out unused CSS classes in production builds, keeping stylesheet sizes minimal.

- **CDN Caching (via Vercel)**
  - Static assets and pages are cached close to users, ensuring fast page loads worldwide.

- **Realtime Subscriptions**
  - Efficiently push updates (new posts, reactions) without constant polling, reducing server and network load.

## Conclusion and Overall Tech Stack Summary

This tech stack combines modern, widely adopted tools to deliver an interactive, reliable, and easy-to-maintain application:

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui, Aceternity UI, next-themes
- **Backend**: Next.js API Routes, Supabase SDK (Auth, Database, Storage, Realtime), managed PostgreSQL
- **Infrastructure**: Vercel hosting + CI/CD, Git/GitHub, optional Docker for local development
- **Integrations**: Supabase services, animated UI components, interactive mapping, optional analytics
- **Security & Performance**: Supabase RLS, JWT auth, input validation, image optimization, CDN caching

Together, these choices align perfectly with the project’s goals: building a vibrant, nostalgic “Wall of Memories” that feels alive in real time and remains secure, scalable, and easy to deploy.