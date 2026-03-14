export function Header() {
  return (
    <header
      style={{
        borderBottom: "2px solid black",
        padding: "24px 32px",
        display: "flex",
        alignItems: "baseline",
        gap: "24px",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "72px",
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          textTransform: "uppercase",
        }}
      >
        HANDS
      </h1>
      <div
        style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "#666",
          fontWeight: 500,
        }}
      >
        Philadelphia, PA · Post-Rock Archive
      </div>
    </header>
  );
}
