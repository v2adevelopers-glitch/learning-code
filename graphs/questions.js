// Question bank for the "Important questions" section.
// Each entry: id, title, difficulty, tags, desc, example, hint, approach, complexity, link, code{cpp,java,js}
window.QUESTIONS = [
  {
    id: "gr-path-exists",
    title: "Find if Path Exists in Graph",
    difficulty: "easy",
    tags: ["DFS / BFS"],
    desc: "Given n vertices and an undirected edge list, is there a path from source to destination?",
    example: "n = 3, edges = [[0,1],[1,2],[2,0]], 0 → 2  →  true",
    hint: "Build an adjacency list, then explore from the source with a visited array.",
    approach: "Iterative DFS (stack) from source; return true as soon as destination is reached. Union-Find also works.",
    complexity: "Time O(V + E) · Space O(V + E)",
    link: "https://leetcode.com/problems/find-if-path-exists-in-graph/",
    code: {
      cpp: `bool validPath(int n, vector<vector<int>>& edges, int source, int destination) {
    vector<vector<int>> adj(n);
    for (auto& e : edges) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); }
    vector<bool> seen(n, false);
    stack<int> st;
    st.push(source); seen[source] = true;
    while (!st.empty()) {
        int u = st.top(); st.pop();
        if (u == destination) return true;
        for (int v : adj[u]) if (!seen[v]) { seen[v] = true; st.push(v); }
    }
    return false;
}`,
      java: `public boolean validPath(int n, int[][] edges, int source, int destination) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
    boolean[] seen = new boolean[n];
    Deque<Integer> st = new ArrayDeque<>();
    st.push(source); seen[source] = true;
    while (!st.isEmpty()) {
        int u = st.pop();
        if (u == destination) return true;
        for (int v : adj.get(u)) if (!seen[v]) { seen[v] = true; st.push(v); }
    }
    return false;
}`,
      js: `function validPath(n, edges, source, destination) {
    const adj = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
    const seen = new Array(n).fill(false), st = [source];
    seen[source] = true;
    while (st.length) {
        const u = st.pop();
        if (u === destination) return true;
        for (const v of adj[u]) if (!seen[v]) { seen[v] = true; st.push(v); }
    }
    return false;
}`
    }
  },
  {
    id: "gr-town-judge",
    title: "Find the Town Judge",
    difficulty: "easy",
    tags: ["Degrees"],
    desc: "The judge trusts nobody, and everybody else trusts the judge. Given trust pairs [a, b] (a trusts b) among people 1…n, return the judge or −1.",
    example: "n = 3, trust = [[1,3],[2,3]]  →  3",
    hint: "In a directed graph, the judge has in-degree n − 1 and out-degree 0.",
    approach: "Keep score = in-degree − out-degree; the judge is the person with score n − 1.",
    complexity: "Time O(n + E) · Space O(n)",
    link: "https://leetcode.com/problems/find-the-town-judge/",
    code: {
      cpp: `int findJudge(int n, vector<vector<int>>& trust) {
    vector<int> score(n + 1, 0);
    for (auto& t : trust) { score[t[0]]--; score[t[1]]++; }
    for (int i = 1; i <= n; i++) if (score[i] == n - 1) return i;
    return -1;
}`,
      java: `public int findJudge(int n, int[][] trust) {
    int[] score = new int[n + 1];
    for (int[] t : trust) { score[t[0]]--; score[t[1]]++; }
    for (int i = 1; i <= n; i++) if (score[i] == n - 1) return i;
    return -1;
}`,
      js: `function findJudge(n, trust) {
    const score = new Array(n + 1).fill(0);
    for (const [a, b] of trust) { score[a]--; score[b]++; }
    for (let i = 1; i <= n; i++) if (score[i] === n - 1) return i;
    return -1;
}`
    }
  },
  {
    id: "gr-star-center",
    title: "Find Center of Star Graph",
    difficulty: "easy",
    tags: ["Degrees"],
    desc: "A star graph has one centre connected to every other vertex. Given its edges, return the centre.",
    example: "[[1,2],[2,3],[4,2]]  →  2",
    hint: "The centre appears in every edge — so it's the vertex shared by the first two edges.",
    approach: "Compare the endpoints of edges[0] and edges[1]. O(1) — no need to count all degrees.",
    complexity: "Time O(1) · Space O(1)",
    link: "https://leetcode.com/problems/find-center-of-star-graph/",
    code: {
      cpp: `int findCenter(vector<vector<int>>& e) {
    return (e[0][0] == e[1][0] || e[0][0] == e[1][1]) ? e[0][0] : e[0][1];
}`,
      java: `public int findCenter(int[][] e) {
    return (e[0][0] == e[1][0] || e[0][0] == e[1][1]) ? e[0][0] : e[0][1];
}`,
      js: `function findCenter(e) {
    return e[0][0] === e[1][0] || e[0][0] === e[1][1] ? e[0][0] : e[0][1];
}`
    }
  },
  {
    id: "gr-provinces",
    title: "Number of Provinces",
    difficulty: "medium",
    tags: ["Components", "Adjacency matrix"],
    desc: "isConnected[i][j] = 1 if cities i and j are directly connected. Count the groups of connected cities.",
    example: "[[1,1,0],[1,1,0],[0,0,1]]  →  2",
    hint: "This is counting connected components. Start a DFS from every unvisited city.",
    approach: "Loop over cities; each DFS launched from an unvisited city discovers one whole province. (Union-Find also works.)",
    complexity: "Time O(n²) for the matrix · Space O(n)",
    link: "https://leetcode.com/problems/number-of-provinces/",
    code: {
      cpp: `int findCircleNum(vector<vector<int>>& m) {
    int n = m.size(), provinces = 0;
    vector<bool> seen(n, false);
    for (int s = 0; s < n; s++) {
        if (seen[s]) continue;
        provinces++;
        stack<int> st; st.push(s); seen[s] = true;
        while (!st.empty()) {
            int u = st.top(); st.pop();
            for (int v = 0; v < n; v++)
                if (m[u][v] && !seen[v]) { seen[v] = true; st.push(v); }
        }
    }
    return provinces;
}`,
      java: `public int findCircleNum(int[][] m) {
    int n = m.length, provinces = 0;
    boolean[] seen = new boolean[n];
    for (int s = 0; s < n; s++) {
        if (seen[s]) continue;
        provinces++;
        Deque<Integer> st = new ArrayDeque<>();
        st.push(s); seen[s] = true;
        while (!st.isEmpty()) {
            int u = st.pop();
            for (int v = 0; v < n; v++)
                if (m[u][v] == 1 && !seen[v]) { seen[v] = true; st.push(v); }
        }
    }
    return provinces;
}`,
      js: `function findCircleNum(m) {
    const n = m.length, seen = new Array(n).fill(false);
    let provinces = 0;
    for (let s = 0; s < n; s++) {
        if (seen[s]) continue;
        provinces++;
        const st = [s];
        seen[s] = true;
        while (st.length) {
            const u = st.pop();
            for (let v = 0; v < n; v++)
                if (m[u][v] && !seen[v]) { seen[v] = true; st.push(v); }
        }
    }
    return provinces;
}`
    }
  },
  {
    id: "gr-keys-rooms",
    title: "Keys and Rooms",
    difficulty: "medium",
    tags: ["Reachability"],
    desc: "Room 0 is open. rooms[i] lists the keys found in room i. Can you visit every room?",
    example: "[[1],[2],[3],[]]  →  true,   [[1,3],[3,0,1],[2],[0]]  →  false",
    hint: "Rooms are vertices, keys are directed edges. Is everything reachable from 0?",
    approach: "DFS/BFS from room 0 counting visited rooms; compare with n.",
    complexity: "Time O(V + E) · Space O(V)",
    link: "https://leetcode.com/problems/keys-and-rooms/",
    code: {
      cpp: `bool canVisitAllRooms(vector<vector<int>>& rooms) {
    vector<bool> seen(rooms.size(), false);
    stack<int> st; st.push(0); seen[0] = true;
    int count = 1;
    while (!st.empty()) {
        int u = st.top(); st.pop();
        for (int k : rooms[u]) if (!seen[k]) { seen[k] = true; count++; st.push(k); }
    }
    return count == rooms.size();
}`,
      java: `public boolean canVisitAllRooms(List<List<Integer>> rooms) {
    boolean[] seen = new boolean[rooms.size()];
    Deque<Integer> st = new ArrayDeque<>();
    st.push(0); seen[0] = true;
    int count = 1;
    while (!st.isEmpty()) {
        int u = st.pop();
        for (int k : rooms.get(u)) if (!seen[k]) { seen[k] = true; count++; st.push(k); }
    }
    return count == rooms.size();
}`,
      js: `function canVisitAllRooms(rooms) {
    const seen = new Array(rooms.length).fill(false), st = [0];
    seen[0] = true;
    let count = 1;
    while (st.length) {
        const u = st.pop();
        for (const k of rooms[u]) if (!seen[k]) { seen[k] = true; count++; st.push(k); }
    }
    return count === rooms.length;
}`
    }
  },
  {
    id: "gr-max-island",
    title: "Max Area of Island",
    difficulty: "medium",
    tags: ["Grid DFS"],
    desc: "In a 0/1 grid, an island is a 4-directionally connected group of 1s. Return the largest island's area (0 if none).",
    example: "a grid with islands of sizes 1, 4 and 6  →  6",
    hint: "Each cell is a vertex. From every unvisited land cell, flood-fill and count.",
    approach: "Iterative DFS that sinks visited land (sets it to 0) so it isn't counted twice; track the maximum count.",
    complexity: "Time O(R·C) · Space O(R·C)",
    link: "https://leetcode.com/problems/max-area-of-island/",
    code: {
      cpp: `int maxAreaOfIsland(vector<vector<int>>& g) {
    int R = g.size(), C = g[0].size(), best = 0;
    int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++) {
            if (!g[i][j]) continue;
            int area = 0;
            stack<pair<int, int>> st; st.push({i, j}); g[i][j] = 0;
            while (!st.empty()) {
                auto [r, c] = st.top(); st.pop(); area++;
                for (int d = 0; d < 4; d++) {
                    int nr = r + dr[d], nc = c + dc[d];
                    if (nr >= 0 && nr < R && nc >= 0 && nc < C && g[nr][nc]) { g[nr][nc] = 0; st.push({nr, nc}); }
                }
            }
            best = max(best, area);
        }
    return best;
}`,
      java: `public int maxAreaOfIsland(int[][] g) {
    int R = g.length, C = g[0].length, best = 0;
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++) {
            if (g[i][j] == 0) continue;
            int area = 0;
            Deque<int[]> st = new ArrayDeque<>();
            st.push(new int[]{i, j}); g[i][j] = 0;
            while (!st.isEmpty()) {
                int[] cell = st.pop(); area++;
                for (int[] d : dirs) {
                    int nr = cell[0] + d[0], nc = cell[1] + d[1];
                    if (nr >= 0 && nr < R && nc >= 0 && nc < C && g[nr][nc] == 1) { g[nr][nc] = 0; st.push(new int[]{nr, nc}); }
                }
            }
            best = Math.max(best, area);
        }
    return best;
}`,
      js: `function maxAreaOfIsland(g) {
    const R = g.length, C = g[0].length, dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let best = 0;
    for (let i = 0; i < R; i++)
        for (let j = 0; j < C; j++) {
            if (!g[i][j]) continue;
            let area = 0;
            const st = [[i, j]];
            g[i][j] = 0;
            while (st.length) {
                const [r, c] = st.pop();
                area++;
                for (const [dr, dc] of dirs) {
                    const nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < R && nc >= 0 && nc < C && g[nr][nc]) { g[nr][nc] = 0; st.push([nr, nc]); }
                }
            }
            best = Math.max(best, area);
        }
    return best;
}`
    }
  },
  {
    id: "gr-clone",
    title: "Clone Graph",
    difficulty: "medium",
    tags: ["Hash map", "DFS"],
    desc: "Return a deep copy of a connected undirected graph given one of its nodes (Node has val and neighbors).",
    example: "[[2,4],[1,3],[2,4],[1,3]]  →  an identical, independent graph",
    hint: "Map each original node to its copy. The map doubles as the visited set — it also handles cycles.",
    approach: "DFS: if a node is already in the map, return its copy; otherwise create the copy, store it, then clone each neighbour.",
    complexity: "Time O(V + E) · Space O(V)",
    link: "https://leetcode.com/problems/clone-graph/",
    code: {
      cpp: `// class Node { public: int val; vector<Node*> neighbors; Node(int v) : val(v) {} };
unordered_map<Node*, Node*> copies;
Node* cloneGraph(Node* node) {
    if (!node) return nullptr;
    if (copies.count(node)) return copies[node];
    Node* c = new Node(node->val);
    copies[node] = c;                          // store BEFORE recursing (cycles)
    for (Node* nb : node->neighbors) c->neighbors.push_back(cloneGraph(nb));
    return c;
}`,
      java: `// class Node { int val; List<Node> neighbors = new ArrayList<>(); Node(int v) { val = v; } }
private final Map<Node, Node> copies = new HashMap<>();
public Node cloneGraph(Node node) {
    if (node == null) return null;
    if (copies.containsKey(node)) return copies.get(node);
    Node c = new Node(node.val);
    copies.put(node, c);                       // store BEFORE recursing (cycles)
    for (Node nb : node.neighbors) c.neighbors.add(cloneGraph(nb));
    return c;
}`,
      js: `// class Node { constructor(val, neighbors = []) { this.val = val; this.neighbors = neighbors; } }
function cloneGraph(node) {
    const copies = new Map();
    const clone = n => {
        if (!n) return null;
        if (copies.has(n)) return copies.get(n);
        const c = new Node(n.val);
        copies.set(n, c);                      // store BEFORE recursing (cycles)
        for (const nb of n.neighbors) c.neighbors.push(clone(nb));
        return c;
    };
    return clone(node);
}`
    }
  },
  {
    id: "gr-course",
    title: "Course Schedule",
    difficulty: "medium",
    tags: ["Topological sort", "Cycle detection"],
    desc: "prerequisites[i] = [a, b] means you must take b before a. Can you finish all numCourses courses?",
    example: "2, [[1,0]]  →  true,   2, [[1,0],[0,1]]  →  false",
    hint: "Courses are vertices, prerequisites are directed edges b → a. You can finish iff there is no cycle.",
    approach: "Kahn's algorithm: repeatedly take courses with in-degree 0. If you take all of them, there is no cycle.",
    complexity: "Time O(V + E) · Space O(V + E)",
    link: "https://leetcode.com/problems/course-schedule/",
    code: {
      cpp: `bool canFinish(int n, vector<vector<int>>& pre) {
    vector<vector<int>> adj(n);
    vector<int> indeg(n, 0);
    for (auto& p : pre) { adj[p[1]].push_back(p[0]); indeg[p[0]]++; }
    queue<int> q;
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
    int taken = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop(); taken++;
        for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
    }
    return taken == n;
}`,
      java: `public boolean canFinish(int n, int[][] pre) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    int[] indeg = new int[n];
    for (int[] p : pre) { adj.get(p[1]).add(p[0]); indeg[p[0]]++; }
    Queue<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);
    int taken = 0;
    while (!q.isEmpty()) {
        int u = q.poll(); taken++;
        for (int v : adj.get(u)) if (--indeg[v] == 0) q.offer(v);
    }
    return taken == n;
}`,
      js: `function canFinish(n, pre) {
    const adj = Array.from({ length: n }, () => []), indeg = new Array(n).fill(0);
    for (const [a, b] of pre) { adj[b].push(a); indeg[a]++; }
    const q = [];
    for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
    for (let head = 0; head < q.length; head++)
        for (const v of adj[q[head]]) if (--indeg[v] === 0) q.push(v);
    return q.length === n;                 // every course was dequeued once
}`
    }
  },
  {
    id: "gr-course-ii",
    title: "Course Schedule II",
    difficulty: "medium",
    tags: ["Topological sort"],
    desc: "Return an order in which you can take all courses, or an empty array if impossible.",
    example: "4, [[1,0],[2,0],[3,1],[3,2]]  →  [0,1,2,3] or [0,2,1,3]",
    hint: "Same as Course Schedule — but record the order in which Kahn's algorithm removes vertices.",
    approach: "Kahn's algorithm; the dequeue order is a valid topological order. If it has fewer than n courses, return [].",
    complexity: "Time O(V + E) · Space O(V + E)",
    link: "https://leetcode.com/problems/course-schedule-ii/",
    code: {
      cpp: `vector<int> findOrder(int n, vector<vector<int>>& pre) {
    vector<vector<int>> adj(n);
    vector<int> indeg(n, 0), order;
    for (auto& p : pre) { adj[p[1]].push_back(p[0]); indeg[p[0]]++; }
    queue<int> q;
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
    }
    return order.size() == n ? order : vector<int>{};
}`,
      java: `public int[] findOrder(int n, int[][] pre) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    int[] indeg = new int[n], order = new int[n];
    for (int[] p : pre) { adj.get(p[1]).add(p[0]); indeg[p[0]]++; }
    Queue<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);
    int k = 0;
    while (!q.isEmpty()) {
        int u = q.poll();
        order[k++] = u;
        for (int v : adj.get(u)) if (--indeg[v] == 0) q.offer(v);
    }
    return k == n ? order : new int[0];
}`,
      js: `function findOrder(n, pre) {
    const adj = Array.from({ length: n }, () => []), indeg = new Array(n).fill(0);
    for (const [a, b] of pre) { adj[b].push(a); indeg[a]++; }
    const q = [];
    for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
    for (let head = 0; head < q.length; head++)
        for (const v of adj[q[head]]) if (--indeg[v] === 0) q.push(v);
    return q.length === n ? q : [];        // the queue IS the order
}`
    }
  },
  {
    id: "gr-bipartite",
    title: "Is Graph Bipartite?",
    difficulty: "medium",
    tags: ["BFS colouring"],
    desc: "graph[u] lists u's neighbours (undirected, maybe disconnected). Can the vertices be split into two sets with every edge crossing between them?",
    example: "[[1,3],[0,2],[1,3],[0,2]]  →  true,   [[1,2,3],[0,2],[0,1,3],[0,2]]  →  false",
    hint: "Try to 2-colour: give a vertex colour 0, its neighbours colour 1, theirs 0… A conflict means an odd cycle.",
    approach: "BFS from every uncoloured vertex (the graph may be disconnected). If a neighbour already has your colour, return false.",
    complexity: "Time O(V + E) · Space O(V)",
    link: "https://leetcode.com/problems/is-graph-bipartite/",
    code: {
      cpp: `bool isBipartite(vector<vector<int>>& g) {
    int n = g.size();
    vector<int> color(n, -1);
    for (int s = 0; s < n; s++) {
        if (color[s] != -1) continue;
        queue<int> q; q.push(s); color[s] = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : g[u]) {
                if (color[v] == -1) { color[v] = 1 - color[u]; q.push(v); }
                else if (color[v] == color[u]) return false;
            }
        }
    }
    return true;
}`,
      java: `public boolean isBipartite(int[][] g) {
    int n = g.length;
    int[] color = new int[n];
    Arrays.fill(color, -1);
    for (int s = 0; s < n; s++) {
        if (color[s] != -1) continue;
        Queue<Integer> q = new ArrayDeque<>();
        q.offer(s); color[s] = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : g[u]) {
                if (color[v] == -1) { color[v] = 1 - color[u]; q.offer(v); }
                else if (color[v] == color[u]) return false;
            }
        }
    }
    return true;
}`,
      js: `function isBipartite(g) {
    const color = new Array(g.length).fill(-1);
    for (let s = 0; s < g.length; s++) {
        if (color[s] !== -1) continue;
        const q = [s];
        color[s] = 0;
        for (let head = 0; head < q.length; head++) {
            const u = q[head];
            for (const v of g[u]) {
                if (color[v] === -1) { color[v] = 1 - color[u]; q.push(v); }
                else if (color[v] === color[u]) return false;
            }
        }
    }
    return true;
}`
    }
  },
  {
    id: "gr-pacific",
    title: "Pacific Atlantic Water Flow",
    difficulty: "medium",
    tags: ["Reverse search", "Grid"],
    desc: "Water flows to neighbouring cells of equal or lower height. Pacific touches the top/left edges, Atlantic the bottom/right. Return cells that can reach both.",
    example: "5×5 sample  →  [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
    hint: "Searching from every cell is O((RC)²). Reverse it: start from each ocean and climb UP to cells with height ≥ current.",
    approach: "Two flood fills from the ocean borders (one per ocean); answer = cells reached by both.",
    complexity: "Time O(R·C) · Space O(R·C)",
    link: "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    code: {
      cpp: `vector<vector<int>> pacificAtlantic(vector<vector<int>>& h) {
    int R = h.size(), C = h[0].size();
    auto flood = [&](vector<pair<int, int>> starts) {
        vector<vector<bool>> ok(R, vector<bool>(C, false));
        stack<pair<int, int>> st;
        for (auto [r, c] : starts) if (!ok[r][c]) { ok[r][c] = true; st.push({r, c}); }
        int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        while (!st.empty()) {
            auto [r, c] = st.top(); st.pop();
            for (int d = 0; d < 4; d++) {
                int nr = r + dr[d], nc = c + dc[d];
                if (nr >= 0 && nr < R && nc >= 0 && nc < C && !ok[nr][nc] && h[nr][nc] >= h[r][c]) {
                    ok[nr][nc] = true; st.push({nr, nc});
                }
            }
        }
        return ok;
    };
    vector<pair<int, int>> pac, atl;
    for (int i = 0; i < R; i++) { pac.push_back({i, 0}); atl.push_back({i, C - 1}); }
    for (int j = 0; j < C; j++) { pac.push_back({0, j}); atl.push_back({R - 1, j}); }
    auto P = flood(pac), A = flood(atl);
    vector<vector<int>> res;
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++)
            if (P[i][j] && A[i][j]) res.push_back({i, j});
    return res;
}`,
      java: `public List<List<Integer>> pacificAtlantic(int[][] h) {
    int R = h.length, C = h[0].length;
    boolean[][] P = new boolean[R][C], A = new boolean[R][C];
    Deque<int[]> ps = new ArrayDeque<>(), as = new ArrayDeque<>();
    for (int i = 0; i < R; i++) { mark(P, ps, i, 0); mark(A, as, i, C - 1); }
    for (int j = 0; j < C; j++) { mark(P, ps, 0, j); mark(A, as, R - 1, j); }
    flood(h, P, ps);
    flood(h, A, as);
    List<List<Integer>> res = new ArrayList<>();
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++)
            if (P[i][j] && A[i][j]) res.add(List.of(i, j));
    return res;
}
private void mark(boolean[][] ok, Deque<int[]> st, int r, int c) {
    if (!ok[r][c]) { ok[r][c] = true; st.push(new int[]{r, c}); }
}
private void flood(int[][] h, boolean[][] ok, Deque<int[]> st) {
    int R = h.length, C = h[0].length;
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    while (!st.isEmpty()) {
        int[] cell = st.pop();
        for (int[] d : dirs) {
            int nr = cell[0] + d[0], nc = cell[1] + d[1];
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && !ok[nr][nc] && h[nr][nc] >= h[cell[0]][cell[1]])
                mark(ok, st, nr, nc);
        }
    }
}`,
      js: `function pacificAtlantic(h) {
    const R = h.length, C = h[0].length, dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const flood = starts => {
        const ok = Array.from({ length: R }, () => new Array(C).fill(false)), st = [];
        for (const [r, c] of starts) if (!ok[r][c]) { ok[r][c] = true; st.push([r, c]); }
        while (st.length) {
            const [r, c] = st.pop();
            for (const [dr, dc] of dirs) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < R && nc >= 0 && nc < C && !ok[nr][nc] && h[nr][nc] >= h[r][c]) {
                    ok[nr][nc] = true; st.push([nr, nc]);
                }
            }
        }
        return ok;
    };
    const pac = [], atl = [];
    for (let i = 0; i < R; i++) { pac.push([i, 0]); atl.push([i, C - 1]); }
    for (let j = 0; j < C; j++) { pac.push([0, j]); atl.push([R - 1, j]); }
    const P = flood(pac), A = flood(atl), res = [];
    for (let i = 0; i < R; i++)
        for (let j = 0; j < C; j++)
            if (P[i][j] && A[i][j]) res.push([i, j]);
    return res;
}`
    }
  },
  {
    id: "gr-surrounded",
    title: "Surrounded Regions",
    difficulty: "medium",
    tags: ["Reverse search", "Grid"],
    desc: "Capture every region of 'O' that is completely surrounded by 'X' by flipping it to 'X'. Regions touching the border survive.",
    example: "an 'O' region in the middle becomes 'X'; an 'O' on the edge stays",
    hint: "Finding surrounded regions is hard; finding the ones that escape is easy — they're connected to the border.",
    approach: "Flood-fill from every border 'O', marking it '#'. Then flip remaining 'O' → 'X' and '#' → 'O'.",
    complexity: "Time O(R·C) · Space O(R·C)",
    link: "https://leetcode.com/problems/surrounded-regions/",
    code: {
      cpp: `void solve(vector<vector<char>>& b) {
    int R = b.size(), C = b[0].size();
    stack<pair<int, int>> st;
    for (int i = 0; i < R; i++) for (int j = 0; j < C; j++)
        if ((i == 0 || j == 0 || i == R - 1 || j == C - 1) && b[i][j] == 'O') { b[i][j] = '#'; st.push({i, j}); }
    int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
    while (!st.empty()) {
        auto [r, c] = st.top(); st.pop();
        for (int d = 0; d < 4; d++) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && b[nr][nc] == 'O') { b[nr][nc] = '#'; st.push({nr, nc}); }
        }
    }
    for (auto& row : b) for (char& ch : row) ch = (ch == '#') ? 'O' : 'X';
}`,
      java: `public void solve(char[][] b) {
    int R = b.length, C = b[0].length;
    Deque<int[]> st = new ArrayDeque<>();
    for (int i = 0; i < R; i++) for (int j = 0; j < C; j++)
        if ((i == 0 || j == 0 || i == R - 1 || j == C - 1) && b[i][j] == 'O') { b[i][j] = '#'; st.push(new int[]{i, j}); }
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    while (!st.isEmpty()) {
        int[] cell = st.pop();
        for (int[] d : dirs) {
            int nr = cell[0] + d[0], nc = cell[1] + d[1];
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && b[nr][nc] == 'O') { b[nr][nc] = '#'; st.push(new int[]{nr, nc}); }
        }
    }
    for (char[] row : b) for (int j = 0; j < C; j++) row[j] = row[j] == '#' ? 'O' : 'X';
}`,
      js: `function solve(b) {
    const R = b.length, C = b[0].length, st = [], dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (let i = 0; i < R; i++) for (let j = 0; j < C; j++)
        if ((i === 0 || j === 0 || i === R - 1 || j === C - 1) && b[i][j] === "O") { b[i][j] = "#"; st.push([i, j]); }
    while (st.length) {
        const [r, c] = st.pop();
        for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && b[nr][nc] === "O") { b[nr][nc] = "#"; st.push([nr, nc]); }
        }
    }
    for (const row of b) for (let j = 0; j < C; j++) row[j] = row[j] === "#" ? "O" : "X";
}`
    }
  },
  {
    id: "gr-network-delay",
    title: "Network Delay Time",
    difficulty: "medium",
    tags: ["Dijkstra"],
    desc: "times[i] = [u, v, w]: a signal takes w to go from u to v. Sent from k, how long until all n nodes (1…n) receive it? −1 if some never do.",
    example: "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2  →  2",
    hint: "Single-source shortest paths with non-negative weights → Dijkstra. The answer is the largest of those distances.",
    approach: "n ≤ 100, so the simple O(n²) Dijkstra (pick the closest unsettled node by scanning) is clean and fast — no heap needed. For large sparse graphs use the heap version.",
    complexity: "Time O(n² + E) · Space O(n + E)",
    link: "https://leetcode.com/problems/network-delay-time/",
    code: {
      cpp: `int networkDelayTime(vector<vector<int>>& times, int n, int k) {
    vector<vector<pair<int, int>>> adj(n + 1);
    for (auto& t : times) adj[t[0]].push_back({t[1], t[2]});
    vector<int> dist(n + 1, INT_MAX);
    vector<bool> done(n + 1, false);
    dist[k] = 0;
    for (int iter = 0; iter < n; iter++) {
        int u = -1;
        for (int v = 1; v <= n; v++)                    // closest unsettled node
            if (!done[v] && dist[v] != INT_MAX && (u == -1 || dist[v] < dist[u])) u = v;
        if (u == -1) break;
        done[u] = true;
        for (auto [v, w] : adj[u]) dist[v] = min(dist[v], dist[u] + w);
    }
    int ans = *max_element(dist.begin() + 1, dist.end());
    return ans == INT_MAX ? -1 : ans;
}`,
      java: `public int networkDelayTime(int[][] times, int n, int k) {
    List<List<int[]>> adj = new ArrayList<>();
    for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
    for (int[] t : times) adj.get(t[0]).add(new int[]{t[1], t[2]});
    int[] dist = new int[n + 1];
    Arrays.fill(dist, Integer.MAX_VALUE);
    boolean[] done = new boolean[n + 1];
    dist[k] = 0;
    for (int iter = 0; iter < n; iter++) {
        int u = -1;
        for (int v = 1; v <= n; v++)                    // closest unsettled node
            if (!done[v] && dist[v] != Integer.MAX_VALUE && (u == -1 || dist[v] < dist[u])) u = v;
        if (u == -1) break;
        done[u] = true;
        for (int[] e : adj.get(u)) dist[e[0]] = Math.min(dist[e[0]], dist[u] + e[1]);
    }
    int ans = 0;
    for (int v = 1; v <= n; v++) ans = Math.max(ans, dist[v]);
    return ans == Integer.MAX_VALUE ? -1 : ans;
}`,
      js: `function networkDelayTime(times, n, k) {
    const adj = Array.from({ length: n + 1 }, () => []);
    for (const [u, v, w] of times) adj[u].push([v, w]);
    const dist = new Array(n + 1).fill(Infinity), done = new Array(n + 1).fill(false);
    dist[k] = 0;
    for (let iter = 0; iter < n; iter++) {
        let u = -1;
        for (let v = 1; v <= n; v++)                    // closest unsettled node
            if (!done[v] && dist[v] < Infinity && (u === -1 || dist[v] < dist[u])) u = v;
        if (u === -1) break;
        done[u] = true;
        for (const [v, w] of adj[u]) dist[v] = Math.min(dist[v], dist[u] + w);
    }
    const ans = Math.max(...dist.slice(1));
    return ans === Infinity ? -1 : ans;
}`
    }
  },
  {
    id: "gr-redundant",
    title: "Redundant Connection",
    difficulty: "medium",
    tags: ["Union-Find"],
    desc: "A tree with n nodes got one extra edge. Return the edge that can be removed to restore a tree (the last such edge in the input).",
    example: "[[1,2],[1,3],[2,3]]  →  [2,3]",
    hint: "Add edges one by one with Union-Find. The first edge whose endpoints are already connected closes a cycle.",
    approach: "For each edge, if find(u) == find(v) return it; otherwise unite them.",
    complexity: "Time ≈ O(n · α(n)) · Space O(n)",
    link: "https://leetcode.com/problems/redundant-connection/",
    code: {
      cpp: `vector<int> parent;
int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }
vector<int> findRedundantConnection(vector<vector<int>>& edges) {
    parent.resize(edges.size() + 1);
    iota(parent.begin(), parent.end(), 0);
    for (auto& e : edges) {
        int a = find(e[0]), b = find(e[1]);
        if (a == b) return e;                  // already connected → cycle
        parent[a] = b;
    }
    return {};
}`,
      java: `private int[] parent;
private int find(int x) { return parent[x] == x ? x : (parent[x] = find(parent[x])); }
public int[] findRedundantConnection(int[][] edges) {
    parent = new int[edges.length + 1];
    for (int i = 0; i < parent.length; i++) parent[i] = i;
    for (int[] e : edges) {
        int a = find(e[0]), b = find(e[1]);
        if (a == b) return e;                  // already connected → cycle
        parent[a] = b;
    }
    return new int[0];
}`,
      js: `function findRedundantConnection(edges) {
    const parent = Array.from({ length: edges.length + 1 }, (_, i) => i);
    const find = x => {
        while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    };
    for (const e of edges) {
        const a = find(e[0]), b = find(e[1]);
        if (a === b) return e;                 // already connected → cycle
        parent[a] = b;
    }
    return [];
}`
    }
  },
  {
    id: "gr-binary-matrix",
    title: "Shortest Path in Binary Matrix",
    difficulty: "medium",
    tags: ["BFS", "Grid"],
    desc: "Fewest cells on a path of 0s from top-left to bottom-right, moving in 8 directions. −1 if impossible.",
    example: "[[0,0,0],[1,1,0],[1,1,0]]  →  4",
    hint: "Unweighted shortest path → BFS. Count cells, so the start already has distance 1.",
    approach: "BFS from (0,0) if it's open, marking cells as visited when enqueued; return the distance when you pop the target.",
    complexity: "Time O(n²) · Space O(n²)",
    link: "https://leetcode.com/problems/shortest-path-in-binary-matrix/",
    code: {
      cpp: `int shortestPathBinaryMatrix(vector<vector<int>>& g) {
    int n = g.size();
    if (g[0][0] || g[n - 1][n - 1]) return -1;
    queue<array<int, 3>> q;                    // r, c, distance
    q.push({0, 0, 1}); g[0][0] = 1;            // mark visited in place
    while (!q.empty()) {
        auto [r, c, d] = q.front(); q.pop();
        if (r == n - 1 && c == n - 1) return d;
        for (int dr = -1; dr <= 1; dr++)
            for (int dc = -1; dc <= 1; dc++) {
                int nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && !g[nr][nc]) { g[nr][nc] = 1; q.push({nr, nc, d + 1}); }
            }
    }
    return -1;
}`,
      java: `public int shortestPathBinaryMatrix(int[][] g) {
    int n = g.length;
    if (g[0][0] == 1 || g[n - 1][n - 1] == 1) return -1;
    Queue<int[]> q = new ArrayDeque<>();      // r, c, distance
    q.offer(new int[]{0, 0, 1}); g[0][0] = 1; // mark visited in place
    while (!q.isEmpty()) {
        int[] cur = q.poll();
        if (cur[0] == n - 1 && cur[1] == n - 1) return cur[2];
        for (int dr = -1; dr <= 1; dr++)
            for (int dc = -1; dc <= 1; dc++) {
                int nr = cur[0] + dr, nc = cur[1] + dc;
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && g[nr][nc] == 0) { g[nr][nc] = 1; q.offer(new int[]{nr, nc, cur[2] + 1}); }
            }
    }
    return -1;
}`,
      js: `function shortestPathBinaryMatrix(g) {
    const n = g.length;
    if (g[0][0] || g[n - 1][n - 1]) return -1;
    const q = [[0, 0, 1]];                     // r, c, distance
    g[0][0] = 1;                               // mark visited in place
    for (let head = 0; head < q.length; head++) {
        const [r, c, d] = q[head];
        if (r === n - 1 && c === n - 1) return d;
        for (let dr = -1; dr <= 1; dr++)
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && !g[nr][nc]) { g[nr][nc] = 1; q.push([nr, nc, d + 1]); }
            }
    }
    return -1;
}`
    }
  },
  {
    id: "gr-cheapest-flights",
    title: "Cheapest Flights Within K Stops",
    difficulty: "medium",
    tags: ["Bellman–Ford"],
    desc: "Find the cheapest price from src to dst using at most k stops (k + 1 flights). −1 if impossible.",
    example: "n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src 0, dst 3, k = 1  →  700",
    hint: "A limit on the number of edges is exactly what Bellman–Ford's rounds give you: after i rounds, paths use ≤ i edges.",
    approach: "Run k + 1 relaxation rounds over all flights, each round reading from a copy of the previous distances so one round adds at most one edge.",
    complexity: "Time O(k · E) · Space O(n)",
    link: "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
    code: {
      cpp: `int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;
    for (int i = 0; i <= k; i++) {
        vector<int> next = dist;               // copy: one more edge per round
        for (auto& f : flights)
            if (dist[f[0]] != INT_MAX) next[f[1]] = min(next[f[1]], dist[f[0]] + f[2]);
        dist = next;
    }
    return dist[dst] == INT_MAX ? -1 : dist[dst];
}`,
      java: `public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    for (int i = 0; i <= k; i++) {
        int[] next = dist.clone();             // copy: one more edge per round
        for (int[] f : flights)
            if (dist[f[0]] != Integer.MAX_VALUE) next[f[1]] = Math.min(next[f[1]], dist[f[0]] + f[2]);
        dist = next;
    }
    return dist[dst] == Integer.MAX_VALUE ? -1 : dist[dst];
}`,
      js: `function findCheapestPrice(n, flights, src, dst, k) {
    let dist = new Array(n).fill(Infinity);
    dist[src] = 0;
    for (let i = 0; i <= k; i++) {
        const next = [...dist];                // copy: one more edge per round
        for (const [u, v, w] of flights)
            if (dist[u] < Infinity) next[v] = Math.min(next[v], dist[u] + w);
        dist = next;
    }
    return dist[dst] === Infinity ? -1 : dist[dst];
}`
    }
  },
  {
    id: "gr-min-cost-points",
    title: "Min Cost to Connect All Points",
    difficulty: "medium",
    tags: ["MST", "Prim"],
    desc: "Connect all points so every pair is linked by some path; edge cost is the Manhattan distance. Return the minimum total cost.",
    example: "[[0,0],[2,2],[3,10],[5,2],[7,0]]  →  20",
    hint: "This is a minimum spanning tree on a complete graph. With n² edges, the O(n²) array version of Prim beats sorting all edges.",
    approach: "Prim: keep minDist[v] = cheapest edge from the tree to v. Repeatedly add the closest outside point and update its neighbours.",
    complexity: "Time O(n²) · Space O(n)",
    link: "https://leetcode.com/problems/min-cost-to-connect-all-points/",
    code: {
      cpp: `int minCostConnectPoints(vector<vector<int>>& p) {
    int n = p.size(), total = 0;
    vector<int> minDist(n, INT_MAX);
    vector<bool> inTree(n, false);
    minDist[0] = 0;
    for (int iter = 0; iter < n; iter++) {
        int u = -1;
        for (int v = 0; v < n; v++)
            if (!inTree[v] && (u == -1 || minDist[v] < minDist[u])) u = v;
        inTree[u] = true;
        total += minDist[u];
        for (int v = 0; v < n; v++)
            if (!inTree[v]) minDist[v] = min(minDist[v], abs(p[u][0] - p[v][0]) + abs(p[u][1] - p[v][1]));
    }
    return total;
}`,
      java: `public int minCostConnectPoints(int[][] p) {
    int n = p.length, total = 0;
    int[] minDist = new int[n];
    Arrays.fill(minDist, Integer.MAX_VALUE);
    boolean[] inTree = new boolean[n];
    minDist[0] = 0;
    for (int iter = 0; iter < n; iter++) {
        int u = -1;
        for (int v = 0; v < n; v++)
            if (!inTree[v] && (u == -1 || minDist[v] < minDist[u])) u = v;
        inTree[u] = true;
        total += minDist[u];
        for (int v = 0; v < n; v++)
            if (!inTree[v]) minDist[v] = Math.min(minDist[v], Math.abs(p[u][0] - p[v][0]) + Math.abs(p[u][1] - p[v][1]));
    }
    return total;
}`,
      js: `function minCostConnectPoints(p) {
    const n = p.length, minDist = new Array(n).fill(Infinity), inTree = new Array(n).fill(false);
    let total = 0;
    minDist[0] = 0;
    for (let iter = 0; iter < n; iter++) {
        let u = -1;
        for (let v = 0; v < n; v++)
            if (!inTree[v] && (u === -1 || minDist[v] < minDist[u])) u = v;
        inTree[u] = true;
        total += minDist[u];
        for (let v = 0; v < n; v++)
            if (!inTree[v]) minDist[v] = Math.min(minDist[v], Math.abs(p[u][0] - p[v][0]) + Math.abs(p[u][1] - p[v][1]));
    }
    return total;
}`
    }
  },
  {
    id: "gr-word-ladder",
    title: "Word Ladder",
    difficulty: "hard",
    tags: ["BFS", "Implicit graph"],
    desc: "Transform beginWord into endWord changing one letter at a time; every intermediate word must be in wordList. Return the number of words in the shortest sequence, or 0.",
    example: "hit → cog with [hot,dot,dog,lot,log,cog]  →  5   (hit → hot → dot → dog → cog)",
    hint: "Words are vertices; words differing by one letter are connected. Shortest sequence = BFS.",
    approach: "BFS level by level. Generate neighbours by trying all 26 letters in every position; remove words from the set when visited.",
    complexity: "Time O(N · L · 26) · Space O(N · L)",
    link: "https://leetcode.com/problems/word-ladder/",
    code: {
      cpp: `int ladderLength(string begin, string end, vector<string>& wordList) {
    unordered_set<string> dict(wordList.begin(), wordList.end());
    if (!dict.count(end)) return 0;
    queue<string> q; q.push(begin);
    for (int steps = 1; !q.empty(); steps++) {
        for (int sz = q.size(); sz > 0; sz--) {
            string w = q.front(); q.pop();
            if (w == end) return steps;
            for (int i = 0; i < w.size(); i++) {
                char orig = w[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    w[i] = c;
                    if (dict.erase(w)) q.push(w);    // erase = mark visited
                }
                w[i] = orig;
            }
        }
    }
    return 0;
}`,
      java: `public int ladderLength(String begin, String end, List<String> wordList) {
    Set<String> dict = new HashSet<>(wordList);
    if (!dict.contains(end)) return 0;
    Queue<String> q = new ArrayDeque<>();
    q.offer(begin);
    for (int steps = 1; !q.isEmpty(); steps++) {
        for (int sz = q.size(); sz > 0; sz--) {
            char[] w = q.poll().toCharArray();
            if (String.valueOf(w).equals(end)) return steps;
            for (int i = 0; i < w.length; i++) {
                char orig = w[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    w[i] = c;
                    String s = String.valueOf(w);
                    if (dict.remove(s)) q.offer(s);  // remove = mark visited
                }
                w[i] = orig;
            }
        }
    }
    return 0;
}`,
      js: `function ladderLength(begin, end, wordList) {
    const dict = new Set(wordList);
    if (!dict.has(end)) return 0;
    let level = [begin];
    for (let steps = 1; level.length; steps++) {
        const next = [];
        for (const w of level) {
            if (w === end) return steps;
            for (let i = 0; i < w.length; i++)
                for (let c = 97; c <= 122; c++) {
                    const s = w.slice(0, i) + String.fromCharCode(c) + w.slice(i + 1);
                    if (dict.delete(s)) next.push(s);   // delete = mark visited
                }
        }
        level = next;
    }
    return 0;
}`
    }
  },
  {
    id: "gr-critical",
    title: "Critical Connections in a Network",
    difficulty: "hard",
    tags: ["Tarjan", "Bridges"],
    desc: "Return all edges (bridges) whose removal would disconnect the undirected network.",
    example: "n = 4, [[0,1],[1,2],[2,0],[1,3]]  →  [[1,3]]",
    hint: "During DFS, low[v] = the earliest discovery time reachable from v's subtree using one back edge. Edge u–v is a bridge if low[v] > disc[u].",
    approach: "Tarjan's bridge algorithm: one DFS assigning discovery times and low-links; skip the edge back to the parent.",
    complexity: "Time O(V + E) · Space O(V + E)",
    link: "https://leetcode.com/problems/critical-connections-in-a-network/",
    code: {
      cpp: `class Solution {
    vector<vector<int>> adj, res;
    vector<int> disc, low;
    int timer = 0;
    void dfs(int u, int parent) {
        disc[u] = low[u] = ++timer;
        for (int v : adj[u]) {
            if (v == parent) continue;
            if (!disc[v]) {
                dfs(v, u);
                low[u] = min(low[u], low[v]);
                if (low[v] > disc[u]) res.push_back({u, v});   // no back edge around u–v
            } else low[u] = min(low[u], disc[v]);
        }
    }
public:
    vector<vector<int>> criticalConnections(int n, vector<vector<int>>& conns) {
        adj.assign(n, {}); disc.assign(n, 0); low.assign(n, 0);
        for (auto& c : conns) { adj[c[0]].push_back(c[1]); adj[c[1]].push_back(c[0]); }
        for (int u = 0; u < n; u++) if (!disc[u]) dfs(u, -1);
        return res;
    }
};`,
      java: `private List<List<Integer>> adj, res;
private int[] disc, low;
private int timer;
public List<List<Integer>> criticalConnections(int n, List<List<Integer>> conns) {
    adj = new ArrayList<>(); res = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (List<Integer> c : conns) { adj.get(c.get(0)).add(c.get(1)); adj.get(c.get(1)).add(c.get(0)); }
    disc = new int[n]; low = new int[n]; timer = 0;
    for (int u = 0; u < n; u++) if (disc[u] == 0) dfs(u, -1);
    return res;
}
private void dfs(int u, int parent) {
    disc[u] = low[u] = ++timer;
    for (int v : adj.get(u)) {
        if (v == parent) continue;
        if (disc[v] == 0) {
            dfs(v, u);
            low[u] = Math.min(low[u], low[v]);
            if (low[v] > disc[u]) res.add(List.of(u, v));   // no back edge around u–v
        } else low[u] = Math.min(low[u], disc[v]);
    }
}`,
      js: `function criticalConnections(n, conns) {
    const adj = Array.from({ length: n }, () => []);
    for (const [a, b] of conns) { adj[a].push(b); adj[b].push(a); }
    const disc = new Array(n).fill(0), low = new Array(n).fill(0), res = [];
    let timer = 0;
    const dfs = (u, parent) => {
        disc[u] = low[u] = ++timer;
        for (const v of adj[u]) {
            if (v === parent) continue;
            if (!disc[v]) {
                dfs(v, u);
                low[u] = Math.min(low[u], low[v]);
                if (low[v] > disc[u]) res.push([u, v]);     // no back edge around u–v
            } else low[u] = Math.min(low[u], disc[v]);
        }
    };
    for (let u = 0; u < n; u++) if (!disc[u]) dfs(u, -1);
    return res;
}`
    }
  },
  {
    id: "gr-bus-routes",
    title: "Bus Routes",
    difficulty: "hard",
    tags: ["BFS", "Graph modelling"],
    desc: "routes[i] is the loop of stops bus i visits. Return the fewest buses to get from source to target, or −1.",
    example: "routes = [[1,2,7],[3,6,7]], source 1, target 6  →  2",
    hint: "We count buses, not stops — so the vertices that matter are buses. Two buses are connected if they share a stop.",
    approach: "Map stop → buses. BFS where each level boards every not-yet-used bus at the current stops, then adds all their stops. Mark buses (and stops) visited.",
    complexity: "Time O(sum of route lengths) · Space O(same)",
    link: "https://leetcode.com/problems/bus-routes/",
    code: {
      cpp: `int numBusesToDestination(vector<vector<int>>& routes, int source, int target) {
    if (source == target) return 0;
    unordered_map<int, vector<int>> busesAt;
    for (int b = 0; b < routes.size(); b++) for (int s : routes[b]) busesAt[s].push_back(b);
    vector<bool> usedBus(routes.size(), false);
    unordered_set<int> seenStop{source};
    vector<int> stops{source};
    for (int buses = 1; !stops.empty(); buses++) {
        vector<int> next;
        for (int s : stops)
            for (int b : busesAt[s]) {
                if (usedBus[b]) continue;
                usedBus[b] = true;
                for (int t : routes[b]) {
                    if (t == target) return buses;
                    if (seenStop.insert(t).second) next.push_back(t);
                }
            }
        stops = next;
    }
    return -1;
}`,
      java: `public int numBusesToDestination(int[][] routes, int source, int target) {
    if (source == target) return 0;
    Map<Integer, List<Integer>> busesAt = new HashMap<>();
    for (int b = 0; b < routes.length; b++)
        for (int s : routes[b]) busesAt.computeIfAbsent(s, x -> new ArrayList<>()).add(b);
    boolean[] usedBus = new boolean[routes.length];
    Set<Integer> seenStop = new HashSet<>(List.of(source));
    List<Integer> stops = List.of(source);
    for (int buses = 1; !stops.isEmpty(); buses++) {
        List<Integer> next = new ArrayList<>();
        for (int s : stops)
            for (int b : busesAt.getOrDefault(s, List.of())) {
                if (usedBus[b]) continue;
                usedBus[b] = true;
                for (int t : routes[b]) {
                    if (t == target) return buses;
                    if (seenStop.add(t)) next.add(t);
                }
            }
        stops = next;
    }
    return -1;
}`,
      js: `function numBusesToDestination(routes, source, target) {
    if (source === target) return 0;
    const busesAt = new Map();
    routes.forEach((r, b) => r.forEach(s => {
        if (!busesAt.has(s)) busesAt.set(s, []);
        busesAt.get(s).push(b);
    }));
    const usedBus = new Array(routes.length).fill(false), seenStop = new Set([source]);
    let stops = [source];
    for (let buses = 1; stops.length; buses++) {
        const next = [];
        for (const s of stops)
            for (const b of busesAt.get(s) || []) {
                if (usedBus[b]) continue;
                usedBus[b] = true;
                for (const t of routes[b]) {
                    if (t === target) return buses;
                    if (!seenStop.has(t)) { seenStop.add(t); next.push(t); }
                }
            }
        stops = next;
    }
    return -1;
}`
    }
  }
];

