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
    cpp: "int|long|bool|char|void|auto|return|for|while|if|else|continue|break|true|false|vector|class|public|private|const|stack|double",
    java: "int|long|boolean|char|void|return|for|while|if|else|continue|break|true|false|new|class|public|private|final|static|double",
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

  // ---------- binary search step generator ----------
  // Returns snapshots {lo, hi, mid, msg, result?} for the chosen mode.
  function bsSteps(a, t, mode) {
    const steps = [];
    if (mode === "exact") {
      let lo = 0, hi = a.length - 1;
      while (lo <= hi) {
        const mid = lo + Math.floor((hi - lo) / 2);
        if (a[mid] === t) {
          steps.push({ lo, hi, mid, msg: `a[${mid}] = ${a[mid]} == ${t} → found at index ${mid}`, result: mid });
          return steps;
        }
        if (a[mid] < t) {
          steps.push({ lo, hi, mid, msg: `a[${mid}] = ${a[mid]} < ${t} → lo = mid + 1 = ${mid + 1}` });
          lo = mid + 1;
        } else {
          steps.push({ lo, hi, mid, msg: `a[${mid}] = ${a[mid]} > ${t} → hi = mid − 1 = ${mid - 1}` });
          hi = mid - 1;
        }
      }
      steps.push({ lo, hi, mid: -1, msg: `lo (${lo}) > hi (${hi}) → range empty, return −1`, result: -1 });
      return steps;
    }
    const strict = mode === "upper";
    const sym = strict ? ">" : "≥";
    let lo = 0, hi = a.length;
    while (lo < hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      const ok = strict ? a[mid] > t : a[mid] >= t;
      if (ok) {
        steps.push({ lo, hi, mid, msg: `a[${mid}] = ${a[mid]} ${sym} ${t} ✓ → hi = mid = ${mid}` });
        hi = mid;
      } else {
        steps.push({ lo, hi, mid, msg: `a[${mid}] = ${a[mid]} ${sym} ${t} ✗ → lo = mid + 1 = ${mid + 1}` });
        lo = mid + 1;
      }
    }
    steps.push({
      lo, hi, mid: -1, result: lo,
      msg: `lo == hi == ${lo} → first index with a[i] ${sym} ${t} is ${lo}` + (lo === a.length ? " (past the end: no such element)" : "")
    });
    return steps;
  }

  // ---------- hero animation ----------
  (function hero() {
    const el = $("#heroBs"), cap = $("#heroBsCap");
    const a = [3, 8, 12, 15, 21, 26, 30, 37, 41, 48, 52, 60, 67, 71, 85, 93];
    a.forEach(v => el.appendChild(Object.assign(document.createElement("span"), { textContent: v })));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cells = Array.from(el.children);
    const targets = [67, 12, 85, 41];
    let ti = 0, si = 0, steps = bsSteps(a, targets[0], "exact");
    setInterval(() => {
      if (si > steps.length + 1) {
        ti = (ti + 1) % targets.length; si = 0;
        steps = bsSteps(a, targets[ti], "exact");
      }
      cells.forEach(c => (c.className = ""));
      cap.textContent = `searching for ${targets[ti]}…`;
      const s = steps[Math.min(si, steps.length - 1)];
      if (si > 0) {
        cells.forEach((c, i) => { if (i < s.lo || i > s.hi) c.classList.add("out"); });
        if (s.mid >= 0) cells[s.mid].classList.add(s.result === s.mid ? "found" : "mid");
        if (s.result !== undefined && s.result >= 0) cap.textContent = `found ${targets[ti]} in ${steps.length} step${steps.length === 1 ? "" : "s"}`;
      }
      si++;
    }, 900);
  })();

  // ---------- monotonic strip ----------
  (function strip() {
    const el = $("#monoStrip");
    for (let i = 0; i < 10; i++) {
      const yes = i >= 6;
      el.appendChild(Object.assign(document.createElement("span"), {
        className: (yes ? "yes" : "no") + (i === 6 ? " first" : ""),
        textContent: yes ? "yes" : "no"
      }));
    }
  })();

  // ---------- koko table ----------
  (function koko() {
    const el = $("#koko"), piles = [3, 6, 7, 11], h = 8;
    for (let k = 1; k <= 11; k++) {
      const hours = piles.reduce((s, p) => s + Math.ceil(p / k), 0);
      const ok = hours <= h;
      const d = document.createElement("div");
      d.className = (ok ? "yes" : "no") + (k === 4 ? " first" : "");
      d.innerHTML = `<div class="k">k=${k}</div>${hours}h<br>${ok ? "✓" : "✗"}`;
      el.appendChild(d);
    }
  })();

  // ---------- visualizer ----------
  const viz = { a: [], steps: [], i: 0, timer: null };
  const arrEl = $("#bsArray"), statusEl = $("#bsStatus"), logEl = $("#bsLog");

  function newArray() {
    const n = Math.max(2, Math.min(24, Math.floor(+$("#bsSize").value || 16)));
    $("#bsSize").value = n;
    const dups = $("#bsDups").checked;
    const vals = [];
    let v = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < n; i++) {
      vals.push(v);
      v += dups && Math.random() < 0.35 ? 0 : Math.floor(Math.random() * 7) + 1;
    }
    viz.a = vals;
    $("#bsTarget").value = Math.random() < 0.7 ? vals[Math.floor(Math.random() * n)] : vals[0] + Math.floor(Math.random() * (vals[n - 1] - vals[0] + 1));
    resetViz();
  }

  function stopPlay() { clearInterval(viz.timer); viz.timer = null; $("#bsPlay").textContent = "Play ⏵⏵"; }

  function resetViz() {
    stopPlay();
    const t = Math.floor(+$("#bsTarget").value || 0);
    viz.steps = bsSteps(viz.a, t, $("#bsMode").value);
    viz.i = 0;
    logEl.innerHTML = "";
    render(null);
    const half = $("#bsMode").value !== "exact";
    statusEl.textContent = half
      ? `lo = 0, hi = n = ${viz.a.length}  (half-open range [lo, hi)) — press Step`
      : `lo = 0, hi = n − 1 = ${viz.a.length - 1}  (closed range [lo, hi]) — press Step`;
  }

  function render(s) {
    const half = $("#bsMode").value !== "exact";
    const n = viz.a.length;
    const lo = s ? s.lo : 0, hi = s ? s.hi : (half ? n : n - 1);
    arrEl.innerHTML = "";
    const total = half ? n + 1 : n;
    for (let i = 0; i < total; i++) {
      const d = document.createElement("div");
      const isEnd = i === n;
      d.className = "bs-cell" + (isEnd ? " end" : "");
      d.innerHTML = `<span class="i">${i}</span>${isEnd ? "end" : viz.a[i]}`;
      if (!isEnd) d.classList.add(i >= lo && i <= hi ? "in" : "out");
      if (s && s.mid === i) d.classList.add(s.result === i ? "found" : "mid");
      if (s && s.mid < 0 && s.result === i && !isEnd) d.classList.add("found");
      const ptr = [];
      if (i === lo) ptr.push('<span class="lo">lo</span>');
      if (s && s.mid === i) ptr.push('<span class="md">mid</span>');
      if (i === hi) ptr.push('<span class="hi">hi</span>');
      if (ptr.length) d.insertAdjacentHTML("beforeend", `<div class="bs-ptrs">${ptr.join(" ")}</div>`);
      arrEl.appendChild(d);
    }
  }

  function step() {
    if (viz.i >= viz.steps.length) { stopPlay(); return false; }
    const s = viz.steps[viz.i++];
    render(s);
    statusEl.textContent = `Step ${viz.i}: lo = ${s.lo}, hi = ${s.hi}` + (s.mid >= 0 ? `, mid = ${s.mid}` : "") + `  —  ${s.msg}`;
    logEl.insertAdjacentHTML("beforeend", `<li>${esc(s.msg)}</li>`);
    logEl.scrollTop = logEl.scrollHeight;
    if (viz.i >= viz.steps.length) {
      stopPlay();
      const c = viz.steps.filter(x => x.mid >= 0).length;
      statusEl.textContent += `   ✔ done in ${c} comparison${c === 1 ? "" : "s"}`;
    }
    return true;
  }

  $("#bsStep").addEventListener("click", step);
  $("#bsPlay").addEventListener("click", () => {
    if (viz.timer) { stopPlay(); return; }
    if (viz.i >= viz.steps.length) resetViz();
    $("#bsPlay").textContent = "Pause ⏸";
    viz.timer = setInterval(step, 900);
  });
  $("#bsReset").addEventListener("click", resetViz);
  $("#bsShuffle").addEventListener("click", newArray);
  ["#bsTarget", "#bsMode"].forEach(s => $(s).addEventListener("change", resetViz));
  ["#bsSize", "#bsDups"].forEach(s => $(s).addEventListener("change", newArray));
  newArray();

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
