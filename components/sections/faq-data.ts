/**
 * The homepage FAQ, in one place.
 *
 * Copy is final and comes from slic-faq-final-v3.md. Ten questions, laid out
 * two columns on desktop: 1 to 5 on the left, 6 to 10 on the right. On mobile
 * they stack in this order, 1 through 10, which is the order they are written
 * in here, so the array order is the reading order, not a layout detail.
 *
 * Answers are arrays because every one of them is two paragraphs. Joining them
 * into a single string would collapse the structure the copy was written with.
 *
 * `**bold**` inside a paragraph is honoured by the renderer (see boldParts in
 * faq-section.tsx). It is deliberately the only markup supported: the copy
 * needs emphasis in one place and nothing more, and anything richer would want
 * a real parser rather than a five-line split.
 */
export interface Faq {
  question: string;
  /** One string per paragraph. */
  answer: string[];
}

export const faqs: Faq[] = [
  {
    question: "What type of clients does SLIC work with?",
    answer: [
      "DTC and ecommerce brands spending $30,000+ per month on paid media, running video ads on Meta, TikTok and YouTube.",
      "If you have product-market fit and a converting funnel but creative is your bottleneck, we're a good fit. If you're still finding product-market fit, creative isn't your real problem yet, and we'll tell you that on the call.",
    ],
  },
  {
    question: "Do you shoot footage or work with UGC creators?",
    answer: [
      "No to both, and that's deliberate. We work from footage that already exists: your product shots, your past ads, and creator content you've already licensed. Where there's a gap we bring in licensed footage, plus animation and motion graphics we build in-house.",
      "That's why we can turn a new variant around in 48 to 72 hours. A shop that films has to book a crew, a location and talent before it can test a single idea. We don't.",
    ],
  },
  {
    question: "What do we actually get each month?",
    answer: [
      "4 to 6 distinct creative concepts, built out into 12 to 20 platform-ready variants: different hooks, lengths, aspect ratios and CTAs, cut for each platform.",
      "Every batch ships with the research brief behind it and a testing plan, so your media buyer knows what each variant is testing. Two rounds of revisions are included on every ad.",
    ],
  },
  {
    question: "How long until we get the first batch?",
    answer: [
      "About three weeks. Week one is research and strategy, week two scripting, week three editing and motion work.",
      "That front-loaded work is what makes everything after it fast. Once the research exists, new variants ship in 48 to 72 hours. The first batch is the slowest one you'll ever get from us.",
    ],
  },
  {
    question: "Do you handle creative strategy, or just execution?",
    answer: [
      "Both, and strategy comes first. We audit your competitors' ads, mine your customer reviews, and break down what's already winning in your category. That becomes a brief showing which hooks, angles and formats work, and where the gaps are.",
      "You don't need a script or a concept to start. Most clients arrive with a product and a problem. We handle the rest.",
    ],
  },
  {
    question:
      "What happens if the first batch doesn't beat our current creative?",
    answer: [
      "We iterate, fast. Every batch tests several distinct angles rather than betting on one idea, so even a batch without a winner tells us which direction is dead and which is worth pushing. That feedback goes straight into the next round, in 48 to 72 hours rather than another three weeks.",
      "What we won't do is keep billing you to find out. If we're several rounds in and nothing is moving, we'll say so.",
    ],
  },
  {
    question: "What's the minimum commitment?",
    answer: [
      "There isn't one. We work month to month and you can cancel any time. Once you've paid, the finished videos are yours, and we'll hand over the project files too if you ask for them.",
      "We'd rather earn the next month than lock you into six. Most agencies use long contracts to protect themselves against creative that doesn't perform. We'd rather just make creative that performs.",
    ],
  },
  {
    question: "How much does it cost to work with SLIC?",
    answer: [
      "Pricing depends on volume, platforms and turnaround, so we scope it on the call rather than quote a number that won't fit you.",
      "What we can say upfront: no minimum commitment, and you can cancel any time. The number that actually matters is whether the first month pays for itself.",
    ],
  },
  {
    question: "What do you need from us, and how do you keep it on-brand?",
    answer: [
      "Your product, your brand guidelines and tone, and whatever creative material you already have: product footage, past ads, photography, anything that performed before. **We don't need access to your Ads Manager.** Send us the numbers and we'll work from those.",
      "You review and approve everything before delivery. Nothing ships without your sign-off.",
    ],
  },
  {
    question: "Why should we choose SLIC over other creative agencies?",
    answer: [
      "Most agencies start with production. We start with research. We know what's working in your category before we build anything, and every ad is scripted from that, not from a template.",
      "And because we don't run shoot days, we can test an idea in 48 to 72 hours instead of four to eight weeks. No contract holding you in place. If the work doesn't perform, you leave.",
    ],
  },
];
