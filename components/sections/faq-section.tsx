"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { faqs } from "./faq-data";

/**
 * Splits a paragraph on `**bold**` and wraps the marked runs in <strong>.
 *
 * String.split with a capturing group interleaves the captures into the
 * result, so every odd index is the text that was inside the markers.
 *
 * This exists because one line of the copy carries emphasis and the answers
 * are otherwise plain prose. It is not a markdown renderer and should not
 * grow into one: if the copy ever needs links or lists, the answers should
 * become structured data rather than strings with more syntax bolted on.
 */
function boldParts(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-foreground">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

/**
 * Two columns on desktop, one stack on mobile.
 *
 * The columns are two real elements rather than a grid, and that is the whole
 * trick: a grid would put question 1 and question 6 in the same row and tie
 * their heights together, so opening a long answer on the left would leave a
 * gap under the right-hand question. Independent columns each collapse and
 * grow on their own.
 *
 * It also gets the mobile order right for free. flex-col stacks the first
 * column then the second, and since they hold 1 to 5 and 6 to 10, that reads
 * 1 through 10 in order.
 */
const columns = [faqs.slice(0, 5), faqs.slice(5)];

export function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="faqs" className="section-padding relative overflow-hidden">
      <div className="container-tight relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center md:mb-16 mb-6"
        >
          <span className="tag">Got questions?</span>
          <h2 className="heading">Frequently Asked Questions</h2>
          <p className="desc">
            Everything you need to know before working with us.
          </p>
        </motion.div>

        {/* FAQ columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:max-w-[72vw] max-w-[90vw] mx-auto flex flex-col md:flex-row md:gap-[3vw] md:items-start"
        >
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex-1 md:min-w-0">
              {column.map((faq, indexInColumn) => {
                const index = columnIndex * 5 + indexInColumn;
                const isOpen = activeIndex === index;
                const panelId = `faq-answer-${index}`;
                const buttonId = `faq-question-${index}`;

                // The left column keeps its bottom rule on mobile, where
                // question 5 sits directly above question 6 and needs the
                // divider. On desktop it is the foot of the column, so it
                // goes. The right column's last item never has one.
                const isLastInColumn = indexInColumn === column.length - 1;
                const borderClass = !isLastInColumn
                  ? "border-b border-border"
                  : columnIndex === 0
                    ? "border-b border-border md:border-b-0"
                    : "";

                return (
                  <div key={faq.question} className={borderClass}>
                    {/* Question */}
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setActiveIndex(isOpen ? -1 : index)}
                      className="w-full flex items-center justify-between gap-3 md:px-[1vw] md:py-[0.2vw] p-1.5 text-left group"
                    >
                      <span className="font-sans text-sm md:text-[0.8vw] font-bold text-foreground group-hover:text-brand-alt transition-colors">
                        {faq.question}
                      </span>

                      <div className="md:p-[1vw] p-2 shrink-0 text-[0.8vw] font-normal rounded-full bg-secondary/50 text-foreground/80 group-hover:bg-primary/10 group-hover:text-brand-alt transition-colors">
                        {isOpen ? (
                          <Minus className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {/*
                      Every answer stays mounted, collapsed to height 0 rather
                      than removed from the tree. This is a hard requirement,
                      not a nicety: with an AnimatePresence that unmounted
                      closed answers, nine of the ten answers existed nowhere
                      in the document, so a crawler saw ten questions and one
                      answer. All the copy below is only reachable because it
                      is always rendered.

                      initial={false} skips the mount animation, so the first
                      answer is simply open on load instead of unfurling.
                    */}
                    <motion.div
                      id={panelId}
                      aria-hidden={!isOpen}
                      initial={false}
                      animate={{
                        height: isOpen ? "auto" : 0,
                        opacity: isOpen ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="md:px-5 md:pb-5 pb-2 px-2 space-y-3">
                        {faq.answer.map((paragraph, paragraphIndex) => (
                          <p
                            key={paragraphIndex}
                            className="text-foreground/80 leading-relaxed font-normal text-xs md:text-[0.8vw]"
                          >
                            {boldParts(paragraph)}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
