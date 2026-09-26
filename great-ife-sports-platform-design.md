# Great Ife Students' Union — Sports Office Digital Platform

## Project Overview

Build a digital platform for the **Office of the Director of Sports, Great Ife Students' Union, Obafemi Awolowo University (OAU)**. The platform serves as both an official public-facing website for the Sports Office and a production system for issuing digital sports ID cards to registered athletes. It also functions as a sports community hub for news, announcements, complaints/suggestions, and a public athlete roster.

---

## Core Purpose

1. **Official Sports Office Website** — A public, credible institutional presence for the Director of Sports and the Great Ife sporting community.
2. **Digital Sports ID Card System** — Athletes apply online, upload their details and photo, and receive a generated digital ID card with a unique barcode.
3. **Sports Community Hub** — Share news/announcements, log complaints or suggestions, and browse a verified athlete roster.
4. **Role-Based Consoles** — Provide dedicated administrative consoles for the Director of Sports, Faculty Sport Officers, and Media Officers.

---

## Visual Identity & Design System

### Theme: "Modern Sport Tech"

A clean, high-performance sports dashboard aesthetic that balances institutional credibility with athletic energy.

### Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| Ink Navy | `#0B1220` | Primary background, hero sections, panels |
| Electric Green | `#12E28C` | CTAs, accents, active states, highlights, barcodes |
| Steel Blue | `#1E2A44` | Cards, surfaces, secondary backgrounds |
| Off-White | `#F7FAFC` | Primary text, headings, light backgrounds |
| Muted Text | `#94A3B8` | Secondary text, captions |
| Border | `#334155` | Dividers, card borders |

### Typography

- **Headings:** `Barlow Condensed` — bold, athletic, condensed display type for section titles and card headers.
- **Body:** `Manrope` — clean, modern sans-serif for body text, forms, and UI labels.
- **Mono/Numbers:** `JetBrains Mono` or similar for ID card numbers, matric numbers, barcodes, and system codes.

### Design Principles

- Dark-first UI with electric green accents for energy and action.
- Card-based layouts with generous radius, subtle borders, and soft shadows.
- High-contrast text for readability and accessibility.
- Mobile-first responsive design; every page must be usable on phones.
- No purple gradients or generic AI startup aesthetics — the look must be distinctive and institutional-sport.

---

## User Roles & Access Model

| Role | Description | Permissions |
|------|-------------|-------------|
| **Athlete** | Any student applying for or holding a sports ID card | Apply for ID card, download own ID card, view news, browse community roster, submit complaints/suggestions, verify other cards via barcode. |
| **Director of Sports** | Head of the Sports Office | Full admin: manage roles, view all athletes, respond to complaints, publish/edit/delete announcements, manage ID card issuance. |
| **Faculty Sport Officer** | Faculty-level sports representative | View athletes within assigned faculty, respond to complaints, limited console access. |
| **Media Officer** | Sports Office media/communications lead | Publish and manage announcements/news only; no athlete-management permissions. |

Roles are stored in a dedicated `user_roles` table (never on the profile/user record) to prevent privilege escalation. Admin checks are performed server-side, never from client-side storage.

---

## Data Architecture

### Supabase Backend (Lovable Cloud)

- **Auth:** Supabase Auth with Google OAuth provider. No anonymous sign-ups; no email/password flow unless explicitly requested. Athletes sign in with their Google account, which automatically captures their verified email address.
- **Database:** PostgreSQL via Supabase with Row Level Security (RLS) on every user-facing table.
- **Storage:** Private `athlete-photos` bucket for ID card photos; signed URLs used for display.
- **Email:** Sending email is not enabled until a domain is verified. Until then, ID cards are generated and downloadable in-app. Once a domain is verified, switch on transactional email so the office email receives the generated ID card and the athlete receives confirmation.

### Key Tables

| Table | Purpose |
|-------|---------|
| `auth.users` | Supabase-managed authenticated users |
| `profiles` | Extended user profile linked to `auth.users` |
| `user_roles` | User roles (athlete, director, faculty_sport_officer, media_officer) |
| `id_cards` | Issued sports ID cards with auto-generated card numbers |
| `announcements` | News and announcements from the Sports Office |
| `complaints` | Complaints, suggestions, and feedback from athletes |

### ID Card Numbering

Card numbers are generated automatically in the format:

```
GICS/YYYY/NNNN
```

Where `YYYY` is the current year and `NNNN` is a zero-padded sequential number (e.g., `GICS/2026/0001`). This is enforced via a PostgreSQL sequence and trigger.

### Security Functions

