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

  // ---------- stack / queue rendering ----------
  function renderItems(el, items, opts = {}) {
    if (!items.length) { el.innerHTML = `<span class="sq-empty">empty</span>`; return; }
    el.innerHTML = items.map((v, i) =>
      `<div class="sq-item${opts.hl === i ? " hl" : ""}${opts.out === i ? " out" : ""}">${esc(String(v))}</div>`).join("");
  }

  // ---------- hero animation ----------
  (function hero() {
    const sEl = $("#heroStack"), qEl = $("#heroQueue");
    let st = [1, 2], q = [1, 2], step = 2;                  // start part-filled
    renderItems(sEl, st); renderItems(qEl, q);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setInterval(() => {
      const k = step % 9;
      if (k < 4) { st.push(k + 1); q.push(k + 1); renderItems(sEl, st, { hl: st.length - 1 }); renderItems(qEl, q, { hl: q.length - 1 }); }
      else if (k < 8) {
        renderItems(sEl, st, { out: st.length - 1 }); renderItems(qEl, q, { out: 0 });
        setTimeout(() => { st.pop(); q.shift(); renderItems(sEl, st); renderItems(qEl, q); }, 320);
      }
      step++;
    }, 900);
  })();

  // ---------- visualizer A: basic operations ----------
  const sq = { st: [3, 8, 5], q: [3, 8, 5], busy: false };
  const vStack = $("#vStack"), vQueue = $("#vQueue"), sqStatus = $("#sqStatus");
  const MAXN = 7;
  renderItems(vStack, sq.st); renderItems(vQueue, sq.q);
  const val = () => Math.floor(+$("#sqVal").value || 0);
  const bump = () => { $("#sqVal").value = 1 + Math.floor(Math.random() * 99); };

  $$("[data-sop]").forEach(b => b.addEventListener("click", () => {
    if (sq.busy) return;
    const op = b.dataset.sop, st = sq.st;
    if (op === "push") {
      if (st.length >= MAXN) { sqStatus.textContent = "Stack is full in this demo (7 items). Pop something first."; return; }
      st.push(val()); renderItems(vStack, st, { hl: st.length - 1 });
      sqStatus.textContent = `push(${val()}) → added on top. O(1)`; bump();
    } else if (!st.length) {
      sqStatus.textContent = `${op}() on an empty stack → error! Always check isEmpty() first.`;
    } else if (op === "peek") {
      renderItems(vStack, st, { hl: st.length - 1 });
      sqStatus.textContent = `peek() → ${st[st.length - 1]} (top stays in place)`;
    } else {
      sq.busy = true;
      renderItems(vStack, st, { out: st.length - 1 });
      sqStatus.textContent = `pop() → ${st[st.length - 1]} — the LAST one pushed leaves first (LIFO)`;
      setTimeout(() => { st.pop(); renderItems(vStack, st); sq.busy = false; }, 320);
    }
  }));
  $$("[data-qop]").forEach(b => b.addEventListener("click", () => {
    if (sq.busy) return;
    const op = b.dataset.qop, q = sq.q;
    if (op === "enqueue") {
      if (q.length >= MAXN) { sqStatus.textContent = "Queue is full in this demo (7 items). Dequeue something first."; return; }
      q.push(val()); renderItems(vQueue, q, { hl: q.length - 1 });
      sqStatus.textContent = `enqueue(${val()}) → joins at the back. O(1)`; bump();
    } else if (!q.length) {
      sqStatus.textContent = `${op}() on an empty queue → error! Always check isEmpty() first.`;
    } else if (op === "front") {
      renderItems(vQueue, q, { hl: 0 });
      sqStatus.textContent = `front() → ${q[0]} (stays in the queue)`;
    } else {
      sq.busy = true;
      renderItems(vQueue, q, { out: 0 });
      sqStatus.textContent = `dequeue() → ${q[0]} — the FIRST one in leaves first (FIFO)`;
      setTimeout(() => { q.shift(); renderItems(vQueue, q); sq.busy = false; }, 320);
    }
  }));

  // ---------- visualizer B: balanced brackets ----------
  const OPEN = { "(": ")", "[": "]", "{": "}" }, CLOSE = { ")": "(", "]": "[", "}": "{" };
  function bracketSteps(s) {
    const steps = [], st = [], openAt = [], cls = new Array(s.length).fill("");
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (OPEN[c]) {
        st.push(c); openAt.push(i); cls[i] = "ok";
        steps.push({ i, st: st.slice(), cls: cls.slice(), msg: `'${c}' is an opener → push` });
      } else if (CLOSE[c]) {
        if (!st.length) {
          cls[i] = "bad";
          steps.push({ i, st: st.slice(), cls: cls.slice(), msg: `'${c}' but the stack is empty → NOT balanced`, end: false });
          return steps;
        }
        if (st[st.length - 1] !== CLOSE[c]) {
          cls[i] = "bad";
          steps.push({ i, st: st.slice(), cls: cls.slice(), msg: `'${c}' but the top is '${st[st.length - 1]}' → mismatch, NOT balanced`, end: false });
          return steps;
        }
        st.pop(); openAt.pop(); cls[i] = "ok";
        steps.push({ i, st: st.slice(), cls: cls.slice(), msg: `'${c}' matches top '${CLOSE[c]}' → pop` });
      } else {
        cls[i] = "skip";
        steps.push({ i, st: st.slice(), cls: cls.slice(), msg: `'${c}' is not a bracket → skip` });
      }
    }
    openAt.forEach(j => (cls[j] = "bad"));                 // unmatched openers
    steps.push({ i: -1, st: st.slice(), cls: cls.slice(), end: st.length === 0,
      msg: st.length ? `End of input, but ${st.length} opener(s) left on the stack → NOT balanced` : "End of input and the stack is empty → balanced ✔" });
    return steps;
  }
  let brTimer = null;
  function brRun() {
    clearInterval(brTimer);
    const s = $("#brInput").value.slice(0, 24);
    $("#brInput").value = s;
    const steps = bracketSteps(s);
    const charsEl = $("#brChars"), stEl = $("#brStack"), status = $("#brStatus");
    const draw = step => {
      charsEl.innerHTML = [...s].map((c, i) =>
        `<span class="${step ? (step.i === i ? "cur " : "") + (step.cls[i] || "") : ""}">${esc(c)}</span>`).join("");
      renderItems(stEl, step ? step.st : [], { hl: step && step.st.length ? step.st.length - 1 : -1 });
    };
    draw(null);
    if (!steps.length) { status.textContent = "Empty string → balanced ✔"; return; }
    let k = 0;
    brTimer = setInterval(() => {
      const step = steps[k++];
      draw(step);
      status.textContent = step.msg;
      if (k >= steps.length) clearInterval(brTimer);
    }, 650);
  }
  $("#brRun").addEventListener("click", brRun);
  $$("[data-br]").forEach(b => b.addEventListener("click", () => { $("#brInput").value = b.dataset.br; brRun(); }));
  $("#brChars").innerHTML = [...$("#brInput").value].map(c => `<span>${esc(c)}</span>`).join("");
  renderItems($("#brStack"), []);

  // ---------- visualizer C: next greater element ----------
  let ngArr = [4, 6, 3, 2, 8, 1, 5, 7], ngTimer = null;
  function ngSteps(a) {
    const steps = [], st = [], ans = new Array(a.length).fill(null);
    for (let i = 0; i < a.length; i++) {
      steps.push({ i, st: st.slice(), ans: ans.slice(), msg: `i = ${i}: look at ${a[i]}` });
      while (st.length && a[st[st.length - 1]] < a[i]) {
        const j = st.pop();
        ans[j] = a[i];
        steps.push({ i, st: st.slice(), ans: ans.slice(), set: j, msg: `${a[j]} < ${a[i]} → pop index ${j}: its next greater is ${a[i]}` });
      }
      st.push(i);
      steps.push({ i, st: st.slice(), ans: ans.slice(), msg: `push index ${i} (${a[i]}). Stack values stay decreasing.` });
    }
    st.forEach(j => (ans[j] = -1));
    steps.push({ i: -1, st: st.slice(), ans: ans.slice(), msg: `Done. Indices left on the stack have no greater element → −1. ${a.length} pushes, at most ${a.length} pops: O(n).` });
    return steps;
  }
  function ngDraw(s) {
    const a = ngArr, inSt = new Set(s ? s.st : []);
    $("#ngArr").innerHTML = a.map((v, i) => {
      const cls = s && s.i === i ? "cur" : inSt.has(i) ? "instack" : s && s.ans[i] !== null ? "done" : "";
      return `<div class="${cls}"><small>${i}</small>${v}</div>`;
    }).join("");
    $("#ngAns").innerHTML = a.map((_, i) => {
      const v = s ? s.ans[i] : null;
      return `<div class="${v === null ? "" : v === -1 ? "none set" : "set"}">${v === null ? "?" : v}</div>`;
    }).join("");
    renderItems($("#ngStack"), s ? s.st.map(j => `${a[j]} @${j}`) : [], { hl: s && s.st.length ? s.st.length - 1 : -1 });
  }
  function ngRun() {
    clearInterval(ngTimer);
    const steps = ngSteps(ngArr);
    let k = 0;
    const tick = () => {
      const s = steps[k++];
      ngDraw(s); $("#ngStatus").textContent = s.msg;
      if (k >= steps.length) clearInterval(ngTimer);
    };
    tick();
    ngTimer = setInterval(tick, +$("#ngSpeed").value);
  }
  $("#ngRun").addEventListener("click", ngRun);
  $("#ngNew").addEventListener("click", () => {
    clearInterval(ngTimer);
    ngArr = Array.from({ length: 8 }, () => 1 + Math.floor(Math.random() * 9));
    ngDraw(null); $("#ngStatus").textContent = "New array. Press Run.";
  });
  ngDraw(null);

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
