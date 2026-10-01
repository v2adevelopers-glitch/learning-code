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
    cpp: "int|long|bool|char|void|auto|return|for|while|if|else|continue|break|true|false|vector|class|public|private|const|stack|double|priority_queue|queue|deque|map|pair|string|bool",
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

  // ---------- sorting algorithms as event generators ----------
  // Events: {t:"c", i, j} compare · {t:"s", i, j} swap · {t:"w", i, v} write · {t:"d", i} final position
  const C = (i, j) => ({ t: "c", i, j }), S = (i, j) => ({ t: "s", i, j }), W = (i, v) => ({ t: "w", i, v }), D = i => ({ t: "d", i });
  const swapA = (a, i, j) => { const x = a[i]; a[i] = a[j]; a[j] = x; };

  const ALGOS = {
    bubble: { name: "Bubble", *run(a) {
      const n = a.length;
      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
          yield C(j, j + 1);
          if (a[j] > a[j + 1]) { swapA(a, j, j + 1); yield S(j, j + 1); swapped = true; }
        }
        yield D(n - 1 - i);
        if (!swapped) return;
      }
    } },
    selection: { name: "Selection", *run(a) {
      const n = a.length;
      for (let i = 0; i < n - 1; i++) {
        let m = i;
        for (let j = i + 1; j < n; j++) { yield C(j, m); if (a[j] < a[m]) m = j; }
        if (m !== i) { swapA(a, i, m); yield S(i, m); }
        yield D(i);
      }
    } },
    insertion: { name: "Insertion", *run(a) {
      for (let i = 1; i < a.length; i++)
        for (let j = i; j > 0; j--) {
          yield C(j - 1, j);
          if (a[j - 1] <= a[j]) break;
          swapA(a, j - 1, j); yield S(j - 1, j);
        }
    } },
    merge: { name: "Merge", *run(a) {
      const tmp = new Array(a.length);
      function* ms(lo, hi) {
        if (hi - lo < 2) return;
        const mid = (lo + hi) >> 1;
        yield* ms(lo, mid); yield* ms(mid, hi);
        let i = lo, j = mid, k = lo;
        while (i < mid && j < hi) { yield C(i, j); tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++]; }
        while (i < mid) tmp[k++] = a[i++];
        while (j < hi) tmp[k++] = a[j++];
        for (k = lo; k < hi; k++) { a[k] = tmp[k]; yield W(k, a[k]); }
      }
      yield* ms(0, a.length);
    } },
    quick: { name: "Quick", *run(a) {
      function* qs(lo, hi) {
        if (lo > hi) return;
        if (lo === hi) { yield D(lo); return; }
        const r = lo + Math.floor(Math.random() * (hi - lo + 1));
        if (r !== hi) { swapA(a, r, hi); yield S(r, hi); }
        let i = lo;
        for (let j = lo; j < hi; j++) {
          yield C(j, hi);
          if (a[j] < a[hi]) { if (i !== j) { swapA(a, i, j); yield S(i, j); } i++; }
        }
        if (i !== hi) { swapA(a, i, hi); yield S(i, hi); }
        yield D(i);
        yield* qs(lo, i - 1); yield* qs(i + 1, hi);
      }
      yield* qs(0, a.length - 1);
    } },
    heap: { name: "Heap", *run(a) {
      const n = a.length;
      function* sift(i, end) {
        while (2 * i + 1 < end) {
          let c = 2 * i + 1;
          if (c + 1 < end) { yield C(c, c + 1); if (a[c + 1] > a[c]) c++; }
          yield C(i, c);
          if (a[i] >= a[c]) return;
          swapA(a, i, c); yield S(i, c); i = c;
        }
      }
      for (let i = (n >> 1) - 1; i >= 0; i--) yield* sift(i, n);
      for (let end = n - 1; end > 0; end--) { swapA(a, 0, end); yield S(0, end); yield D(end); yield* sift(0, end); }
      if (n) yield D(0);
    } }
  };

  function makeInput(n, kind) {
    let a = Array.from({ length: n }, (_, i) => i + 1);
    if (kind === "few") a = a.map(() => 1 + Math.floor(Math.random() * 4) * Math.ceil(n / 4));
    if (kind === "random" || kind === "few") for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); swapA(a, i, j); }
    if (kind === "reversed") a.reverse();
    if (kind === "nearly") for (let k = 0; k < Math.max(1, n / 10); k++) { const i = Math.floor(Math.random() * (n - 1)); swapA(a, i, i + 1); }
    return a;
  }

  function drawBars(el, a, cls = {}) {
    const mx = Math.max(...a, 1);
    if (el.children.length !== a.length) el.innerHTML = a.map(() => `<div class="bar"></div>`).join("");
    a.forEach((v, i) => {
      const b = el.children[i];
      b.style.height = `${Math.max(3, (v / mx) * 100)}%`;
      b.className = "bar" + (cls[i] ? " " + cls[i] : "");
    });
  }

  // ---------- hero animation ----------
  (function hero() {
    const el = $("#heroBars");
    let a = makeInput(14, "random");
    drawBars(el, a);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let gen = ALGOS.insertion.run([...a]), pause = 0;
    setInterval(() => {
      if (pause > 0) { if (--pause === 0) { a = makeInput(14, "random"); gen = ALGOS.insertion.run([...a]); drawBars(el, a); } return; }
      const { value: e, done } = gen.next();
      if (done) { drawBars(el, a, Object.fromEntries(a.map((_, i) => [i, "done"]))); pause = 8; return; }
      const cls = {};
      if (e.t === "c") { cls[e.i] = cls[e.j] = "cmp"; }
      if (e.t === "s") { swapA(a, e.i, e.j); cls[e.i] = cls[e.j] = "wr"; }
      drawBars(el, a, cls);
    }, 170);
  })();

  // ---------- visualizer A ----------
  const vz = { algo: "bubble", base: [], timer: null };
  const barsEl = $("#sortBars"), statusEl = $("#sortStatus");
  function newArray() {
    clearInterval(vz.timer);
    const n = Math.max(5, Math.min(60, Math.floor(+$("#sortSize").value || 24)));
    $("#sortSize").value = n;
    vz.base = makeInput(n, $("#sortInput").value);
    drawBars(barsEl, vz.base);
    $("#statCmp").textContent = 0; $("#statWr").textContent = 0;
    $("#sortTable").innerHTML = "";
    statusEl.textContent = "New array. Pick an algorithm and press Sort.";
  }
  function runSort() {
    clearInterval(vz.timer);
    const shown = [...vz.base], done = new Set();
    const gen = ALGOS[vz.algo].run([...vz.base]);
    let cmp = 0, wr = 0;
    const speed = +$("#sortSpeed").value, perTick = speed <= 12 ? 4 : 1;
    statusEl.textContent = `Running ${ALGOS[vz.algo].name} sort…`;
    vz.timer = setInterval(() => {
      let cls = {};
      for (let k = 0; k < perTick; k++) {
        const { value: e, done: finished } = gen.next();
        if (finished) {
          clearInterval(vz.timer);
          drawBars(barsEl, shown, Object.fromEntries(shown.map((_, i) => [i, "done"])));
          statusEl.textContent = `${ALGOS[vz.algo].name} sort finished: ${cmp} comparisons, ${wr} writes/swaps on n = ${shown.length}.`;
          return;
        }
        cls = {};
        if (e.t === "c") { cmp++; cls[e.i] = cls[e.j] = "cmp"; }
        else if (e.t === "s") { wr++; swapA(shown, e.i, e.j); cls[e.i] = cls[e.j] = "wr"; }
        else if (e.t === "w") { wr++; shown[e.i] = e.v; cls[e.i] = "wr"; }
        else if (e.t === "d") done.add(e.i);
      }
      done.forEach(i => { if (!cls[i]) cls[i] = "done"; });
      drawBars(barsEl, shown, cls);
      $("#statCmp").textContent = cmp; $("#statWr").textContent = wr;
    }, speed);
  }
  function compareAll() {
    const rows = Object.entries(ALGOS).map(([key, al]) => {
      let c = 0, w = 0;
      for (const e of al.run([...vz.base])) { if (e.t === "c") c++; else if (e.t === "s" || e.t === "w") w++; }
      return { name: al.name, c, w };
    });
    const mx = Math.max(...rows.map(r => r.c + r.w), 1), n = vz.base.length;
    $("#sortTable").innerHTML = `<div class="table-card sort-table"><table class="cmp-table">
      <thead><tr><th>Algorithm</th><th>Comparisons</th><th>Writes/swaps</th><th>Total work</th></tr></thead><tbody>` +
      rows.map(r => `<tr><td><strong>${r.name}</strong></td><td>${r.c}</td><td>${r.w}</td>
        <td><div class="bar-cell"><div class="meter" style="width:${Math.round(((r.c + r.w) / mx) * 160)}px"></div>${r.c + r.w}</div></td></tr>`).join("") +
      `</tbody></table></div>`;
    statusEl.textContent = `Same ${n}-element ${$("#sortInput").selectedOptions[0].text.toLowerCase()} array for all six. For reference n² ≈ ${n * n}, n·log₂n ≈ ${Math.round(n * Math.log2(n))}.`;
  }
  $$("#algoButtons button").forEach(b => b.addEventListener("click", () => {
    vz.algo = b.dataset.algo;
    $$("#algoButtons button").forEach(x => x.classList.toggle("active", x === b));
    clearInterval(vz.timer); drawBars(barsEl, vz.base);
    statusEl.textContent = `${ALGOS[vz.algo].name} sort selected. Press Sort.`;
  }));
  $("#sortRun").addEventListener("click", runSort);
  $("#sortShuffle").addEventListener("click", newArray);
  $("#sortAll").addEventListener("click", compareAll);
  ["#sortSize", "#sortInput"].forEach(s => $(s).addEventListener("change", newArray));
  newArray();

  // ---------- visualizer B: stability ----------
  function makeCards() {
    const pool = [1, 1, 1, 2, 2, 2, 3, 3, 3];                 // each value at most 3 times → tags a, b, c
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); swapA(pool, i, j); }
    const seen = {};
    return pool.slice(0, 8).map(v => ({ v, t: (seen[v] = (seen[v] ?? -1) + 1) }));
  }
  const insertionCards = cs => { const a = [...cs]; for (let i = 1; i < a.length; i++) for (let j = i; j > 0 && a[j - 1].v > a[j].v; j--) swapA(a, j - 1, j); return a; };
  const selectionCards = cs => { const a = [...cs]; for (let i = 0; i < a.length - 1; i++) { let m = i; for (let j = i + 1; j < a.length; j++) if (a[j].v < a[m].v) m = j; swapA(a, i, m); } return a; };
  const isStable = a => a.every((c, i) => i === 0 || a[i - 1].v !== c.v || a[i - 1].t < c.t);
  function renderStability() {
    let cards, sel;
    for (let tries = 0; tries < 60; tries++) {              // pick an input where selection sort visibly breaks
      cards = makeCards(); sel = selectionCards(cards);
      if (!isStable(sel)) break;
    }
    const rows = [
      ["Original", cards, null],
      ["Insertion sort", insertionCards(cards), true],
      ["Selection sort", sel, null],
      ["JS built-in sort", [...cards].sort((x, y) => x.v - y.v), true]
    ];
    $("#stabRows").innerHTML = rows.map(([label, arr]) => {
      const stable = label === "Original" ? null : isStable(arr);
      const flagged = new Set();
      if (stable === false) arr.forEach((c, i) => { if (i && arr[i - 1].v === c.v && arr[i - 1].t > c.t) { flagged.add(i); flagged.add(i - 1); } });
      return `<div class="stab-row"><div class="lbl">${label}${stable === null ? "" : `<small class="${stable ? "yes" : "no"}">${stable ? "✔ order of equals kept" : "✘ equals swapped order"}</small>`}</div>
        <div class="cards">${arr.map((c, i) => `<div class="scard t${c.t}${flagged.has(i) ? " flag" : ""}">${c.v}<sub>${"abc"[c.t]}</sub></div>`).join("")}</div></div>`;
    }).join("");
  }
  $("#stabShuffle").addEventListener("click", renderStability);
  renderStability();

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
