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