window.QUIZ = [
  {
    q: "Which traversal finds the shortest path (fewest edges) in an unweighted graph?",
    opts: ["DFS", "BFS", "Inorder", "Any of them"],
    a: 1,
    exp: "BFS explores in rings of increasing distance, so the first time it reaches a vertex is via a shortest path. DFS can wander far first."
  },
  {
    q: "Space used by an adjacency list for V vertices and E edges?",
    opts: ["O(V²)", "O(V + E)", "O(E²)", "O(V · E)"],
    a: 1,
    exp: "One list per vertex plus one entry per edge (two for undirected). An adjacency matrix is O(V²)."
  },
  {
    q: "Why does BFS mark a vertex visited when it is ENQUEUED rather than when it is dequeued?",
    opts: ["It's faster to type", "Otherwise the same vertex can be added to the queue many times", "To make it a DFS", "It doesn't matter"],
    a: 1,
    exp: "Between being enqueued and dequeued, other vertices could enqueue it again — wasting time and, in some problems, giving wrong counts."
  },
  {
    q: "Kahn's algorithm processes only 5 of 7 vertices. What does that mean?",
    opts: ["The graph is disconnected", "There is a cycle, so no topological order exists", "The graph is bipartite", "Two vertices have the same in-degree"],
    a: 1,
    exp: "Vertices on a cycle never reach in-degree 0, so they are never taken."
  },
  {
    q: "Dijkstra's algorithm can give wrong answers when…",
    opts: ["The graph is directed", "Some edge weights are negative", "The graph has cycles", "Weights are large"],
    a: 1,
    exp: "Dijkstra assumes a settled vertex can't get cheaper later. A negative edge breaks that — use Bellman–Ford instead."
  },
  {
    q: "Which structure answers “are u and v in the same group?” as edges keep being added?",
    opts: ["Stack", "Union-Find (DSU)", "Priority queue", "Adjacency matrix"],
    a: 1,
    exp: "DSU's find and union run in nearly O(1) amortised with path compression and union by size."
  },
  {
    q: "In a directed graph, DFS reaches a GREY vertex (on the current path). This means…",
    opts: ["A cross edge", "A cycle", "A bridge", "The graph is a tree"],
    a: 1,
    exp: "A grey vertex is an ancestor on the current recursion path, so the edge back to it closes a cycle."
  },
  {
    q: "“Shortest distance from every cell to the nearest gate” is best solved with…",
    opts: ["One BFS per cell", "Multi-source BFS starting from all gates at once", "DFS from the top-left", "Sorting the cells"],
    a: 1,
    exp: "Putting all sources in the queue first finds every cell's nearest source in a single O(R·C) pass."
  }
];
