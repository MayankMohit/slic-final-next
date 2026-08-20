"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

/**
 * Author and category inputs that remember what has been used before.
 *
 * Both accept free text, so a new name is always one keystroke away; the
 * suggestion rows are a shortcut, not a constraint. Suggestions come from
 * getPostFacets(), which reads them off the existing posts.
 *
 * Deliberately chips rather than a native <datalist>: the dropdown a datalist
 * renders is drawn by the browser and cannot be styled, so it arrives as a
 * light-themed popup in the middle of a dark admin. Chips also select in one
 * click instead of two, which matters when a blog has three authors rather
 * than three hundred.
 */

// Mirrors the .max(6) on `categories` in lib/post-schema.ts. Exceeding it would
// otherwise fail server-side validation after the post is written.
export const MAX_CATEGORIES = 6;
const MAX_CATEGORY_LENGTH = 40;

const chipBase =
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors";

const suggestionChip = `${chipBase} border border-white/10 bg-white/2 text-foreground/60 hover:border-primary/50 hover:text-foreground`;

function SuggestionRow({
  label,
  items,
  onPick,
}: {
  label: string;
  items: string[];
  onPick: (value: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="mt-2">
      <p className="mb-1.5 text-[0.65rem] uppercase tracking-wide text-foreground/35">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onPick(item)}
            className={suggestionChip}
          >
            <Plus className="h-3 w-3" />
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AuthorField({
  value,
  onChange,
  suggestions,
  inputClassName,
  labelClassName,
}: {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  inputClassName: string;
  labelClassName: string;
}) {
  // The one currently typed is not worth offering back.
  const others = suggestions.filter(
    (name) => name.toLowerCase() !== value.trim().toLowerCase(),
  );

  return (
    <div>
      <label htmlFor="author" className={labelClassName}>
        Author
      </label>
      <input
        id="author"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />
      <SuggestionRow label="Previously used" items={others} onPick={onChange} />
    </div>
  );
}

export function CategoryPicker({
  value,
  onChange,
  suggestions,
  inputClassName,
  labelClassName,
  hintClassName,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  suggestions: string[];
  inputClassName: string;
  labelClassName: string;
  hintClassName: string;
}) {
  const [draft, setDraft] = useState("");

  const atLimit = value.length >= MAX_CATEGORIES;
  const has = (name: string) =>
    value.some((entry) => entry.toLowerCase() === name.toLowerCase());

  const add = (raw: string) => {
    const name = raw.trim().slice(0, MAX_CATEGORY_LENGTH);
    setDraft("");
    if (!name || atLimit || has(name)) return;

    /**
     * Snap to the casing already in use.
     *
     * Categories are matched case-insensitively everywhere else, so letting
     * "meta ads" and "Meta Ads" both persist would split one category into two
     * on the public blog while looking identical in this list.
     */
    const canonical =
      suggestions.find((entry) => entry.toLowerCase() === name.toLowerCase()) ?? name;

    onChange([...value, canonical]);
  };

  const remove = (name: string) => onChange(value.filter((entry) => entry !== name));

  const unused = suggestions.filter((name) => !has(name));

  return (
    <div>
      <label htmlFor="category-input" className={labelClassName}>
        Categories
      </label>

      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {value.map((category) => (
            <span
              key={category}
              className={`${chipBase} border border-primary/40 bg-primary/15 text-primary`}
            >
              {category}
              <button
                type="button"
                onClick={() => remove(category)}
                aria-label={`Remove ${category}`}
                className="-mr-0.5 grid h-4 w-4 place-items-center rounded-full hover:bg-primary/25"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        id="category-input"
        value={draft}
        disabled={atLimit}
        maxLength={MAX_CATEGORY_LENGTH}
        onChange={(event) => {
          // Typing or pasting a comma commits the entry, so a habit of writing
          // "a, b, c" still works even though this is no longer a text field.
          if (event.target.value.includes(",")) add(event.target.value.replace(/,/g, ""));
          else setDraft(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            // Without this the Enter would submit the whole post form.
            event.preventDefault();
            add(draft);
          } else if (event.key === "Backspace" && !draft && value.length > 0) {
            remove(value[value.length - 1]!);
          }
        }}
        onBlur={() => add(draft)}
        placeholder={atLimit ? `Limit of ${MAX_CATEGORIES} reached` : "Type and press Enter"}
        className={`${inputClassName} disabled:cursor-not-allowed disabled:opacity-50`}
      />

      <p className={hintClassName}>
        {value.length}/{MAX_CATEGORIES} used. Enter or a comma adds one;
        Backspace on an empty field removes the last.
      </p>

      {!atLimit && (
        <SuggestionRow label="Previously used" items={unused} onPick={add} />
      )}
    </div>
  );
}
