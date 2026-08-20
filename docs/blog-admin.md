# Blog admin

The blog runs on MongoDB, Vercel Blob and a password-protected editor at
`/admin`. It replaced Sanity, so there is no Studio, no `/studio` route, and no
third-party account to hand over — the database and the images belong to
whoever holds the connection string.

## One-time setup

### 1. A database

Any MongoDB works. For a throwaway one, create a free M0 cluster at
[cloud.mongodb.com](https://cloud.mongodb.com), add a database user, and under
**Network Access** allow `0.0.0.0/0` (Vercel's functions have no fixed IP).

Copy the connection string into `.env.local`:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=slic
```

Indexes are created automatically on first use: a unique index on `slug`, a
compound index on `{ status, publishedAt }`, and a TTL index on
`login_attempts.expiresAt`.

### 2. The admin password

```bash
node scripts/hash-password.mjs "a long password you will remember"
```

It prints two lines. Paste both into `.env.local`:

```
ADMIN_PASSWORD_HASH=scrypt:<salt>:<key>
ADMIN_SESSION_SECRET=<48 random bytes>
```

The plaintext password is never stored. `ADMIN_SESSION_SECRET` signs the session
cookie — changing it signs everyone out immediately, which is the fastest way to
revoke access if the password ever leaks.

### 3. Image storage

In the Vercel dashboard: **Storage → Create → Blob**, then link it to the
project. Vercel injects `BLOB_READ_WRITE_TOKEN` into deployments automatically.
For local uploads, pull it down:

```bash
vercel env pull .env.local
```

Without that token the editor loads but image uploads fail.

### 4. Deploy

Add `MONGODB_URI`, `MONGODB_DB`, `ADMIN_PASSWORD_HASH` and
`ADMIN_SESSION_SECRET` to the Vercel project's environment variables.
`BLOB_READ_WRITE_TOKEN` is already there if the store is linked.

## Handing the database to the client

Only the connection string changes. To carry existing posts across:

```bash
mongodump   --uri="<current MONGODB_URI>" --db=slic --out=./dump
mongorestore --uri="<client MONGODB_URI>" --nsFrom='slic.*' --nsTo='slic.*' ./dump
```

Then swap `MONGODB_URI` in Vercel and redeploy.

Images are the part that does *not* move automatically — they live in whichever
Blob store the uploads went to. If the client wants to own those too, create a
Blob store under their account before any real content is written.

## Writing posts

`/admin` lists everything, drafts included. `/admin/new` opens an empty editor.

- **Slug** follows the title until you edit it by hand, after which it stays
  put. Renaming a published post changes its URL and orphans the old one, so
  the field deliberately stops auto-updating once a post exists.
- **Publish date** blank means "now". A date in the future keeps the post out of
  every public query until it passes — the blog index revalidates hourly, so a
  scheduled post appears within the hour of its date.
- **Draft** posts are invisible to the site entirely; they are filtered out at
  the database query, not hidden in the UI.
- **Excerpt** blank derives from the first 180 characters of the body.
- **Featured** puts the post in the "Featured Articles" row on `/blog`.

Saving calls `revalidatePath` for `/blog`, the post's URL, the previous URL if
the slug changed, and `/sitemap.xml`, so edits are live immediately rather than
waiting for the hourly window.

## How it fits together

| File | Role |
| --- | --- |
| `lib/mongodb.ts` | Cached `MongoClient`, one pool per instance |
| `lib/post-types.ts` | Types and pure helpers — no `server-only`, safe in the browser |
| `lib/posts.ts` | Queries; everything that touches the driver |
| `lib/post-schema.ts` | Zod validation for anything posted back from the editor |
| `lib/auth.ts` | scrypt password check, JWT session cookie, login throttle |
| `lib/tiptap-render.tsx` | TipTap JSON to React, whitelisted node by node |
| `app/admin/**` | The editor |
| `app/api/admin/upload/route.ts` | Issues Blob upload tokens, admin-only |

Article bodies are stored as TipTap (ProseMirror) JSON, not HTML. Nothing ever
renders through `dangerouslySetInnerHTML`, so there is no HTML string to
sanitize — unknown node types are simply not rendered.

## Security notes

- Every server action and the upload route call `assertAdmin()` for themselves.
  The layout guard at `app/admin/(dashboard)/layout.tsx` stops pages rendering
  for a signed-out visitor, but it is not the only check, because a layout
  cannot protect a server action.
- Failed logins are counted in Mongo, not in memory: eight attempts per IP per
  15 minutes, shared across every serverless instance. The in-memory limiter in
  `lib/rate-limit.ts` is per-instance and stays where it is, guarding the
  careers form.
- Uploads are capped at 8MB and restricted to JPEG, PNG, WebP, AVIF and GIF.
  Post bodies may only reference `*.public.blob.vercel-storage.com` URLs, both
  at save time and at render time.
- `/admin` is `noindex, nofollow, nocache`.
