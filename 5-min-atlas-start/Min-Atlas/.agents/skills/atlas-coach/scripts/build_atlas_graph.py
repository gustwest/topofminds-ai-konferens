#!/usr/bin/env python3
"""
Noll-beroende Kunskapsgrafs-byggare för Min-Atlas (kräver endast Python 3 standardbibliotek).
Skannar alla .md-filer i Min-Atlas, extraherar noder, sektioner, nyckelbegrepp och korskopplingar,
och skapar:
  - graphify-out/graph.html       (Interaktiv, klickbar kunskapsgraf i Top of Minds-design)
  - graphify-out/GRAPH_REPORT.md  (Översikt med God Nodes, kluster och kopplingar)
  - graphify-out/graph.json       (Maskinläsbar graf för AI-agenten)
"""
from __future__ import annotations
import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
OUT_DIR = ROOT / "graphify-out"

CLUSTER_CONFIG = {
    "01-privat": ("Privatliv & Mål", "#15803d"),
    "02-bolag-och-topofminds": ("Bolag & Top of Minds", "#7c3aed"),
    "03-uppdrag": ("Kunduppdrag & Leverans", "#0369a1"),
    "04-personer-och-natverk": ("Personer & Nätverk", "#b45309"),
    ".agents": ("Skills & Agentstyrning", "#09213a"),
    "root": ("Kärna & Stabschef", "#dc2626"),
}

STOP_HEADINGS = {
    "översikt", "inledning", "sammanfattning", "detaljer", "anteckningar",
    "bakgrund", "nästa steg", "exempel", "mall", "beskrivning",
    "så här kommer du igång på 2 minuter i google antigravity:",
}


def detect_cluster(rel_path: str) -> tuple[str, str]:
    parts = Path(rel_path).parts
    if len(parts) > 1 and parts[0] in CLUSTER_CONFIG:
        return CLUSTER_CONFIG[parts[0]]
    return CLUSTER_CONFIG["root"]


def clean_text(text: str) -> str:
    t = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    t = re.sub(r"[#*`_~>]+", "", t).strip()
    return re.sub(r"\s+", " ", t)


def clean_title(text: str, max_len: int = 48) -> str:
    t = clean_text(text)
    if len(t) <= max_len:
        return t
    cut = t[:max_len].rsplit(" ", 1)[0]
    return (cut or t[:max_len]) + "…"


def extract_doc_summary(text: str, rel: str) -> str:
    # For SKILL.md, prefer YAML frontmatter description
    if rel.endswith("SKILL.md"):
        desc_m = re.search(r"^description:\s*[\"']?(.+?)[\"']?\s*$", text, flags=re.MULTILINE)
        if desc_m:
            return clean_text(desc_m.group(1))
    # Strip frontmatter if any
    body = re.sub(r"^---\n.*?\n---\n", "", text, count=1, flags=re.DOTALL)
    collected: list[str] = []
    for line in body.splitlines():
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        cleaned = clean_text(re.sub(r"^[\-\*\d\.\)]+\s*", "", s))
        if len(cleaned) >= 12:
            collected.append(cleaned)
        if sum(len(c) for c in collected) >= 240 or len(collected) >= 3:
            break
    return " ".join(collected) if collected else f"Dokument i {rel}."


def extract_section_summary(sec_body: str, fallback: str) -> str:
    items: list[str] = []
    for line in sec_body.splitlines():
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        cleaned = clean_text(re.sub(r"^[\-\*\d\.\)]+\s*", "", s))
        if len(cleaned) >= 8:
            items.append(cleaned)
        if sum(len(x) for x in items) >= 260 or len(items) >= 3:
            break
    return " • ".join(items) if items else fallback


