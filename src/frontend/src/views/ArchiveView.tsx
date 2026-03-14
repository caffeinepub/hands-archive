import { useState } from "react";
import { ArchiveCard } from "../components/Card";
import type { ArchiveItem } from "../data";
import { ALL_ITEMS } from "../data";

type Props = {
  onSelectItem: (item: ArchiveItem) => void;
};

type FilterType = "all" | "song" | "album" | "show" | "member";

export function ArchiveView({ onSelectItem }: Props) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered =
    filter === "all" ? ALL_ITEMS : ALL_ITEMS.filter((i) => i.type === filter);

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "song", label: "Songs" },
    { key: "album", label: "Albums" },
    { key: "show", label: "Shows" },
    { key: "member", label: "Members" },
  ];

  return (
    <div style={{ padding: "48px 48px 64px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "32px",
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "48px",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
          }}
        >
          Archive
        </h2>
        <div
          style={{
            fontSize: "11px",
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {filtered.length} items
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0",
          borderBottom: "1px solid black",
          marginBottom: "32px",
        }}
      >
        {filters.map((f) => (
          <button
            type="button"
            key={f.key}
            data-ocid="archive.filter.tab"
            onClick={() => setFilter(f.key)}
            style={{
              padding: "8px 20px",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              background: filter === f.key ? "#000" : "transparent",
              color: filter === f.key ? "#fff" : "#000",
              border: "none",
              borderRight: "1px solid black",
              cursor: "pointer",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1px",
          background: "#000",
        }}
      >
        {filtered.map((item, idx) => (
          <div key={item.id} style={{ background: "#fff" }}>
            <ArchiveCard
              item={item}
              onClick={onSelectItem}
              data-ocid={idx < 3 ? `archive.item.${idx + 1}` : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