- `public.has_role(user_id, role)` — security definer function for checking user roles without recursive RLS issues.
- `public.verify_card(card_no)` — public RPC for verifying any issued ID card by barcode or card number.
- `public.public_roster()` — public RPC returning only the approved athlete data needed for the community roster.

### RLS & Grants

- Every table in the `public` schema must have explicit `GRANT` statements for `authenticated` and `service_role`.
- Anon grants are only used for fully public tables or RPCs.
- RLS policies enforce:
  - Users can only read/update their own `profiles` row.
  - Users can only read their own `id_cards` row.
  - Admins/Faculty Officers can read athlete data according to role scope.
  - Admins/Media Officers can manage `announcements`.
  - Users can create `complaints` and read their own; staff can read/respond to complaints in their scope.

---

## Routes & Pages

| Route | Purpose | Access |
|-------|---------|--------|
| `/` | Home page: hero, feature highlights, latest news preview, verify ID card CTA | Public |
| `/about` | The Office: mandate, structure, leadership, contact info | Public |
| `/news` | Full announcements and news feed | Public |
| `/community` | Public roster of verified athletes | Public |
| `/sport-id` | ID card application form and generated card preview | Authenticated (Athlete+) |
| `/verify` | Verify any athlete ID card by typing or scanning barcode | Public |
| `/feedback` | Complaints and suggestions form + submission tracking | Authenticated (Athlete+) for new submissions; public page shows general info |
| `/auth` | Sign-in page with Google OAuth | Public |
| `/console` | Administrative dashboard with role-based tabs | Staff only (Director, Faculty Officer, Media Officer) |

---

## Feature Specifications

### 1. Google Sign-In / Auth

