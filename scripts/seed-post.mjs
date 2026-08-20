/**
 * Inserts (or refreshes) one sample post so the blog can be exercised end to end.
 *
 *   node --env-file=.env.local scripts/seed-post.mjs
 *   node --env-file=.env.local scripts/seed-post.mjs --draft
 *   node --env-file=.env.local scripts/seed-post.mjs --remove
 *
 * The body deliberately uses every node and mark type lib/tiptap-render.tsx
 * knows about - headings, both list kinds, a quote, a code block, a divider,
 * bold/italic/inline-code/link marks - so rendering it proves the whole
 * pipeline rather than just the happy path.
 *
 * Images are the one thing it cannot cover: the renderer only accepts
 * *.public.blob.vercel-storage.com URLs, so a made-up src would be silently
 * dropped. Upload a cover through /admin to test that half.
 *
 * Writes are keyed on the slug, so running this twice updates rather than
 * failing against the unique index.
 */
import { MongoClient } from "mongodb";

const SLUG = "hook-retention-three-second-drop";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set. Run with: node --env-file=.env.local scripts/seed-post.mjs");
  process.exit(1);
}

const remove = process.argv.includes("--remove");
const asDraft = process.argv.includes("--draft");

/* -------------------------------------------------------------------------- */
/* TipTap document helpers                                                    */
/* -------------------------------------------------------------------------- */

const text = (value, ...marks) => ({
  type: "text",
  text: value,
  ...(marks.length ? { marks: marks.map((m) => (typeof m === "string" ? { type: m } : m)) } : {}),
});
const link = (href) => ({ type: "link", attrs: { href } });
const para = (...content) => ({ type: "paragraph", content });
const heading = (level, value) => ({
  type: "heading",
  attrs: { level },
  content: [text(value)],
});
const item = (...content) => ({ type: "listItem", content: [para(...content)] });

const body = {
  type: "doc",
  content: [
    para(
      text("Most brands treat the first three seconds as a formality - a logo, a "),
      text("slow pan", "italic"),
      text(", a title card. The retention curve disagrees, and it disagrees "),
      text("expensively", "bold"),
      text("."),
    ),

    heading(2, "What the drop actually looks like"),
    para(
      text(
        "Pull the retention graph on any underperforming ad and the shape is always the same: a cliff between 0:00 and 0:03, then a gentle slope. The cliff is not an attention problem. It is a promise problem - nothing in those three seconds told the viewer what they were about to get.",
      ),
    ),
    para(
      text("Three patterns account for most of the cliff we see in audits:"),
    ),
    {
      type: "bulletList",
      content: [
        item(text("Branded intros. ", "bold"), text("Nobody opted in to watch a logo animate.")),
        item(text("Context before conflict. ", "bold"), text("The setup runs long and the reason to care arrives after the viewer has gone.")),
        item(text("Voiceover-first openings. ", "bold"), text("Sound-off viewing is the default, so an audio-only hook is no hook at all.")),
      ],
    },

    heading(2, "The fix is structural, not stylistic"),
    para(
      text("Rewriting the first line rarely moves the number. Restructuring what the first line "),
      text("does", "italic"),
      text(" almost always does. In order:"),
    ),
    {
      type: "orderedList",
      content: [
        item(text("Lead with the outcome or the objection, never the brand.")),
        item(text("Put the visual proof on screen before the claim, not after it.")),
        item(text("Burn in captions - assume the sound is off and the phone is muted.")),
        item(text("Cut the first two seconds you were fond of. They are almost always setup.")),
      ],
    },

    {
      type: "blockquote",
      content: [
        para(
          text(
            "A hook is not the first line of the script. It is the first reason the viewer has to stay.",
          ),
        ),
      ],
    },

    heading(3, "How we measure it"),
    para(
      text("We track three-second hold rate as a share of impressions, not of plays. The distinction matters: "),
      text("plays", "code"),
      text(" already filters out the people who scrolled past, which is exactly the group you are trying to win."),
    ),
    {
      type: "codeBlock",
      content: [
        text("hold_rate_3s = views_3s / impressions\ntarget       = 0.28   // below this, the hook is the problem\nfatigue_flag = hold_rate_3s drops >15% week over week"),
      ],
    },

    { type: "horizontalRule" },

    para(
      text("This is the same diagnostic we run in every creative audit. If you want the full teardown template, it is on the "),
      text("work page", link("https://slic.agency/work")),
      text("."),
    ),
  ],
};

const now = new Date();

const doc = {
  title: "Why Your Hook Dies at Three Seconds",
  slug: SLUG,
  excerpt:
    "Pull the retention graph on any underperforming ad and the shape is the same: a cliff between 0:00 and 0:03. That cliff is a promise problem, not an attention problem.",
  body,
  // Left null so the placeholder at /blog/placeholder.jpg is exercised too.
  coverImage: null,
  authorName: "SLIC",
  categories: ["Creative Strategy", "Meta Ads"],
  featured: true,
  status: asDraft ? "draft" : "published",
  publishedAt: asDraft ? null : now,
  updatedAt: now,
};

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });

try {
  await client.connect();
  const posts = client.db(process.env.MONGODB_DB || "slic").collection("posts");

  if (remove) {
    const { deletedCount } = await posts.deleteOne({ slug: SLUG });
    console.log(deletedCount ? `Removed /blog/${SLUG}` : "Nothing to remove.");
  } else {
    const result = await posts.updateOne(
      { slug: SLUG },
      { $set: doc, $setOnInsert: { createdAt: now } },
      { upsert: true },
    );
    console.log(result.upsertedCount ? "Inserted." : "Updated existing post.");
    console.log(`  status : ${doc.status}`);
    console.log(`  local  : http://localhost:3000/blog/${SLUG}`);
    console.log(`  admin  : http://localhost:3000/admin`);
    if (asDraft) console.log("\n  Draft - it will NOT appear on /blog until published.");
  }
} catch (error) {
  console.error("Failed:", error.message.split("\n")[0]);
  process.exitCode = 1;
} finally {
  await client.close().catch(() => {});
}
