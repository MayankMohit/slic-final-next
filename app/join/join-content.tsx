"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Globe, Rocket, Users } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { GlowCard } from "@/components/ui/glow-card";
import {
  JOIN_ROLES,
  JOIN_EXPERIENCE_LEVELS,
  joinApplicationSchema,
  type JoinApplication,
} from "@/lib/join-schema";

const perks = [
  {
    icon: Rocket,
    title: "Performance-First Work",
    description: "Your creative runs on real campaigns with real budgets — you see the numbers it drives.",
  },
  {
    icon: Users,
    title: "Small, Sharp Team",
    description: "No layers of approvals. Your ideas go from pitch to production fast.",
  },
  {
    icon: Globe,
    title: "Remote Friendly",
    description: "Work from wherever you do your best work. Output matters, not hours online.",
  },
];

const inputClasses =
  "w-full rounded-lg border border-transparent bg-black/30 px-4 py-3 text-sm md:text-[0.85vw] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

const labelClasses =
  "block mb-2 text-xs md:text-[0.75vw] font-semibold text-muted-foreground uppercase tracking-wide";

export function JoinPageContent() {
  const {
    register,
    handleSubmit,
    reset,
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

      <section className="section-padding pt-28 md:pt-[18vh]">
        <div className="container-tight">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-[4vh]"
          >
            <span className="tag">Careers</span>
            <h1 className="heading">
              Join <span className="text-gradient">SLIC</span>
            </h1>
            <p className="desc">
              We're always looking for editors, strategists, and creatives who
              care about performance as much as craft. Tell us about yourself
              and we'll be in touch.
            </p>
          </motion.div>

          {/* Perks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid sm:grid-cols-3 gap-4 md:gap-[1.5vw] mb-[5vh] max-w-4xl mx-auto"
          >
            {perks.map((perk) => (
              <div key={perk.title} className="text-center px-2">
                <div className="inline-flex p-3 md:p-[0.8vw] rounded-xl bg-primary/10 mb-3">
                  <perk.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-sans text-sm md:text-[0.9vw] font-bold text-foreground mb-1">
                  {perk.title}
                </h3>
                <p className="text-xs md:text-[0.75vw] text-muted-foreground font-semibold leading-relaxed">
                  {perk.description}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <GlowCard className="p-6 md:p-[2.5vw]">
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

                <div className="grid sm:grid-cols-2 gap-5 md:gap-[1.5vw]">
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
                      <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
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
                      <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="join-phone" className={labelClasses}>
                      Phone <span className="normal-case">(optional)</span>
                    </label>
                    <input
                      id="join-phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      autoComplete="tel"
                      className={inputClasses}
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="join-role" className={labelClasses}>
                      Role *
                    </label>
                    <select
                      id="join-role"
                      defaultValue=""
                      className={`${inputClasses} appearance-none cursor-pointer [&>option]:bg-neutral-900`}
                      {...register("role")}
                    >
                      <option value="" disabled>
                        Select a role
                      </option>
                      {JOIN_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    {errors.role && (
                      <p className="mt-1 text-xs text-red-400">{errors.role.message}</p>
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
                      <p className="mt-1 text-xs text-red-400">
                        {errors.experience.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="join-portfolio" className={labelClasses}>
                      Portfolio / Work Link{" "}
                      <span className="normal-case">(optional)</span>
                    </label>
                    <input
                      id="join-portfolio"
                      type="url"
                      placeholder="https://your-portfolio.com"
                      className={inputClasses}
                      {...register("portfolio")}
                    />
                    {errors.portfolio && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.portfolio.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="join-message" className={labelClasses}>
                      Why do you want to join SLIC? *
                    </label>
                    <textarea
                      id="join-message"
                      rows={5}
                      placeholder="Tell us about yourself, what you've worked on, and why performance creative excites you..."
                      className={`${inputClasses} resize-y min-h-[120px]`}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 md:mt-[2vw] w-full rounded-lg bg-gradient-primary px-6 py-3.5 text-sm md:text-[0.85vw] font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Application"}
                </button>
              </form>
            </GlowCard>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
