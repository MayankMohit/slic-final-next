# SLIC Work Brief (revised)

Supersedes the earlier D3/D5/D7/O2/O3 document. Do not work from that version.

**What changed:**

* **D3 rewritten.** Canonical host is now `slic.agency`, not www. The previous version had this backwards and would have caused unnecessary work
* **D7 cancelled.** Logo row stays as it is
* **D5 corrected.** The schema example had an error in it
* **O2 and O3 unchanged**

---

## Summary

| # | Item | Owner | Priority | Est. |
|---|---|---|---|---|
| D3 | Add a redirect so the site serves on one hostname | Dev | Medium | ~10 min |
| D5 | Extend the existing schema, add Article schema to blog | Dev | Low | ~1.5 hrs |
| D7 | **Cancelled** | | | |
| O2 | Reconcile contradictory numbers across pages | Ops | **High** | ~20 min |
| O3 | Fix the Calendly booking event | Ops | **High** | ~15 min |

O2 is blocked until Vedant confirms five numbers, listed at the end. Everything else is unblocked.

---

# DEV

## D3. Add a redirect so the site serves on one hostname

### The situation

Both of these serve the complete site right now, with a 200 and no redirect between them:

* `https://slic.agency/`
* `https://www.slic.agency/`

So every page exists at two addresses, and Google has to guess which one is real.

### Decision: the canonical host is `slic.agency` (no www)

This is already what the codebase declares. All four of these point at the apex today and are correct:

| Declaration | Current value | Action |
|---|---|---|
| `<link rel="canonical">` | `https://slic.agency/` | none, already correct |
| `og:image` | `https://slic.agency/og-image.jpg` | none, already correct |
| `sitemap.xml`, all locs | `https://slic.agency/...` | none, already correct |
| `robots.txt` Sitemap line | `https://slic.agency/sitemap.xml` | none, already correct |

### The only thing to build

**A 301 redirect from `www.slic.agency` to `slic.agency`**, preserving path and query string. `www.slic.agency/work` goes to `slic.agency/work`, not to the homepage.

On Vercel this is a domain setting, not code. Set `slic.agency` as the primary domain and `www.slic.agency` as a redirect to it. If it's done in `next.config.js` instead, use `permanent: true`.

That's the whole ticket. Roughly ten minutes.

### Verify

```bash
# www must 301 to apex, with the path preserved
curl -sI https://www.slic.agency/work | grep -i -E "^(HTTP|location)"
# expect: HTTP/2 301  +  location: https://slic.agency/work

# apex must return 200
curl -sI https://slic.agency/work | head -1
# expect: HTTP/2 200
```

### Two notes

**Internal links need no change.** They're relative, so they follow whichever host the visitor is on. Once www redirects, everyone ends up on the apex.

**Sitemap cleanup.** `slic.agency/blog/test-blog` is currently listed in the sitemap. Ops is deleting that post separately. Confirm with them that it's gone before the next build, then check it has dropped out of `sitemap.xml`.

### Honest note on priority

This is hygiene, not an emergency. Your canonical tags consistently point at the apex, so Google would very likely consolidate correctly on its own. It's worth doing because it takes ten minutes, not because anything is currently broken.

---

## D5. Extend the existing schema

### Do not add FAQPage schema

Google deprecated FAQ rich results:

* **7 May 2026**, FAQ rich results stopped appearing in Google Search
* **June 2026**, the FAQ filter, rich result report and Rich Results Test support were removed
* **August 2026**, Search Console API support for FAQ data ends

Existing FAQ markup is harmless and doesn't need removing, but it produces no search benefit. Adding it now would be work with no return.

### 5a. Enrich the Organization schema, roughly 45 minutes

