const PRESS_ITEMS = [
  {
    id: "pitchfork-2011",
    outlet: "Pitchfork",
    date: "2011-09-12",
    headline:
      '"Synesthesia" is a debut that announces a band unafraid of space.',
    score: "7.8",
  },
  {
    id: "wire-2013",
    outlet: "The Wire",
    date: "2013-11-04",
    headline:
      "Wildly Idle positions Hands as one of the most uncompromising voices in post-rock.",
    score: null,
  },
  {
    id: "exclaim-2016",
    outlet: "Exclaim!",
    date: "2016-08-20",
    headline: "Cavalo finds the trio at their most physical and visceral.",
    score: "8/10",
  },
];

export function MediaView() {
  return (
    <div style={{ padding: "48px 48px 64px", maxWidth: "800px" }}>
      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "48px",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          marginBottom: "40px",
          textTransform: "uppercase",
        }}
      >
        Media
      </h2>

      <div style={{ marginBottom: "48px" }}>
        <div
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "#666",
            marginBottom: "20px",
            fontWeight: 600,
            borderBottom: "1px solid black",
            paddingBottom: "8px",
          }}
        >
          Press
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1px",
            background: "#000",
          }}
        >
          {PRESS_ITEMS.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#fff",
                padding: "20px",
                display: "flex",
                gap: "24px",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flexShrink: 0, width: "100px" }}>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "13px",
                    textTransform: "uppercase",
                  }}
                >
                  {item.outlet}
                </div>
                <div
                  style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}
                >
                  {item.date}
                </div>
                {item.score && (
                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "20px",
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontWeight: 900,
                    }}
                  >
                    {item.score}
                  </div>
                )}
              </div>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  fontStyle: "italic",
                  color: "#222",
                }}
              >
                &ldquo;{item.headline}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "#666",
            marginBottom: "20px",
            fontWeight: 600,
            borderBottom: "1px solid black",
            paddingBottom: "8px",
          }}
        >
          Discography at a Glance
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            background: "#000",
          }}
        >
          {["Synesthesia (2011)", "Wildly Idle (2013)", "Cavalo (2016)"].map(
            (title) => (
              <div
                key={title}
                style={{
                  background: "#fff",
                  padding: "32px 20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "#000",
                    margin: "0 auto 16px",
                  }}
                />
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {title}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
