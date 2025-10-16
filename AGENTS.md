# AI Development Agent Guidelines

## Project Overview
**Project:** nostalgic-memories-wall
**** Here is the enhanced repository summary, tailored to your "Wall of Memories" project goals.

### **Enhanced Repository Summary: `codeguide-starter-fullstack`**

The provided repository analysis covers a full-stack starter template, `codeguide-starter-fullstack`, which serves as an excellent architectural foundation for building modern web applications like the proposed **"Wall of Memories"**. This enhanced summary integrates the specific goals of your project, highlighting how the starter's features can be leveraged and adapted to create an interactive, nostalgic, and deploy-ready application with Next.js 15, Aceternity UI, and Supabase.

### 1. What this codebase does (purpose and functionality)

This codebase provides a full-stack boilerplate designed to accelerate development by offering pre-configured technologies and common functionalities. For the "Wall of Memories" project, it provides a direct path to implementing core features:

*   **User Authentication**: The template includes a comprehensive sign-up, sign-in, and session management system using `better-auth`. This entire module can be seamlessly adapted to implement the **Admin Login** functionality using **Supabase Auth**. The existing patterns for protecting routes and managing sessions are directly applicable.
*   **Interactive Dashboard**: The starter features a protected dashboard area. This is a perfect blueprint for the **Admin Curation Dashboard**, where authenticated admins can approve, reject, and delete memory posts. The `(protected)` route group structure is ideal for this.
*   **Rich UI**: The foundation of `shadcn/ui` and Tailwind CSS provides a modern, customizable UI. This is fully compatible with **Aceternity UI**, which also leverages Tailwind CSS, allowing you to easily integrate its unique, animated components to build the vibrant, chaotic "wall" of memories.
*   **Database Interaction**: The starter's seamless integration with PostgreSQL using Drizzle ORM establishes a clear pattern for data management. This can be directly swapped with the **Supabase JavaScript client**, which connects to Supabase's own managed PostgreSQL database. The existing `db/` and `lib/` structure provides a logical place to initialize the Supabase client and define data-fetching functions.
*   **API Endpoints**: The clear structure for backend logic using Next.js API routes is perfect for handling anonymous and public **memory submissions (text and photo uploads)**, as well as managing emoji reactions and comments.

### 2. Key architecture and technology choices

The architecture follows a modern full-stack approach using the Next.js App Router, which aligns perfectly with your chosen technology stack.

**Frontend Stack:**
*   **Next.js (App Router)**: The core framework, enabling the creation of the public-facing "wall," the static "Reunion" page, and the protected admin area.
*   **React**: For building interactive components like memory cards, reaction buttons, and the **Social Connect modal**.
*   **TypeScript**: Ensures type safety across the application, which is especially valuable when working with your Supabase database schema (`posts`, `reactions`, etc.).
*   **Tailwind CSS**: The utility-first CSS framework that underpins both `shadcn/ui` and your chosen **Aceternity UI**, ensuring a consistent and efficient styling workflow.
*   **shadcn/ui & Aceternity UI**: The starter's use of `shadcn/ui` provides a solid base for standard UI elements (buttons, forms, modals). You will extend this by integrating **Aceternity UI** for the specialized, animated components that will bring the "Wall of Memories" to life.
*   **next-themes**: Useful for adding a potential "night mode" or other thematic variations to the nostalgic design.

**Backend Stack (Original vs. Your Adaptation):**
*   **Next.js API Routes**: The core of the backend logic remains. You will use them to create endpoints for submitting posts, adding comments, and handling social link submissions.
*   **Drizzle ORM, bcrypt, better-auth (To be replaced)**: These will be swapped out in favor of the all-in-one **Supabase SDK**.
    *   **Supabase Client** will replace Drizzle for all database operations (CRUD for posts, reactions, etc.).
    *   **Supabase Auth** will replace `better-auth` and `bcrypt` for secure admin authentication.
    *   **Supabase Storage** will be used for handling the photo uploads for memories and comments.

**Database & Infrastructure:**
*   **PostgreSQL**: You will be using **Supabase's managed PostgreSQL instance** instead of the Dockerized local one, simplifying setup and deployment.
*   **Docker & Docker Compose**: While useful for local development in the starter, this can be omitted in favor of connecting directly to your cloud-based Supabase project.
*   **Vercel**: The starter is optimized for Vercel, matching your deployment target perfectly. Environment variables for Supabase keys can be configured directly in your Vercel project settings.

### 3. Main components and how they interact

