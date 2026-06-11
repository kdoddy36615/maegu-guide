// Resolves "sources/..." image paths from the data files to bundled asset URLs.
const images = import.meta.glob("../../../sources/**/*.png", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function resolve(dataPath: string): string | undefined {
  const key = `../../../${dataPath}`;
  return images[key];
}

export default function SourceImage({ path, alt }: { path: string; alt: string }) {
  const url = resolve(path);
  if (!url) return <p className="dim small">Missing image: {path}</p>;
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <img className="source-img" src={url} alt={alt} loading="lazy" />
    </a>
  );
}
