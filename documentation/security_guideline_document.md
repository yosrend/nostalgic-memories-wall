# Wall of Memories – Security Guideline Document

This document defines the security requirements and best practices for the **Wall of Memories** application, ensuring it’s secure by design, resilient to attacks, and protects user data and privacy throughout its lifecycle.

---

## 1. Core Security Principles

• **Security by Design**: Integrate security at every phase—from planning and development to testing and deployment.  
• **Least Privilege**: Grant only the permissions needed (e.g., separate service roles in Supabase with minimal rights).  
• **Defense in Depth**: Layer controls (e.g., API authentication, Next.js middleware, Supabase RLS, CSP).  
• **Fail Securely**: On error, avoid exposing stack traces or sensitive data. Provide generic error feedback to users.  
• **Secure Defaults**: All new features (Storage buckets, API endpoints) default to the most restrictive settings.

---

## 2. Authentication & Access Control

### 2.1 Supabase Auth Configuration

- Use **Supabase Auth** for all user and admin authentication.  
- Enforce **strong password policies** (min. 12 characters, mix of letters, numbers, symbols) in the Supabase dashboard.  
- Enable **MFA** (TOTP or SMS) for admin accounts.  
- Store JWTs in **Secure, HttpOnly cookies** with `SameSite=Strict` and `Secure` flags.  

### 2.2 Next.js Middleware & Route Protection

- Implement a **Next.js middleware** to guard protected routes (`/dashboard/*`).  
- Verify JWT signature, expiration (`exp`) and user role claims on each request.  
- Redirect unauthorized or expired sessions to the login page.

### 2.3 Supabase Row-Level Security (RLS)

- **Posts Table**:
  - PUBLIC role: `SELECT` only where `status = 'approved'`.  
  - AUTHENTICATED role: `INSERT` only; no direct `UPDATE`/`DELETE`.  
  - ADMIN role (via custom JWT claim): `UPDATE`/`DELETE` on any row.  
- **Reactions & Comments Tables**:
  - Anyone may `INSERT`.  
  - Only the record owner (by `user_id` claim) may `UPDATE`/`DELETE`.
- **Storage Buckets**:
  - Private by default.  
  - Public-read only for approved images.  
  - Enforce upload path patterns to prevent arbitrary bucket access.

---

## 3. Input Handling & Processing

### 3.1 Form Validation

- **Client-side**: Use React Hook Form + Zod for schema definitions.  
- **Server-side**: Validate via Zod or Joi in Next.js API routes before processing.  

### 3.2 File Upload Security

- Restrict file types to `image/jpeg`, `image/png`, `image/webp`.  
- Enforce max file size (e.g., 5 MB).  
- Sanitize file names; generate UUID-based storage keys.  
- Virus-scan uploads with a third-party service or lambda function.

### 3.3 Injection and XSS Prevention

- Use parameterized queries via Supabase client (no string concatenation).  
- Escape or sanitize user-provided text when rendering in React.  
- Employ a strict **Content Security Policy** to block inline scripts and unauthorized sources.

---

## 4. Data Protection & Privacy

- Enforce **TLS 1.2+** for all client-server and server-database communication.  
- Rely on Supabase’s managed encryption at rest (AES-256).  
- Store no PII outside the authenticated user context.  
- **Rotate service keys** every 90 days; store secrets in Vercel Environment Variables or a Vault solution.  
- Mask sensitive data in logs; do not log raw tokens, passwords, or PII.

---

## 5. API & Service Security

- **HTTPS Only**: Redirect HTTP → HTTPS at the edge (Vercel).  
- **Rate Limiting**: Use Vercel Edge Middleware or API Gateway to throttle endpoints (e.g., 100 req/min per IP).  
- **CORS**: Allow only trusted origins (`https://your-domain.com`).  
- **HTTP Methods**: Enforce correct use—GET for reads, POST for writes, PUT/PATCH for updates, DELETE for removals.  
- **Versioning**: Prefix API routes (e.g., `/api/v1/posts`).

---

## 6. Web Application Security Hygiene

- **Secure Headers** (via `next-secure-headers`):  
  - `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.  
- **CSRF Protection**: Use Anti-CSRF tokens on state-changing POST/PUT/DELETE routes.  
- **Cookies**: `HttpOnly`, `SameSite=Strict`, `Secure`.  
- **SRI**: Add Subresource Integrity hashes to any third-party scripts.

---

## 7. Infrastructure & Configuration Management

- **Serverless Deployment**: Host on Vercel; disable debug logs in production.  
- **Environment Variables**: `.env.local` for dev; configure secrets only in Vercel dashboard.  
- **Network Segmentation**: Supabase service role key is used only server-side—not shipped to clients.  
- **Least Privilege for Service Keys**: Use anon/public key for client; service role key only in API routes with minimal privileges.

---

## 8. Dependency Management

- **Package Lockfiles**: Commit `package-lock.json` to ensure deterministic builds.  
- **Vulnerability Scanning**: Integrate Snyk or GitHub Dependabot for CVE alerts.  
- **Minimal Footprint**: Audit and remove unused libraries (e.g., Drizzle ORM, bcrypt).  
- **Regular Updates**: Schedule monthly dependency upgrades and patch reviews.

---

## 9. Monitoring, Logging & Incident Response

- **Centralized Logging**: Capture errors and warnings via Sentry (no PII in logs).  
- **Uptime Monitoring**: Use Pingdom or Vercel’s built-in alerts for downtime.  
- **Alerting**: Notify on repeated 5xx errors or RLS policy violations.  
- **Incident Playbook**: Define steps for key compromise—rotate keys, revoke tokens, notify stakeholders.

---

## 10. Compliance & Privacy Considerations

- **GDPR/CCPA**: Provide data export/deletion endpoints for user requests.  
- **Data Retention Policy**: Archive or purge records older than configurable thresholds.  
- **Privacy Policy**: Document what data is collected, how it’s stored, and who has access.

---

By following these guidelines, the **Wall of Memories** application will maintain strong security posture, protect user data, and deliver a reliable, trustworthy experience.