The starter's logical structure is an ideal scaffold for the "Wall of Memories" application.

*   **`app/`**:
    *   **`app/api/auth/[...all]/route.ts`**: This route will be refactored to handle **Supabase Auth** callbacks for the admin login flow.
    *   **New API Routes**: You will create new routes like `app/api/posts/route.ts` and `app/api/reactions/route.ts` to handle submissions from the frontend, which will then call Supabase functions to interact with the database.
    *   **`app/(auth)/sign-in/page.tsx`**: This will be repurposed as the **Admin Login** page.
    *   **`app/(protected)/dashboard/page.tsx`**: This becomes the **Admin Curation Dashboard**, fetching posts with a `status` of 'pending' from Supabase and providing buttons to update their status.
    *   **New Public Pages**: You will create `app/page.tsx` for the main "Wall of Memories" and `app/reunion/page.tsx` for the static reunion information.
*   **`components/`**: This directory is central to your project.
    *   **New Core Components**: You'll build `MemoryCard.tsx` (using Aceternity UI), `PostForm.tsx` (for submitting memories), `ReactionButtons.tsx`, `SocialConnectModal.tsx`, and components for the reunion page's photo gallery and FAQ.
    *   **`components/auth-buttons.tsx`**: This can be adapted to show the admin's user information and a sign-out button on the protected dashboard.
*   **`lib/`**:
    *   This is the perfect place to create `lib/supabase-client.ts` to initialize and export a singleton instance of the Supabase client for use across the application (both client and server-side).
*   **`db/`**:
    *   While your schema (`posts`, `reactions`, etc.) will be defined in the Supabase dashboard, you can use this folder to store TypeScript type definitions that mirror your tables (e.g., `db/types.ts`). This ensures type-safe data handling throughout your app.

The interaction flow will be: A user submits a memory via a form on the main page, which hits a Next.js API route. This route validates the data, uploads the image to Supabase Storage, and inserts a new record into your `posts` table. **Supabase Realtime** will then push this update to the admin dashboard, and upon approval, to all connected clients viewing the wall.

### 4. Notable patterns, configurations, or design decisions

The starter's design patterns are highly valuable, even after adapting the tech stack.

*   **`better-auth` Integration Pattern**: While replacing the library, the *pattern* of centralizing authentication logic in a dedicated API route is a best practice you should replicate with the **Next.js Auth Helpers for Supabase**.
*   **Component-Driven UI**: This approach is critical for your project. Building the wall from small, reusable `MemoryCard` components will make the complex, animated layout manageable.
*   **CSS Variables for Theming**: This is a key feature for achieving your **nostalgic school vibe**. You can define CSS variables for paper-like background textures, Polaroid-style borders, and specific fonts, making the theme easily configurable.
*   **Dockerized Development (Adaptable)**: The principle of a consistent development environment is key. You'll achieve this by ensuring all developers connect to the same Supabase development project.
*   **Environment Variable Management**: Crucial for securely managing your **Supabase URL and API keys** (`.env.local`). The starter's `.env.example` provides the right template.

### 5. Overall code structure and organization

The repository's structure is clean, modular, and perfectly suited for the "Wall of Memories" project. It promotes a clear separation of concerns that will keep your codebase maintainable as it grows.
*   **`app/`**: Will house the public wall, reunion page, admin login, protected admin dashboard, and all backend API logic.
*   **`components/`**: Will contain all your custom React components, from Aceternity UI cards to forms and modals.
*   **`lib/`**: Will be the home for the Supabase client and other utility functions.
*   **`public/`**: For static assets like background textures, logos, or default images.

### 6. Code quality observations and recommendations

The starter's high code quality provides a strong foundation. Here are tailored recommendations for your project:

*   **Increase Test Coverage**:
    *   **Actionable**: Write tests for the memory submission API to ensure data validation and proper handling of image uploads. Create integration tests for the admin moderation flow (approve/reject). Use Playwright or Cypress to write E2E tests for the core user journey: submitting a memory and seeing it appear on the wall after approval.
*   **Refine Error Handling**:
    *   **Actionable**: Implement robust error handling for file uploads (e.g., file size limits, accepted formats) and display user-friendly toast notifications. Ensure the admin dashboard clearly communicates the success or failure of moderation actions.
