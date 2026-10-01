// Question bank for the "Important questions" section.
// Each entry: id, title, difficulty, tags, desc, example, hint, approach, complexity, link, code{cpp,java,js}
window.QUESTIONS = [
  {
    id: "sq-valid-paren",
    title: "Valid Parentheses",
    difficulty: "easy",
    tags: ["Matching"],
    desc: "Given a string of '()[]{}', decide whether every bracket is closed by the same type, in the correct order.",
    example: "\"()[]{}\"  →  true,   \"(]\"  →  false,   \"([)]\"  →  false",
    hint: "The most recent unclosed opener must be closed first — that's a stack.",
    approach: "Push the expected closer for each opener. For a closer, the popped value must match. At the end the stack must be empty.",
    complexity: "Time O(n) · Space O(n)",
    link: "https://leetcode.com/problems/valid-parentheses/",
    code: {
      cpp: `bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(') st.push(')');
        else if (c == '[') st.push(']');
        else if (c == '{') st.push('}');
        else if (st.empty() || st.top() != c) return false;
        else st.pop();
    }
    return st.empty();
}`,
      java: `public boolean isValid(String s) {
    Deque<Character> st = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(') st.push(')');
        else if (c == '[') st.push(']');
        else if (c == '{') st.push('}');
        else if (st.isEmpty() || st.pop() != c) return false;
    }
    return st.isEmpty();
}`,
      js: `function isValid(s) {
    const pair = { "(": ")", "[": "]", "{": "}" };
    const st = [];
    for (const c of s) {
        if (pair[c]) st.push(pair[c]);
        else if (st.pop() !== c) return false;
    }
    return st.length === 0;
}`
    }
  },
  {
    id: "sq-queue-stacks",
    title: "Implement Queue using Stacks",
    difficulty: "easy",
    tags: ["Design", "Amortised"],
    desc: "Implement a FIFO queue (push, pop, peek, empty) using only two stacks.",
    example: "push(1), push(2), peek() → 1, pop() → 1, empty() → false",
    hint: "Push into an 'in' stack. When you need the front, pour 'in' into 'out' — this reverses the order.",
    approach: "Only pour when 'out' is empty. Each element moves from in to out at most once, so every operation is amortised O(1).",
    complexity: "Amortised O(1) per operation · Space O(n)",
    link: "https://leetcode.com/problems/implement-queue-using-stacks/",
    code: {
      cpp: `class MyQueue {
    stack<int> in, out;
    void pour() {
        if (out.empty())
            while (!in.empty()) { out.push(in.top()); in.pop(); }
    }
public:
    void push(int x) { in.push(x); }
    int pop() { pour(); int x = out.top(); out.pop(); return x; }
    int peek() { pour(); return out.top(); }
    bool empty() { return in.empty() && out.empty(); }
};`,
      java: `class MyQueue {
    private final Deque<Integer> in = new ArrayDeque<>(), out = new ArrayDeque<>();
    private void pour() {
        if (out.isEmpty())
            while (!in.isEmpty()) out.push(in.pop());
    }
    public void push(int x) { in.push(x); }
    public int pop() { pour(); return out.pop(); }
    public int peek() { pour(); return out.peek(); }
    public boolean empty() { return in.isEmpty() && out.isEmpty(); }
}`,
      js: `class MyQueue {
    constructor() { this.in = []; this.out = []; }
    pour() {
        if (!this.out.length)
            while (this.in.length) this.out.push(this.in.pop());
    }
    push(x) { this.in.push(x); }
    pop() { this.pour(); return this.out.pop(); }
    peek() { this.pour(); return this.out[this.out.length - 1]; }
    empty() { return !this.in.length && !this.out.length; }
}`
    }
  },
  {
    id: "sq-stack-queues",
    title: "Implement Stack using Queues",
    difficulty: "easy",
    tags: ["Design"],
    desc: "Implement a LIFO stack (push, pop, top, empty) using only queue operations.",
    example: "push(1), push(2), top() → 2, pop() → 2, empty() → false",
    hint: "With one queue: after adding x at the back, rotate the older elements behind it so x is at the front.",
    approach: "push is O(n): enqueue x, then dequeue + enqueue the other size − 1 elements. pop and top read the front in O(1).",
    complexity: "push O(n), pop/top O(1) · Space O(n)",
    link: "https://leetcode.com/problems/implement-stack-using-queues/",
    code: {
      cpp: `class MyStack {
    queue<int> q;
public:
    void push(int x) {
        q.push(x);
        for (int i = 1; i < q.size(); i++) { q.push(q.front()); q.pop(); }
    }
    int pop() { int x = q.front(); q.pop(); return x; }
    int top() { return q.front(); }
    bool empty() { return q.empty(); }
};`,
      java: `class MyStack {
    private final Queue<Integer> q = new ArrayDeque<>();
    public void push(int x) {
        q.offer(x);
        for (int i = 1; i < q.size(); i++) q.offer(q.poll());
    }
    public int pop() { return q.poll(); }
    public int top() { return q.peek(); }
    public boolean empty() { return q.isEmpty(); }
}`,
      js: `class MyStack {
    constructor() { this.q = []; }          // used strictly as a queue: push + shift
    push(x) {
        this.q.push(x);
        for (let i = 1; i < this.q.length; i++) this.q.push(this.q.shift());
    }
    pop() { return this.q.shift(); }
    top() { return this.q[0]; }
    empty() { return this.q.length === 0; }
}`
    }
  },
  {
    id: "sq-baseball",
    title: "Baseball Game",
    difficulty: "easy",
    tags: ["Simulation"],
    desc: "Process operations: an integer adds a score, '+' adds the sum of the last two, 'D' doubles the last, 'C' removes the last. Return the total.",
    example: "[\"5\",\"2\",\"C\",\"D\",\"+\"]  →  30",
    hint: "Every operation only looks at the most recent valid scores — keep them on a stack.",
    approach: "Simulate with a stack, then sum it.",
    complexity: "Time O(n) · Space O(n)",
    link: "https://leetcode.com/problems/baseball-game/",
    code: {
      cpp: `int calPoints(vector<string>& ops) {
    vector<int> st;
    for (auto& op : ops) {
        if (op == "+") st.push_back(st[st.size() - 1] + st[st.size() - 2]);
        else if (op == "D") st.push_back(2 * st.back());
        else if (op == "C") st.pop_back();
        else st.push_back(stoi(op));
    }
    return accumulate(st.begin(), st.end(), 0);
}`,
      java: `public int calPoints(String[] ops) {
    Deque<Integer> st = new ArrayDeque<>();
    for (String op : ops) {
        if (op.equals("+")) { int a = st.pop(), b = st.peek(); st.push(a); st.push(a + b); }
        else if (op.equals("D")) st.push(2 * st.peek());
        else if (op.equals("C")) st.pop();
        else st.push(Integer.parseInt(op));
    }
    int sum = 0;
    for (int x : st) sum += x;
    return sum;
}`,
      js: `function calPoints(ops) {
    const st = [];
    for (const op of ops) {
        if (op === "+") st.push(st[st.length - 1] + st[st.length - 2]);
        else if (op === "D") st.push(2 * st[st.length - 1]);
        else if (op === "C") st.pop();
        else st.push(Number(op));
    }
    return st.reduce((s, x) => s + x, 0);
}`
    }
  },
  {
    id: "sq-backspace",
    title: "Backspace String Compare",
    difficulty: "easy",
    tags: ["Stack", "Two pointers"],
    desc: "'#' is a backspace. Return true if two strings are equal after typing them into empty editors.",
    example: "s = \"ab#c\", t = \"ad#c\"  →  true   (both become \"ac\")",
    hint: "Typing a character pushes it; '#' pops (if anything is there).",
    approach: "Build both results with a stack and compare. (O(1)-space follow-up: walk both strings backwards, counting pending backspaces.)",
    complexity: "Time O(n + m) · Space O(n + m)",
    link: "https://leetcode.com/problems/backspace-string-compare/",
    code: {
      cpp: `string build(const string& s) {
    string st;                         // std::string works as a char stack
    for (char c : s) {
        if (c != '#') st.push_back(c);
        else if (!st.empty()) st.pop_back();
    }
    return st;
}
bool backspaceCompare(string s, string t) { return build(s) == build(t); }`,
      java: `public boolean backspaceCompare(String s, String t) {
    return build(s).equals(build(t));
}
private String build(String s) {
    StringBuilder st = new StringBuilder();   // used as a char stack
    for (char c : s.toCharArray()) {
        if (c != '#') st.append(c);
        else if (st.length() > 0) st.deleteCharAt(st.length() - 1);
    }
    return st.toString();
}`,
      js: `function backspaceCompare(s, t) {
    const build = str => {
        const st = [];
        for (const c of str) {
            if (c !== "#") st.push(c);
            else st.pop();                 // pop on empty is harmless in JS
        }
        return st.join("");
    };
    return build(s) === build(t);
}`
    }
  },
  {
    id: "sq-recent-calls",
    title: "Number of Recent Calls",
    difficulty: "easy",
    tags: ["Queue", "Sliding window"],
    desc: "ping(t) records a request at time t (strictly increasing) and returns how many requests happened in [t − 3000, t].",
    example: "ping(1) → 1, ping(100) → 2, ping(3001) → 3, ping(3002) → 3",
    hint: "Old requests expire from the front in arrival order — a queue.",
    approach: "Enqueue t, dequeue from the front while the front is older than t − 3000, return the size.",
    complexity: "Amortised O(1) per ping · Space O(window)",
    link: "https://leetcode.com/problems/number-of-recent-calls/",
    code: {
      cpp: `class RecentCounter {
    queue<int> q;
public:
    int ping(int t) {
        q.push(t);
        while (q.front() < t - 3000) q.pop();
        return q.size();
    }
};`,
      java: `class RecentCounter {
    private final Queue<Integer> q = new ArrayDeque<>();
    public int ping(int t) {
        q.offer(t);
        while (q.peek() < t - 3000) q.poll();
        return q.size();
    }
}`,
      js: `class RecentCounter {
    constructor() { this.q = []; this.head = 0; }   // head index instead of shift()
    ping(t) {
        this.q.push(t);
        while (this.q[this.head] < t - 3000) this.head++;
        return this.q.length - this.head;
    }
}`
    }
  },
  {
    id: "sq-adjacent-dups",
    title: "Remove All Adjacent Duplicates in String",
    difficulty: "easy",
    tags: ["Matching"],
    desc: "Repeatedly remove two adjacent equal letters until no more can be removed. Return the final string.",
    example: "\"abbaca\"  →  \"ca\"",
    hint: "Each new letter either cancels the letter on top of the stack or is pushed.",
    approach: "Use the result string itself as a stack: if the last char equals c, pop; else push.",
    complexity: "Time O(n) · Space O(n)",
    link: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/",
    code: {
      cpp: `string removeDuplicates(string s) {
    string st;
    for (char c : s) {
        if (!st.empty() && st.back() == c) st.pop_back();
        else st.push_back(c);
    }
    return st;
}`,
      java: `public String removeDuplicates(String s) {
    StringBuilder st = new StringBuilder();
    for (char c : s.toCharArray()) {
        int n = st.length();
        if (n > 0 && st.charAt(n - 1) == c) st.deleteCharAt(n - 1);
        else st.append(c);
    }
    return st.toString();
}`,
      js: `function removeDuplicates(s) {
    const st = [];
    for (const c of s) {
        if (st.length && st[st.length - 1] === c) st.pop();
        else st.push(c);
    }
    return st.join("");
}`
    }
  },
  {
    id: "sq-min-stack",
    title: "Min Stack",
    difficulty: "medium",
    tags: ["Design", "Augmented stack"],
    desc: "Design a stack supporting push, pop, top and getMin, all in O(1).",
    example: "push(-2), push(0), push(-3), getMin() → -3, pop(), top() → 0, getMin() → -2",
    hint: "Store, with each value, the minimum of the stack at the moment it was pushed.",
    approach: "Push pairs (value, min(value, current min)). The top pair always holds the current minimum.",
    complexity: "O(1) per operation · Space O(n)",
    link: "https://leetcode.com/problems/min-stack/",
    code: {
      cpp: `class MinStack {
    stack<pair<int, int>> st;          // (value, min so far)
public:
    void push(int x) { st.push({x, st.empty() ? x : min(x, st.top().second)}); }
    void pop() { st.pop(); }
    int top() { return st.top().first; }
    int getMin() { return st.top().second; }
};`,
      java: `class MinStack {
    private final Deque<int[]> st = new ArrayDeque<>();   // {value, min so far}
    public void push(int x) { st.push(new int[]{x, st.isEmpty() ? x : Math.min(x, st.peek()[1])}); }
    public void pop() { st.pop(); }
    public int top() { return st.peek()[0]; }
    public int getMin() { return st.peek()[1]; }
}`,
      js: `class MinStack {
    constructor() { this.st = []; }        // [value, min so far]
    push(x) {
        const min = this.st.length ? Math.min(x, this.st[this.st.length - 1][1]) : x;
        this.st.push([x, min]);
    }
    pop() { this.st.pop(); }
    top() { return this.st[this.st.length - 1][0]; }
    getMin() { return this.st[this.st.length - 1][1]; }
}`
    }
  },
  {
    id: "sq-rpn",
    title: "Evaluate Reverse Polish Notation",
    difficulty: "medium",
    tags: ["Expression"],
    desc: "Evaluate an expression in postfix notation with + − × ÷ (division truncates toward zero).",
    example: "[\"2\",\"1\",\"+\",\"3\",\"*\"]  →  9   ((2 + 1) × 3)",
    hint: "Numbers wait on a stack; an operator pops the two most recent numbers and pushes the result.",
    approach: "Pop b first, then a, and compute a op b — order matters for − and ÷.",
    complexity: "Time O(n) · Space O(n)",
    link: "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
    code: {
      cpp: `int evalRPN(vector<string>& tokens) {
    stack<long long> st;
    for (auto& t : tokens) {
        if (t == "+" || t == "-" || t == "*" || t == "/") {
            long long b = st.top(); st.pop();
            long long a = st.top(); st.pop();
            if (t == "+") st.push(a + b);
            else if (t == "-") st.push(a - b);
            else if (t == "*") st.push(a * b);
            else st.push(a / b);             // C++ truncates toward zero
        } else st.push(stoll(t));
    }
    return st.top();
}`,
      java: `public int evalRPN(String[] tokens) {
    Deque<Integer> st = new ArrayDeque<>();
    for (String t : tokens) {
        switch (t) {
            case "+": { int b = st.pop(), a = st.pop(); st.push(a + b); break; }
            case "-": { int b = st.pop(), a = st.pop(); st.push(a - b); break; }
            case "*": { int b = st.pop(), a = st.pop(); st.push(a * b); break; }
            case "/": { int b = st.pop(), a = st.pop(); st.push(a / b); break; }
            default: st.push(Integer.parseInt(t));
        }
    }
    return st.pop();
}`,
      js: `function evalRPN(tokens) {
    const st = [];
    const ops = {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        "*": (a, b) => a * b,
        "/": (a, b) => Math.trunc(a / b),   // truncate toward zero, not floor
    };
    for (const t of tokens) {
        if (ops[t]) {
            const b = st.pop(), a = st.pop();
            st.push(ops[t](a, b));
        } else st.push(Number(t));
    }
    return st.pop();
}`
    }
  },
  {
    id: "sq-daily-temps",
    title: "Daily Temperatures",
    difficulty: "medium",
    tags: ["Monotonic stack"],
    desc: "For each day, how many days until a warmer temperature? 0 if none.",
    example: "[73,74,75,71,69,72,76,73]  →  [1,1,4,2,1,1,0,0]",
    hint: "Keep indices of days still waiting for a warmer day; their temperatures are decreasing.",
    approach: "For each day i, pop every waiting day j colder than today and set ans[j] = i − j. Then push i.",
    complexity: "Time O(n) · Space O(n)",
    link: "https://leetcode.com/problems/daily-temperatures/",
    code: {
      cpp: `vector<int> dailyTemperatures(vector<int>& t) {
    vector<int> ans(t.size(), 0);
    stack<int> st;                           // indices, temps decreasing
    for (int i = 0; i < t.size(); i++) {
        while (!st.empty() && t[st.top()] < t[i]) {
            ans[st.top()] = i - st.top();
            st.pop();
        }
        st.push(i);
    }
    return ans;
}`,
      java: `public int[] dailyTemperatures(int[] t) {
    int[] ans = new int[t.length];
    Deque<Integer> st = new ArrayDeque<>();  // indices, temps decreasing
    for (int i = 0; i < t.length; i++) {
        while (!st.isEmpty() && t[st.peek()] < t[i]) {
            int j = st.pop();
            ans[j] = i - j;
        }
        st.push(i);
    }
    return ans;
}`,
      js: `function dailyTemperatures(t) {
    const ans = new Array(t.length).fill(0);
    const st = [];                           // indices, temps decreasing
    for (let i = 0; i < t.length; i++) {
        while (st.length && t[st[st.length - 1]] < t[i]) {
            const j = st.pop();
            ans[j] = i - j;
        }
        st.push(i);
    }
    return ans;
}`
    }
  },
  {
    id: "sq-next-greater-ii",
    title: "Next Greater Element II (circular)",
    difficulty: "medium",
    tags: ["Monotonic stack", "Circular"],
    desc: "In a circular array, return the next greater number for every element (−1 if none).",
    example: "[1,2,1]  →  [2,-1,2]",
    hint: "Simulate the wrap-around by looping twice over the indices (i % n).",
    approach: "Standard next-greater monotonic stack over 2n steps; only push indices during the first pass.",
    complexity: "Time O(n) · Space O(n)",
    link: "https://leetcode.com/problems/next-greater-element-ii/",
    code: {
      cpp: `vector<int> nextGreaterElements(vector<int>& a) {
    int n = a.size();
    vector<int> res(n, -1);
    stack<int> st;
    for (int i = 0; i < 2 * n; i++) {
        int x = a[i % n];
        while (!st.empty() && a[st.top()] < x) { res[st.top()] = x; st.pop(); }
        if (i < n) st.push(i);
    }
    return res;
}`,
      java: `public int[] nextGreaterElements(int[] a) {
    int n = a.length;
    int[] res = new int[n];
    Arrays.fill(res, -1);
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i < 2 * n; i++) {
        int x = a[i % n];
        while (!st.isEmpty() && a[st.peek()] < x) res[st.pop()] = x;
        if (i < n) st.push(i);
    }
    return res;
}`,
      js: `function nextGreaterElements(a) {
    const n = a.length, res = new Array(n).fill(-1), st = [];
    for (let i = 0; i < 2 * n; i++) {
        const x = a[i % n];
        while (st.length && a[st[st.length - 1]] < x) res[st.pop()] = x;
        if (i < n) st.push(i);
    }
    return res;
}`
    }
  },
  {
    id: "sq-stock-span",
    title: "Online Stock Span",
    difficulty: "medium",
    tags: ["Monotonic stack", "Design"],
    desc: "next(price) returns the number of consecutive days (including today) the price was ≤ today's price.",
    example: "100, 80, 60, 70, 60, 75, 85  →  1, 1, 1, 2, 1, 4, 6",
    hint: "Days with a lower price than today can never be the 'blocker' for a future day — merge their spans into today's.",
    approach: "Stack of (price, span). Pop while the top price ≤ today, adding its span. Push (price, total span).",
    complexity: "Amortised O(1) per call · Space O(n)",
    link: "https://leetcode.com/problems/online-stock-span/",
    code: {
      cpp: `class StockSpanner {
    stack<pair<int, int>> st;                // (price, span)
public:
    int next(int price) {
        int span = 1;
        while (!st.empty() && st.top().first <= price) { span += st.top().second; st.pop(); }
        st.push({price, span});
        return span;
    }
};`,
      java: `class StockSpanner {
    private final Deque<int[]> st = new ArrayDeque<>();   // {price, span}
    public int next(int price) {
        int span = 1;
        while (!st.isEmpty() && st.peek()[0] <= price) span += st.pop()[1];
        st.push(new int[]{price, span});
        return span;
    }
}`,
      js: `class StockSpanner {
    constructor() { this.st = []; }          // [price, span]
    next(price) {
        let span = 1;
        while (this.st.length && this.st[this.st.length - 1][0] <= price)
            span += this.st.pop()[1];
        this.st.push([price, span]);
        return span;
    }
}`
    }
  },
  {
    id: "sq-asteroids",
    title: "Asteroid Collision",
    difficulty: "medium",
    tags: ["Simulation"],
    desc: "Positive asteroids move right, negative move left. When they meet, the smaller explodes (both if equal). Return the survivors.",
    example: "[5,10,-5]  →  [5,10],   [10,2,-5]  →  [10]",
    hint: "Only a left-moving asteroid can hit right-moving ones already on the stack.",
    approach: "For a negative asteroid, keep popping smaller positive tops; if equal, both die; if the top is bigger, it dies. Push survivors.",
    complexity: "Time O(n) · Space O(n)",
    link: "https://leetcode.com/problems/asteroid-collision/",
    code: {
      cpp: `vector<int> asteroidCollision(vector<int>& a) {
    vector<int> st;
    for (int x : a) {
        bool alive = true;
        while (alive && x < 0 && !st.empty() && st.back() > 0) {
            if (st.back() < -x) st.pop_back();               // top explodes
            else { if (st.back() == -x) st.pop_back(); alive = false; }
        }
        if (alive) st.push_back(x);
    }
    return st;
}`,
      java: `public int[] asteroidCollision(int[] a) {
    Deque<Integer> st = new ArrayDeque<>();
    for (int x : a) {
        boolean alive = true;
        while (alive && x < 0 && !st.isEmpty() && st.peek() > 0) {
            if (st.peek() < -x) st.pop();                    // top explodes
            else { if (st.peek() == -x) st.pop(); alive = false; }
        }
        if (alive) st.push(x);
    }
    int[] res = new int[st.size()];
    for (int i = res.length - 1; i >= 0; i--) res[i] = st.pop();
    return res;
}`,
      js: `function asteroidCollision(a) {
    const st = [];
    for (const x of a) {
        let alive = true;
        while (alive && x < 0 && st.length && st[st.length - 1] > 0) {
            const top = st[st.length - 1];
            if (top < -x) st.pop();                          // top explodes
            else { if (top === -x) st.pop(); alive = false; }
        }
        if (alive) st.push(x);
    }
    return st;
}`
    }
  },
  {
    id: "sq-decode",
    title: "Decode String",
    difficulty: "medium",
    tags: ["Nested", "Two stacks"],
    desc: "Decode strings like k[encoded], where the encoded part is repeated k times. Brackets may nest.",
    example: "\"3[a2[c]]\"  →  \"accaccacc\"",
    hint: "On '[' save the current string and the repeat count; on ']' restore and append the repeated part.",
    approach: "Keep cur and k. '[' → push (cur, k) and reset. ']' → pop (prev, times), cur = prev + cur × times. Digits build k (may be multi-digit).",
    complexity: "Time O(output length) · Space O(output length)",
    link: "https://leetcode.com/problems/decode-string/",
    code: {
      cpp: `string decodeString(string s) {
    stack<pair<string, int>> st;
    string cur;
    int k = 0;
    for (char c : s) {
        if (isdigit(c)) k = k * 10 + (c - '0');
        else if (c == '[') { st.push({cur, k}); cur = ""; k = 0; }
        else if (c == ']') {
            auto [prev, times] = st.top(); st.pop();
            string rep;
            while (times--) rep += cur;
            cur = prev + rep;
        } else cur += c;
    }
    return cur;
}`,
      java: `public String decodeString(String s) {
    Deque<StringBuilder> strs = new ArrayDeque<>();
    Deque<Integer> counts = new ArrayDeque<>();
    StringBuilder cur = new StringBuilder();
    int k = 0;
    for (char c : s.toCharArray()) {
        if (Character.isDigit(c)) k = k * 10 + (c - '0');
        else if (c == '[') { strs.push(cur); counts.push(k); cur = new StringBuilder(); k = 0; }
        else if (c == ']') {
            StringBuilder prev = strs.pop();
            prev.append(cur.toString().repeat(counts.pop()));
            cur = prev;
        } else cur.append(c);
    }
    return cur.toString();
}`,
      js: `function decodeString(s) {
    const st = [];
    let cur = "", k = 0;
    for (const c of s) {
        if (c >= "0" && c <= "9") k = k * 10 + Number(c);
        else if (c === "[") { st.push([cur, k]); cur = ""; k = 0; }
        else if (c === "]") {
            const [prev, times] = st.pop();
            cur = prev + cur.repeat(times);
        } else cur += c;
    }
    return cur;
}`
    }
  },
  {
    id: "sq-simplify-path",
    title: "Simplify Path",
    difficulty: "medium",
    tags: ["Stack of tokens"],
    desc: "Convert an absolute Unix path to its canonical form (handle '.', '..', and repeated slashes).",
    example: "\"/a/./b/../../c/\"  →  \"/c\"",
    hint: "Split by '/'. Folder names are pushed; '..' pops (if possible); '' and '.' are ignored.",
    approach: "Stack of directory names, then join with '/' and add the leading slash.",
    complexity: "Time O(n) · Space O(n)",
    link: "https://leetcode.com/problems/simplify-path/",
    code: {
      cpp: `string simplifyPath(string path) {
    vector<string> st;
    stringstream ss(path);
    string part;
    while (getline(ss, part, '/')) {
        if (part == "" || part == ".") continue;
        if (part == "..") { if (!st.empty()) st.pop_back(); }
        else st.push_back(part);
    }
    string res;
    for (auto& p : st) res += "/" + p;
    return res.empty() ? "/" : res;
}`,
      java: `public String simplifyPath(String path) {
    Deque<String> st = new ArrayDeque<>();
    for (String part : path.split("/")) {
        if (part.isEmpty() || part.equals(".")) continue;
        if (part.equals("..")) { if (!st.isEmpty()) st.pop(); }
        else st.push(part);
    }
    StringBuilder res = new StringBuilder();
    while (!st.isEmpty()) res.append("/").append(st.pollLast());   // bottom first
    return res.length() == 0 ? "/" : res.toString();
}`,
      js: `function simplifyPath(path) {
    const st = [];
    for (const part of path.split("/")) {
        if (part === "" || part === ".") continue;
        if (part === "..") st.pop();
        else st.push(part);
    }
    return "/" + st.join("/");
}`
    }
  },
  {
    id: "sq-circular-queue",
    title: "Design Circular Queue",
    difficulty: "medium",
    tags: ["Ring buffer", "Design"],
    desc: "Implement a fixed-size circular queue: enQueue, deQueue, Front, Rear, isEmpty, isFull.",
    example: "k = 3: enQueue 1,2,3 → true; enQueue 4 → false; Rear → 3; deQueue → true; enQueue 4 → true; Rear → 4",
    hint: "Track head and size. Tail index = (head + size) % k. Rear = (head + size − 1) % k.",
    approach: "All operations are index arithmetic on a fixed array. Keeping size avoids the 'full vs empty' ambiguity.",
    complexity: "O(1) per operation · Space O(k)",
    link: "https://leetcode.com/problems/design-circular-queue/",
    code: {
      cpp: `class MyCircularQueue {
    vector<int> a; int head = 0, size = 0;
public:
    MyCircularQueue(int k) : a(k) {}
    bool enQueue(int x) {
        if (isFull()) return false;
        a[(head + size) % a.size()] = x; size++;
        return true;
    }
    bool deQueue() {
        if (isEmpty()) return false;
        head = (head + 1) % a.size(); size--;
        return true;
    }
    int Front() { return isEmpty() ? -1 : a[head]; }
    int Rear() { return isEmpty() ? -1 : a[(head + size - 1) % a.size()]; }
    bool isEmpty() { return size == 0; }
    bool isFull() { return size == a.size(); }
};`,
      java: `class MyCircularQueue {
    private final int[] a; private int head = 0, size = 0;
    public MyCircularQueue(int k) { a = new int[k]; }
    public boolean enQueue(int x) {
        if (isFull()) return false;
        a[(head + size) % a.length] = x; size++;
        return true;
    }
    public boolean deQueue() {
        if (isEmpty()) return false;
        head = (head + 1) % a.length; size--;
        return true;
    }
    public int Front() { return isEmpty() ? -1 : a[head]; }
    public int Rear() { return isEmpty() ? -1 : a[(head + size - 1) % a.length]; }
    public boolean isEmpty() { return size == 0; }
    public boolean isFull() { return size == a.length; }
}`,
      js: `class MyCircularQueue {
    constructor(k) { this.a = new Array(k); this.head = 0; this.size = 0; }
    enQueue(x) {
        if (this.isFull()) return false;
        this.a[(this.head + this.size) % this.a.length] = x;
        this.size++;
        return true;
    }
    deQueue() {
        if (this.isEmpty()) return false;
        this.head = (this.head + 1) % this.a.length;
        this.size--;
        return true;
    }
    Front() { return this.isEmpty() ? -1 : this.a[this.head]; }
    Rear() { return this.isEmpty() ? -1 : this.a[(this.head + this.size - 1) % this.a.length]; }
    isEmpty() { return this.size === 0; }
    isFull() { return this.size === this.a.length; }
}`
    }
  },
  {
    id: "sq-rotting",
    title: "Rotting Oranges",
    difficulty: "medium",
    tags: ["BFS", "Multi-source"],
    desc: "Grid: 0 empty, 1 fresh, 2 rotten. Each minute, rotten oranges rot their 4 neighbours. Minutes until none are fresh, or −1.",
    example: "[[2,1,1],[1,1,0],[0,1,1]]  →  4",
    hint: "Start a BFS from ALL rotten oranges at once. Each BFS layer is one minute.",
    approach: "Queue every rotten cell and count fresh ones. Process layer by layer, rotting fresh neighbours. If fresh remain at the end, return −1.",
    complexity: "Time O(R·C) · Space O(R·C)",
    link: "https://leetcode.com/problems/rotting-oranges/",
    code: {
      cpp: `int orangesRotting(vector<vector<int>>& g) {
    int R = g.size(), C = g[0].size(), fresh = 0, minutes = 0;
    queue<pair<int, int>> q;
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++) {
            if (g[i][j] == 2) q.push({i, j});
            else if (g[i][j] == 1) fresh++;
        }
    int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
    while (!q.empty() && fresh > 0) {
        for (int sz = q.size(); sz > 0; sz--) {          // one minute
            auto [r, c] = q.front(); q.pop();
            for (int d = 0; d < 4; d++) {
                int nr = r + dr[d], nc = c + dc[d];
                if (nr >= 0 && nr < R && nc >= 0 && nc < C && g[nr][nc] == 1) {
                    g[nr][nc] = 2; fresh--; q.push({nr, nc});
                }
            }
        }
        minutes++;
    }
    return fresh == 0 ? minutes : -1;
}`,
      java: `public int orangesRotting(int[][] g) {
    int R = g.length, C = g[0].length, fresh = 0, minutes = 0;
    Queue<int[]> q = new ArrayDeque<>();
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++) {
            if (g[i][j] == 2) q.offer(new int[]{i, j});
            else if (g[i][j] == 1) fresh++;
        }
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    while (!q.isEmpty() && fresh > 0) {
        for (int sz = q.size(); sz > 0; sz--) {          // one minute
            int[] cell = q.poll();
            for (int[] d : dirs) {
                int nr = cell[0] + d[0], nc = cell[1] + d[1];
                if (nr >= 0 && nr < R && nc >= 0 && nc < C && g[nr][nc] == 1) {
                    g[nr][nc] = 2; fresh--; q.offer(new int[]{nr, nc});
                }
            }
        }
        minutes++;
    }
    return fresh == 0 ? minutes : -1;
}`,
      js: `function orangesRotting(g) {
    const R = g.length, C = g[0].length;
    let fresh = 0, minutes = 0, layer = [];
    for (let i = 0; i < R; i++)
        for (let j = 0; j < C; j++) {
            if (g[i][j] === 2) layer.push([i, j]);
            else if (g[i][j] === 1) fresh++;
        }
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (layer.length && fresh > 0) {
        const next = [];                                  // one minute = one BFS layer
        for (const [r, c] of layer)
            for (const [dr, dc] of dirs) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < R && nc >= 0 && nc < C && g[nr][nc] === 1) {
                    g[nr][nc] = 2; fresh--; next.push([nr, nc]);
                }
            }
        layer = next;
        minutes++;
    }
    return fresh === 0 ? minutes : -1;
}`
    }
  },
  {
    id: "sq-histogram",
    title: "Largest Rectangle in Histogram",
    difficulty: "hard",
    tags: ["Monotonic stack"],
    desc: "Given bar heights (width 1 each), return the area of the largest rectangle in the histogram.",
    example: "[2,1,5,6,2,3]  →  10   (bars 5 and 6, width 2)",
    hint: "For each bar, the widest rectangle of its height stretches to the nearest shorter bar on each side.",
    approach: "Keep an increasing stack of indices. When a shorter bar arrives, pop: the popped bar's right limit is i, its left limit is the new top. Add a sentinel 0 at the end to flush.",
    complexity: "Time O(n) · Space O(n)",
    link: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    code: {
      cpp: `int largestRectangleArea(vector<int>& h) {
    stack<int> st;                           // indices, heights increasing
    int best = 0, n = h.size();
    for (int i = 0; i <= n; i++) {
        int cur = (i == n) ? 0 : h[i];       // sentinel flushes the stack
        while (!st.empty() && h[st.top()] >= cur) {
            int height = h[st.top()]; st.pop();
            int width = st.empty() ? i : i - st.top() - 1;
            best = max(best, height * width);
        }
        st.push(i);
    }
    return best;
}`,
      java: `public int largestRectangleArea(int[] h) {
    Deque<Integer> st = new ArrayDeque<>();  // indices, heights increasing
    int best = 0, n = h.length;
    for (int i = 0; i <= n; i++) {
        int cur = (i == n) ? 0 : h[i];       // sentinel flushes the stack
        while (!st.isEmpty() && h[st.peek()] >= cur) {
            int height = h[st.pop()];
            int width = st.isEmpty() ? i : i - st.peek() - 1;
            best = Math.max(best, height * width);
        }
        st.push(i);
    }
    return best;
}`,
      js: `function largestRectangleArea(h) {
    const st = [];                           // indices, heights increasing
    let best = 0;
    for (let i = 0; i <= h.length; i++) {
        const cur = i === h.length ? 0 : h[i];   // sentinel flushes the stack
        while (st.length && h[st[st.length - 1]] >= cur) {
            const height = h[st.pop()];
            const width = st.length ? i - st[st.length - 1] - 1 : i;
            best = Math.max(best, height * width);
        }
        st.push(i);
    }
    return best;
}`
    }
  },
  {
    id: "sq-window-max",
    title: "Sliding Window Maximum",
    difficulty: "hard",
    tags: ["Monotonic deque"],
    desc: "Return the maximum of every contiguous window of size k.",
    example: "nums = [1,3,-1,-3,5,3,6,7], k = 3  →  [3,3,5,5,6,7]",
    hint: "A smaller element that arrived earlier than a bigger one can never be a window max again — throw it away.",
    approach: "Deque of indices with decreasing values. Drop the front when it leaves the window; drop smaller values from the back before pushing i. The front is the max.",
    complexity: "Time O(n) · Space O(k)",
    link: "https://leetcode.com/problems/sliding-window-maximum/",
    code: {
      cpp: `vector<int> maxSlidingWindow(vector<int>& a, int k) {
    deque<int> dq;                           // indices, values decreasing
    vector<int> out;
    for (int i = 0; i < a.size(); i++) {
        if (!dq.empty() && dq.front() <= i - k) dq.pop_front();
        while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) out.push_back(a[dq.front()]);
    }
    return out;
}`,
      java: `public int[] maxSlidingWindow(int[] a, int k) {
    Deque<Integer> dq = new ArrayDeque<>();  // indices, values decreasing
    int[] out = new int[a.length - k + 1];
    for (int i = 0; i < a.length; i++) {
        if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();
        while (!dq.isEmpty() && a[dq.peekLast()] <= a[i]) dq.pollLast();
        dq.offerLast(i);
        if (i >= k - 1) out[i - k + 1] = a[dq.peekFirst()];
    }
    return out;
}`,
      js: `function maxSlidingWindow(a, k) {
    const dq = [], out = [];                 // indices, values decreasing
    let head = 0;                            // dq[head] is the front (no shift())
    for (let i = 0; i < a.length; i++) {
        if (head < dq.length && dq[head] <= i - k) head++;
        while (dq.length > head && a[dq[dq.length - 1]] <= a[i]) dq.pop();
        dq.push(i);
        if (i >= k - 1) out.push(a[dq[head]]);
    }
    return out;
}`
    }
  },
  {
    id: "sq-calculator",
    title: "Basic Calculator",
    difficulty: "hard",
    tags: ["Expression", "Nested"],
    desc: "Evaluate a string expression with +, −, parentheses, spaces and non-negative integers (unary minus allowed).",
    example: "\"(1+(4+5+2)-3)+(6+8)\"  →  23",
    hint: "Keep a running result and the sign of the next number. On '(' save (result, sign) on a stack and start fresh.",
    approach: "Digits build num. '+'/'−' commit result += sign × num and set the new sign. '(' pushes result and sign; ')' commits, then result = savedResult + savedSign × result.",
    complexity: "Time O(n) · Space O(n)",
    link: "https://leetcode.com/problems/basic-calculator/",
    code: {
      cpp: `int calculate(string s) {
    stack<long long> st;
    long long result = 0, num = 0;
    int sign = 1;
    for (char c : s) {
        if (isdigit(c)) num = num * 10 + (c - '0');
        else if (c == '+' || c == '-') {
            result += sign * num; num = 0;
            sign = (c == '+') ? 1 : -1;
        } else if (c == '(') {
            st.push(result); st.push(sign);
            result = 0; sign = 1;
        } else if (c == ')') {
            result += sign * num; num = 0;
            long long savedSign = st.top(); st.pop();
            long long savedResult = st.top(); st.pop();
            result = savedResult + savedSign * result;
        }
    }
    return result + sign * num;
}`,
      java: `public int calculate(String s) {
    Deque<Integer> st = new ArrayDeque<>();
    int result = 0, num = 0, sign = 1;
    for (char c : s.toCharArray()) {
        if (Character.isDigit(c)) num = num * 10 + (c - '0');
        else if (c == '+' || c == '-') {
            result += sign * num; num = 0;
            sign = (c == '+') ? 1 : -1;
        } else if (c == '(') {
            st.push(result); st.push(sign);
            result = 0; sign = 1;
        } else if (c == ')') {
            result += sign * num; num = 0;
            int savedSign = st.pop(), savedResult = st.pop();
            result = savedResult + savedSign * result;
        }
    }
    return result + sign * num;
}`,
      js: `function calculate(s) {
    const st = [];
    let result = 0, num = 0, sign = 1;
    for (const c of s) {
        if (c >= "0" && c <= "9") num = num * 10 + Number(c);
        else if (c === "+" || c === "-") {
            result += sign * num; num = 0;
            sign = c === "+" ? 1 : -1;
        } else if (c === "(") {
            st.push(result, sign);
            result = 0; sign = 1;
        } else if (c === ")") {
            result += sign * num; num = 0;
            const savedSign = st.pop(), savedResult = st.pop();
            result = savedResult + savedSign * result;
        }
    }
    return result + sign * num;
}`
    }
  }
];