def build_graph() -> dict:
    nodes: dict[str, dict] = {}
    edges: list[dict] = []
    seen_edges: set[tuple[str, str, str]] = set()

    def add_node(nid: str, label: str, cluster: str, color: str, kind: str, source: str, summary: str = ""):
        if nid not in nodes:
            nodes[nid] = {
                "id": nid,
                "label": label,
                "cluster": cluster,
                "color": color,
                "kind": kind,
                "source": source,
                "summary": summary.strip(),
                "degree": 0,
            }

    def add_edge(src: str, dst: str, rel: str, confidence: str = "EXTRACTED"):
        if src == dst or src not in nodes or dst not in nodes:
            return
        key = tuple(sorted((src, dst))) + (rel,)
        if key in seen_edges:
            return
        seen_edges.add(key)
        edges.append({"source": src, "target": dst, "label": rel, "confidence": confidence})
        nodes[src]["degree"] += 1
        nodes[dst]["degree"] += 1

    # Central hub node
    add_node(
        "hub:min-atlas",
        "Min Atlas (Kärna)",
        "Kärna & Stabschef",
        "#dc2626",
        "Kärna",
        "AGENTS.md",
        "Central knutpunkt som binder ihop privatliv, eget bolag, Top of Minds, uppdrag och återanvändbara Skills.",
    )

    md_files: list[Path] = []
    for p in sorted(ROOT.rglob("*.md")):
        rel = p.relative_to(ROOT).as_posix()
        if rel.startswith("graphify-out/") or "/references/" in rel or rel == "STARTA_HAR.md":
            continue
        md_files.append(p)

    file_contents: dict[str, str] = {}
    concept_to_node: dict[str, str] = {}

    for p in md_files:
        rel = p.relative_to(ROOT).as_posix()
        text = p.read_text(encoding="utf-8", errors="ignore")
        file_contents[rel] = text
        cluster, color = detect_cluster(rel)

        # Determine file node title
        h1_match = re.search(r"^#\s+(.+)$", text, flags=re.MULTILINE)
        if rel.endswith("SKILL.md"):
            name_m = re.search(r"^name:\s*(.+)$", text, flags=re.MULTILINE)
            skill_name = clean_title(name_m.group(1)) if name_m else p.parent.name
            label = f"Skill: {skill_name}"
            kind = "Skill"
        elif rel == "AGENTS.md":
            label = "AGENTS.md (Lagbok)"
            kind = "Styrfil"
        else:
            label = clean_title(h1_match.group(1)) if h1_match else p.stem.replace("-", " ").title()
            kind = "Dokument"

        doc_summary = extract_doc_summary(text, rel)
        file_nid = f"file:{rel}"
        add_node(file_nid, label, cluster, color, kind, rel, doc_summary)
        add_edge("hub:min-atlas", file_nid, "styr / omfattar", "EXTRACTED")
        concept_to_node[label.lower()] = file_nid

        # Extract H2/H3 entities (skip generic headings, ignore giant reference skills)
        if not rel.endswith("graphify/SKILL.md"):
            headings = list(re.finditer(r"^#{2,3}\s+(.+)$", text, flags=re.MULTILINE))
            for idx, hm in enumerate(headings):
                htitle_raw = clean_text(hm.group(1))
                htitle_clean = re.sub(r"^\d+[\.\)]\s*", "", htitle_raw).strip()
                if len(htitle_clean) < 3 or htitle_clean.lower() in STOP_HEADINGS:
                    continue
                start_pos = hm.end()
                end_pos = headings[idx + 1].start() if idx + 1 < len(headings) else len(text)
                sec_body = text[start_pos:end_pos]
                sec_summary = extract_section_summary(sec_body, f"Delområde i {rel}.")
                sec_nid = f"sec:{rel}:{htitle_clean.lower()}"
                add_node(sec_nid, clean_title(htitle_clean), cluster, color, "Delområde", rel, sec_summary)
                add_edge(file_nid, sec_nid, "innehåller", "EXTRACTED")
                if len(htitle_clean) >= 4:
                    concept_to_node[htitle_clean.lower()] = sec_nid

            # Extract bolded entities (- **Namn:** beskrivning)
            for bm in re.finditer(r"^[\-\*]\s+\*\*([^*\n]{3,52}?)\*\*[:\s–-]+([^\n]+)", text, flags=re.MULTILINE):
                bname = clean_text(bm.group(1)).rstrip(":")
                bdesc = clean_text(bm.group(2))
                if bname.lower() in STOP_HEADINGS or len(bname) < 3:
                    continue
                ent_nid = f"ent:{bname.lower()}"
                add_node(ent_nid, clean_title(bname), cluster, color, "Entitet / Punkt", rel, bdesc)
                add_edge(file_nid, ent_nid, "beskriver", "EXTRACTED")
                concept_to_node[bname.lower()] = ent_nid

    # Cross-file links (Markdown links + shared concept mentions)
    for rel, text in file_contents.items():
        src_nid = f"file:{rel}"
        for lm in re.finditer(r"\[([^\]]+)\]\(([^)]+\.md[^)]*)\)", text):
            target_raw = lm.group(2).split("#")[0]
            target_path = (ROOT / Path(rel).parent / target_raw).resolve()
            try:
                target_rel = target_path.relative_to(ROOT).as_posix()
                dst_nid = f"file:{target_rel}"
                add_edge(src_nid, dst_nid, "länkar till", "EXTRACTED")
            except ValueError:
                pass

        lower_text = text.lower()
        for cname, cnid in concept_to_node.items():
            if len(cname) >= 5 and cnid != src_nid and not cnid.startswith(f"sec:{rel}:"):
                if cname in lower_text and nodes[cnid]["source"] != rel:
                    add_edge(src_nid, cnid, "kopplar till", "INFERRED")

    node_list = sorted(nodes.values(), key=lambda n: (-n["degree"], n["label"]))
    return {"nodes": node_list, "edges": edges}