- Athletes sign in with Google.
- The system captures their verified Google email automatically (browsers cannot expose the user's email without an OAuth sign-in).
- First-time sign-in creates a `profile` record and assigns the `athlete` role by default.
- Sign-in redirect uses same-origin public URLs (`window.location.origin`) and stores the intended destination for post-auth navigation.

### 2. ID Card Application (`/sport-id`)

The athlete provides:
- Photo (uploaded to private storage)
- Full name
- Date of birth (age is auto-calculated from the current year)
- Matric number
- Faculty (dropdown from official OAU faculties)
- Department
- Sport (dropdown from official sports list)
- Gender/Sex
- Phone number
- Email (auto-captured from Google sign-in)

On submission:
- Photo is uploaded to the `athlete-photos` bucket.
- A new `id_cards` row is inserted with a generated card number.
- The ID card is rendered in a high-resolution, printable/downloadable card component.
- A barcode (CODE128) is generated from the card number.
- The athlete sees a message: "Kindly check your email for your ID card." (Email delivery is enabled once a sending domain is verified; until then, the card is downloadable in-app.)
- The system sends the generated ID card to the official Sports Office email address and the athlete's email once email is enabled.

### 3. ID Card Design

- Modern sport tech card layout with the OAU/GICS branding.
- Displays: photo, full name, matric number, faculty, department, sport, gender, age, phone, email, card number, barcode.
- Card dimensions suitable for digital display and high-res PNG export (e.g., 420px wide preview, 2x export for print).
- Export uses `html-to-image` to generate a PNG.

### 4. Card Verification (`/verify`)

- Any user can type a card number or scan the barcode.
- The `verify_card` RPC returns the athlete's public details if the card exists and is valid.
- Invalid cards show an appropriate "Not found" message.

### 5. News & Announcements (`/news`)

- Media Officers and the Director can publish, edit, and delete announcements.
- Public users view the full feed and individual announcements.
- Home page shows a preview of the latest 3–5 items.

### 6. Complaints & Suggestions (`/feedback`)

- Authenticated athletes can submit complaints, suggestions, or general feedback.
- Each submission has a category and a message.
- Staff can view and respond to submissions in their console.
- Athletes can see their own submission history and any office responses.

### 7. Community Roster (`/community`)

- Public page listing verified athletes.
- Uses `public_roster()` RPC to expose only safe, approved data (no phone/email).
- Search/filter by sport, faculty, or gender.

### 8. Admin Console (`/console`)

Role-based tabs:
- **Director:** All tabs — Manage Roles, Athletes, Complaints, News.
- **Faculty Sport Officer:** Athletes (within assigned faculty), Complaints.
- **Media Officer:** News only.

The console is protected by the `_authenticated` layout and server-side role checks.

---

## Technical Stack

- **Framework:** TanStack Start v1 (full-stack React 19 with SSR/SSG)
- **Router:** TanStack Router (file-based routing)
- **Styling:** Tailwind CSS v4 with native CSS `@theme` variables
- **UI Components:** shadcn/ui
- **Backend:** Supabase (Auth, PostgreSQL, Storage) via Lovable Cloud
- **Server Logic:** `createServerFn` from `@tanstack/react-start` for internal app logic
- **Public APIs:** TanStack file routes under `/api/public/*` for webhooks/public endpoints
- **Barcode:** `jsbarcode`
- **Image Export:** `html-to-image`
- **Icons:** `lucide-react`
- **Fonts:** `Barlow Condensed` + `Manrope` via Google Fonts `<link>` in `__root.tsx`

---

## Key Files & Responsibilities

| File | Responsibility |
|------|--------------|
| `src/styles.css` | Global theme tokens: colors, typography, spacing, utilities |
| `src/lib/sports-data.ts` | OAU faculties, sports list, office email, age calculation helper |
| `src/hooks/useAuth.tsx` | Auth session, role detection, role helpers |
| `src/components/IdCard.tsx` | Reusable ID card component with barcode and export hook |
| `src/components/site/SiteHeader.tsx` | Main site navigation |
| `src/components/site/SiteFooter.tsx` | Footer with contact info and links |
| `src/routes/__root.tsx` | Root layout wrapping all pages with header, footer, toast provider |
| `src/routes/index.tsx` | Home page |
| `src/routes/about.tsx` | About/Office page |
| `src/routes/news.tsx` | News feed |
| `src/routes/community.tsx` | Public athlete roster |
| `src/routes/sport-id.tsx` | ID card application and card preview |
| `src/routes/verify.tsx` | Card verification |
| `src/routes/feedback.tsx` | Complaints and suggestions |
| `src/routes/auth.tsx` | Google sign-in page |
| `src/routes/console.tsx` | Admin console |
| `supabase/migrations/*.sql` | Database schema, RLS, functions, triggers, seed data |

---

## Important Constraints & Decisions

1. **Email capture:** Auto-captured only through Google OAuth. Manual email typing is not used for ID card applicants.
2. **Email sending:** Deferred until a verified domain exists. Until then, ID cards are in-app downloadable only.
3. **Office email of record:** `paulinomarx4@gmail.com` — this receives ID card copies once email sending is enabled.
4. **Age calculation:** Computed from the athlete's date of birth relative to the current year on the client and server.
5. **No anonymous sign-ups:** All athletes must sign in with Google.
6. **No role fields on the profile table:** Roles live in a separate `user_roles` table only.
7. **Server-side admin checks:** Never use client-side storage or hardcoded credentials to determine admin status.
8. **Barcode format:** CODE128 generated from the card number; scannable with standard barcode readers.
9. **Separate routes for sections:** Each major section (About, News, Community, Sport ID, Verify, Feedback, Console) has its own route file for SEO and SSR.

---

## SEO & Metadata

Every route defines its own `head()` with:
- Unique `<title>` (under 60 chars, keyword-rich)
- Unique `<meta name="description">` (under 160 chars)
- Open Graph tags (`og:title`, `og:type`, `og:description`, `og:image` where a hero/cover image exists)
- Twitter card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` where applicable)
- Canonical tags and responsive viewport meta

The `__root.tsx` head does not include `og:image` — that is set per leaf route.

---

## Future Enhancements

1. Enable domain-verified transactional email to send ID cards automatically to athletes and the office.
2. Bulk export of athlete data for the Sports Office (CSV/Excel).
3. Event/ fixture management module.
4. Team registration and captain assignment.
5. Mobile app or PWA wrapper for offline ID card display.
6. Advanced analytics dashboard for participation metrics.

---

## Prompt for Rebuilding / Extending

Use this prompt as a source-of-truth when regenerating or extending the platform:

> "Build a TanStack Start v1 + Supabase full-stack platform for the Office of the Director of Sports, Great Ife Students' Union, OAU. Use the 'Modern Sport Tech' design system: ink navy (#0B1220), electric green (#12E28C), steel blue (#1E2A44), off-white (#F7FAFC), Barlow Condensed headings, Manrope body. Implement public routes for Home, About, News, Community, Verify, plus an authenticated Sport ID application route, Feedback route, and a role-based Console for Director/Faculty Sport Officer/Media Officer. Athletes sign in with Google to auto-capture their email. The ID card form collects photo, full name, date of birth (auto age), matric number, faculty, department, sport, gender, and phone. Card numbers auto-generate as GICS/YYYY/NNNN with a barcode. ID cards are downloadable in-app and will be emailed once a domain is verified; office email of record is paulinomarx4@gmail.com. Enforce RLS, separate user_roles table, and server-side role checks. Use file-based TanStack Router, Tailwind v4 with theme tokens, shadcn/ui, jsbarcode, and html-to-image. No purple gradients, no generic startup aesthetics."

---

*Prepared for the Office of the Director of Sports, Great Ife Students' Union, OAU.*
