# Public numbers: one source of truth

Every figure SLIC states publicly, where it currently appears, and what it
should say. This file exists because the same metric carried two different
values on two pages that are both in the nav, which is the kind of thing a DTC
operator notices and cannot un-notice.

**Status: awaiting Vedant.** Nothing in the site has been changed. The tables
below are an audit of what is live in the codebase right now. Fill in the
**Agreed** column, and each change becomes mechanical.

**Rule once this is filled in:** a number does not go on the site, in a deck,
in a PDF or in a meta description unless it is in this file. If a new number is
needed, it gets added here first.

---

## The five open questions

### 1. Performance ads delivered

**Agreed figure:** `________`

| Where | Currently says |
|---|---|
| `components/sections/hero-section.tsx:22` — homepage stat band | **1000+** |
| `app/about/about-content.tsx:58` — /about milestones | **500+** |

Same metric, same wording on the label, 2x apart, both pages in the nav. This
is the sharpest of the five.

---

### 2. NeuroBrocc ROAS

**Agreed figure:** `________`

| Where | Currently says |
|---|---|
| `components/sections/case-studies-section.tsx:13` — homepage card metric | **3.5x ROAS** |
| `components/sections/case-studies-section.tsx:19` — homepage card body | "Delivered **3.5x ROAS** for NeuroBrocc during their US market relaunch" |
| `app/case-studies/case-studies-content.tsx:38` — case study stat | **3x** |
| `app/case-studies/case-studies-content.tsx:40` — case study title | "NeuroBrocc: $10M+ Revenue and **3x ROAS** on US Launch" |
| `app/case-studies/case-studies-content.tsx:48` — case study result bullet | "**3x ROAS** on paid campaigns" |

Four of the five say 3x. The homepage is the outlier.

---

### 3. Loop Labs result

**Agreed figure:** `________`

**Agreed label:** `________`

| Where | Currently says |
|---|---|
| `components/sections/case-studies-section.tsx:24` — homepage card metric | **3x** |
| `components/sections/case-studies-section.tsx:29` — homepage card body | "**3x performance improvement**" |
| `app/case-studies/case-studies-content.tsx:17` — case study stat | **2.5x ROAS** |
| `app/case-studies/case-studies-content.tsx:27` — case study result bullet | "Consistent **2.5x ROAS** across campaigns" |

If both are true they are measuring different things, and each needs its own
label. "Performance improvement" is not a defined metric; whatever it means,
say that instead.

---

### 4. Headline ROAS: which metric, and what is it called

**Agreed metric (lift or absolute):** `________`

**Agreed figure:** `________`

**Agreed label:** `________`

| Where | Currently says |
|---|---|
| `components/sections/hero-section.tsx:24` — homepage stat band | **3.2x**, labelled "Avg. ROAS Lift", counts up from 2.0 |
| `app/about/about-content.tsx:57` — /about milestones | **2.5x to 3.5x+**, labelled "Average ROAS" |
| `app/about/page.tsx:15` — /about meta description | "**2.5x to 3.5x** ROAS" (no `+`) |
| `app/case-studies/page.tsx:13` — /case-studies OG description | "**2x to 3x** ROAS" |

A **lift** is a delta over a baseline. An **average ROAS** is an absolute.
They cannot share a label, and right now there are three different ranges
across four places. The fourth row was not in the brief and is a third variant.

Note the homepage figure animates upward from 2.0, so the number is also making
an implicit claim about the baseline.

---

### 5. Brands scaled, and how the $50M splits

**Agreed figure:** `________`

**Agreed framing for the concentration:** `________`

| Where | Currently says |
|---|---|
| `app/about/about-content.tsx:59` — /about milestones | **50+** brands scaled |
| `app/case-studies/case-studies-content.tsx:16, 19, 26` — Loop Labs | **$40M+** |
| `app/case-studies/case-studies-content.tsx:37, 40, 47` — NeuroBrocc | **$10M+** |

$40M + $10M is exactly the $50M+ headline, so on the published figures the
other 48 brands contributed nothing to it. Anyone reading both pages does that
subtraction.

Worth reframing rather than just correcting: "$50M+ generated, $40M of it from
a single two-year engagement" proves retention, which is a stronger claim than
the vague version.

---

## Figures that are consistent today

Leave these alone unless a number above changes and drags one of them with it.

| Figure | Where |
|---|---|
| **$50M+** revenue generated | `components/sections/hero-section.tsx:21`, `app/about/about-content.tsx:56`, `app/about/about-content.tsx:128`, `components/sections/about-section.tsx:61`, `app/about/page.tsx:15`, `app/layout.tsx:49`, `app/layout.tsx:75`, `app/case-studies/page.tsx:13` |
| **32%** avg. CPA reduction | `components/sections/hero-section.tsx:23` (only instance) |
| **LOKT 3x ROAS, $12 to $15 CPA** | `app/case-studies/case-studies-content.tsx:58, 61, 68` (internally consistent, no revenue figure claimed) |
| **$30k+/month** minimum client spend | homepage FAQ, hero, /join, case studies CTA |
| **48 to 72 hours** iteration speed | homepage FAQ, `app/about/about-content.tsx:28` |

`$50M+` appears in eight places. If that number ever moves, all eight move.

---

## Found during the audit, not in the brief

**`app/case-studies/page.tsx:7`** — the /case-studies meta description reads:

> "See how we've helped brands achieve 3x conversion rates, 150K+ followers, and 7-figure revenue."

Three problems in one sentence, and it is the text Google shows under the
result:

* **"3x conversion rates"** is not ROAS and not a conversion rate. A 3x
  conversion rate is not a thing.
* **"150K+ followers"** is a metric that appears nowhere else on the site.
  SLIC does not sell follower growth.
* **"7-figure revenue"** contradicts the `$50M+` in the OG description of the
  same file, eight lines below. That is 8-figure.

This reads as leftover boilerplate from an earlier positioning. It is not one
of the five, but it is the worst single line of numbers on the site.

**Removed already:** the `Organization` JSON-LD in `app/layout.tsx` used to
restate "$50M+ revenue generated" in its description. It now describes the
service without a figure, so structured data is no longer repeating a number
that is under review.

---

## After the figures are agreed

The durable fix is the same one used for the hostname in `lib/site.ts`: define
each public number once in a `lib/stats.ts` and import it everywhere, so the
values cannot drift again. That was deliberately not built yet, because
consolidating today would mean choosing between 1000+ and 500+, and that choice
is Vedant's, not the code's.