*   **Security Review Expansion**:
    *   **Actionable**: This is critical. Implement **Supabase Row Level Security (RLS) policies** on all your tables. For example:
        *   `posts`: Allow public `SELECT` only for posts with `status = 'approved'`. Allow `INSERT` for anyone. Allow `UPDATE` and `DELETE` only for users with an 'admin' role.
        *   `reactions` / `comments`: Allow anyone to `INSERT`, but only the creator to `UPDATE` or `DELETE`.
        *   Secure your Supabase Storage buckets with appropriate policies to control access to uploaded photos.

### 7. Potential areas for improvement or refactoring (Your Customization Plan)

This section outlines the primary steps to transform the starter into the "Wall of Memories" app.

*   **Swap Core Services (DB & Auth)**: The first and most significant task is to remove `Drizzle`, `better-auth`, and `bcrypt` and integrate the **Supabase SDK**. This involves setting up a Supabase project, configuring environment variables, and refactoring the authentication and data access layers.
*   **Implement Realtime Functionality**: A key addition not present in the starter. Use Supabase's `subscribe()` method on the client-side to listen for changes to the `posts` and `reactions` tables. This will make the wall feel alive by showing new posts and reactions instantly.
*   **Build the "Wall" UI**: Integrate **Aceternity UI** to build the main page. Fetch approved posts from Supabase and map them to animated card components. Use CSS or a JavaScript library to achieve the random, overlapping layout.
*   **Develop Image Upload Flow**: Create the client-side logic and a dedicated API route to handle image uploads to **Supabase Storage**. Ensure you handle loading states and potential errors gracefully.
*   **Flesh out Admin and Static Pages**: Build the admin dashboard UI for post curation and create the static "Reunion" page with its gallery, map, and FAQ sections.
*   **CI/CD Pipeline**: Leverage Vercel's built-in CI/CD. The starter's structure is already optimized for this. Your pipeline should run tests on every push and automatically deploy successful builds to a preview or production environment.

In conclusion, this `codeguide-starter-fullstack` repository provides the ideal architectural skeleton for your "Wall of Memories" project. Its modern Next.js structure, emphasis on component-driven design, and clear organization will save you significant setup time. Your primary task will be to swap the backend services for Supabase and focus on building the unique, nostalgic, and highly interactive user interface that will make your application a success.

## CodeGuide CLI Usage Instructions

This project is managed using CodeGuide CLI. The AI agent should follow these guidelines when working on this project.

### Essential Commands

#### Project Setup & Initialization
```bash
# Login to CodeGuide (first time setup)
codeguide login

# Start a new project (generates title, outline, docs, tasks)
codeguide start "project description prompt"

# Initialize current directory with CLI documentation
codeguide init
```

#### Task Management
```bash
# List all tasks
codeguide task list

# List tasks by status
codeguide task list --status pending
codeguide task list --status in_progress
codeguide task list --status completed

# Start working on a task
codeguide task start <task_id>

# Update task with AI results
codeguide task update <task_id> "completion summary or AI results"

# Update task status
codeguide task update <task_id> --status completed
```

#### Documentation Generation
```bash
# Generate documentation for current project
codeguide generate

# Generate documentation with custom prompt
codeguide generate --prompt "specific documentation request"

# Generate documentation for current codebase
codeguide generate --current-codebase
```

#### Project Analysis
```bash
# Analyze current project structure
codeguide analyze

# Check API health
codeguide health
```

### Workflow Guidelines

1. **Before Starting Work:**
   - Run `codeguide task list` to understand current tasks
   - Identify appropriate task to work on
   - Use `codeguide task update <task_id> --status in_progress` to begin work

2. **During Development:**
   - Follow the task requirements and scope
   - Update progress using `codeguide task update <task_id>` when significant milestones are reached
   - Generate documentation for new features using `codeguide generate`

3. **Completing Work:**
   - Update task with completion summary: `codeguide task update <task_id> "completed work summary"`
   - Mark task as completed: `codeguide task update <task_id> --status completed`
   - Generate any necessary documentation

### AI Agent Best Practices

- **Task Focus**: Work on one task at a time as indicated by the task management system
- **Documentation**: Always generate documentation for new features and significant changes
- **Communication**: Provide clear, concise updates when marking task progress
- **Quality**: Follow existing code patterns and conventions in the project
- **Testing**: Ensure all changes are properly tested before marking tasks complete

### Project Configuration
This project includes:
- `codeguide.json`: Project configuration with ID and metadata
- `documentation/`: Generated project documentation
- `AGENTS.md`: AI agent guidelines

### Getting Help
Use `codeguide --help` or `codeguide <command> --help` for detailed command information.

---
*Generated by CodeGuide CLI on 2025-10-15T07:38:57.049Z*
