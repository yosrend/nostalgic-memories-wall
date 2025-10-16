# Project Requirements Document

# Project Requirements Document (PRD)

## 1. Project Overview

The **Nostalgic Memories Wall** is a web application that lets visitors share short text memories and photos in an interactive, school-themed mosaic. Think of it as a virtual bulletin board where alumni, students, or event attendees upload snapshots and personal notes. An admin team can curate submissions, approving only those that fit the community tone. Once approved, memories are displayed as animated cards that overlap in a randomized collage—complete with Polaroid-style borders, paper-like textures, and subtle motion effects.

We’re building this project to foster a sense of community and nostalgia before an upcoming reunion or gathering. By crowdsourcing memories in a fun, visually rich way, participants can revisit shared experiences and comment or react in real time. The key success criteria are:

• Seamless submission and moderation flows (zero friction for users and admins)  
• Real-time updates on both public wall and admin dashboard  
• A delightful, retro-inspired interface that works on desktop and mobile  
• Robust security around file uploads, data privacy, and admin access

## 2. In-Scope vs. Out-of-Scope

**In-Scope (v1)**
- Admin authentication and session management using Supabase Auth  
- Public memory submission form (text + image) with client- and server-side validation  
- Image storage in Supabase Storage with size/type checks  
- Protected Admin Curation Dashboard: view, approve, reject, delete submissions  
- Animated, randomized “Wall of Memories” display of approved posts  
- Real-time syncing of submissions, approvals, and emoji reactions via Supabase Realtime  
- Reaction and comment system for each memory card  
- Static Reunion page: photo gallery, embedded map, FAQ section  
- Basic theming: CSS variables for nostalgic design, light/dark mode via next-themes  
- CI/CD pipeline on Vercel with automated tests on pull requests

**Out-of-Scope (v1)**
- Native mobile apps (iOS/Android)  
- Deep social media integration (auto-posting to FB/Twitter)  
- Multi-language or localization support  
- Advanced analytics or reporting dashboards  
- Gamification (badges, leaderboards)  
- Offline submission or PWA caching beyond essential service workers

## 3. User Flow

Visitors land on the home page and immediately see the live “Wall of Memories” filled with approved cards. Each card shows a thumbnail, a short text snippet, a timestamp, and reaction counts. Visitors can scroll, hover or tap a card to expand it, add emoji reactions, or read/write comments in-line. A floating “Share Your Memory” button opens a modal where users type their memory, upload a photo, optionally link a social profile via the Social Connect modal, and hit submit. The form validates file size (max 5 MB) and image format (JPEG/PNG) before sending data to a Next.js API route.

Admins navigate to the `/sign-in` page and enter credentials managed by Supabase Auth. After sign-in, middleware ensures only authenticated sessions reach the protected `/dashboard`. Here, pending submissions stream in real time: admins review each memory card, then click Approve, Reject, or Delete. Approvals trigger a Supabase Realtime broadcast so connected viewers see new cards instantly. Rejections or deletes remove the item from the public queue without ever displaying it on the wall.

## 4. Core Features

- **Authentication & Authorization**  
  • Supabase Auth for admin sign-in, JWT tokens, and session cookies  
  • Row-Level Security (RLS) policies to guard database operations  

- **Memory Submission**  
  • React form with text area and file input  
  • Next.js API route validates input, uploads image to Supabase Storage, writes metadata to `posts` table  

- **Image Storage**  
  • Supabase Storage bucket with RLS  
  • Enforce max file size and type on API layer  

- **Admin Curation Dashboard**  
  • Protected React page listing pending posts  
  • Approve/Reject/Delete actions via Supabase SDK  
  • Real-time updates on status changes  

- **Public Wall Display**  
  • Animated `MemoryCard` components using Aceternity UI  
  • Randomized, overlapping layout with CSS transforms  
  • Infinite scroll or pagination for large datasets  

- **Realtime Updates**  
  • Supabase Realtime subscriptions for `posts`, `reactions`, `comments`  

