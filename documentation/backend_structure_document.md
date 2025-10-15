# Backend Structure Document

## 1. Backend Architecture

We chose a modern serverless approach built on Next.js’s App Router and API Routes. Here’s how it all fits together:

• Framework: Next.js App Router handles routing for both pages and backend functions.  
• API Routes: Each endpoint lives under `app/api/…/route.ts`, making backend logic part of your codebase.  
• Service Layer: A `lib/supabase-client.ts` file initializes and exports a single Supabase client. This keeps database and auth calls consistent across pages and functions.  
• Component-Driven Design: Your UI components (located in `components/`) talk to these API routes, which talk to the database. That separation (UI → API → DB) keeps things organized.

How it supports key goals:

• Scalability:  
  – Next.js serverless functions auto-scale on Vercel.  
  – Supabase’s managed Postgres and Storage scale to handle growth.  
• Maintainability:  
  – Clear folder structure (`app/`, `components/`, `lib/`).  
  – TypeScript throughout ensures type safety on data and function calls.  
  – Reusable lib modules and helper functions reduce duplication.  
• Performance:  
  – Edge caching on Vercel for static content.  
  – Supabase Realtime subscriptions push updates instantly, reducing polling.  
  – CDN-backed image delivery via Supabase Storage speeds up photo loads.

## 2. Database Management

We rely on Supabase’s managed PostgreSQL database. Here’s what we use and how we manage data:

• Database Type: Relational SQL (PostgreSQL)  
• Client Library: `@supabase/supabase-js` for all CRUD, auth, storage, and real-time operations  
• Data Practices:  
  – Row-Level Security (RLS) for fine-grained access control  
  – Automated daily backups via Supabase’s built-in backup system  
  – Environment-based configuration: separate dev and prod schemas  
• Storage: Supabase Storage buckets for image files, with URL references stored in the `posts` table  
• Access Patterns:  
  – Public users can insert new memories and read approved posts  
  – Admin users with JWT tokens can update or delete records  
  – Real-time subscriptions on `posts`, `reactions`, and `comments` tables keep the UI in sync

## 3. Database Schema

### Human-Readable Format

1. **posts**  
   • id: unique identifier  
   • user_id: who submitted it (nullable for anonymous)  
   • content_text: memory text  
   • image_url: link to uploaded photo  
   • social_profile_url: optional link submitted with the post  
   • status: “pending”, “approved”, or “rejected”  
   • created_at / updated_at: timestamps

2. **reactions**  
   • id: unique identifier  
   • post_id: tied to a post  
   • user_id: who reacted (nullable)  
   • type: emoji code (e.g., “❤️”, “😂”)  
   • created_at: timestamp

3. **comments**  
   • id: unique identifier  
   • post_id: tied to a post  
   • user_id: who commented (nullable)  
   • content_text: comment text  
   • created_at: timestamp

4. **social_links** (optional)  
   • id: unique identifier  
   • user_id: who owns this link  
   • platform: e.g., “Twitter” or “Instagram”  
   • url: full profile URL  
   • created_at: timestamp

### SQL Schema (PostgreSQL)

```sql
-- posts table
enable row level security;
create table posts (
  id             uuid      primary key default gen_random_uuid(),
  user_id        uuid      null,
  content_text   text      not null,
  image_url      text      not null,
  social_profile_url text  null,
  status         text      not null default 'pending',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- reactions table
create table reactions (
  id          uuid      primary key default gen_random_uuid(),
  post_id     uuid      references posts(id) on delete cascade,
  user_id     uuid      null,
  type        text      not null,
  created_at  timestamptz not null default now()
);

-- comments table
create table comments (
  id           uuid      primary key default gen_random_uuid(),
  post_id      uuid      references posts(id) on delete cascade,
  user_id      uuid      null,
  content_text text      not null,
  created_at   timestamptz not null default now()
);

-- social_links table
create table social_links (
  id          uuid      primary key default gen_random_uuid(),
  user_id     uuid      references auth.users(id),
  platform    text      not null,
  url         text      not null,
  created_at  timestamptz not null default now()
);
```  

## 4. API Design and Endpoints

We use RESTful API Routes inside Next.js. Key routes include:

