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
    cpp: "int|long|bool|char|void|auto|return|for|while|if|else|continue|break|true|false|vector|class|public|private|const|stack|struct|new|delete|nullptr|double",
    java: "int|long|boolean|char|void|return|for|while|if|else|continue|break|true|false|new|class|public|private|final|static|null|double",
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

  // ---------- linked list rendering ----------
  // A snapshot: { vals, next[i] (index or -1 for null), ptrs {index|"null": [names]}, cls {index: class}, dummy, msg }
  const linear = n => Array.from({ length: n }, (_, i) => (i + 1 < n ? i + 1 : -1));

  function ptrHtml(names) {
    if (!names || !names.length) return "";
    return `<div class="vn-ptrs">${names.map(p => `<span class="p-${p.replace(/\W.*/, "")}">${p}</span>`).join("")}</div>`;
  }
  function renderLL(el, s) {
    const n = s.vals.length, ptrs = s.ptrs || {}, cls = s.cls || {};
    let html = "";
    const node = (i, label) =>
      `<div class="vn ${cls[i] || ""}"><div class="vn-box">${label}</div>${ptrHtml(ptrs[i])}</div>`;
    if (s.dummy) html += node(-1, "D") + `<div class="vn-arrow">→</div>`;
    if (n > 1 && s.next[0] === -1) html += `<div class="vn">${'<span class="vn-null">null</span>'}${ptrHtml(ptrs.nullL)}</div><div class="vn-arrow back">←</div>`;
    for (let i = 0; i < n; i++) {
      html += node(i, s.vals[i]);
      if (i + 1 < n) {
        const dir = s.next[i] === i + 1 ? "→" : s.next[i + 1] === i ? "←" : "";
        html += `<div class="vn-arrow ${dir === "←" ? "back" : dir ? "" : "none"}">${dir || "·"}</div>`;
      }
    }
    if (n === 0 || s.next[n - 1] === -1 || ptrs.null) {
      const tail = s.next[n - 1] === -1;
      html += (n ? `<div class="vn-arrow ${tail ? "" : "none"}">${tail ? "→" : "·"}</div>` : "") +
        `<div class="vn"><span class="vn-null">null</span>${ptrHtml(ptrs.null)}</div>`;
    }
    el.innerHTML = html;
  }

  // ---------- step generators ----------
  function reverseSnaps(vals, compact) {
    const n = vals.length, next = linear(n), snaps = [];
    let prev = -1, curr = 0;
    const P = (extra = {}) => {
      const p = {};
      const add = (k, name) => (p[k] = (p[k] || []).concat(name));
      add(0, "head");
      if (prev >= 0) add(prev, "prev"); else add("nullL", "prev");
      if (curr >= 0) add(curr, "curr"); else add("null", "curr");
      for (const k in extra) add(k, extra[k]);
      return p;
    };
    const cls = () => { const c = {}; for (let i = 0; i < (curr < 0 ? n : curr); i++) c[i] = "done"; return c; };
    snaps.push({ vals, next: next.slice(), ptrs: P(), cls: cls(), msg: "prev = null, curr = head" });
    while (curr !== -1) {
      const nx = next[curr];
      if (!compact) snaps.push({ vals, next: next.slice(), ptrs: P({ [nx < 0 ? "null" : nx]: "next" }), cls: { ...cls(), [curr]: "hl" }, msg: `next = curr.next (${nx < 0 ? "null" : vals[nx]})` });
      next[curr] = prev;
      snaps.push({ vals, next: next.slice(), ptrs: P({ [nx < 0 ? "null" : nx]: "next" }), cls: { ...cls(), [curr]: "hl" }, msg: `curr.next = prev → ${vals[curr]} now points to ${prev < 0 ? "null" : vals[prev]}` });
      prev = curr; curr = nx;
      if (!compact) snaps.push({ vals, next: next.slice(), ptrs: P(), cls: cls(), msg: `prev = curr, curr = next` });
    }
    const rv = vals.slice().reverse();
    snaps.push({ vals: rv, next: linear(n), ptrs: { 0: ["head"] }, cls: Object.fromEntries(rv.map((_, i) => [i, "done"])), msg: "curr is null → return prev as the new head" });
    return snaps;
  }

  function middleSnaps(vals) {
    const n = vals.length, next = linear(n), snaps = [];
    let slow = 0, fast = 0;
    const P = () => {
      const p = { 0: ["head"] };
      const add = (k, name) => (p[k] = (p[k] || []).concat(name));
      add(slow, "slow"); add(fast < 0 ? "null" : fast, "fast");
      return p;
    };
    snaps.push({ vals, next, ptrs: P(), cls: { [slow]: "hl" }, msg: "slow = fast = head" });
    while (fast >= 0 && fast + 1 < n) {
      slow += 1; fast = fast + 2 < n ? fast + 2 : -1;
      snaps.push({ vals, next, ptrs: P(), cls: { [slow]: "hl" }, msg: `slow → ${vals[slow]} (1 step), fast → ${fast < 0 ? "null" : vals[fast]} (2 steps)` });
    }
    snaps.push({ vals, next, ptrs: P(), cls: { [slow]: "new" }, msg: `fast ${fast < 0 ? "is null" : "has no next"} → stop. Middle = ${vals[slow]}` });
    return snaps;
  }

  function nthSnaps(vals, k) {
    const n = vals.length, next = linear(n), snaps = [];
    if (k < 1 || k > n) return [{ vals, next, ptrs: { 0: ["head"] }, msg: `k must be between 1 and ${n}` }];
    let fast = -1, slow = -1;                               // -1 = dummy
    const P = () => {
      const p = {};
      const add = (key, name) => (p[key] = (p[key] || []).concat(name));
      if (n) add(0, "head");
      add(fast >= n ? "null" : fast, "fast"); add(slow, "slow");
      return p;
    };
    snaps.push({ vals, next, dummy: true, ptrs: P(), msg: `fast = slow = dummy; move fast k + 1 = ${k + 1} steps` });
    for (let i = 0; i <= k; i++) {
      fast++;
      snaps.push({ vals, next, dummy: true, ptrs: P(), msg: `fast step ${i + 1} → ${fast >= n ? "null" : vals[fast]}` });
    }
    while (fast < n) {
      fast++; slow++;
      snaps.push({ vals, next, dummy: true, ptrs: P(), msg: `move both: fast → ${fast >= n ? "null" : vals[fast]}, slow → ${vals[slow]}` });
    }
    const t = slow + 1;
    const nx = next.slice(); if (slow >= 0) nx[slow] = -2;
    snaps.push({ vals, next: nx, dummy: true, ptrs: P(), cls: { [t]: "gone" }, msg: `fast is null → slow.next (${vals[t]}) is k-th from end. slow.next = slow.next.next` });
    const rest = vals.filter((_, i) => i !== t);
    snaps.push({ vals: rest, next: linear(rest.length), ptrs: { 0: ["head"] }, msg: `removed ${vals[t]} — return dummy.next` });
    return snaps;
  }

  function insertSnaps(vals, x, idx) {
    const n = vals.length, snaps = [];
    if (idx < 0 || idx > n) return [{ vals, next: linear(n), ptrs: n ? { 0: ["head"] } : {}, msg: `index must be between 0 and ${n}` }];
    const after = vals.slice(0, idx).concat([x], vals.slice(idx));
    if (idx === 0) {
      const nx = linear(n + 1);
      snaps.push({ vals: after, next: nx, ptrs: { 0: ["new"], ...(n ? { 1: ["head"] } : { null: ["head"] }) }, cls: { 0: "new" }, msg: "node = new Node(" + x + "); node.next = head" });
      snaps.push({ vals: after, next: nx, ptrs: { 0: ["head"] }, cls: { 0: "new" }, msg: "head = node — O(1)" });
      return snaps;
    }
    for (let i = 0; i < idx; i++)
      snaps.push({ vals, next: linear(n), ptrs: { 0: i === 0 ? ["head", "prev"] : ["head"], ...(i ? { [i]: ["prev"] } : {}) }, cls: { [i]: "hl" }, msg: i === 0 ? "prev = head" : `prev = prev.next → ${vals[i]}` });
    const p = idx - 1;
    const nx1 = linear(n + 1); nx1[p] = idx + 1 <= n ? idx + 1 : -2;
    const ptr = { 0: p === 0 ? ["head", "prev"] : ["head"], [idx]: ["new"] }; if (p) ptr[p] = ["prev"];
    snaps.push({ vals: after, next: nx1, ptrs: ptr, cls: { [p]: "hl", [idx]: "new" }, msg: `node.next = prev.next (${idx < n ? vals[idx] : "null"}) — connect first` });
    snaps.push({ vals: after, next: linear(n + 1), ptrs: ptr, cls: { [p]: "hl", [idx]: "new" }, msg: `prev.next = node — inserted ${x} at index ${idx}` });
    return snaps;
  }

  function deleteSnaps(vals, x) {
    const n = vals.length, snaps = [], next = linear(n);
    const t = vals.indexOf(x);
    if (t === 0) {
      snaps.push({ vals, next, ptrs: { 0: ["head"] }, cls: { 0: "gone" }, msg: `head holds ${x} → head = head.next` });
    } else {
      for (let i = 0; i < (t < 0 ? n : t); i++)
        snaps.push({ vals, next, ptrs: { 0: ["head"], [i]: i ? ["prev"] : ["head", "prev"] }, cls: { [i]: "hl" }, msg: `prev = ${vals[i]}; prev.next ${i + 1 < n ? `= ${vals[i + 1]}` : "is null"}${i + 1 === t ? " → match!" : ""}` });
      if (t < 0) { snaps.push({ vals, next, ptrs: n ? { 0: ["head"] } : {}, msg: `${x} not found — list unchanged` }); return snaps; }
      const nx = next.slice(); nx[t - 1] = -2;
      snaps.push({ vals, next: nx, ptrs: { 0: t - 1 ? ["head"] : ["head", "prev"], ...(t - 1 ? { [t - 1]: ["prev"] } : {}) }, cls: { [t - 1]: "hl", [t]: "gone" }, msg: "prev.next = prev.next.next — bypass the node" });
    }
    const rest = vals.filter((_, i) => i !== t);
    snaps.push({ vals: rest, next: linear(rest.length), ptrs: rest.length ? { 0: ["head"] } : { null: ["head"] }, msg: `deleted ${x}` });
    return snaps;
  }

  // ---------- hero animation ----------
  (function hero() {
    const el = $("#heroLL"), cap = $("#heroCap");
    const vals = [1, 2, 3, 4, 5];
    let snaps = reverseSnaps(vals, true), i = 0, flip = false;
    renderLL(el, snaps[0]);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setInterval(() => {
      i++;
      if (i >= snaps.length + 2) {
        flip = !flip; i = 0;
        snaps = reverseSnaps(flip ? vals.slice().reverse() : vals, true);
      }
      const s = snaps[Math.min(i, snaps.length - 1)];
      renderLL(el, s);
      cap.textContent = s.msg;
    }, 1100);
  })();

  // ---------- visualizer ----------
  const ll = { vals: [3, 8, 1, 6, 9], timer: null };
  const stageEl = $("#llStage"), statusEl = $("#llStatus"), logEl = $("#llLog");
  const showList = () => renderLL(stageEl, { vals: ll.vals, next: linear(ll.vals.length), ptrs: ll.vals.length ? { 0: ["head"] } : { null: ["head"] } });

  function play(snaps, finalVals) {
    clearInterval(ll.timer);
    logEl.innerHTML = "";
    let i = 0;
    const tick = () => {
      const s = snaps[i];
      renderLL(stageEl, s);
      statusEl.textContent = `Step ${i + 1}/${snaps.length}: ${s.msg}`;
      logEl.insertAdjacentHTML("beforeend", `<li>${esc(s.msg)}</li>`);
      logEl.scrollTop = logEl.scrollHeight;
      i++;
      if (i >= snaps.length) { clearInterval(ll.timer); ll.timer = null; if (finalVals) ll.vals = finalVals; }
    };
    tick();
    if (i < snaps.length) ll.timer = setInterval(tick, +$("#llSpeed").value);
    else if (finalVals) ll.vals = finalVals;
  }

  $$("#llButtons button").forEach(b => b.addEventListener("click", () => {
    $$("#llButtons button").forEach(x => x.classList.toggle("active", x === b && b.dataset.op !== "random"));
    const x = Math.floor(+$("#llVal").value || 0), k = Math.floor(+$("#llIdx").value || 0);
    const v = ll.vals, op = b.dataset.op;
    const MAX = 9;
    if (["head", "tail", "at"].includes(op) && v.length >= MAX) {
      statusEl.textContent = `The visualizer holds up to ${MAX} nodes — delete one first.`; return;
    }
    if (op === "head") play(insertSnaps(v, x, 0), [x, ...v]);
    if (op === "tail") play(insertSnaps(v, x, v.length), [...v, x]);
    if (op === "at") play(insertSnaps(v, x, k), k >= 0 && k <= v.length ? v.slice(0, k).concat([x], v.slice(k)) : null);
    if (op === "del") { const t = v.indexOf(x); play(deleteSnaps(v, x), t < 0 ? null : v.filter((_, i) => i !== t)); }
    if (op === "reverse") play(reverseSnaps(v, false), v.slice().reverse());
    if (op === "middle") play(v.length ? middleSnaps(v) : [{ vals: v, next: [], ptrs: { null: ["head"] }, msg: "empty list" }]);
    if (op === "nth") play(nthSnaps(v, k), k >= 1 && k <= v.length ? v.filter((_, i) => i !== v.length - k) : null);
    if (op === "random") {
      clearInterval(ll.timer);
      const n = 4 + Math.floor(Math.random() * 4);
      ll.vals = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 20));
      showList(); logEl.innerHTML = ""; statusEl.textContent = "New random list. Pick an operation.";
    }
  }));
  showList();

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
