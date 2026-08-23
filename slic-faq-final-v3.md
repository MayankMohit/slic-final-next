# SLIC FAQ (final) and Decisions Applied

Ten questions, five per column. No em dashes anywhere in this file.

**Changed since v2:**

* Every em dash and en dash removed. Replaced with full stops, colons and commas depending on what the sentence actually needed
* A few other AI tells trimmed. Details at the end
* Fixed a redundancy in Q2 (it said "licensed" twice)

| Left column | Right column |
|---|---|
| 1. Who you work with | 6. What if it doesn't work |
| 2. The model (no shoot, no UGC) | 7. Minimum commitment |
| 3. What we get monthly | 8. Cost |
| 4. Speed | 9. What you need from us |
| 5. Strategy vs execution | 10. Why SLIC |

---

## LEFT COLUMN

### 1. What type of clients does SLIC work with?

DTC and ecommerce brands spending $30,000+ per month on paid media, running video ads on Meta, TikTok and YouTube.

If you have product-market fit and a converting funnel but creative is your bottleneck, we're a good fit. If you're still finding product-market fit, creative isn't your real problem yet, and we'll tell you that on the call.

### 2. Do you shoot footage or work with UGC creators?

No to both, and that's deliberate. We work from footage that already exists: your product shots, your past ads, and creator content you've already licensed. Where there's a gap we bring in licensed footage, plus animation and motion graphics we build in-house.

That's why we can turn a new variant around in 48 to 72 hours. A shop that films has to book a crew, a location and talent before it can test a single idea. We don't.

### 3. What do we actually get each month?

4 to 6 distinct creative concepts, built out into 12 to 20 platform-ready variants: different hooks, lengths, aspect ratios and CTAs, cut for each platform.

Every batch ships with the research brief behind it and a testing plan, so your media buyer knows what each variant is testing. Two rounds of revisions are included on every ad.

### 4. How long until we get the first batch?

About three weeks. Week one is research and strategy, week two scripting, week three editing and motion work.

That front-loaded work is what makes everything after it fast. Once the research exists, new variants ship in 48 to 72 hours. The first batch is the slowest one you'll ever get from us.

### 5. Do you handle creative strategy, or just execution?

Both, and strategy comes first. We audit your competitors' ads, mine your customer reviews, and break down what's already winning in your category. That becomes a brief showing which hooks, angles and formats work, and where the gaps are.

You don't need a script or a concept to start. Most clients arrive with a product and a problem. We handle the rest.

---

## RIGHT COLUMN

### 6. What happens if the first batch doesn't beat our current creative?

We iterate, fast. Every batch tests several distinct angles rather than betting on one idea, so even a batch without a winner tells us which direction is dead and which is worth pushing. That feedback goes straight into the next round, in 48 to 72 hours rather than another three weeks.

What we won't do is keep billing you to find out. If we're several rounds in and nothing is moving, we'll say so.

### 7. What's the minimum commitment?

There isn't one. We work month to month and you can cancel any time. Once you've paid, the finished videos are yours, and we'll hand over the project files too if you ask for them.

We'd rather earn the next month than lock you into six. Most agencies use long contracts to protect themselves against creative that doesn't perform. We'd rather just make creative that performs.

### 8. How much does it cost to work with SLIC?

Pricing depends on volume, platforms and turnaround, so we scope it on the call rather than quote a number that won't fit you.

What we can say upfront: no minimum commitment, and you can cancel any time. The number that actually matters is whether the first month pays for itself.

> **Note, not for the site:** this is the only answer that gives the reader nothing concrete. That's a deliberate choice, not an oversight. If bookings from cold traffic underperform, this is the first answer to revisit. Adding a floor would be the single highest-leverage change to this page.

### 9. What do you need from us, and how do you keep it on-brand?

Your product, your brand guidelines and tone, and whatever creative material you already have: product footage, past ads, photography, anything that performed before. **We don't need access to your Ads Manager.** Send us the numbers and we'll work from those.

You review and approve everything before delivery. Nothing ships without your sign-off.

### 10. Why should we choose SLIC over other creative agencies?

Most agencies start with production. We start with research. We know what's working in your category before we build anything, and every ad is scripted from that, not from a template.

And because we don't run shoot days, we can test an idea in 48 to 72 hours instead of four to eight weeks. No contract holding you in place. If the work doesn't perform, you leave.

---

## Still required outside the FAQ

