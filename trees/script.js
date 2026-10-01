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
    cpp: "int|long|bool|char|void|auto|return|for|while|if|else|continue|break|true|false|vector|class|public|private|const|stack|double|priority_queue|queue|deque|map|pair|string|bool|struct|nullptr|new|stack|unordered_map",
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

  // ---------- tree model + SVG rendering ----------
  let nextId = 1;
  const mk = (val, left = null, right = null) => ({ id: nextId++, val, left, right });
  function fromLevel(arr) {                       // LeetCode-style level array → tree
    if (!arr.length || arr[0] === null) return null;
    const root = mk(arr[0]), q = [root];
    let i = 1, h = 0;
    while (i < arr.length) {
      const n = q[h++];
      for (const side of ["left", "right"]) {
        if (i < arr.length && arr[i] !== null) { n[side] = mk(arr[i]); q.push(n[side]); }
        i++;
      }
    }
    return root;
  }
  const heightOf = n => (n ? 1 + Math.max(heightOf(n.left), heightOf(n.right)) : 0);
  const countOf = n => (n ? 1 + countOf(n.left) + countOf(n.right) : 0);
  const inorderVals = (n, out = []) => { if (n) { inorderVals(n.left, out); out.push(n.val); inorderVals(n.right, out); } return out; };

  const SVGNS = "http://www.w3.org/2000/svg";
  function renderTree(svg, root, opts = {}) {
    const cls = opts.cls || {}, ord = opts.ord || {}, pathEdges = opts.pathEdges || new Set();
    const pos = {};
    let x = 0, maxD = 0;
    (function lay(n, d) {                          // x = inorder index, y = depth
      if (!n) return;
      lay(n.left, d + 1);
      pos[n.id] = { x: x++, d };
      maxD = Math.max(maxD, d);
      lay(n.right, d + 1);
    })(root, 0);
    const GX = 46, GY = 62, R = 17;
    const W = Math.max(x * GX, 320), H = (maxD + 1) * GY + 10;
    const off = (W - x * GX) / 2 + GX / 2;
    const px = id => off + pos[id].x * GX, py = id => 26 + pos[id].d * GY;
    svg.setAttribute("viewBox", `0 0 ${W} ${Math.max(H, 120)}`);
    if (svg.classList.contains("big")) svg.style.height = `${Math.min(440, Math.max(180, (maxD + 1) * 62 + 20))}px`;   // grow with depth
    let html = "";
    if (!root) html = `<text class="empty" x="${W / 2}" y="60">empty tree</text>`;
    (function edges(n) {
      if (!n) return;
      for (const c of [n.left, n.right]) if (c) {
        html += `<line class="edge${pathEdges.has(c.id) ? " path" : ""}" x1="${px(n.id)}" y1="${py(n.id)}" x2="${px(c.id)}" y2="${py(c.id)}"/>`;
        edges(c);
      }
    })(root);
    (function nodes(n) {
      if (!n) return;
      html += `<g class="node ${cls[n.id] || ""}"><circle cx="${px(n.id)}" cy="${py(n.id)}" r="${R}"/>` +
        `<text x="${px(n.id)}" y="${py(n.id)}">${n.val}</text>` +
        (ord[n.id] ? `<text class="ord" x="${px(n.id) + R + 2}" y="${py(n.id) - R + 2}">${ord[n.id]}</text>` : "") + `</g>`;
      nodes(n.left); nodes(n.right);
    })(root);
    svg.innerHTML = html;
  }

  function visitOrder(root, kind) {
    const out = [];
    const dfs = n => {
      if (!n) return;
      if (kind === "pre") out.push(n);
      dfs(n.left);
      if (kind === "in") out.push(n);
      dfs(n.right);
      if (kind === "post") out.push(n);
    };
    if (kind === "level") {
      let level = root ? [root] : [];
      while (level.length) { out.push(...level); level = level.flatMap(n => [n.left, n.right].filter(Boolean)); }
    } else dfs(root);
    return out;
  }

  // ---------- hero animation ----------
  (function hero() {
    const svg = $("#heroTree");
    const root = fromLevel([8, 4, 12, 2, 6, 10, 14, 1, 3]);
    const seq = visitOrder(root, "level");
    renderTree(svg, root);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let k = 0;
    setInterval(() => {
      k = (k + 1) % (seq.length + 4);
      const cls = {}, ord = {};
      seq.slice(0, Math.min(k, seq.length)).forEach((n, i) => { cls[n.id] = "seen"; ord[n.id] = i + 1; });
      if (k > 0 && k <= seq.length) cls[seq[k - 1].id] = "cur";
      renderTree(svg, root, { cls, ord });
    }, 700);
  })();

  // ---------- visualizer A: traversals ----------
  const tv = { root: fromLevel([1, 2, 3, 4, 5, 6, 7, null, 8, null, null, 9]), kind: "pre", timer: null };
  const travSvg = $("#travSvg"), travStatus = $("#travStatus");
  const TRAV_NOTE = {
    pre: "node → left → right", in: "left → node → right", post: "left → right → node", level: "top to bottom, left to right, using a queue"
  };
  function randomTree() {
    const n = 7 + Math.floor(Math.random() * 5);
    const vals = [...new Set(Array.from({ length: 40 }, () => 1 + Math.floor(Math.random() * 99)))].slice(0, n);
    const root = mk(vals[0]);
    for (const v of vals.slice(1)) {
      const slots = [];                             // free child slots at depth ≤ 3
      (function free(x, d) {
        if (!x || d >= 3) return;
        for (const side of ["left", "right"]) { if (!x[side]) slots.push([x, side]); else free(x[side], d + 1); }
      })(root, 0);
      const [parent, side] = slots[Math.floor(Math.random() * slots.length)];
      parent[side] = mk(v);
    }
    return root;
  }
  function runTraversal() {
    clearInterval(tv.timer);
    const seq = visitOrder(tv.root, tv.kind);
    let k = 0;
    const tick = () => {
      k++;
      const cls = {}, ord = {};
      seq.slice(0, k).forEach((n, i) => { cls[n.id] = "seen"; ord[n.id] = i + 1; });
      if (k <= seq.length) cls[seq[k - 1].id] = "cur";
      renderTree(travSvg, tv.root, { cls, ord });
      travStatus.textContent = `${tv.kind === "level" ? "Level order" : tv.kind[0].toUpperCase() + tv.kind.slice(1) + "order"} (${TRAV_NOTE[tv.kind]}): [${seq.slice(0, k).map(n => n.val).join(", ")}]`;
      if (k >= seq.length) clearInterval(tv.timer);
    };
    tick();
    tv.timer = setInterval(tick, +$("#travSpeed").value);
  }
  $$("[data-trav]").forEach(b => b.addEventListener("click", () => {
    tv.kind = b.dataset.trav;
    $$("[data-trav]").forEach(x => x.classList.toggle("active", x === b));
    runTraversal();
  }));
  $("#travRandom").addEventListener("click", () => {
    clearInterval(tv.timer); tv.root = randomTree(); renderTree(travSvg, tv.root);
    travStatus.textContent = "New random tree. Pick a traversal.";
  });
  renderTree(travSvg, tv.root);

  // ---------- visualizer B: BST playground ----------
  const bst = { root: null, busy: false, timer: null };
  const bstSvg = $("#bstSvg"), bstStatus = $("#bstStatus");
  function bstInsertRaw(x) {
    if (!bst.root) { bst.root = mk(x); return bst.root; }
    let n = bst.root;
    while (true) {
      if (x === n.val) return null;
      const side = x < n.val ? "left" : "right";
      if (!n[side]) { n[side] = mk(x); return n[side]; }
      n = n[side];
    }
  }
  function updateInfo() {
    $("#bstH").textContent = Math.max(0, heightOf(bst.root) - 1) + " edges";
    $("#bstN").textContent = countOf(bst.root);
    const ino = inorderVals(bst.root);
    $("#bstIn").textContent = ino.length ? ino.join(", ") : "—";
  }
  const showBST = (opts) => { renderTree(bstSvg, bst.root, opts); updateInfo(); };
  function pathTo(x) {                            // nodes visited while searching for x
    const path = [];
    let n = bst.root;
    while (n) { path.push(n); if (x === n.val) break; n = x < n.val ? n.left : n.right; }
    return path;
  }
  function animatePath(path, x, done) {
    bst.busy = true;
    let k = 0;
    const msgs = [];
    const tick = () => {
      if (k >= path.length) { clearInterval(bst.timer); bst.busy = false; done(); return; }
      const n = path[k];
      const cls = {}, edges = new Set();
      path.slice(0, k + 1).forEach(p => { cls[p.id] = "path"; edges.add(p.id); });
      cls[n.id] = "cur";
      msgs.push(x === n.val ? `${x} = ${n.val}` : x < n.val ? `${x} < ${n.val} → left` : `${x} > ${n.val} → right`);
      showBST({ cls, pathEdges: edges });
      bstStatus.textContent = msgs.join(" · ");
      k++;
    };
    tick();
    bst.timer = setInterval(tick, 550);
  }
  function bstOp(op) {
    if (bst.busy) return;
    const x = Math.floor(+$("#bstVal").value);
    if (!Number.isFinite(x)) { bstStatus.textContent = "Enter a number first."; return; }
    const path = pathTo(x);
    const found = path.length && path[path.length - 1].val === x ? path[path.length - 1] : null;
    const steps = `${path.length} comparison${path.length === 1 ? "" : "s"}`;
    if (op === "insert") {
      if (countOf(bst.root) >= 15 && !found) { bstStatus.textContent = "The playground holds up to 15 nodes — delete one or clear."; return; }
      animatePath(path, x, () => {
        if (found) { showBST({ cls: { [found.id]: "found" } }); bstStatus.textContent += ` — ${x} is already in the tree (duplicates ignored).`; return; }
        const nn = bstInsertRaw(x);
        showBST({ cls: { [nn.id]: "new" } });
        bstStatus.textContent += ` — inserted ${x} as a new leaf (${steps}).`;
        $("#bstVal").value = 1 + Math.floor(Math.random() * 99);
      });
    } else if (op === "search") {
      animatePath(path, x, () => {
        if (found) { showBST({ cls: { [found.id]: "found" } }); bstStatus.textContent += ` — found ${x} after ${steps}.`; }
        else { showBST({}); bstStatus.textContent += ` — hit null: ${x} is not in the tree (${steps}).`; }
      });
    } else if (op === "delete") {
      animatePath(path, x, () => {
        if (!found) { showBST({}); bstStatus.textContent += ` — ${x} is not in the tree.`; return; }
        const kids = (found.left ? 1 : 0) + (found.right ? 1 : 0);
        if (kids < 2) {
          showBST({ cls: { [found.id]: "gone" } });
          bstStatus.textContent += kids === 0 ? ` — leaf: just remove it.` : ` — one child: the child takes its place.`;
          setTimeout(() => {
            const child = found.left || found.right;
            if (bst.root === found) bst.root = child;
            else { const parent = path[path.length - 2]; parent[parent.left === found ? "left" : "right"] = child; }
            showBST({});
          }, 700);
        } else {
          let parent = found, s = found.right;
          while (s.left) { parent = s; s = s.left; }
          showBST({ cls: { [found.id]: "gone", [s.id]: "found" } });
          bstStatus.textContent += ` — two children: copy the inorder successor ${s.val} (min of the right subtree), then delete it.`;
          setTimeout(() => {
            found.val = s.val;
            if (parent === found) parent.right = s.right; else parent.left = s.right;
            showBST({ cls: { [found.id]: "found" } });
          }, 900);
        }
      });
    }
  }
  $$("[data-bst]").forEach(b => b.addEventListener("click", () => {
    $$("[data-bst]").forEach(x => x.classList.toggle("active", x === b));
    bstOp(b.dataset.bst);
  }));
  function randomBST() {
    clearInterval(bst.timer); bst.busy = false; bst.root = null;
    const vals = [...new Set(Array.from({ length: 30 }, () => 1 + Math.floor(Math.random() * 99)))].slice(0, 9);
    vals.forEach(bstInsertRaw);
    showBST({});
    bstStatus.textContent = `Random BST from inserting ${vals.join(", ")}. Inorder (below) is always sorted.`;
  }
  $("#bstRandom").addEventListener("click", randomBST);
  $("#bstSorted").addEventListener("click", () => {
    clearInterval(bst.timer); bst.busy = false; bst.root = null;
    for (let v = 1; v <= 7; v++) bstInsertRaw(v);
    showBST({});
    bstStatus.textContent = "Inserting sorted values makes every node go right: the BST degrades into a linked list (height 6 for 7 nodes). Balanced BSTs (AVL, red-black) prevent this.";
  });
  $("#bstClear").addEventListener("click", () => {
    clearInterval(bst.timer); bst.busy = false; bst.root = null; showBST({}); bstStatus.textContent = "Empty tree. Insert some values.";
  });
  [50, 30, 70, 20, 40, 60, 80].forEach(bstInsertRaw);
  showBST({});

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
