/**
 * Every public number the site claims, in one place.
 *
 * These were hardcoded per component, which is exactly how they drifted: the
 * homepage said 1000+ ads while /about said 500+, the homepage credited
 * NeuroBrocc with 3.5x ROAS while the case study said 3x, and the ROAS headline
 * read "3.2x average" against four case studies averaging 2.6x. None of those
 * were typos. They were four files nobody had read side by side.
 *
 * Importing from here makes that class of contradiction impossible rather than
 * merely unlikely: a figure can still be wrong, but it can no longer be wrong
 * in one place and right in another.
 *
 * Values confirmed by Vedant, August 2026. The reasoning behind each is in
 * docs/public-numbers.md.
 *
 * ---------------------------------------------------------------------------
 * Two things to know before changing anything here.
 *
 * Peak, not average. peakRoas is deliberately labelled "Peak ROAS" wherever it
 * appears. The case studies run 2x to 3x and average 2.6x, so an "average" of
 * 3x would be contradicted by the page directly below it - and a media buyer
 * reading these figures for a living is precisely the audience that checks.
 *
 * Prose is not covered. Sentences like "$40M+ in revenue generated over 2
 * years" and the case study titles still hold their numbers inline, because
 * templating a headline reads worse than it protects. When a value here
 * changes, grep the old string before assuming this file was the only copy.
 * ---------------------------------------------------------------------------
 */

/** Agency-wide figures. Used on the homepage stat band and /about. */
export const METRICS = {
  revenueGenerated: "$50M+",
  /**
   * Corroborated by the site's own stated volume rather than taken on trust:
   * the FAQ promises 12 to 20 variants a month per client, and Loop Labs alone
   * ran two years, which is roughly 480 at the top of that range before
   * counting NeuroBrocc, LOKT, UNSCRPTD and Blackbox.
   */
  adsDelivered: "1000+",
  peakRoas: "3x",
  cpaReduction: "32%",
  avgHoldRate: "47%",
} as const;

/**
 * Per-client figures, as shown on /case-studies.
 *
 * That page is the source of truth for these and was already correct;
 * everything else was changed to agree with it.
 *
 * Loop Labs carries both a `roas` and a `lift` because they measure different
 * things: 2.5x is the return on ad spend, 3x is the improvement over the
 * creative they were running before. The homepage used to show the 3x under a
 * label that implied ROAS, which is the only reason it looked like the two
 * pages disagreed.
 */
export const CLIENTS = {
  loopLabs: { revenue: "$40M+", roas: "2.5x", lift: "3x" },
  neuroBrocc: { revenue: "$10M+", roas: "3x" },
  lokt: { roas: "3x", cpa: "$12 to $15" },
  unscrptd: { roas: "2x" },
} as const;
