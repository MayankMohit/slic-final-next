"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  BarChart3,
  FileText,
  Film,
  Globe,
  Search,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { GlowCard } from "@/components/ui/glow-card";
import {
  JOIN_ROLES,
  JOIN_EXPERIENCE_LEVELS,
  JOIN_AVAILABILITY,
  joinApplicationSchema,
  type JoinApplication,
} from "@/lib/join-schema";

const heroFacts = ["Remote", "Full-time, part-time & project", "Rolling applications"];

const perks = [
  {
    icon: TrendingUp,
    title: "Performance-First Work",
    description:
      "Everything you make ships to a live campaign. You get the hold rate, the CPA, and the thumbstop data back on your own work.",
  },
  {
    icon: Zap,
    title: "No Approval Layers",
    description:
      "You pitch straight to the founders. Concepts go from idea to test-ready in 48 to 72 hours, not four review cycles.",
  },
  {
    icon: Globe,
    title: "Remote, Output-First",
    description:
      "Work from anywhere, on your own schedule. We measure what ships, not hours online.",
  },
];

/**
 * The Open Roles cards.
 *
 * `title` is typed as a member of JOIN_ROLES rather than a plain string, so a
 * card whose title drifts out of step with the schema enum is a compile error
 * instead of a role picker that silently fails validation. The order here is
 * the order of JOIN_ROLES, which is also the order the 01-04 numbers imply.
 */
const roles: {
  step: string;
  icon: LucideIcon;
  title: (typeof JOIN_ROLES)[number];
  description: string;
}[] = [
  {
    step: "01",
    icon: Search,
    title: "Creative Researcher",
    description:
      "You audit competitor ad libraries, mine customer reviews, and break down what's winning in the category. Your strategy brief is what every script and edit is built from.",
  },
  {
    step: "02",
    icon: FileText,
    title: "Scriptwriter",
    description:
      "You write hooks engineered for the first 3 seconds, narratives that hold attention past 15, and CTAs that drive action. Every script starts from research, never a template.",
  },
  {
    step: "03",
    icon: Film,
    title: "Video Editor",
    description:
      "You cut platform-native ads for Meta, TikTok, and YouTube — pacing, captions, overlays, and format variations per algorithm. You ship variants in batches, not one hero film.",
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Creative Strategist",
    description:
      "You turn research into a testing roadmap: which angles run, which hooks pair with them, what gets killed after week one. You own the batch plan and the iteration calls.",
  },
];

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm md:text-[0.85vw] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

const labelClasses =
  "block mb-2 text-xs md:text-[0.75vw] font-normal text-foreground/80 uppercase tracking-wide";

// Sits under a field to explain it. Deliberately dimmer and smaller than the
// label so it reads as an aside rather than a second instruction.
const hintClasses =
  "mt-2 text-xs md:text-[0.7vw] text-foreground/50 leading-relaxed font-normal";

const errorClasses = "mt-2 text-xs md:text-[0.7vw] text-red-400";

