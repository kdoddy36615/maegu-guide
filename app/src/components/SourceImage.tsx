import { useEffect, useState } from "react";

// Resolves "sources/..." image paths from the data files to bundled asset URLs.
const images = import.meta.glob("../../../sources/**/*.png", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function resolve(dataPath: string): string | undefined {
  return images[`../../../${dataPath}`];
}

/**
 * Framed source-image thumbnail (~360px, mono caption) that opens a
 * click-to-zoom lightbox. Esc or click anywhere closes it.
 */
export default function SourceImage({ path, alt }: { path: string; alt: string }) {
  const url = resolve(path);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!url) return <p className="note">Missing image: {path}</p>;
  return (
    <>
      <figure className="thumb">
        <button type="button" onClick={() => setOpen(true)} title="Click to zoom">
          <img src={url} alt={alt} loading="lazy" />
        </button>
        <figcaption>{alt} — click to zoom</figcaption>
      </figure>
      {open && (
        <div className="lightbox" onClick={() => setOpen(false)} role="dialog" aria-label={alt}>
          <img src={url} alt={alt} />
        </div>
      )}
    </>
  );
}
