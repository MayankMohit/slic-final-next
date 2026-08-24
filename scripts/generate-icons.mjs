/**
 * Generates the whole favicon set from one square source image.
 *
 *   node scripts/generate-icons.mjs                      # public/icons/s-mark.png
 *   node scripts/generate-icons.mjs path/to/source.png
 *
 * Writes:
 *
 *   app/favicon.ico             16, 32 and 48px, in one multi-resolution file
 *   app/apple-icon.png          180px, the iOS home screen icon
 *   public/icons/icon-192.png   Android home screen, referenced by the manifest
 *   public/icons/icon-512.png   splash screens and install prompts
 *
 * The two files under app/ use Next's file conventions, so the <link> tags are
 * emitted automatically and fingerprinted for cache busting. Nothing needs to
 * be declared in metadata.icons - doing both is how you end up with duplicate
 * tags fighting over which one wins.
 *
 * Re-run it whenever the mark changes. Everything here is derived, so the
 * source image is the only thing worth keeping in sync.
 */
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const source = process.argv[2] || "public/icons/s-mark.png";

if (!existsSync(source)) {
  console.error(`\nSource image not found: ${source}\n`);
  console.error("Save the 512px version of the mark there, then re-run.\n");
  process.exit(1);
}

const meta = await sharp(source).metadata();

if (!meta.width || !meta.height) {
  console.error("Could not read the image dimensions.");
  process.exit(1);
}

if (meta.width !== meta.height) {
  console.error(
    `Source is ${meta.width}x${meta.height}. Favicons are square at every size, ` +
      "so a rectangular source would be cropped or letterboxed by whichever " +
      "browser renders it. Crop it square first.",
  );
  process.exit(1);
}

if (meta.width < 512) {
  console.error(
    `Source is ${meta.width}px. 512 is the largest size emitted, and upscaling ` +
      "a smaller original produces a soft install icon on Android. Use the " +
      "largest version you have.",
  );
  process.exit(1);
}

/** Square PNG buffer at the given edge length. */
function png(size) {
  return sharp(source)
    .resize(size, size, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Packs PNG buffers into an .ico container.
 *
 * sharp has no ICO encoder, and the format is simple enough not to warrant a
 * dependency: a 6-byte header, one 16-byte directory entry per image, then the
 * image data. Every entry here holds a whole PNG rather than a raw DIB, which
 * ICO has accepted since Vista and every browser in use understands.
 */
function ico(images) {
  const HEADER = 6;
  const ENTRY = 16;

  const header = Buffer.alloc(HEADER);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  let offset = HEADER + ENTRY * images.length;

  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(ENTRY);
    // 256 is stored as 0: the field is one byte and 256 does not fit.
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // palette size, 0 for truecolour
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

async function write(file, data) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, data);
  console.log(`  ${file.padEnd(28)} ${(data.length / 1024).toFixed(1)} KB`);
}

console.log(`\nSource: ${source} (${meta.width}x${meta.height})\n`);

const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(
  icoSizes.map(async (size) => ({ size, data: await png(size) })),
);

await write("app/favicon.ico", ico(icoImages));
await write("app/apple-icon.png", await png(180));
await write("public/icons/icon-192.png", await png(192));
await write("public/icons/icon-512.png", await png(512));

console.log("\nDone. app/manifest.ts already points at the two icons/ files.\n");
