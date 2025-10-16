# App Flowchart

flowchart TD
    A[Public User] --> B[View Wall of Memories]
    B --> C[Submit Memory]
    C --> D[Social Connect Modal]
    D --> E[Post Form Component]
    E --> F[API Route Submission]
    F --> G[Upload Image to Supabase Storage]
    F --> H[Insert Memory in DB status pending]
    H --> I[Pending Memory]
    I --> J[Admin Login Page]
    J --> K[Supabase Auth]
    K --> L[Admin Dashboard]
    L --> M[View Pending Memories]
    M --> N{Approve or Reject}
    N -->|Approve| O[Update status to approved]
    N -->|Reject| P[Delete or mark rejected]
    O --> Q[Broadcast new memory]
    Q --> B
    P --> L
    B --> R[Static Reunion Page]
    B --> S[React to Memories]
    S --> T[API Route for Reactions]
    T --> U[Insert Reaction in DB]
    U --> V[Broadcast reaction]
    V --> B

---
**Document Details**
- **Project ID**: 08ff3b20-1691-4506-892c-099f84beabfb
- **Document ID**: 52fdfed9-0b81-47e3-8b83-1893758cd71e
- **Type**: custom
- **Custom Type**: app_flowchart
- **Status**: completed
- **Generated On**: 2025-10-15T07:13:48.117Z
- **Last Updated**: N/A