• Authentication (handled by Supabase Auth Helpers):  
  – sign-in/sign-up flows via built-in Supabase endpoints  
  – middleware protects `/api/admin/*` routes

• Posts:  
  – `GET /api/posts` → fetch all approved posts  
  – `POST /api/posts` → submit a new memory (text + optional image)  
  – `GET /api/admin/posts?status=pending` → list pending posts for admins  
  – `PUT /api/admin/posts/:id/status` → update status (approve/reject)  
  – `DELETE /api/admin/posts/:id` → remove an entry

• Reactions:  
  – `GET /api/reactions?postId={id}` → get reactions for a post  
  – `POST /api/reactions` → add a reaction

• Comments:  
  – `GET /api/comments?postId={id}` → get comments  
  – `POST /api/comments` → submit a comment

Each route validates input, checks auth via JWT, interacts with Supabase client, and returns JSON responses. Error states return clear messages for the frontend.

## 5. Hosting Solutions

• Frontend & API: Vercel serverless platform  
  – Edge caching for static assets and API responses  
  – Auto-scaling functions handle traffic spikes  
  – Built-in CI/CD triggered on Git pushes

• Database & Storage: Supabase cloud  
  – Managed PostgreSQL with automated backups  
  – Supabase Storage for images, backed by a CDN  
  – Built-in auth and real-time engine

Benefits:  
• Reliability: SLA-backed services, no self-hosting overhead  
• Scalability: Automatic scaling in both Vercel and Supabase  
• Cost-effectiveness: Free tiers for development, pay-as-you-grow pricing

## 6. Infrastructure Components

• Load Balancer & CDN:  
  – Vercel’s global CDN serves pages and assets from edge locations  
  – Supabase Storage assets are cached via CDN for fast image delivery

• Caching:  
  – Next.js ISR (Incremental Static Regeneration) for reunion page and FAQs  
  – Edge caching headers on API routes where data is public and changes infrequently

• Real-time Engine:  
  – Supabase Realtime subscriptions notify clients of database changes  
  – WebSocket-based updates for posts, reactions, and comments

• Logging & Metrics:  
  – Vercel’s built-in analytics for request times and status codes  
  – Supabase dashboard shows query performance and database health

## 7. Security Measures

• Authentication & Authorization:  
  – Supabase Auth issues JWT tokens upon login  
  – Next.js middleware enforces auth on protected routes  
  – Row-Level Security (RLS) policies in Postgres restrict data access by role

• Encryption:  
  – TLS for all network traffic (frontend ↔ Vercel ↔ Supabase)  
  – Data-at-rest encryption in Supabase’s managed Postgres and Storage

• Input Validation & Sanitization:  
  – Server-side checks on API routes for expected fields and file sizes  
  – Whitelist of allowed image types and size limits enforced before upload

• Rate Limiting (Future Improvement):  
  – Vercel middleware or Supabase Edge Functions can throttle abusive clients  

## 8. Monitoring and Maintenance

• Monitoring Tools:  
  – Vercel dashboard for deployment status, latency, error rates  
  – Supabase monitoring for database connections, query times, and storage usage

• Error Tracking:  
  – Integrate an error-tracking service (e.g., Sentry) in API Routes and client code  
  – Alerts configured for high error rates or slow response times

• Maintenance Strategies:  
  – Automated daily backups from Supabase  
  – GitHub Actions or Vercel CI run tests on every pull request  
  – Scheduled dependency updates via Dependabot or Renovate

## 9. Conclusion and Overall Backend Summary

The backend for the “Wall of Memories” leverages a serverless, full-stack approach with Next.js and Supabase to deliver a scalable, secure, and maintainable environment. Key strengths:

• Serverless Functions: Effortless scaling and zero server maintenance on Vercel  
• Managed Database & Storage: Supabase handles Postgres, auth, real-time updates, and file storage  
• Clear Separation: UI components, API routes, and database logic are neatly organized  
• Security by Default: JWT authentication, RLS policies, and encrypted connections  

This setup aligns perfectly with the project’s goals: a nostalgic, interactive wall that feels alive with real-time posts, reactions, and comments, all backed by a robust and easy-to-manage backend infrastructure.