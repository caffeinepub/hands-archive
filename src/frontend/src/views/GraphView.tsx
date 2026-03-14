import { useCallback, useEffect, useRef, useState } from "react";
import { ALL_ITEMS } from "../data";
import type { ArchiveItem } from "../data";

type GeometryMode = "standard" | "flower" | "hex" | "spiral";

type GraphNode = {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number | null;
  fy: number | null;
};

type GraphLink = {
  source: string;
  target: string;
};

type Props = {
  onSelectItem: (item: ArchiveItem) => void;
};

const NODE_COLORS: Record<string, string> = {
  song: "#000",
  album: "#555",
  member: "#888",
  show: "#bbb",
};

const NODE_RADII: Record<string, number> = {
  song: 8,
  album: 14,
  member: 12,
  show: 8,
};

function buildGraph(W: number, H: number) {
  const nodes: GraphNode[] = ALL_ITEMS.map((item) => ({
    id: item.id,
    label: item.type === "member" ? (item as any).name : (item as any).title,
    type: item.type,
    x: W / 2 + (Math.random() - 0.5) * 300,
    y: H / 2 + (Math.random() - 0.5) * 300,
    vx: 0,
    vy: 0,
    fx: null,
    fy: null,
  }));

  const links: GraphLink[] = [];
  for (const item of ALL_ITEMS) {
    if (item.type === "album") {
      for (const songId of item.trackList) {
        links.push({ source: item.id, target: songId });
      }
    }
    if (item.type === "member") {
      const albums = ALL_ITEMS.filter((i) => i.type === "album");
      for (const album of albums) {
        links.push({ source: item.id, target: album.id });
      }
    }
  }

  return { nodes, links };
}

function tickSimulation(
  nodes: GraphNode[],
  links: GraphLink[],
  W: number,
  H: number,
) {
  const alpha = 0.3;
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Link forces
  for (const link of links) {
    const s = nodeMap.get(link.source);
    const t = nodeMap.get(link.target);
    if (!s || !t) continue;
    const dx = t.x - s.x;
    const dy = t.y - s.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const targetDist = 100;
    const force = (dist - targetDist) * 0.01 * alpha;
    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;
    if (s.fx === null) {
      s.vx += fx;
      s.vy += fy;
    }
    if (t.fx === null) {
      t.vx -= fx;
      t.vy -= fy;
    }
  }

  // Repulsion + centering
  for (const n of nodes) {
    if (n.fx !== null) continue;
    // Center attraction
    n.vx += (W / 2 - n.x) * 0.002 * alpha;
    n.vy += (H / 2 - n.y) * 0.002 * alpha;
    // Repulsion from other nodes
    for (const m of nodes) {
      if (n === m) continue;
      const dx = n.x - m.x;
      const dy = n.y - m.y;
      const dist2 = dx * dx + dy * dy || 1;
      const f = (4000 * alpha) / dist2;
      n.vx += dx * f;
      n.vy += dy * f;
    }
  }

  // Integrate
  for (const n of nodes) {
    if (n.fx !== null) {
      n.x = n.fx;
      n.y = n.fy!;
      n.vx = 0;
      n.vy = 0;
    } else {
      n.vx *= 0.88;
      n.vy *= 0.88;
      n.x += n.vx;
      n.y += n.vy;
    }
  }
}

function applyGeometry(
  nodes: GraphNode[],
  mode: GeometryMode,
  cx: number,
  cy: number,
) {
  if (mode === "flower") {
    const rings = [1, 6, 5];
    let i = 0;
    for (const [ringIdx, count] of rings.entries()) {
      const r = ringIdx * 130;
      for (let j = 0; j < count && i < nodes.length; j++, i++) {
        const angle = (j / Math.max(1, count)) * Math.PI * 2;
        nodes[i].fx = cx + r * Math.cos(angle);
        nodes[i].fy = cy + r * Math.sin(angle);
      }
    }
    for (; i < nodes.length; i++) {
      const angle = (i / nodes.length) * Math.PI * 2;
      nodes[i].fx = cx + 260 * Math.cos(angle);
      nodes[i].fy = cy + 260 * Math.sin(angle);
    }
  } else if (mode === "hex") {
    const cols = Math.ceil(Math.sqrt(nodes.length));
    for (const [i, node] of nodes.entries()) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const offset = row % 2 === 0 ? 0 : 60;
      node.fx = cx - (cols * 60) / 2 + col * 120 + offset;
      node.fy = cy - (Math.ceil(nodes.length / cols) * 70) / 2 + row * 104;
    }
  } else if (mode === "spiral") {
    for (const [i, node] of nodes.entries()) {
      const angle = i * 0.8;
      const r = i * 20;
      node.fx = cx + r * Math.cos(angle);
      node.fy = cy + r * Math.sin(angle);
    }
  } else {
    for (const node of nodes) {
      node.fx = null;
      node.fy = null;
    }
  }
}

