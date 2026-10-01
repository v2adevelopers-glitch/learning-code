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
    cpp: "int|long|bool|char|void|auto|return|for|while|if|else|continue|break|true|false|vector|class|public|private|const|stack|double|priority_queue|map|pair|string",
    java: "int|long|boolean|char|void|return|for|while|if|else|continue|break|true|false|new|class|public|private|final|static|double|null",
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

  // ---------- interval timeline ----------
  const T = 24;  // timeline spans hours 0..24
  function renderTimeline(el, items, state, cut) {
    let html = `<div class="tl-axis">${[0, 4, 8, 12, 16, 20, 24].map(h => `<span style="left:${(h / T) * 100}%">${h}</span>`).join("")}</div>`;
    items.forEach(it => {
      const cls = (state && state[it.name]) || "";
      html += `<div class="tl-row"><span class="nm">${it.name}</span><div class="tl-track">` +
        `<div class="tl-bar ${cls}" style="left:${(it.s / T) * 100}%;width:${((it.e - it.s) / T) * 100}%">${it.s}–${it.e}</div>` +
        (cut != null ? `<div class="tl-cut" style="left:${(cut / T) * 100}%"></div>` : "") +
        `</div></div>`;
    });
    el.innerHTML = html;
  }

  const RULES = {
    end: { label: "earliest end", key: (a, b) => a.e - b.e || a.s - b.s },
    start: { label: "earliest start", key: (a, b) => a.s - b.s || a.e - b.e },
    short: { label: "shortest first", key: (a, b) => (a.e - a.s) - (b.e - b.s) || a.s - b.s }
  };
  const overlaps = (a, b) => a.s < b.e && b.s < a.e;   // touching ends are fine

  function scheduleSteps(items, rule) {
    const order = items.slice().sort(RULES[rule].key);
    const chosen = [], state = {}, steps = [];
    steps.push({ order, state: { ...state }, msg: `Sorted by ${RULES[rule].label}. Go top to bottom.` });
    for (const it of order) {
      steps.push({ order, state: { ...state, [it.name]: "cur" }, cut: rule === "end" && chosen.length ? chosen[chosen.length - 1].e : null, msg: `Consider ${it.name} [${it.s}, ${it.e}]` });
      const clash = chosen.find(c => overlaps(c, it));
      if (clash) {
        state[it.name] = "rej";
        steps.push({ order, state: { ...state }, msg: `${it.name} overlaps chosen ${clash.name} → reject` });
      } else {
        chosen.push(it);
        state[it.name] = "sel";
        steps.push({ order, state: { ...state }, cut: rule === "end" ? it.e : null, msg: `${it.name} fits → choose it (${chosen.length} so far)` });
      }
    }
    return { steps, count: chosen.length };
  }

  const PRESET = [
    { name: "A", s: 0, e: 23 }, { name: "B", s: 1, e: 5 }, { name: "C", s: 6, e: 10 },
    { name: "D", s: 11, e: 15 }, { name: "E", s: 16, e: 20 }, { name: "F", s: 4, e: 7 }
  ];

  // ---------- hero animation ----------
  (function hero() {
    const el = $("#heroTimeline"), cap = $("#heroCap");
    const items = [
      { name: "A", s: 0, e: 9 }, { name: "B", s: 1, e: 5 }, { name: "C", s: 6, e: 11 },
      { name: "D", s: 5, e: 8 }, { name: "E", s: 9, e: 15 }, { name: "F", s: 14, e: 22 }, { name: "G", s: 16, e: 20 }
    ];
    const { steps } = scheduleSteps(items, "end");
    let i = 0;
    renderTimeline(el, steps[0].order, steps[0].state);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setInterval(() => {
      i = (i + 1) % (steps.length + 3);
      const s = steps[Math.min(i, steps.length - 1)];
      renderTimeline(el, s.order, s.state, s.cut);
      cap.textContent = i >= steps.length - 1 ? "earliest end → maximum meetings" : s.msg;
    }, 800);
  })();

  // ---------- interval visualizer ----------
  const iv = { items: PRESET.map(x => ({ ...x })), timer: null };
  const tlEl = $("#ivTimeline"), ivStatus = $("#ivStatus");

  function ivShow() { clearInterval(iv.timer); renderTimeline(tlEl, iv.items, {}); }
  function ivRun(rule) {
    clearInterval(iv.timer);
    $$("[data-rule]").forEach(b => b.classList.toggle("active", b.dataset.rule === rule));
    const { steps, count } = scheduleSteps(iv.items, rule);
    const best = scheduleSteps(iv.items, "end").count;
    let k = 0;
    const tick = () => {
      const s = steps[k];
      renderTimeline(tlEl, s.order, s.state, s.cut);
      ivStatus.textContent = s.msg;
      k++;
      if (k >= steps.length) {
        clearInterval(iv.timer);
        ivStatus.textContent = `“${RULES[rule].label}” chose ${count} interval${count === 1 ? "" : "s"}. Maximum possible: ${best}. ` +
          (count === best ? "✔ optimal on this input" : "✘ not optimal — this rule fails here");
      }
    };
    tick();
    iv.timer = setInterval(tick, +$("#ivSpeed").value);
  }
  $$("[data-rule]").forEach(b => b.addEventListener("click", () => ivRun(b.dataset.rule)));
  $("#ivPreset").addEventListener("click", () => {
    iv.items = PRESET.map(x => ({ ...x })); ivShow();
    ivStatus.textContent = "Preset: try all three rules. Earliest start and shortest-first both lose here.";
  });
  $("#ivRandom").addEventListener("click", () => {
    iv.items = "ABCDEFGH".split("").map(name => {
      const s = Math.floor(Math.random() * 21), len = 1 + Math.floor(Math.random() * 8);
      return { name, s, e: Math.min(T, s + len) };
    });
    ivShow(); ivStatus.textContent = "Random intervals. Pick a rule.";
  });
  ivShow();

  // ---------- coin change ----------
  const coinEl = $("#coinResult");
  function parseCoins() {
    return [...new Set($("#coinSet").value.split(/[\s,]+/).map(Number).filter(x => Number.isInteger(x) && x > 0))].sort((a, b) => b - a);
  }
  function greedyCoins(coins, amt) {
    const out = [];
    let left = amt;
    for (const c of coins) while (left >= c) { out.push(c); left -= c; }
    return { out, left };
  }
  function dpCoins(coins, amt) {
    const best = new Array(amt + 1).fill(Infinity), from = new Array(amt + 1).fill(0);
    best[0] = 0;
    for (let a = 1; a <= amt; a++)
      for (const c of coins)
        if (c <= a && best[a - c] + 1 < best[a]) { best[a] = best[a - c] + 1; from[a] = c; }
    if (best[amt] === Infinity) return null;
    const out = [];
    for (let a = amt; a > 0; a -= from[a]) out.push(from[a]);
    return out.sort((x, y) => y - x);
  }
  let coinTimer = null;
  function coinRun() {
    clearInterval(coinTimer);
    const coins = parseCoins();
    const amt = Math.max(1, Math.min(500, Math.floor(+$("#coinAmt").value || 1)));
    $("#coinAmt").value = amt;
    if (!coins.length) { coinEl.innerHTML = `<div class="verdict bad">Enter at least one positive coin value.</div>`; return; }
    const g = greedyCoins(coins, amt), opt = dpCoins(coins, amt);
    const steps = [];
    let left = amt;
    g.out.forEach(c => { steps.push(`${left} − ${c} = ${left - c}`); left -= c; });
    coinEl.innerHTML = `
      <div><span class="tag-lbl bad-lbl">Greedy (largest coin that fits)</span>
        <div class="coins" id="gCoins"></div><p class="small muted" id="gCount"></p>
        <ol class="steps" id="gSteps"></ol></div>
      <div><span class="tag-lbl good-lbl">Optimal (dynamic programming)</span>
        <div class="coins">${opt ? opt.map(c => `<span class="coin opt">${c}</span>`).join("") : ""}</div>
        <p class="small muted">${opt ? `${opt.length} coin${opt.length === 1 ? "" : "s"}` : "impossible with these coins"}</p></div>
      <div class="verdict" id="coinVerdict" hidden></div>`;
    const gc = $("#gCoins"), gs = $("#gSteps");
    let k = 0;
    const finish = () => {
      $("#gCount").textContent = g.left ? `stuck with ${g.left} left over` : `${g.out.length} coin${g.out.length === 1 ? "" : "s"}`;
      const v = $("#coinVerdict");
      v.hidden = false;
      if (!opt) { v.className = "verdict bad"; v.textContent = `${amt} can't be made from {${coins.join(", ")}} at all.`; }
      else if (g.left) { v.className = "verdict bad"; v.textContent = `✘ Greedy got stuck with ${g.left} left, but ${opt.length} coins work. Greedy fails here.`; }
      else if (g.out.length > opt.length) { v.className = "verdict bad"; v.textContent = `✘ Greedy used ${g.out.length} coins, optimal is ${opt.length}. This coin system breaks greedy.`; }
      else { v.className = "verdict ok"; v.textContent = `✔ Greedy is optimal for ${amt} (${opt.length} coins).`; }
    };
    if (!g.out.length) { finish(); return; }
    coinTimer = setInterval(() => {
      gc.insertAdjacentHTML("beforeend", `<span class="coin pop">${g.out[k]}</span>`);
      gs.insertAdjacentHTML("beforeend", `<li>${steps[k]}</li>`);
      k++;
      if (k >= g.out.length) { clearInterval(coinTimer); finish(); }
    }, g.out.length > 12 ? 90 : 260);
  }
  $("#coinRun").addEventListener("click", coinRun);
  $$("[data-coins]").forEach(b => b.addEventListener("click", () => {
    $("#coinSet").value = b.dataset.coins; $("#coinAmt").value = b.dataset.amt; coinRun();
  }));
  coinRun();

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
