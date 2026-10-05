# Ambassador Console — interactive demo

A front-end demo of an operations console for running a campus brand-ambassador programme: review
timesheets and expenses, curate campaign resources and social posts, see who is active, and message
ambassadors.

**There is no backend.** No sign-in, no database, no network calls. Every name, client, university and
address is invented, and all data lives in memory, so a refresh returns the demo to its starting state.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
npm run preview    # serve the production build locally
```

The build uses relative asset paths and a hash router, so `dist/` works on any static host or inside a
sub-folder of an existing site (GitHub Pages, Netlify, S3, a portfolio subpath) with no rewrite rules.

## What to try

Use the **Admin / Ambassador** switch in the header. It stands in for sign-in and changes what you can
see and do, the way roles would in the real thing. **Reset** restores the starting data.

| Where | Try this |
| --- | --- |
| Submissions (admin) | Open a timesheet and approve it. Reject another and give a reason. Approving one with a social link publishes it to that campaign's gallery. |
| Expenses (admin) | Open the **£0.00 "Parking"** expense and try to approve it: it is refused. Set a real amount, then approve. Export paid expenses to CSV. |
| Campaigns → Resources | Open a folder, use the arrow keys in the viewer. One file is too large to preview, one video has no preview frame, and neither shows a broken image. |
| Campaigns → Social | As admin, hide a post with the eye icon. Switch to Ambassador and it is gone. |
| Ambassadors (admin) | Filter by **Not activated**, see **Online now** versus last seen, suspend someone. |
| New timesheet (ambassador) | Submit it empty to see validation. Reach of **0** is accepted (a poster); description cannot be only spaces. |
| Inbox | Open an unread thread to clear its marker. Reply as admin and a simulated answer arrives. |

## How it is put together

```
src/
  components/ui/      shadcn-style primitives (Radix + Tailwind)
  components/         shared pieces: badges, review footer, layout shell
  data/               in-memory store + fictional seed data + generated artwork
  features/<name>/    one folder per area:
    *Rules.js           pure business rules (no React, no I/O)
    *Service.js         the only code that touches the store; adds latency
    *Queries.js         TanStack Query hooks: keys, caching, invalidation
    *Page.jsx           the screen
  lib/                money, time, and the role switch
```

Data flows **Page → query hook → service → store**, with rules kept pure so they can be tested without a
UI. Swapping the in-memory store for a real API would only touch the `*Service.js` files.

Decisions worth a look:

- **Money is summed in integer pennies** and only divided for display, so totals and the exported CSV
  reconcile exactly (`src/lib/money.js`, `features/expenses/expenseRules.js`).
- **Nothing worth £0.00 can be approved or paid.** The same rule is checked for expenses and for
  timesheets, judged on hours plus bonus so a bonus-only row stays valid
  (`features/submissions/submissionRules.js`).
- **Validation with Zod**, with messages written for the person filling the form in, including the
  "write 0 for a poster" case.
- **Roles are enforced in the service layer**, not just by hiding buttons: an ambassador's request for
  other people's rows, or an admin-only action, is refused even if the UI were bypassed.
- **Media never renders a broken image.** Grid previews are small thumbnails or type tiles, an image that
  fails falls back to a tile, and the viewer has a defined state for every kind of file.
- **Generated artwork.** There are no photographs: every "image" is an SVG built from a seed string, so
  there is nothing to license and no binary assets.
- **Code-split pages** so the first load only fetches the shell and the page you land on.

## Stack

React 19 · Vite · Tailwind CSS 4 · Radix UI · TanStack Query · React Router (hash) · Zod · lucide-react

## Notes

- Platform "logos" are neutral coloured initials rather than third-party marks.
- Files chosen in the timesheet form are never read or uploaded; only the file name is kept.
- This is a demo: there is no accessibility audit, test suite or error reporting beyond what is visible.
