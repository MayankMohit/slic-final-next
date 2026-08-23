"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import {
  assertAdmin,
  changeAdminPassword,
  clearLoginAttempts,
  endSession,
  registerLoginAttempt,
  requestIp,
  startSession,
  verifyPassword,
} from "@/lib/auth";
import { postFormSchema } from "@/lib/post-schema";
import { deriveExcerpt, postsCollection, slugify, type PostDoc } from "@/lib/posts";

/* -------------------------------------------------------------------------- */
/* Auth                                                                       */
/* -------------------------------------------------------------------------- */

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  let allowed: boolean;
  let retryAfterMinutes = 15;
  try {
    const throttle = await registerLoginAttempt(await requestIp());
    allowed = throttle.ok;
    retryAfterMinutes = throttle.retryAfterMinutes;
  } catch {
    // The throttle counter lives in Mongo, so an unreachable database means we
    // cannot count attempts. Fail closed: without a database the admin has
    // nothing to edit anyway, and an uncounted login endpoint is worse.
    return { error: "Cannot reach the database. Check MONGODB_URI." };
  }

  if (!allowed) {
    return {
      error: `Too many attempts. Try again in ${retryAfterMinutes} minutes.`,
    };
  }

  if (!(await verifyPassword(password))) {
    return { error: "Incorrect password." };
  }

  await clearLoginAttempts(await requestIp());
  await startSession();
  redirect("/admin");
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/login");
}

export interface PasswordState {
  error?: string;
  success?: boolean;
}

export async function changePasswordAction(
  _prev: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  await assertAdmin();

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next !== confirm) return { error: "The new passwords do not match." };

  const ip = await requestIp();
  try {
    // Throttled under its own scope: this form takes the current password, so
    // it is a credential check like the login form and guessable in the same
    // way. A separate scope means a blocked guesser here cannot also lock the
    // real admin out of /admin/login, and vice versa.
    const throttle = await registerLoginAttempt(ip, "password");
    if (!throttle.ok) {
      return { error: `Too many attempts. Try again in ${throttle.retryAfterMinutes} minutes.` };
    }
  } catch {
    return { error: "Cannot reach the database. Try again shortly." };
  }

  const result = await changeAdminPassword(current, next);
  if (!result.ok) return { error: result.error };

  await clearLoginAttempts(ip, "password");

  // The change just revoked every session issued before now, including this
  // one. Minting a fresh cookie keeps the person who made the change signed in
  // while everyone else is turned out.
  await startSession();

  return { success: true };
}

/* -------------------------------------------------------------------------- */
/* Posts                                                                      */
/* -------------------------------------------------------------------------- */

export type SaveResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; error: string };

/**
 * Rebuilds every cached page whose contents depend on this post.
 *
 * Pages are statically rendered now that the data is ours, so nothing updates
 * on its own the way Sanity's live subscription did. `oldSlug` matters when a
 * post is renamed: the previous URL still has a cached page that must be
 * dropped, or the old address keeps serving the article forever.
 */
function revalidatePost(slug: string, oldSlug?: string) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  if (oldSlug && oldSlug !== slug) revalidatePath(`/blog/${oldSlug}`);
  revalidatePath("/sitemap.xml");
}

export async function savePost(id: string | null, input: unknown): Promise<SaveResult> {
  await assertAdmin();

  const parsed = postFormSchema.safeParse(input);
  if (!parsed.success) {
    /**
     * Name the field that failed.
     *
     * Zod's default text for a type mismatch is bare ("Expected object,
     * received function") and says nothing about which of the ten fields it
     * came from, which makes a bad payload almost impossible to place from the
     * toast alone. The full issue list goes to the server log for the cases
     * where one line is not enough.
     */
    console.error("savePost validation failed:", JSON.stringify(parsed.error.issues, null, 2));

    const issue = parsed.error.issues[0];
    const field = issue?.path.join(".");
    return {
      ok: false,
      error: issue
        ? `${field || "post"}: ${issue.message}`
        : "Invalid post",
    };
  }
  const data = parsed.data;

  const slug = data.slug || slugify(data.title);
  if (!slug) {
    return { ok: false, error: "Could not build a slug from that title — set one manually." };
  }

  const collection = await postsCollection();
  const now = new Date();

  const existing = id && ObjectId.isValid(id)
    ? await collection.findOne({ _id: new ObjectId(id) })
    : null;

  if (id && !existing) return { ok: false, error: "That post no longer exists." };

  /**
   * A published post always carries a date, because the public query filters on
   * `publishedAt <= now`. A blank field means "publish now"; a filled one is
   * read as local time, matching what the datetime-local input showed. Moving a
   * post back to draft keeps the date so re-publishing does not reset it.
   */
  let publishedAt: Date | null = existing?.publishedAt ?? null;
  if (data.publishedAt) {
    const parsedDate = new Date(data.publishedAt);
    if (Number.isNaN(parsedDate.getTime())) {
      return { ok: false, error: "That publish date is not valid." };
    }
    publishedAt = parsedDate;
  } else if (data.status === "published" && !publishedAt) {
    publishedAt = now;
  }

  const fields: Omit<PostDoc, "_id" | "createdAt"> = {
    title: data.title,
    slug,
    excerpt: data.excerpt || deriveExcerpt(data.body),
    body: data.body,
    coverImage: data.coverImage,
    authorName: data.authorName,
    categories: data.categories,
    featured: data.featured,
    status: data.status,
    publishedAt,
    updatedAt: now,
  };

  try {
    if (existing) {
      await collection.updateOne({ _id: existing._id }, { $set: fields });
      revalidatePost(slug, existing.slug);
      return { ok: true, id: existing._id.toHexString(), slug };
    }

    const result = await collection.insertOne({
      _id: new ObjectId(),
      createdAt: now,
      ...fields,
    });
    revalidatePost(slug);
    return { ok: true, id: result.insertedId.toHexString(), slug };
  } catch (error) {
    // 11000 is the unique index on `slug`. Everything else is a real fault.
    if (typeof error === "object" && error && (error as { code?: number }).code === 11000) {
      return { ok: false, error: `The slug "${slug}" is already used by another post.` };
    }
    throw error;
  }
}

export async function deletePost(id: string) {
  await assertAdmin();
  if (!ObjectId.isValid(id)) return;

  const collection = await postsCollection();
  const removed = await collection.findOneAndDelete({ _id: new ObjectId(id) });
  if (removed) revalidatePost(removed.slug);

  redirect("/admin");
}
