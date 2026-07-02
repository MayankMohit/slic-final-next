import "server-only";
import { defineLive } from "next-sanity/live";
import { client } from "./sanity";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: false,
  browserToken: false,
});
