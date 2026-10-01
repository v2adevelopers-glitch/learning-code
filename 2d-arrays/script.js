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
    cpp: "int|long|bool|char|void|auto|return|for|while|if|else|continue|break|true|false|vector|class|public|private|const|stack",
    java: "int|long|boolean|char|void|return|for|while|if|else|continue|break|true|false|new|class|public|private|final|static",
    python: "def|return|for|in|while|if|elif|else|and|or|not|True|False|None|class|from|import|range|len|continue|break|lambda"
  };
  function highlight(code, lang) {
    const comment = lang === "python" ? "#[^\\n]*" : "\\/\\/[^\\n]*";
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

  const LANG_LABEL = { cpp: "C++", java: "Java", python: "Python" };
  let lang = store.get("lang", "cpp");

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

  // ---------- hero animation (spiral) ----------
  (function hero() {
    const el = $("#heroMatrix");
    const N = 6;
    for (let i = 0; i < N * N; i++) {
      const s = document.createElement("span");
      s.textContent = i + 1;
      el.appendChild(s);
    }
    const order = orderFor("spiral", N, N);
    const cells = el.children;
    let k = 0;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setInterval(() => {
      const idx = k % (order.length + 6);
      if (idx === 0) Array.from(cells).forEach(c => c.classList.remove("on"));
      if (idx < order.length) {
        const [r, c] = order[idx];
        cells[r * N + c].classList.add("on");
      }
      k++;
    }, 160);
  })();

  // ---------- index demo ----------
  (function indexDemo() {
    const R = 3, C = 4;
    const el = $("#indexDemo");
    const text = $("#indexDemoText");
    el.style.gridTemplateColumns = `36px repeat(${C}, 1fr)`;
    el.appendChild(Object.assign(document.createElement("div"), { className: "hdr" }));
    for (let j = 0; j < C; j++) el.appendChild(Object.assign(document.createElement("div"), { className: "hdr", textContent: "col " + j }));
    const cells = [];
    for (let i = 0; i < R; i++) {
      el.appendChild(Object.assign(document.createElement("div"), { className: "hdr", textContent: "row " + i }));
      for (let j = 0; j < C; j++) {
        const d = document.createElement("div");
        d.className = "cell";
        d.textContent = `[${i}][${j}]`;
        d.tabIndex = 0;
        const show = () => {
          cells.forEach(x => x.el.classList.remove("hl", "hl-row", "hl-col"));
          cells.forEach(x => { if (x.i === i) x.el.classList.add("hl-row"); if (x.j === j) x.el.classList.add("hl-col"); });
          d.classList.add("hl");
          text.innerHTML = `<code>a[${i}][${j}]</code> → row ${i}, column ${j} · flat index ${i} × ${C} + ${j} = <strong>${i * C + j}</strong>`;
        };
        d.addEventListener("mouseenter", show);
        d.addEventListener("focus", show);
        cells.push({ i, j, el: d });
        el.appendChild(d);
      }
    }
  })();

  // ---------- flatten demo ----------
  (function flatten() {
    const R = 3, C = 4;
    const el = $("#flattenDemo");
    const mat = Object.assign(document.createElement("div"), { className: "mat" });
    const line = Object.assign(document.createElement("div"), { className: "line" });
    const idx = Object.assign(document.createElement("div"), { className: "line-idx" });
    const pairs = [];
    for (let i = 0; i < R; i++)
      for (let j = 0; j < C; j++) {
        const v = i * C + j + 1;
        const a = Object.assign(document.createElement("div"), { className: `cell r${i}`, textContent: v });
        const b = Object.assign(document.createElement("div"), { className: `cell r${i}`, textContent: v });
        mat.appendChild(a); line.appendChild(b);
        idx.appendChild(Object.assign(document.createElement("span"), { textContent: i * C + j }));
        pairs.push([a, b]);
      }
    pairs.forEach(([a, b]) => {
      const on = () => { a.classList.add("hl"); b.classList.add("hl"); };
      const off = () => { a.classList.remove("hl"); b.classList.remove("hl"); };
      [a, b].forEach(x => { x.addEventListener("mouseenter", on); x.addEventListener("mouseleave", off); });
    });
    el.append(mat, line, idx);
  })();

  // ---------- traversal orders ----------
  function orderFor(p, R, C) {
    const o = [];
    if (p === "row") for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) o.push([i, j]);
    if (p === "col") for (let j = 0; j < C; j++) for (let i = 0; i < R; i++) o.push([i, j]);
    if (p === "snake") for (let i = 0; i < R; i++) for (let k = 0; k < C; k++) o.push([i, i % 2 ? C - 1 - k : k]);
    if (p === "spiral") {
      let t = 0, b = R - 1, l = 0, r = C - 1;
      while (t <= b && l <= r) {
        for (let j = l; j <= r; j++) o.push([t, j]); t++;
        for (let i = t; i <= b; i++) o.push([i, r]); r--;
        if (t <= b) { for (let j = r; j >= l; j--) o.push([b, j]); b--; }
        if (l <= r) { for (let i = b; i >= t; i--) o.push([i, l]); l++; }
      }
    }
    if (p === "diag" || p === "anti") {
      for (let d = 0; d <= R + C - 2; d++) {
        const lo = Math.max(0, d - C + 1), hi = Math.min(d, R - 1);
        const diag = [];
        for (let i = lo; i <= hi; i++) diag.push([i, d - i]);
        if (p === "diag" && d % 2 === 0) diag.reverse();
        o.push(...diag);
      }
    }
    if (p === "main") for (let i = 0; i < Math.min(R, C); i++) o.push([i, i]);
    if (p === "border") {
      for (let j = 0; j < C; j++) o.push([0, j]);
      for (let i = 1; i < R; i++) o.push([i, C - 1]);
      if (R > 1) for (let j = C - 2; j >= 0; j--) o.push([R - 1, j]);
      if (C > 1) for (let i = R - 2; i >= 1; i--) o.push([i, 0]);
    }
    return o;
  }

  const NOTES = {
    row: "Outer loop over rows, inner over columns. Matches memory layout — the fastest way to scan.",
    col: "Outer loop over columns. Useful for column sums or checks, but jumps around in memory.",
    snake: "Even rows left→right, odd rows right→left. Just flip j when i is odd.",
    spiral: "Shrink top/right/bottom/left after each side. Re-check bounds before the 3rd and 4th sides.",
    diag: "Group by d = i + j, reverse every even diagonal (LeetCode 498).",
    anti: "All cells with the same i + j lie on one anti-diagonal. There are R + C − 1 of them.",
    main: "a[i][i] for i < min(R, C). On a square matrix the secondary diagonal is a[i][n−1−i].",
    border: "Top row, right column, bottom row reversed, left column upward — skip the corners you've already visited."
  };

  // ---------- visualizer ----------
  const viz = { R: 4, C: 5, data: [], timer: null };
  const gridEl = $("#vizGrid"), outEl = $("#vizOut"), noteEl = $("#vizNote");

  function resetData() {
    viz.data = [];
    for (let i = 0; i < viz.R; i++) {
      viz.data.push([]);
      for (let j = 0; j < viz.C; j++) viz.data[i].push(i * viz.C + j + 1);
    }
  }
  function drawGrid() {
    gridEl.style.gridTemplateColumns = `repeat(${viz.C}, auto)`;
    gridEl.innerHTML = "";
    for (let i = 0; i < viz.R; i++)
      for (let j = 0; j < viz.C; j++) {
        const d = document.createElement("div");
        d.className = "vc";
        d.id = `vc-${i}-${j}`;
        d.innerHTML = `<small>${i},${j}</small>${viz.data[i][j]}<span class="ord"></span>`;
        gridEl.appendChild(d);
      }
  }
  function stop() { clearInterval(viz.timer); viz.timer = null; }
  function setActive(btn) { $$("#vizButtons button").forEach(b => b.classList.toggle("active", b === btn)); }

  function run(pattern, btn) {
    stop(); drawGrid(); setActive(btn);
    const order = orderFor(pattern, viz.R, viz.C);
    noteEl.textContent = NOTES[pattern];
    outEl.textContent = "";
    const seen = [];
    let k = 0;
    const speed = +$("#vizSpeed").value;
    viz.timer = setInterval(() => {
      $$(".vc.cur", gridEl).forEach(x => { x.classList.remove("cur"); x.classList.add("seen"); });
      if (k >= order.length) { stop(); return; }
      const [i, j] = order[k];
      const cell = $(`#vc-${i}-${j}`);
      cell.classList.add("cur");
      $(".ord", cell).textContent = "#" + (k + 1);
      seen.push(viz.data[i][j]);
      outEl.textContent = "[" + seen.join(", ") + "]";
      k++;
    }, speed);
  }

  function readSize() {
    const clamp = v => Math.max(1, Math.min(8, Math.floor(+v || 1)));
    viz.R = clamp($("#vizRows").value);
    viz.C = clamp($("#vizCols").value);
    $("#vizRows").value = viz.R; $("#vizCols").value = viz.C;
  }

  function op(name) {
    stop(); setActive(null);
    if (name === "reset") {
      readSize(); resetData(); drawGrid();
      outEl.textContent = "—"; noteEl.textContent = "Choose a pattern to start.";
      return;
    }
    const R = viz.R, C = viz.C, a = viz.data;
    const res = [];
    for (let j = 0; j < C; j++) {
      res.push([]);
      for (let i = 0; i < R; i++) res[j].push(name === "transpose" ? a[i][j] : a[R - 1 - i][j]);
    }
    viz.data = res; viz.R = C; viz.C = R;
    $("#vizRows").value = viz.R; $("#vizCols").value = viz.C;
    drawGrid();
    outEl.textContent = JSON.stringify(res).replace(/\],\[/g, "],\n [");
    noteEl.textContent = name === "transpose"
      ? "Transpose: res[j][i] = a[i][j]. An R × C matrix becomes C × R."
      : "Rotate 90° clockwise: res[j][R−1−i] = a[i][j] — same as transpose then reverse each row.";
  }

  $$("#vizButtons button").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.pattern) run(b.dataset.pattern, b);
    else op(b.dataset.op);
  }));
  ["#vizRows", "#vizCols"].forEach(s => $(s).addEventListener("change", () => op("reset")));
  resetData(); drawGrid();

  // ---------- questions ----------
  const QS = window.QUESTIONS || [];
  let solved = store.get("solved", {});
  const listEl = $("#questionList");

  QS.forEach((q, idx) => {
    const art = document.createElement("article");
    art.className = "card q";
    art.dataset.diff = q.difficulty;
    const tags = q.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("");
    const codeBlocks = ["cpp", "java", "python"].filter(l => q.code[l])
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