export function GraphView({ onSelectItem }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [geometry, setGeometry] = useState<GeometryMode>("standard");
  const hoveredIdRef = useRef<string | null>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);
  const transformRef = useRef({ x: 0, y: 0, k: 1 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const dragNodeRef = useRef<GraphNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const geometryRef = useRef<GeometryMode>("standard");

  const getCanvasPos = useCallback(
    (e: MouseEvent, canvas: HTMLCanvasElement) => {
      const rect = canvas.getBoundingClientRect();
      const mx =
        (e.clientX - rect.left - transformRef.current.x) /
        transformRef.current.k;
      const my =
        (e.clientY - rect.top - transformRef.current.y) /
        transformRef.current.k;
      return { mx, my };
    },
    [],
  );

  const findNode = useCallback((mx: number, my: number): GraphNode | null => {
    let found: GraphNode | null = null;
    let minDist = Number.POSITIVE_INFINITY;
    for (const node of nodesRef.current) {
      const dx = node.x - mx;
      const dy = node.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const r = NODE_RADII[node.type] ?? 8;
      if (dist < r + 6 && dist < minDist) {
        minDist = dist;
        found = node;
      }
    }
    return found;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const { nodes, links } = buildGraph(W, H);
    nodesRef.current = nodes;
    linksRef.current = links;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(transformRef.current.x, transformRef.current.y);
      ctx.scale(transformRef.current.k, transformRef.current.k);

      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 1;
      const nodeMap = new Map(nodesRef.current.map((n) => [n.id, n]));
      for (const link of linksRef.current) {
        const s = nodeMap.get(link.source);
        const t = nodeMap.get(link.target);
        if (!s || !t) continue;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
      }

      for (const node of nodesRef.current) {
        const r = NODE_RADII[node.type] ?? 8;
        const isHov = node.id === hoveredIdRef.current;
        ctx.beginPath();
        ctx.rect(node.x - r, node.y - r, r * 2, r * 2);
        ctx.fillStyle = isHov ? "#fff" : (NODE_COLORS[node.type] ?? "#000");
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = isHov ? 2 : 1;
        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.font = `${isHov ? "bold " : ""}10px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(node.label.substring(0, 16), node.x, node.y + r + 12);
      }

      ctx.restore();
    }

    let frame = 0;
    function loop() {
      frame++;
      if (frame < 300 || dragNodeRef.current) {
        tickSimulation(nodesRef.current, linksRef.current, W, H);
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      transformRef.current.k = Math.max(
        0.2,
        Math.min(5, transformRef.current.k * factor),
      );
    };

    const onMouseDown = (e: MouseEvent) => {
      const { mx, my } = getCanvasPos(e, canvas);
      const node = findNode(mx, my);
      if (node) {
        dragNodeRef.current = node;
        node.fx = node.x;
        node.fy = node.y;
      } else {
        isDraggingRef.current = true;
        dragStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          tx: transformRef.current.x,
          ty: transformRef.current.y,
        };
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const { mx, my } = getCanvasPos(e, canvas);
      if (dragNodeRef.current) {
        dragNodeRef.current.fx = mx;
        dragNodeRef.current.fy = my;
        frame = 0;
        return;
      }
      if (isDraggingRef.current) {
        transformRef.current.x =
          dragStartRef.current.tx + (e.clientX - dragStartRef.current.x);
        transformRef.current.y =
          dragStartRef.current.ty + (e.clientY - dragStartRef.current.y);
        return;
      }
      const hovered = findNode(mx, my);
      const newId = hovered?.id ?? null;
      if (newId !== hoveredIdRef.current) {
        hoveredIdRef.current = newId;
        canvas.style.cursor = hovered ? "pointer" : "default";
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (dragNodeRef.current) {
        dragNodeRef.current.fx = null;
        dragNodeRef.current.fy = null;
        dragNodeRef.current = null;
        return;
      }
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        return;
      }
      const { mx, my } = getCanvasPos(e, canvas);
      const node = findNode(mx, my);
      if (node) {
        const item = ALL_ITEMS.find((i) => i.id === node.id);
        if (item) onSelectItem(item);
      }
    };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
    };
  }, [getCanvasPos, findNode, onSelectItem]);

  useEffect(() => {
    geometryRef.current = geometry;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    applyGeometry(nodesRef.current, geometry, W / 2, H / 2);
  }, [geometry]);

  const geomOptions: { key: GeometryMode; label: string }[] = [
    { key: "standard", label: "Standard" },
    { key: "flower", label: "Flower of Life" },
    { key: "hex", label: "Hex Grid" },
    { key: "spiral", label: "Golden Spiral" },
  ];

  const legend = [
    { type: "album", label: "Album" },
    { type: "song", label: "Song" },
    { type: "member", label: "Member" },
    { type: "show", label: "Show" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid black",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 900,
            fontSize: "16px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Graph View
        </span>

        <div style={{ display: "flex", gap: "0", alignItems: "center" }}>
          <span
            style={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#666",
              marginRight: "8px",
              fontWeight: 600,
            }}
          >
            Geometry:
          </span>
          {geomOptions.map((opt) => (
            <button
              type="button"
              key={opt.key}
              data-ocid="geometry.toggle"
              onClick={() => setGeometry(opt.key)}
              style={{
                padding: "4px 12px",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 600,
                background: geometry === opt.key ? "#000" : "#fff",
                color: geometry === opt.key ? "#fff" : "#000",
                border: "1px solid black",
                borderRight: "none",
                cursor: "pointer",
              }}
            >
              {opt.label}
            </button>
          ))}
          <div style={{ width: "1px", height: "28px", background: "#000" }} />
        </div>

        <div style={{ display: "flex", gap: "16px", marginLeft: "auto" }}>
          {legend.map((l) => (
            <div
              key={l.type}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  background: NODE_COLORS[l.type],
                  border: "1px solid black",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#666",
                }}
              >
                {l.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <canvas
          ref={canvasRef}
          data-ocid="graph.canvas_target"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            background: "#fff",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            fontSize: "10px",
            color: "#aaa",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            pointerEvents: "none",
          }}
        >
          Scroll to zoom · Drag to pan · Click node to view
        </div>
      </div>
    </div>
  );
}
