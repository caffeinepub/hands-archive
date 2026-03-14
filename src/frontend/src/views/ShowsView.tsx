import { ArchiveCard } from "../components/Card";
import type { ArchiveItem } from "../data";
import { SHOWS } from "../data";

type Props = {
  onSelectItem: (item: ArchiveItem) => void;
};

export function ShowsView({ onSelectItem }: Props) {
  const sorted = [...SHOWS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div style={{ padding: "48px 48px 64px", maxWidth: "800px" }}>
      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "48px",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          marginBottom: "8px",
          textTransform: "uppercase",
        }}
      >
        Live Shows
      </h2>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "40px" }}>
        Documented performances, festivals, and tours.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1px",
          background: "#000",
        }}
      >
        {sorted.map((show) => (
          <div key={show.id} style={{ background: "#fff" }}>
            <ArchiveCard item={show} onClick={onSelectItem} />
          </div>
        ))}
      </div>
    </div>
  );
}
