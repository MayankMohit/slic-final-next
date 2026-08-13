/**
 * Serialize an object for embedding in a <script type="application/ld+json"> tag.
 *
 * JSON.stringify does NOT escape `<`, so a CMS value containing the literal
 * text `</script>` closes the tag early and everything after it is parsed as
 * markup. We escape the three characters that can start a tag boundary, plus
 * the two Unicode line terminators that are legal in JSON but illegal in a
 * JavaScript string literal.
 *
 * The pattern is built with the RegExp constructor rather than a literal
 * because U+2028/U+2029 are line terminators in JS *source* — writing them
 * raw inside a regex literal is a syntax error.
 */
const UNSAFE = new RegExp("[<>&\\u2028\\u2029]", "g");

export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(
    UNSAFE,
    (char) => "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0"),
  );
}
