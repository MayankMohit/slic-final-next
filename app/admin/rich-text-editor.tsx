"use client";

import { useCallback, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import type { TipTapDoc } from "@/lib/post-types";
import { UPLOAD_ACCEPT_ATTR, uploadImage } from "./upload";

/**
 * The article body editor.
 *
 * StarterKit v3 already bundles Link and Underline, so the only extension added
 * here is Image — and it is extended to carry width and height, because those
 * are what lib/tiptap-render.tsx feeds to next/image to reserve layout space.
 * A Blob URL says nothing about the file behind it, so the dimensions have to
 * ride along in the document.
 */
const SizedImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: null },
      height: { default: null },
    };
  },
});

/**
 * Rebuilds the document as ordinary JSON before it leaves the client.
 *
 * ProseMirror creates every node's `attrs` with Object.create(null). React's
 * Flight serializer does not treat a null-prototype object as a plain one --
 * isSimpleObject() calls isObjectPrototype(getPrototypeOf(obj)), which bails on
 * `null` -- so those attrs do not cross into a server action intact, and the
 * zod schema on the far side sees a function where an object should be. Nodes
 * with no attrs are unaffected, which is why only headings, lists, code blocks,
 * images and link marks ever failed.
 *
 * A JSON round-trip gives every object Object.prototype again and drops
 * anything unserializable. It also makes what gets validated byte-identical to
 * what gets stored, since the document ends up as JSON in Mongo regardless.
 */
function toPlainJson(doc: unknown): TipTapDoc {
  return JSON.parse(JSON.stringify(doc)) as TipTapDoc;
}

function ToolbarButton({
  icon: Icon,
  label,
  active,
  onClick,
  disabled,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      // onMouseDown rather than onClick: clicking a toolbar button would
      // otherwise blur the editor first, collapsing the selection the command
      // is meant to act on.
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
      className={`grid h-8 w-8 place-items-center rounded-md border transition-colors disabled:opacity-30 ${
        active
          ? "border-primary/60 bg-primary/15 text-primary"
          : "border-white/10 bg-white/3 text-foreground/70 hover:border-white/25 hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Toolbar({
  editor,
  onInsertImage,
  uploading,
}: {
  editor: Editor;
  onInsertImage: () => void;
  uploading: boolean;
}) {
  const setLink = useCallback(() => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Link URL", previous ?? "https://");

    // Cancel leaves the document untouched; an empty string clears the link.
    if (href === null) return;
    if (href === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-black/20 px-3 py-2">
      <ToolbarButton
        icon={Bold}
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon={Italic}
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        icon={Strikethrough}
        label="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <ToolbarButton
        icon={Code}
        label="Inline code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />

      <span className="mx-1 h-5 w-px bg-white/10" />

      <ToolbarButton
        icon={Heading2}
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        icon={Heading3}
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />
      <ToolbarButton
        icon={List}
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        icon={ListOrdered}
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        icon={Quote}
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <ToolbarButton
        icon={Minus}
        label="Divider"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />

      <span className="mx-1 h-5 w-px bg-white/10" />

      <ToolbarButton
        icon={Link2}
        label="Link"
        active={editor.isActive("link")}
        onClick={setLink}
      />
      <ToolbarButton
        icon={ImagePlus}
        label={uploading ? "Uploading..." : "Insert image"}
        disabled={uploading}
        onClick={onInsertImage}
      />

      <span className="mx-1 h-5 w-px bg-white/10" />

      <ToolbarButton
        icon={Undo2}
        label="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      />
      <ToolbarButton
        icon={Redo2}
        label="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      />
    </div>
  );
}

/**
 * Styles for the contenteditable itself.
 *
 * Written as arbitrary variants rather than a block in globals.css so the
 * editor's appearance stays with the editor. They intentionally echo the
 * classes in lib/tiptap-render.tsx, so what the author sees while writing is
 * close to what the published article renders.
 */
const editorSurface = [
  "[&_.ProseMirror]:min-h-[26rem] [&_.ProseMirror]:outline-none [&_.ProseMirror]:px-4 [&_.ProseMirror]:py-4",
  "[&_.ProseMirror]:text-base [&_.ProseMirror]:leading-8 [&_.ProseMirror]:text-foreground/85",
  "[&_.ProseMirror_p]:mb-4",
  "[&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:text-foreground [&_.ProseMirror_h2]:mt-8 [&_.ProseMirror_h2]:mb-3",
  "[&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:text-foreground [&_.ProseMirror_h3]:mt-6 [&_.ProseMirror_h3]:mb-2",
  "[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:mb-4",
  "[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:mb-4",
  "[&_.ProseMirror_li]:mb-1",
  "[&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-primary [&_.ProseMirror_blockquote]:pl-5 [&_.ProseMirror_blockquote]:italic",
  "[&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:underline-offset-4",
  "[&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-white/10 [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-[0.9em]",
  "[&_.ProseMirror_pre]:rounded-xl [&_.ProseMirror_pre]:bg-black/40 [&_.ProseMirror_pre]:border [&_.ProseMirror_pre]:border-white/10 [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:my-4 [&_.ProseMirror_pre]:overflow-x-auto",
  "[&_.ProseMirror_hr]:my-8 [&_.ProseMirror_hr]:border-white/15",
  "[&_.ProseMirror_img]:rounded-xl [&_.ProseMirror_img]:my-5 [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:h-auto [&_.ProseMirror_img]:ring-1 [&_.ProseMirror_img]:ring-white/10",
  // ProseMirror marks the selected image node; without this it is invisible.
  "[&_.ProseMirror_img.ProseMirror-selectednode]:ring-2 [&_.ProseMirror_img.ProseMirror-selectednode]:ring-primary",
].join(" ");

export function RichTextEditor({
  value,
  onChange,
  onError,
}: {
  value: TipTapDoc;
  onChange: (doc: TipTapDoc) => void;
  onError: (message: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    // Required under the App Router: rendering on the server and again on the
    // client produces a hydration mismatch otherwise.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false,
          autolink: true,
          // Whatever gets through here is re-checked in lib/tiptap-render.tsx,
          // which drops any href that is not http, https or mailto.
          protocols: ["http", "https", "mailto"],
        },
      }),
      SizedImage,
    ],
    content: value,
    onUpdate: ({ editor: instance }) => {
      onChange(toPlainJson(instance.getJSON()));
    },
    editorProps: {
      attributes: { class: "ProseMirror" },
    },
  });

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset immediately so picking the same file twice still fires a change.
    event.target.value = "";
    if (!file || !editor) return;

    setUploading(true);
    try {
      const image = await uploadImage(file);
      editor
        .chain()
        .focus()
        .insertContent({
          type: "image",
          attrs: {
            src: image.url,
            alt: "",
            width: image.width,
            height: image.height,
          },
        })
        .run();
    } catch (error) {
      onError(error instanceof Error ? error.message : "Could not upload that image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
      {editor ? (
        <Toolbar
          editor={editor}
          uploading={uploading}
          onInsertImage={() => fileInputRef.current?.click()}
        />
      ) : (
        <div className="h-[41px] border-b border-white/10 bg-black/20" />
      )}

      <div className={editorSurface}>
        <EditorContent editor={editor} />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={UPLOAD_ACCEPT_ATTR}
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
