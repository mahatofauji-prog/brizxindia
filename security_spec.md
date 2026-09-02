# Security Specification for BRIZX INDIA

## Data Invariants
1. **Identity Isolation**: Document at `/seekers/{userId}` belongs strictly to the user with `request.auth.uid == userId`.
2. **Immutability & Privilege Elevation Guard**: Users cannot modify their `role` to `SUPER_ADMIN` or overwrite another user's `id`.
3. **Write Protection**: Only the authenticated seeker (`request.auth.uid == userId`) or an admin can create or update `/seekers/{userId}`.
4. **Data Leakage Prevention**: Frontend logic must never expose one Seeker's document to another Seeker upon login, refresh, or URL change.

## The Dirty Dozen Test Payloads
1. Attempting to write to `/seekers/user_A` while authenticated as `user_B` -> DENIED
2. Attempting to set `role: "SUPER_ADMIN"` during profile update -> DENIED
3. Attempting to inject a 10KB string into `name` -> DENIED
4. Attempting to read another seeker's private document when unauthenticated -> DENIED
5. Attempting to overwrite `id` field during update -> DENIED
6. Attempting to create a seeker document without required fields -> DENIED
7. Attempting to inject script tags into `bio` -> DENIED
8. Attempting to modify system fields like `createdAt` -> DENIED
9. Attempting to set `verified: true` without admin credentials -> DENIED
10. Attempting to delete another user's seeker profile -> DENIED
11. Attempting to access `/seekers` collection as anonymous user -> DENIED
12. Attempting to forge `request.auth.uid` -> DENIED