def write_outputs(graph: dict) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "graph.json").write_text(json.dumps(graph, ensure_ascii=False, indent=2), encoding="utf-8")

    top_nodes = graph["nodes"][:8]
    clusters: dict[str, int] = {}
    for n in graph["nodes"]:
        clusters[n["cluster"]] = clusters.get(n["cluster"], 0) + 1

    report_lines = [
        "# GRAPH_REPORT — Min Personliga & Professionella Atlas",
        "",
        f"- **Antal noder:** {len(graph['nodes'])}",
        f"- **Antal kopplingar (relationer):** {len(graph['edges'])}",
        "",
        "## Viktigaste knutpunkter (God Nodes)",
    ]
    for n in top_nodes:
        report_lines.append(f"- **{n['label']}** ({n['cluster']}, {n['degree']} kopplingar) — `{n['source']}`")
    report_lines.append("")
    report_lines.append("## Klusterfördelning")
    for cname, count in sorted(clusters.items(), key=lambda x: -x[1]):
        report_lines.append(f"- **{cname}:** {count} noder")

    (OUT_DIR / "GRAPH_REPORT.md").write_text("\n".join(report_lines) + "\n", encoding="utf-8")

    graph_json_inline = json.dumps(graph, ensure_ascii=False)
    html = f"""<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Min Kunskapsgraf – Personlig & Professionell Atlas</title>
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #09213a;
      color: #f8fafc;
      height: 100vh;
      display: grid;
      grid-template-columns: 1fr 340px;
      overflow: hidden;
    }}
    @media (max-width: 860px) {{
      body {{ grid-template-columns: 1fr; grid-template-rows: 1fr 260px; }}
    }}
    .stage {{ position: relative; width: 100%; height: 100%; background: radial-gradient(circle at center, #0e2d4f 0%, #061729 100%); }}
    canvas {{ display: block; width: 100%; height: 100%; cursor: grab; }}
    canvas:active {{ cursor: grabbing; }}
    .topbar {{
      position: absolute; top: 16px; left: 16px; right: 16px;
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px;
      pointer-events: none;
    }}
    .title-box, .filters {{
      pointer-events: auto;
      background: rgba(9, 33, 58, 0.88);
      border: 1px solid rgba(255, 255, 255, 0.16);
      padding: 10px 14px;
      backdrop-filter: blur(8px);
    }}
    .title-box h1 {{ font-size: 15px; font-weight: 800; letter-spacing: 0.02em; }}
    .title-box p {{ font-size: 12px; color: #cbd5e1; margin-top: 2px; }}
    .filters {{ display: flex; flex-wrap: wrap; gap: 6px; }}
    .chip {{
      border: 1px solid rgba(255,255,255,0.22);
      background: transparent; color: #f8fafc;
      font-size: 11px; font-weight: 700; padding: 5px 9px; cursor: pointer;
    }}
    .chip.active {{ background: #7c3aed; border-color: #a78bfa; }}
    .sidebar {{
      background: #ffffff; color: #0f172a;
      border-left: 4px solid #7c3aed;
      padding: 20px; overflow-y: auto;
      display: flex; flex-direction: column; gap: 14px;
    }}
    .badge {{
      display: inline-block; font-size: 10px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.07em;
      padding: 3px 8px; background: #ede9fe; color: #5b21b6; align-self: flex-start;
    }}
    .sidebar h2 {{ font-size: 19px; font-weight: 800; color: #09213a; line-height: 1.25; }}
    .meta {{ font-size: 12px; color: #475569; background: #f1f4f6; padding: 10px; border: 1px solid #d5dde5; }}
    .conn-list {{ list-style: none; display: flex; flex-direction: column; gap: 6px; }}
    .conn-list li {{
      font-size: 12px; padding: 7px 9px; background: #f8fafc;
      border: 1px solid #e2e8f0; cursor: pointer;
    }}
    .conn-list li:hover {{ border-color: #7c3aed; }}
  </style>
</head>
<body>
  <div class="stage">
    <canvas id="graph-canvas"></canvas>
    <div class="topbar">
      <div class="title-box">
        <h1>🧭 Min Personliga & Professionella Kunskapsgraf</h1>
        <p>Dra i noderna · Klicka på valfri nod för att se hur privatliv, bolag, uppdrag & Skills hänger ihop</p>
      </div>
      <div class="filters" id="cluster-filters"></div>
    </div>
  </div>
  <aside class="sidebar">
    <span class="badge" id="sel-cluster">Kärna</span>
    <h2 id="sel-title">Klicka på en nod</h2>
    <p id="sel-summary" style="font-size:13px; color:#334155; line-height:1.5;"></p>
    <div class="meta">
      <div><strong>Typ:</strong> <span id="sel-kind"></span></div>
      <div style="margin-top:4px;"><strong>Lever i fil:</strong> <code id="sel-source"></code></div>
      <div style="margin-top:4px;"><strong>Kopplingar:</strong> <span id="sel-deg"></span> st</div>
    </div>
    <div>
      <strong style="font-size:12px; text-transform:uppercase; color:#64748b;">Direkta kopplingar (klickbara):</strong>
      <ul class="conn-list" id="sel-conns" style="margin-top:8px;"></ul>
    </div>
  </aside>
  <script>
    const DATA = {graph_json_inline};
    const canvas = document.getElementById('graph-canvas');
    const ctx = canvas.getContext('2d');
    let W = 800, H = 600, activeCluster = 'ALL';

    const nodes = DATA.nodes.map((n, i) => {{
      const angle = (i / Math.max(1, DATA.nodes.length)) * Math.PI * 2;
      const r = n.id === 'hub:min-atlas' ? 0 : 140 + (i % 3) * 75;
      return {{ ...n, x: 0 + Math.cos(angle) * r, y: 0 + Math.sin(angle) * r, vx: 0, vy: 0 }};
    }});
    const nodeById = new Map(nodes.map(n => [n.id, n]));
    const edges = DATA.edges.map(e => ({{ ...e, s: nodeById.get(e.source), t: nodeById.get(e.target) }})).filter(e => e.s && e.t);
    let selected = nodes[0] || null;
    let dragging = null;

    function resize() {{
      const rect = canvas.parentElement.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * devicePixelRatio; canvas.height = H * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }}
    window.addEventListener('resize', resize);
    resize();

    const clusters = ['ALL', ...Array.from(new Set(nodes.map(n => n.cluster)))];
    const filterWrap = document.getElementById('cluster-filters');
    clusters.forEach(c => {{
      const btn = document.createElement('button');
      btn.className = 'chip' + (c === 'ALL' ? ' active' : '');
      btn.textContent = c === 'ALL' ? `Alla (${{nodes.length}})` : c;
      btn.onclick = () => {{
        activeCluster = c;
        Array.from(filterWrap.children).forEach(ch => ch.classList.toggle('active', ch === btn));
      }};
      filterWrap.appendChild(btn);
    }});

    function renderSidebar(n) {{
      if (!n) return;
      document.getElementById('sel-cluster').textContent = n.cluster;
      document.getElementById('sel-title').textContent = n.label;
      document.getElementById('sel-summary').textContent = n.summary || '';
      document.getElementById('sel-kind').textContent = n.kind;
      document.getElementById('sel-source').textContent = n.source;
      const related = edges.filter(e => e.s === n || e.t === n);
      document.getElementById('sel-deg').textContent = String(related.length);
      const ul = document.getElementById('sel-conns');
      ul.innerHTML = '';
      related.forEach(e => {{
        const other = e.s === n ? e.t : e.s;
        const li = document.createElement('li');
        li.innerHTML = `<span style="color:#7c3aed;font-weight:700;">${{e.label}}</span> → <strong>${{other.label}}</strong>`;
        li.onclick = () => {{ selected = other; renderSidebar(other); }};
        ul.appendChild(li);
      }});
    }}
    renderSidebar(selected);

    function step() {{
      for (let i = 0; i < nodes.length; i++) {{
        for (let j = i + 1; j < nodes.length; j++) {{
          const a = nodes[i], b = nodes[j];
          let dx = b.x - a.x, dy = b.y - a.y;
          let d2 = dx * dx + dy * dy + 1;
          let f = 2600 / d2;
          let d = Math.sqrt(d2);
          a.vx -= (dx / d) * f; a.vy -= (dy / d) * f;
          b.vx += (dx / d) * f; b.vy += (dy / d) * f;
        }}
      }}
      for (const e of edges) {{
        const dx = e.t.x - e.s.x, dy = e.t.y - e.s.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = (d - 125) * 0.018;
        e.s.vx += (dx / d) * f; e.s.vy += (dy / d) * f;
        e.t.vx -= (dx / d) * f; e.t.vy -= (dy / d) * f;
      }}
      for (const n of nodes) {{
        if (n === dragging) continue;
        if (n.id === 'hub:min-atlas') {{ n.x *= 0.85; n.y *= 0.85; n.vx = 0; n.vy = 0; continue; }}
        n.vx -= n.x * 0.0025; n.vy -= n.y * 0.0025;
        n.vx *= 0.82; n.vy *= 0.82;
        n.x += n.vx; n.y += n.vy;
      }}

      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(W / 2, H / 2);

      for (const e of edges) {{
        const vis = activeCluster === 'ALL' || e.s.cluster === activeCluster || e.t.cluster === activeCluster;
        const hi = selected && (e.s === selected || e.t === selected);
        ctx.beginPath();
        ctx.moveTo(e.s.x, e.s.y);
        ctx.lineTo(e.t.x, e.t.y);
        ctx.strokeStyle = hi ? '#c4b5fd' : 'rgba(203, 213, 225, 0.24)';
        ctx.globalAlpha = vis ? 1 : 0.12;
        ctx.lineWidth = hi ? 2.3 : 1.1;
        if (e.confidence === 'INFERRED') ctx.setLineDash([4, 4]); else ctx.setLineDash([]);
        ctx.stroke();
      }}
      ctx.setLineDash([]);

      for (const n of nodes) {{
        const vis = activeCluster === 'ALL' || n.cluster === activeCluster;
        ctx.globalAlpha = vis ? 1 : 0.16;
        const r = Math.min(22, 8 + n.degree * 1.4);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
        ctx.lineWidth = n === selected ? 3.5 : 1.5;
        ctx.strokeStyle = n === selected ? '#ffffff' : 'rgba(255,255,255,0.6)';
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = (n === selected || n.degree >= 4 ? '700 ' : '600 ') + '11.5px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y + r + 14);
      }}
      ctx.restore();
      requestAnimationFrame(step);
    }}
    requestAnimationFrame(step);

    function hitNode(ev) {{
      const rect = canvas.getBoundingClientRect();
      const mx = ev.clientX - rect.left - W / 2;
      const my = ev.clientY - rect.top - H / 2;
      for (let i = nodes.length - 1; i >= 0; i--) {{
        const n = nodes[i];
        const r = Math.min(24, 10 + n.degree * 1.4);
        if ((n.x - mx) ** 2 + (n.y - my) ** 2 <= r * r) return n;
      }}
      return null;
    }}

    canvas.addEventListener('pointerdown', ev => {{
      const n = hitNode(ev);
      if (n) {{ dragging = n; selected = n; renderSidebar(n); }}
    }});
    window.addEventListener('pointermove', ev => {{
      if (!dragging) return;
      const rect = canvas.getBoundingClientRect();
      dragging.x = ev.clientX - rect.left - W / 2;
      dragging.y = ev.clientY - rect.top - H / 2;
    }});
    window.addEventListener('pointerup', () => {{ dragging = null; }});
  </script>
</body>
</html>
"""
    (OUT_DIR / "graph.html").write_text(html, encoding="utf-8")
    print(f"Kunskapsgraf skapad: {len(graph['nodes'])} noder, {len(graph['edges'])} kopplingar -> {OUT_DIR / 'graph.html'}")


if __name__ == "__main__":
    write_outputs(build_graph())