window.QUIZ = [
  {
    q: "You push 1, 2, 3 onto a stack and then pop once. What is popped?",
    opts: ["1", "2", "3", "It depends on the language"],
    a: 2,
    exp: "A stack is Last In, First Out — the most recently pushed value (3) comes out first."
  },
  {
    q: "You enqueue 1, 2, 3 into a queue and then dequeue once. What comes out?",
    opts: ["1", "2", "3", "Nothing"],
    a: 0,
    exp: "A queue is First In, First Out — the earliest value (1) leaves first."
  },
  {
    q: "Which structure does BFS use to explore a graph level by level?",
    opts: ["Stack", "Queue", "Priority queue only", "Hash set only"],
    a: 1,
    exp: "The queue guarantees all nodes at distance d are processed before any at distance d + 1. DFS uses a stack (or recursion)."
  },
  {
    q: "What is the time complexity of array.shift() in JavaScript?",
    opts: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    a: 2,
    exp: "shift() removes index 0 and moves every other element one slot left. Use a head index or a ring buffer for O(1) dequeues."
  },
  {
    q: "A queue built from two stacks has what cost per operation?",
    opts: ["O(n) every time", "Amortised O(1)", "O(log n)", "O(1) worst case"],
    a: 1,
    exp: "Elements are poured from the 'in' stack to the 'out' stack only when 'out' is empty, so each element moves at most once."
  },
  {
    q: "“For each element, find the next greater element to its right.” Best approach?",
    opts: ["Nested loops, O(n²)", "Sort the array", "Monotonic stack, O(n)", "Binary search"],
    a: 2,
    exp: "Keep a decreasing stack of indices; when a bigger value arrives, everything it pops has found its next greater element."
  },
  {
    q: "Sliding window maximum is usually solved with…",
    opts: ["A stack", "A monotonic deque", "A circular queue", "Two queues"],
    a: 1,
    exp: "The deque front is always the current max; indices leave the front when they exit the window and the back when a bigger value arrives."
  },
  {
    q: "In a circular queue of capacity k with head h and size s, where is the next free slot?",
    opts: ["h + s", "(h + s) % k", "(h − s) % k", "s % k"],
    a: 1,
    exp: "Counting s slots from the head and wrapping around the array end gives (h + s) % k."
  }
];
