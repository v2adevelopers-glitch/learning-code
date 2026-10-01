(function () {
  "use strict";

  // ---------- storage helpers (may be unavailable) ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // ---------- theme ----------
  const root = document.documentElement;
  const savedTheme = store.get("theme", null);
  if (savedTheme) root.setAttribute("data-theme", savedTheme);
  $("#themeToggle").addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme")
      ? root.getAttribute("data-theme") === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    const next = isDark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    store.set("theme", next);
  });

  // ---------- syntax highlighting ----------
  const KW = {
    cpp: "int|long|bool|char|void|auto|return|for|while|if|else|continue|break|true|false|vector|class|public|private|const|stack|double|priority_queue|queue|deque|map|pair|string|bool|struct|nullptr|new|stack|unordered_map|unordered_set|array|greater",
    java: "int|long|boolean|char|void|return|for|while|if|else|continue|break|true|false|new|class|public|private|final|static|double|null|switch|case|default",
    js: "const|let|var|function|return|for|of|in|while|if|else|continue|break|true|false|null|undefined|new|class|this|constructor|get|typeof|Infinity|Math|Map|Set|Array"
  };
  function highlight(code, lang) {
    const comment = "\\/\\/[^\\n]*";
    const re = new RegExp(
      "(" + comment + ")|(\"(?:[^\"\\\\\\n]|\\\\.)*\"|'(?:[^'\\\\\\n]|\\\\.)*')|\\b(" + KW[lang] + ")\\b|\\b(\\d+)\\b",
      "g"
    );
    let out = "", last = 0, m;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index));
      const cls = m[1] ? "c" : m[2] ? "s" : m[3] ? "k" : "n";
      out += `<span class="tok-${cls}">${esc(m[0])}</span>`;
      last = re.lastIndex;
    }
    return out + esc(code.slice(last));
  }

  const LANG_LABEL = { cpp: "C++", java: "Java", js: "JavaScript" };
  let lang = store.get("lang", "cpp");
  if (!LANG_LABEL[lang]) lang = "cpp";

  function enhanceCodeBlock(block) {
    $$("pre", block).forEach(pre => {
      const l = pre.dataset.lang;
      const codeEl = pre.querySelector("code");
      const raw = codeEl.textContent;
      pre.dataset.raw = raw;
      codeEl.innerHTML = highlight(raw, l);
    });
    const tag = document.createElement("span");
    tag.className = "lang-tag";
    block.appendChild(tag);
    const copy = document.createElement("button");
    copy.className = "copy";
    copy.type = "button";
    copy.textContent = "Copy";
    copy.addEventListener("click", () => {
      const pre = $$("pre", block).find(p => !p.hidden);
      if (!pre) return;
      const done = () => { copy.textContent = "Copied!"; setTimeout(() => (copy.textContent = "Copy"), 1200); };
      if (navigator.clipboard) navigator.clipboard.writeText(pre.dataset.raw).then(done, () => {});
    });
    block.appendChild(copy);
  }

  function applyLang() {
    $$(".lang-switch button").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
    $$("[data-code]").forEach(block => {
      const pres = $$("pre", block);
      const target = pres.find(p => p.dataset.lang === lang) || pres[0];
      pres.forEach(p => (p.hidden = p !== target));
      const tag = $(".lang-tag", block);
      if (tag) tag.textContent = LANG_LABEL[target.dataset.lang];
    });
  }
  $$(".lang-switch button").forEach(b =>
    b.addEventListener("click", () => { lang = b.dataset.lang; store.set("lang", lang); applyLang(); })
  );

  // ---------- graph data ----------
  const WG = {                                    // undirected, weighted
    pos: { A: [60, 160], B: [190, 60], C: [190, 260], D: [340, 60], E: [340, 260], F: [470, 160], G: [585, 260], H: [585, 60] },
    edges: [["A", "B", 4], ["A", "C", 2], ["B", "C", 1], ["B", "D", 5], ["C", "D", 8], ["C", "E", 10], ["D", "E", 2],
            ["D", "F", 6], ["E", "F", 3], ["E", "G", 7], ["F", "G", 5], ["F", "H", 4], ["D", "H", 9]]
  };
  const DAG = {
    pos: { A: [70, 70], B: [70, 230], C: [240, 70], D: [240, 230], E: [410, 110], F: [410, 250], G: [570, 170] },
    edges: [["A", "C"], ["B", "C"], ["B", "D"], ["C", "E"], ["D", "E"], ["D", "F"], ["E", "G"], ["F", "G"]]
  };
  const ekey = (u, v) => (u < v ? u + v : v + u);
  function adjOf(g, directed) {
    const adj = {};
    for (const k in g.pos) adj[k] = [];
    for (const [u, v, w] of g.edges) { adj[u].push([v, w]); if (!directed) adj[v].push([u, w]); }
    for (const k in adj) adj[k].sort((a, b) => a[0].localeCompare(b[0]));
    return adj;
  }

  // ---------- SVG rendering ----------
  let svgUid = 0;
  function renderGraph(svg, g, o = {}) {
    const R = 22, nodeCls = o.nodeCls || {}, edgeCls = o.edgeCls || {}, sub = o.sub || {};
    if (!svg.dataset.uid) svg.dataset.uid = "g" + (++svgUid);
    const mid = svg.dataset.uid + "-arrow";
    let html = o.directed ? `<defs><marker id="${mid}" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="13" markerHeight="13" orient="auto-start-reverse"><path class="arrowhead" d="M0,0 L10,5 L0,10 z"/></marker></defs>` : "";
    for (const e of g.edges) {
      const [u, v, w] = e, [x1, y1] = g.pos[u], [x2, y2] = g.pos[v];
      const key = o.directed ? u + v : ekey(u, v), cls = edgeCls[key] || "";
      const mk = o.directed ? ` marker-end="url(#${mid})"` : "";
      if (e.curve) {
        const [cx, cy] = e.curve, len = Math.hypot(x2 - cx, y2 - cy);
        const ex = x2 - ((x2 - cx) / len) * (R + 2), ey = y2 - ((y2 - cy) / len) * (R + 2);
        html += `<path class="gedge ${cls}" fill="none" d="M${x1},${y1} Q${cx},${cy} ${ex},${ey}"${mk}/>`;
      } else {
        const len = Math.hypot(x2 - x1, y2 - y1), sh = o.directed ? R + 2 : 0;
        html += `<line class="gedge ${cls}" x1="${x1}" y1="${y1}" x2="${x2 - ((x2 - x1) / len) * sh}" y2="${y2 - ((y2 - y1) / len) * sh}"${mk}/>`;
      }
      if (o.weights && w !== undefined) html += `<text class="wlabel" x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2}">${w}</text>`;
    }
    for (const k in g.pos) {
      const [x, y] = g.pos[k];
      html += `<g class="gnode ${nodeCls[k] || ""}"><circle cx="${x}" cy="${y}" r="${R}"/><text x="${x}" y="${y}">${k}</text>` +
        (sub[k] !== undefined ? `<text class="sub${sub[k] === "∞" ? " inf" : ""}" x="${x}" y="${y - R - 10}">${sub[k]}</text>` : "") + `</g>`;
    }
    svg.innerHTML = html;
  }

  // ---------- step generators ----------
  function bfsSteps(start) {
    const adj = adjOf(WG), seen = { [start]: 0 }, q = [start], done = new Set(), tree = new Set(), steps = [];
    const snap = (cur, msg) => steps.push({ cur, msg, done: new Set(done), frontier: new Set(q), tree: new Set(tree), ds: [...q], sub: { ...seen } });
    snap(null, `enqueue ${start} (distance 0) and mark it visited`);
    while (q.length) {
      const u = q.shift(), added = [];
      for (const [v] of adj[u]) if (!(v in seen)) { seen[v] = seen[u] + 1; q.push(v); tree.add(ekey(u, v)); added.push(v); }
      snap(u, `dequeue ${u} → ` + (added.length ? `enqueue unvisited neighbours ${added.join(", ")} at distance ${seen[u] + 1}` : "no unvisited neighbours"));
      done.add(u);
    }
    snap(null, `Done. Labels = fewest edges from ${start}. Green edges form the BFS tree.`);
    return steps;
  }
  function dfsSteps(start) {
    const adj = adjOf(WG), order = {}, done = new Set(), tree = new Set(), path = [], steps = [];
    let t = 0;
    const snap = (cur, msg) => steps.push({ cur, msg, done: new Set(done), frontier: new Set(path), tree: new Set(tree), ds: [...path], sub: { ...order } });
    (function dfs(u) {
      order[u] = ++t; path.push(u);
      snap(u, `visit ${u} (#${t}) — go deeper into the first unvisited neighbour`);
      for (const [v] of adj[u]) if (!(v in order)) { tree.add(ekey(u, v)); dfs(v); snap(u, `back at ${u}`); }
      path.pop(); done.add(u);
    })(start);
    snap(null, `Done. Numbers = discovery order. DFS goes deep first; it does NOT find shortest paths.`);
    return steps;
  }
  function dijkstraSteps(start) {
    const adj = adjOf(WG), dist = {}, prev = {}, done = new Set(), steps = [];
    for (const k in WG.pos) dist[k] = Infinity;
    dist[start] = 0;
    let pq = [[0, start]];
    const subOf = () => Object.fromEntries(Object.keys(dist).map(k => [k, dist[k] === Infinity ? "∞" : dist[k]]));
    const treeOf = () => new Set(Object.keys(prev).map(k => ekey(k, prev[k])));
    const snap = (cur, msg, active) => steps.push({ cur, msg, done: new Set(done), frontier: new Set(pq.map(p => p[1]).filter(k => !done.has(k))),
      tree: treeOf(), active, ds: [...pq].sort((a, b) => a[0] - b[0]).map(([d, k]) => `${k}:${d}`), sub: subOf(), dist: { ...dist }, prev: { ...prev } });
    snap(null, `dist[${start}] = 0, every other vertex ∞. Push (0, ${start}).`);
    while (pq.length) {
      pq.sort((a, b) => a[0] - b[0] || a[1].localeCompare(b[1]));
      const [d, u] = pq.shift();
      if (done.has(u)) { snap(null, `pop (${d}, ${u}) — stale entry (${u} already settled), skip`); continue; }
      done.add(u);
      snap(u, `pop (${d}, ${u}) — closest unsettled vertex. ${u} is now settled at ${d}.`);
      for (const [v, w] of adj[u]) {
        if (done.has(v)) continue;
        if (d + w < dist[v]) {
          const old = dist[v];
          dist[v] = d + w; prev[v] = u; pq.push([dist[v], v]);
          snap(u, `relax ${u}–${v}: ${d} + ${w} = ${d + w} < ${old === Infinity ? "∞" : old} → update dist[${v}]`, ekey(u, v));
        } else snap(u, `relax ${u}–${v}: ${d} + ${w} = ${d + w} ≥ ${dist[v]} → no change`, ekey(u, v));
      }
    }
    snap(null, `Done. Labels = cheapest total weight from ${start}. Green edges = shortest-path tree.`);
    return steps;
  }

  // ---------- hero animation ----------
  (function hero() {
    const svg = $("#heroGraph"), cap = $("#heroCap");
    const steps = bfsSteps("A");
    renderGraph(svg, WG);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let k = 0;
    setInterval(() => {
      k = (k + 1) % (steps.length + 3);
      const s = steps[Math.min(k, steps.length - 1)], nodeCls = {}, edgeCls = {};
      s.done.forEach(n => (nodeCls[n] = "done"));
      s.frontier.forEach(n => (nodeCls[n] = "frontier"));
      if (s.cur) nodeCls[s.cur] = "cur";
      s.tree.forEach(e => (edgeCls[e] = "tree"));
      renderGraph(svg, WG, { nodeCls, edgeCls, sub: s.sub });
      cap.textContent = k === 0 ? "breadth-first search from A" : "BFS: layer by layer from A";
    }, 900);
  })();

  // ---------- visualizer A ----------
  const gv = { algo: "bfs", timer: null };
  const gSvg = $("#gSvg"), gStatus = $("#gStatus");
  $("#gStart").innerHTML = Object.keys(WG.pos).map(k => `<option>${k}</option>`).join("");
  function drawStep(s) {
    const nodeCls = {}, edgeCls = {};
    s.done.forEach(n => (nodeCls[n] = "done"));
    s.frontier.forEach(n => { if (!s.done.has(n)) nodeCls[n] = "frontier"; });
    if (s.cur) nodeCls[s.cur] = "cur";
    s.tree.forEach(e => (edgeCls[e] = "tree"));
    if (s.active) edgeCls[s.active] = "active";
    renderGraph(gSvg, WG, { weights: true, nodeCls, edgeCls, sub: s.sub });
    $("#gDs").innerHTML = s.ds.length ? s.ds.map((x, i) => `<span class="${i === 0 && gv.algo !== "dfs" ? "next" : ""}">${x}</span>`).join("") : "—";
    gStatus.textContent = s.msg;
    if (gv.algo === "dijkstra" && s.dist) {
      const ks = Object.keys(WG.pos);
      const pathTo = k => { if (s.dist[k] === Infinity) return "—"; const p = [k]; while (s.prev[p[0]]) p.unshift(s.prev[p[0]]); return p.join("→"); };
      $("#gTable").innerHTML = `<div class="table-card mt"><table class="cmp-table"><thead><tr><th>vertex</th>${ks.map(k => `<th>${k}</th>`).join("")}</tr></thead><tbody>
        <tr><td>dist</td>${ks.map(k => `<td>${s.dist[k] === Infinity ? "∞" : s.dist[k]}</td>`).join("")}</tr>
        <tr><td>path</td>${ks.map(k => `<td>${pathTo(k)}</td>`).join("")}</tr></tbody></table></div>`;
    } else $("#gTable").innerHTML = "";
  }
  function runGraph() {
    clearInterval(gv.timer);
    const start = $("#gStart").value;
    const steps = gv.algo === "bfs" ? bfsSteps(start) : gv.algo === "dfs" ? dfsSteps(start) : dijkstraSteps(start);
    $("#gDsLabel").textContent = gv.algo === "bfs" ? "queue" : gv.algo === "dfs" ? "stack (path)" : "min-heap";
    let k = 0;
    const tick = () => { drawStep(steps[k++]); if (k >= steps.length) clearInterval(gv.timer); };
    tick();
    gv.timer = setInterval(tick, +$("#gSpeed").value);
  }
  $$("[data-galgo]").forEach(b => b.addEventListener("click", () => {
    gv.algo = b.dataset.galgo;
    $$("[data-galgo]").forEach(x => x.classList.toggle("active", x === b));
    runGraph();
  }));
  $("#gStart").addEventListener("change", runGraph);
  renderGraph(gSvg, WG, { weights: true });

  // ---------- visualizer B: topological sort ----------
  let topoTimer = null;
  function topoGraph() {
    const g = { pos: DAG.pos, edges: DAG.edges.map(e => e.slice()) };
    if ($("#topoCycle").checked) { const e = ["G", "B"]; e.curve = [320, 460]; g.edges.push(e); }
    return g;
  }
  function kahnSteps(g) {
    const indeg = {}, adj = {}, steps = [], order = [];
    for (const k in g.pos) { indeg[k] = 0; adj[k] = []; }
    for (const [u, v] of g.edges) { adj[u].push(v); indeg[v]++; }
    for (const k in adj) adj[k].sort();
    const q = Object.keys(g.pos).filter(k => indeg[k] === 0);
    const snap = (cur, msg, active = []) => steps.push({ cur, msg, active, q: [...q], order: [...order], indeg: { ...indeg } });
    snap(null, `In-degrees computed. Vertices with in-degree 0 (${q.join(", ") || "none"}) go into the queue.`);
    while (q.length) {
      const u = q.shift();
      order.push(u);
      const freed = [];
      for (const v of adj[u]) if (--indeg[v] === 0) { q.push(v); freed.push(v); }
      snap(u, `take ${u} → output. Remove its edges: ` + (adj[u].length ? adj[u].map(v => `${v}↓${indeg[v]}`).join(", ") : "none") +
        (freed.length ? `. In-degree 0 now: ${freed.join(", ")} → enqueue.` : "."), adj[u].map(v => u + v));
    }
    const left = Object.keys(g.pos).filter(k => !order.includes(k));
    snap(null, left.length ? `Queue empty but ${left.join(", ")} never reached in-degree 0 — they are on (or blocked by) a CYCLE, so no topological order exists.`
      : `All ${order.length} vertices output: ${order.join(" → ")} is a valid topological order.`, [], left);
    steps[steps.length - 1].stuck = left;
    return steps;
  }
  function runTopo() {
    clearInterval(topoTimer);
    const g = topoGraph(), steps = kahnSteps(g);
    let k = 0;
    const tick = () => {
      const s = steps[k++], nodeCls = {}, edgeCls = {};
      s.order.forEach(n => (nodeCls[n] = "done"));
      s.q.forEach(n => (nodeCls[n] = "frontier"));
      if (s.cur) nodeCls[s.cur] = "cur";
      s.active.forEach(e => (edgeCls[e] = "active"));
      g.edges.forEach(([u, v]) => { if (s.order.includes(u) && !s.active.includes(u + v)) edgeCls[u + v] = "dead"; });
      (s.stuck || []).forEach(n => (nodeCls[n] = "stuck"));
      if (s.stuck && s.stuck.length) g.edges.forEach(([u, v]) => { if (s.stuck.includes(u) && s.stuck.includes(v)) edgeCls[u + v] = "cyc"; });
      const sub = Object.fromEntries(Object.keys(g.pos).filter(n => !s.order.includes(n)).map(n => [n, s.indeg[n]]));
      renderGraph($("#topoSvg"), g, { directed: true, nodeCls, edgeCls, sub });
      $("#topoQ").innerHTML = s.q.length ? s.q.map(x => `<span>${x}</span>`).join("") : "—";
      $("#topoOut").innerHTML = s.order.length ? s.order.map(x => `<span>${x}</span>`).join("") : "—";
      $("#topoStatus").textContent = s.msg;
      if (k >= steps.length) clearInterval(topoTimer);
    };
    tick();
    topoTimer = setInterval(tick, 1000);
  }
  $("#topoRun").addEventListener("click", runTopo);
  $("#topoCycle").addEventListener("change", () => {
    clearInterval(topoTimer);
    renderGraph($("#topoSvg"), topoGraph(), { directed: true });
    $("#topoStatus").textContent = $("#topoCycle").checked ? "Cycle B → D → E → G → B added. Press Run." : "Press Run.";
  });
  renderGraph($("#topoSvg"), topoGraph(), { directed: true });

  // ---------- questions ----------
  const QS = window.QUESTIONS || [];
  let solved = store.get("solved", {});
  const listEl = $("#questionList");

  QS.forEach((q, idx) => {
    const art = document.createElement("article");
    art.className = "card q";
    art.dataset.diff = q.difficulty;
    const tags = q.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("");
    const codeBlocks = ["cpp", "java", "js"].filter(l => q.code[l])
      .map(l => `<pre data-lang="${l}"><code>${esc(q.code[l])}</code></pre>`).join("");
    art.innerHTML = `
      <div class="q-head">
        <input type="checkbox" aria-label="Mark ${esc(q.title)} as solved">
        <div class="q-main">
          <div class="q-title">
            <h3>${idx + 1}. ${esc(q.title)}</h3>
            <span class="badge ${q.difficulty}">${q.difficulty[0].toUpperCase() + q.difficulty.slice(1)}</span>
            ${tags}
          </div>
          <p class="q-desc">${esc(q.desc)}</p>
          <div class="q-example">${esc(q.example)}</div>
          <div class="q-actions">
            <button type="button" data-toggle="hint" aria-expanded="false">💡 Hint</button>
            <button type="button" data-toggle="sol" aria-expanded="false">🧩 Solution</button>
            <a href="${q.link}" target="_blank" rel="noopener">Practice ↗</a>
          </div>
        </div>
      </div>
      <div class="q-panel" data-panel="hint" hidden><div class="hint">${esc(q.hint)}</div></div>
      <div class="q-panel" data-panel="sol" hidden>
        <p><strong>Approach:</strong> ${esc(q.approach)}</p>
        <div class="code" data-code>${codeBlocks}</div>
        <p class="complexity">⏱ ${esc(q.complexity)}</p>
      </div>`;
    const cb = $("input", art);
    cb.checked = !!solved[q.id];
    art.classList.toggle("done", cb.checked);
    cb.addEventListener("change", () => {
      solved[q.id] = cb.checked;
      if (!cb.checked) delete solved[q.id];
      store.set("solved", solved);
      art.classList.toggle("done", cb.checked);
      updateProgress();
    });
    $$("[data-toggle]", art).forEach(btn => btn.addEventListener("click", () => {
      const panel = $(`[data-panel="${btn.dataset.toggle}"]`, art);
      const open = panel.hidden;
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
    }));
    listEl.appendChild(art);
  });

  function updateProgress() {
    const n = QS.filter(q => solved[q.id]).length;
    $("#progressText").textContent = `${n} / ${QS.length} solved`;
    $("#progressFill").style.width = (QS.length ? (n / QS.length) * 100 : 0) + "%";
  }
  updateProgress();

  $$(".filters .chip").forEach(chip => chip.addEventListener("click", () => {
    $$(".filters .chip").forEach(c => c.classList.toggle("active", c === chip));
    const f = chip.dataset.filter;
    $$(".q", listEl).forEach(q => (q.hidden = f !== "all" && q.dataset.diff !== f));
  }));

  // code blocks (static + generated) — highlight, add copy, then pick language
  $$("[data-code]").forEach(enhanceCodeBlock);
  applyLang();

  // ---------- quiz ----------
  const QZ = window.QUIZ || [];
  const quizEl = $("#quizBox");
  let score = 0, answered = 0;
  const scoreEl = document.createElement("p");
  scoreEl.className = "quiz-score";
  QZ.forEach((item, qi) => {
    const card = document.createElement("div");
    card.className = "card quiz-q";
    card.innerHTML = `<h3>${qi + 1}. ${esc(item.q)}</h3><div class="quiz-opts"></div><p class="quiz-exp" hidden></p>`;
    const opts = $(".quiz-opts", card);
    item.opts.forEach((o, oi) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = o;
      b.addEventListener("click", () => {
        const btns = $$("button", opts);
        btns.forEach(x => (x.disabled = true));
        btns[item.a].classList.add("right");
        if (oi !== item.a) b.classList.add("wrong"); else score++;
        answered++;
        const exp = $(".quiz-exp", card);
        exp.hidden = false;
        exp.textContent = (oi === item.a ? "✅ Correct. " : "❌ Not quite. ") + item.exp;
        scoreEl.textContent = `Score: ${score} / ${answered}` + (answered === QZ.length ? ` — ${score === QZ.length ? "perfect! 🎉" : "review the explanations and retry later."}` : "");
      });
      opts.appendChild(b);
    });
    quizEl.appendChild(card);
  });
  quizEl.appendChild(scoreEl);
})();