`Organization` JSON-LD is already on the site and correctly formed. **Keep the `@type` as `Organization`** and add fields to the existing block:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SLIC",
  "url": "https://slic.agency/",
  "logo": "https://slic.agency/<CONFIRM_ACTUAL_PATH>",
  "description": "Performance video ad creative for DTC brands scaling on Meta, TikTok and YouTube.",
  "sameAs": [
    "https://www.linkedin.com/company/slic-media/",
    "https://x.com/slic_media"
  ],
  "email": "hello@slic.agency",
  "knowsAbout": [
    "Performance marketing",
    "Video ad creative",
    "Meta Ads",
    "TikTok Ads",
    "YouTube Ads"
  ]
}
```

**Two things to get right:**

**Do not change `@type` to `ProfessionalService`.** An earlier draft of this brief suggested that and it was wrong. `ProfessionalService` is a subtype of `LocalBusiness` and carries an expectation of a physical address, opening hours and geo data. Declaring it without those is a weaker signal than a clean `Organization`, not a stronger one.

**Confirm the real logo path** before using it. The placeholder above is not a verified URL. Schema pointing at a missing file is a validation error, which is worse than having no logo field.

`sameAs` is the field that matters most here. It's how Google connects the website, the LinkedIn page and the X account as one entity.

Validate the result at [validator.schema.org](https://validator.schema.org/).

### 5b. Add Article schema to blog posts, roughly 1 hour

Still fully supported, unlike FAQ, and still generates rich results. Each post gets `Article` or `BlogPosting` with `headline`, `datePublished`, `dateModified`, `author`, `image` and `publisher`. Worth doing as the blog grows.

### Moved out of this ticket

The FAQ accessibility and DOM-rendering work that used to sit here is now owned by the FAQ document, because that's what makes it urgent. **Do not do it from this file.** It covers rendering answers in the DOM at all times, `aria-expanded` and `aria-controls` on the trigger buttons, and proper heading hierarchy.

---

## D7. Cancelled

The client logo row stays exactly as it is. No build work.

*One optional copy change is still open for Vedant's decision, covered at the end of the FAQ document. It involves the heading above the row, not the logos or the layout. Nothing for the dev unless he says yes.*

---

# OPS

## O2. Reconcile contradictory numbers across pages

### What's wrong

The same facts carry different numbers on different pages. All verified live:

| # | Claim | Homepage says | Other page says |
|---|---|---|---|
| 1 | Performance ads delivered | **1000+** | **500+** on /about |
| 2 | NeuroBrocc ROAS | **3.5x** | **3x** on /case-studies |
| 3 | Loop Labs result | **"3x performance improvement"** | **2.5x ROAS** on /case-studies |
| 4 | ROAS headline | **"3.2x Avg. ROAS Lift"** | **"2.5x to 3.5x+ Average ROAS"** on /about |
| 5 | Brands scaled | **50+** on /about | Case studies account for the entire $50M between two clients |

Number 1 is the sharpest. The same metric, a 2x difference, two pages, both live, both in the nav.

Number 4 isn't just different figures, it's two different metrics sharing a label. A "ROAS lift" is a delta over a baseline. An "average ROAS" is an absolute. They can't both be described the same way.

Number 5 is the one to think about rather than just correct. Loop Labs at $40M+ plus NeuroBrocc at $10M+ equals exactly the $50M+ headline, which means the other 48 brands contributed nothing to it. Anyone reading both pages does that subtraction. Concentration isn't a weakness if it's framed as retention. "$50M+ generated, $40M of it from a single two-year engagement" is a stronger claim than the vague version, because it proves clients stay.

### Why it matters

The buyer is a DTC operator who reads numbers for a living and cross-checks before a call. Two different figures for the same metric doesn't read as a typo, it reads as numbers that were invented. Once one figure is doubted, all of them are, including the true ones.

This got more important after the redesign, not less. Better-looking pages get read more carefully.

### What to do

1. Vedant confirms the correct figure for each row
2. Update every instance across home, /case-studies, /about, and any deck or PDF using the same numbers
3. Record the agreed figures in a shared doc, one source of truth for every public number, so this can't drift again

**Done when:** searching the site for each metric returns one consistent figure, and the reference doc exists.

---

## O3. Fix the Calendly booking event

### What a prospect currently sees

Click **"Book A Strategy Call"** and the booking screen says:

> **Vedant Kulkarni**
> **30 Minute Meeting**
> 30 min, web conferencing details provided upon confirmation

That's Calendly's stock default, unbranded, with a name that doesn't match the button just clicked. It's the last screen before someone commits, and it looks like a personal calendar link rather than an agency booking flow.

### Fix, all in Calendly settings

1. **Rename the event type** to `SLIC Strategy Call`. It should match the CTA wording.
2. **Add a description** matching what the site promises:
   > A clear breakdown of what's holding your creative back and how we'd fix it. No pitch, no pressure.
3. **Brand it.** Upload the SLIC logo, set the brand colour to `#6e23db`.
4. **Add two intake questions:** monthly ad spend, and primary platform. These qualify the call before it happens, so Vedant walks in already knowing whether it's a fit.
5. **Check availability.** When tested, the booking calendar showed availability on today's date only for the rest of the month. That may be accurate or it may be a calendar sync issue. Please confirm which. If it's real, open more windows. A prospect who opens the calendar and sees almost nothing available assumes we're either unreachable or not real, and doesn't come back.

**Done when:** the booking screen is branded, named to match the CTA, carries the two qualifying questions, and shows meaningful availability.

*Separate dev item, not for ops: the popup takes around ten seconds to become interactive, and the booking step has no URL of its own. Being handled separately.*

---

# Inputs needed from Vedant

O2 can't start until these are confirmed. Five numbers, five minutes.

1. **Performance ads delivered.** Is it 500+ or 1000+?
2. **NeuroBrocc ROAS.** 3.5x or 3x?
3. **Loop Labs.** 2.5x ROAS, or a "3x performance improvement"? If both are true they measure different things and need different labels.
4. **Headline ROAS.** Is the claim a lift, meaning a 3.2x improvement over baseline, or an average absolute ROAS of 2.5 to 3.5x? Pick one metric and one label.
5. **Brands scaled.** Is 50+ defensible, given two clients account for the full $50M revenue figure? If yes, keep it. If it needs reframing, see the note in O2.

---

## Sources, FAQ deprecation

* [Google Drops FAQ Rich Results From Search, Search Engine Journal](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/)
* [FAQ schema died twice. The fix is FAQSection, Joost de Valk](https://joost.blog/faq-schema-cycle/)
* [FAQ Rich Results Deprecated, Google's May 2026 Change](https://www.getpassionfruit.com/blog/what-changed-with-google-drops-faq-rich-results-and-what-to-do-now)