export function JoinPageContent() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<JoinApplication>({
    resolver: zodResolver(joinApplicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      portfolio: "",
      message: "",
      company: "",
    },
  });

  // Read back so both the Open Roles cards and the pills in the form can show
  // which role is picked — they write to the same field, so choosing in one
  // place updates the other.
  const selectedRole = watch("role");

  const pickRole = (role: (typeof JOIN_ROLES)[number]) =>
    setValue("role", role, { shouldValidate: true });

  const onSubmit = async (values: JoinApplication) => {
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      toast.success("Application sent! We'll get back to you soon.");
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not send your application. Please try again.",
      );
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="section-padding pt-28 md:pt-[18vh]">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:max-w-[55vw] mx-auto"
          >
            <span className="tag">Careers</span>
            <h1 className="heading">
              Creative Work That{" "}
              <span className="text-gradient">Gets Measured</span>
            </h1>
            <p className="desc">
              We research, script, and edit performance video ads for DTC brands
              scaling on Meta, TikTok, and YouTube. Built for editors, writers,
              and strategists who want their work judged on hold rate and CPA,
              not on how it looks in a portfolio.
            </p>

            <div className="mt-[3vh] flex flex-wrap items-center justify-center gap-2 md:gap-[0.6vw]">
              {heroFacts.map((fact) => (
                <span
                  key={fact}
                  className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 md:px-[1vw] md:py-[0.5vw] text-xs md:text-[0.75vw] text-foreground/80 font-normal"
                >
                  {fact}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Why SLIC                                                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center md:max-w-[45vw] mx-auto mb-[5vh]"
          >
            <span className="tag">Why SLIC</span>
            <h2 className="heading">
              Real spend. Real data. <br />
              Real feedback.
            </h2>
            <p className="desc">
              We don't do spec work. We don't hand out briefs and disappear.
              Every ad you touch runs on live budget, and the numbers come back
              to you.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8 md:gap-[3vw] md:max-w-[70vw] mx-auto">
            {perks.map((perk, index) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex p-3 md:p-[0.8vw] rounded-xl bg-primary/10 mb-4 md:mb-[1vh]">
                  <perk.icon className="w-5 h-5 md:w-[1.2vw] md:h-[1.2vw] text-primary" />
                </div>
                <h3 className="font-sans text-sm md:text-[0.9vw] font-bold text-foreground mb-2 md:mb-[0.6vh]">
                  {perk.title}
                </h3>
                <p className="desc">{perk.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Open roles                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="section-padding">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center md:max-w-[45vw] mx-auto mb-[5vh]"
          >
            <span className="tag">Open Roles</span>
            <h2 className="heading">
              Four roles. <br />
              One standard.
            </h2>
            <p className="desc">
              Each role owns one step of how we build every ad. Research feeds
              the script, the script feeds the edit, the edit feeds the test —
              and the test feeds the next round of research.
            </p>
          </motion.div>

          {/* Same grid recipe as the How We Work cards: items stretch to fill
              their tracks so every card is exactly (wrapper - gaps) / columns
              wide, and h-full lets the description grow into the slack rather
              than leaving it under the text. */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-[2vw] md:max-w-[70vw] mx-auto">
            {roles.map((role) => {
              const isSelected = selectedRole === role.title;

              return (
                <motion.div
                  key={role.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="h-full w-full"
                >
                  {/* A real button, not a div with onClick, so the card is
                      reachable by keyboard and announced as pressable. The
                      pressed state is what the "the form remembers your
                      choice" line below refers to — it writes straight into
                      the form's role field. */}
                  <button
                    type="button"
                    onClick={() => pickRole(role.title)}
                    aria-pressed={isSelected}
                    className="h-full w-full text-left rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <GlowCard
                      className={`h-full p-6 md:p-[1vw] relative group transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10 ${
                        isSelected ? "ring-2 ring-primary shadow-lg shadow-primary/20" : ""
                      }`}
                    >
                      <span
                        className={`absolute top-6 right-6 md:top-[0.85vw] md:right-[0.85vw] text-5xl md:text-[2.5vw] font-bold transition-colors ${
                          isSelected
                            ? "text-primary"
                            : "text-primary/50 group-hover:text-primary/20"
                        }`}
                      >
                        {role.step}
                      </span>

                      <div className="flex flex-col h-full gap-3 md:gap-0">
                        <div className="w-12 h-12 md:w-[2.5vw] md:h-[2.5vw] rounded-xl bg-primary/10 flex items-center justify-center mb-4 md:mb-[0.85vw] group-hover:bg-primary/20 transition-colors">
                          <role.icon className="w-5 h-5 md:w-[1.5vw] md:h-[1.5vw] text-primary" />
                        </div>

                        <h3 className="text-sm md:text-[0.8vw] font-bold mb-3 md:mb-[0.6vw] pr-8 md:pr-[1.7vw]">
                          {role.title}
                        </h3>

                        <p className="text-foreground/80 text-xs md:text-[0.8vw] grow leading-relaxed font-normal">
                          {role.description}
                        </p>
                      </div>
                    </GlowCard>
                  </button>
                </motion.div>
              );
            })}
          </div>

          <p className="mt-[4vh] text-center text-xs md:text-[0.8vw] text-foreground/80 font-normal">
            Pick the closest fit —{" "}
            <span className="font-bold text-foreground">
              the form remembers your choice.
            </span>
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Apply                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section id="apply" className="section-padding scroll-mt-24">
        <div className="container-tight">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center md:max-w-[45vw] mx-auto mb-[5vh]"
          >
            <span className="tag">Apply</span>
            <h2 className="heading">
              One form. <br />
              Five minutes.
            </h2>
            <p className="desc">
              Portfolio first, everything else second. We reply within 5 working
              days — including if it's a no.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <GlowCard className="p-6 md:p-[2vw]">
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Honeypot — hidden from real users, bots fill it */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] top-auto h-px w-px opacity-0"
                  {...register("company")}
                />

                <div className="flex flex-col gap-5 md:gap-[1.5vw]">
                  <div>
                    <label htmlFor="join-name" className={labelClasses}>
                      Full Name *
                    </label>
                    <input
                      id="join-name"
                      type="text"
                      placeholder="Your name"
                      autoComplete="name"
                      className={inputClasses}
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className={errorClasses}>{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="join-email" className={labelClasses}>
                      Email *
                    </label>
                    <input
                      id="join-email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      className={inputClasses}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className={errorClasses}>{errors.email.message}</p>
                    )}
                  </div>

                  {/* Role is a set of pills rather than a <select> so the four
                      options are all visible at once and match the cards
                      above. The value lives in RHF state via setValue, so the
                      hidden registered input is what actually submits it. */}
                  <div>
                    <span className={labelClasses}>Role *</span>
                    <input type="hidden" {...register("role")} />
                    <div
                      role="group"
                      aria-label="Role"
                      className="flex flex-wrap gap-2 md:gap-[0.6vw]"
                    >
                      {roles.map((role) => {
                        const isSelected = selectedRole === role.title;

                        return (
                          <button
                            key={role.title}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => pickRole(role.title)}
                            className={`rounded-full border px-4 py-2 md:px-[1vw] md:py-[0.5vw] text-xs md:text-[0.75vw] font-normal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                              isSelected
                                ? "border-transparent bg-gradient-primary text-primary-foreground font-bold"
                                : "border-white/10 bg-black/30 text-foreground/80 hover:border-primary/50 hover:text-foreground"
                            }`}
                          >
                            {role.title}
                          </button>
                        );
                      })}
                    </div>
                    {errors.role && (
                      <p className={errorClasses}>{errors.role.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="join-experience" className={labelClasses}>
                      Experience *
                    </label>
                    <select
                      id="join-experience"
                      defaultValue=""
                      className={`${inputClasses} appearance-none cursor-pointer [&>option]:bg-neutral-900`}
                      {...register("experience")}
                    >
                      <option value="" disabled>
                        Select experience
                      </option>
                      {JOIN_EXPERIENCE_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                    {errors.experience && (
                      <p className={errorClasses}>{errors.experience.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="join-availability" className={labelClasses}>
                      Availability *
                    </label>
                    <select
                      id="join-availability"
                      defaultValue=""
                      className={`${inputClasses} appearance-none cursor-pointer [&>option]:bg-neutral-900`}
                      {...register("availability")}
                    >
                      <option value="" disabled>
                        Select availability
                      </option>
                      {JOIN_AVAILABILITY.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.availability && (
                      <p className={errorClasses}>
                        {errors.availability.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="join-portfolio" className={labelClasses}>
                      Portfolio or Reel *
                    </label>
                    <input
                      id="join-portfolio"
                      type="url"
                      placeholder="https://"
                      className={inputClasses}
                      {...register("portfolio")}
                    />
                    {errors.portfolio ? (
                      <p className={errorClasses}>{errors.portfolio.message}</p>
                    ) : (
                      <p className={hintClasses}>
                        Drive, Vimeo, Behance or a personal site. Make sure it's
                        publicly viewable — we won't chase access requests.
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="join-message" className={labelClasses}>
                      Pick an ad you'd have made better *
                    </label>
                    <textarea
                      id="join-message"
                      rows={5}
                      placeholder="Link the ad, then tell us what you'd change and why..."
                      className={`${inputClasses} resize-y min-h-[120px]`}
                      {...register("message")}
                    />
                    {errors.message ? (
                      <p className={errorClasses}>{errors.message.message}</p>
                    ) : (
                      <p className={hintClasses}>
                        Any brand's ad, including ours. Three or four lines is
                        enough. We're reading how you think, not how you write.
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="join-phone" className={labelClasses}>
                      Phone <span className="normal-case">(optional)</span>
                    </label>
                    <input
                      id="join-phone"
                      type="tel"
                      placeholder="+91"
                      autoComplete="tel"
                      className={inputClasses}
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className={errorClasses}>{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 md:mt-[1.5vw] w-full rounded-lg bg-gradient-primary px-6 py-3.5 text-sm md:text-[0.85vw] font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Application"}
                </button>

                <p className="mt-4 md:mt-[1vh] text-center text-xs md:text-[0.7vw] text-foreground/50 font-normal leading-relaxed">
                  Shortlisted applicants get a short paid test brief. We don't
                  ask for free work.
                </p>
              </form>
            </GlowCard>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