- **Reactions & Comments**  
  • `ReactionButtons` for emoji tallies  
  • Inline comment threads per memory card  

- **Social Connect Modal**  
  • Optional social profile linking before submission  

- **Static Reunion Page**  
  • Lightbox gallery, interactive map, FAQ section  

- **Theming & Nostalgia Design**  
  • Tailwind CSS + CSS variables for Polaroid borders, textures, fonts  
  • Light/dark mode via next-themes  

- **CI/CD & Testing**  
  • Vercel previews on PRs, production deploy on merge  
  • Automated unit, integration (Playwright/Cypress), and API tests

## 5. Tech Stack & Tools

- **Frontend**
  • Next.js 15 (App Router)  
  • React 18 + TypeScript  
  • Tailwind CSS, shadcn/ui, Aceternity UI  
  • next-themes for color mode  

- **Backend**
  • Next.js API Routes  
  • Supabase JavaScript SDK (Auth, Database, Storage, Realtime)  
  • PostgreSQL (managed by Supabase)  

- **DevOps & CI/CD**
  • Vercel for hosting and preview environments  
  • GitHub Actions or Vercel built-in for test runs  

- **Development Tools**
  • Node.js (v18+), npm or Yarn  
  • VS Code with Cursor or Windsurf plugins  
  • Playwright or Cypress for end-to-end testing  

## 6. Non-Functional Requirements

- **Performance**:  
  • Initial page load < 1.5 s on 3G throttling  
  • Sub-200 ms API response times  
  • Real-time event propagation < 500 ms  

- **Security & Compliance**:  
  • Enforce Supabase RLS on all tables  
  • File size/type checks on uploads  
  • HTTPS everywhere, secure HTTP headers (CSP, HSTS)  
  • GDPR-compliant data handling (opt-in profiles)  

- **Usability & Accessibility**:  
  • WCAG 2.1 AA standards  
  • Keyboard navigation and screen-reader support  
  
- **Scalability & Reliability**:  
  • Handle 100+ concurrent real-time connections  
  • 99.9% uptime via Vercel  
  
- **Maintainability**:  
  • Modular, component-driven codebase  
  • 80%+ test coverage on core flows

## 7. Constraints & Assumptions

- Requires an existing Supabase project (Auth + Storage + DB with RLS enabled).  
- Image uploads capped at 5 MB; supported formats: JPEG, PNG.  
- Deployment target is Vercel; environment variables managed in Vercel dashboard.  
- Modern evergreen browsers assumed (Chrome, Firefox, Safari, Edge).  
- No offline or PWA caching beyond basic service worker.

## 8. Known Issues & Potential Pitfalls

- **Realtime Rate Limits**: Supabase Realtime may throttle high-frequency updates. Mitigation: batch updates, debounce UI renders.  
- **Image Upload Failures**: Large files or network interruptions can cause errors. Mitigation: client-side previews, retry logic, clear error messages.  
- **Layout Jitter**: Randomized overlapping cards can shift on window resize. Mitigation: calculate positions on load and cache them; recalc on explicit resize events.  
- **Spam Submissions**: Public form could be abused. Mitigation: simple CAPTCHA or honeypot field.  
- **RLS Misconfiguration**: Incorrect policies could expose data. Mitigation: thorough policy reviews and environment-specific tests.  

**End of PRD**  
This document is the single source of truth for all subsequent technical deliverables—frontend guidelines, backend structure, detailed app flow, file organization, and CI/CD configurations—all can be derived without ambiguity from the requirements outlined above.

---
**Document Details**
- **Project ID**: 08ff3b20-1691-4506-892c-099f84beabfb
- **Document ID**: 6cf3e377-ca64-4766-9f15-2d80c311eaa2
- **Type**: custom
- **Custom Type**: project_requirements_document
- **Status**: completed
- **Generated On**: 2025-10-15T07:12:23.742Z
- **Last Updated**: N/A