| | Current | Change to |
|---|---|---|
| **Comparison table, Speed row** | `Test-ready variants in 48 to 72 hours` | `Week 3 launch, then 48hr iteration` |
| **Comparison table, Pricing row** | `Flexible packages built for scaling DTC brands` | `Month-to-month, cancel any time` |
| **"How We Work" intro** | `We don't offer UGC. We don't guess...` | `We don't run shoot days. We don't offer UGC. We don't guess...` |
| **Process card 03** | `All production stays in-house...` | `All editing and motion work stays in-house...` |

The Speed row is deliberately short. It sits opposite "4 to 8 week creative cycles", and in a comparison table the shorter cell wins the glance.

**Platform naming:** the FAQ says "Meta, TikTok and YouTube". Other site copy says "Facebook, Instagram, TikTok, and YouTube". Pick one convention and use it everywhere. Either is fine, both is sloppy.

**Leave alone:** the H1 subhead, Siddhartha's "Head of Production" title, and the client logo row.

---

## Build notes

* **Two columns on desktop, single stack on mobile.** Mobile order is 1 through 10 as numbered, not left column then right column.
* **Render every answer in the DOM at all times**, hidden with CSS or via `<details>` and `<summary>`. Right now answers only mount on expand, so crawlers see the questions and nothing else. **This is required, not optional.** It's what makes the copy above visible to search at all.
* **Add `aria-expanded` and `aria-controls`** to the trigger buttons.
* **No FAQPage schema.** Deprecated May 2026.

*(These four supersede the equivalent items in the D5 section of the other brief. Own them here, delete them there, so they don't get done twice or skipped by both.)*

---

# Terms of Service: required update

Q7 now promises project files on request. Your live Terms say only *"Upon full payment, you own the final deliverables we create for you"*, and project files aren't mentioned. So the homepage would be promising something the contract doesn't cover.

Add a clause to the intellectual property section:

> **Deliverables and project files.** Upon full payment, you own the final video deliverables we create for you. Project files, meaning editing timelines, motion graphics source files and layered assets, remain available on request for the duration of our engagement and for 90 days after it ends. Licensed stock, music and third-party assets used within a deliverable remain subject to their original licence terms and are not transferred.

Two things that clause does beyond matching Q7.

**The 90-day window** means you're not obliged to keep archives indefinitely. Without it, a client can ask for project files three years later and you're technically on the hook.

**The licensed-asset carve-out** matters because you use licensed footage. Handing over a project file can't transfer someone else's licence, and saying so upfront prevents a dispute where a client assumes it did.

Have your own legal review the wording. The point is that the Terms and the FAQ need to say the same thing before the FAQ goes live.

---

# On the logo row: one option, then I'll drop it

You've decided to keep the logos as they are. Understood, and I won't raise it again.

One thing worth knowing though. It isn't the logos that make the claim, it's the heading above them. *"Trusted by DTC brands scaling on paid media"* is what turns Maybelline and NEXA into implied clients.

Change six words and the problem goes away with zero design work, zero logos moved, zero layout change:

> **Current:** Trusted by DTC brands scaling on paid media
> **Alternative:** Brands our team has delivered for

That's accurate. Your team has delivered for every logo in that row, Vedant included. It keeps all seven logos in one strip exactly as they are now, and there's nothing left for a prospect to catch you on.

If you'd rather keep the current heading, that's your call and it's a reasonable risk to carry at this stage. Just know the exposure sits in the heading, not in the images.

---

# Other AI tells I removed while I was in here

Em dashes are the obvious one, but they're not the only pattern that reads as machine-written. Four more worth watching for in anything you publish:

**The "it's not X, it's Y" reversal.** Q8 previously ended *"the real question isn't what it costs, it's whether the first month pays for itself."* That construction is everywhere in AI copy. Now it reads *"The number that actually matters is whether the first month pays for itself."* Same point, no pattern.

**Rule of three.** AI reaches for three items in a list almost every time. Real writing uses two and four just as often. Q9 deliberately runs four items, Q3 runs four.

**"That's exactly why".** Intensifiers like *exactly*, *precisely* and *truly* get bolted on where the plain sentence was already fine. Q2 now says *"That's why we can turn a new variant around"*.

**Perfectly balanced sentence pairs.** Q7's *"Most agencies use long contracts... We'd rather just make creative that performs"* is a symmetrical pair, and I've kept it because it earns its place as the closing line of an answer. One per page is a rhetorical device. Four per page is a tell.

For your blog especially, the fastest check: read a paragraph aloud. If you'd never say it in a meeting, rewrite it.
