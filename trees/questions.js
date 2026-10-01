// Question bank for the "Important questions" section.
// Each entry: id, title, difficulty, tags, desc, example, hint, approach, complexity, link, code{cpp,java,js}
// Solutions use LeetCode's TreeNode { val, left, right } definition.
window.QUESTIONS = [
  {
    id: "tr-max-depth",
    title: "Maximum Depth of Binary Tree",
    difficulty: "easy",
    tags: ["Return info up"],
    desc: "Return the number of nodes on the longest path from the root down to a leaf.",
    example: "[3,9,20,null,null,15,7]  →  3",
    hint: "The depth of a tree is 1 + the deeper of its two subtrees. An empty tree has depth 0.",
    approach: "Post-order recursion: ask both children for their depth, return 1 + max. (BFS counting levels also works.)",
    complexity: "Time O(n) · Space O(h) recursion",
    link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    code: {
      cpp: `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
      java: `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      js: `function maxDepth(root) {
    if (!root) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`
    }
  },
  {
    id: "tr-invert",
    title: "Invert Binary Tree",
    difficulty: "easy",
    tags: ["Recursion"],
    desc: "Mirror the tree: swap the left and right children of every node.",
    example: "[4,2,7,1,3,6,9]  →  [4,7,2,9,6,3,1]",
    hint: "Swap the two children of the root, then invert each subtree.",
    approach: "Any traversal works as long as every node's children get swapped exactly once.",
    complexity: "Time O(n) · Space O(h)",
    link: "https://leetcode.com/problems/invert-binary-tree/",
    code: {
      cpp: `TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    swap(root->left, root->right);
    invertTree(root->left);
    invertTree(root->right);
    return root;
}`,
      java: `public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode t = root.left;
    root.left = invertTree(root.right);
    root.right = invertTree(t);
    return root;
}`,
      js: `function invertTree(root) {
    if (!root) return null;
    [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
    return root;
}`
    }
  },
  {
    id: "tr-same",
    title: "Same Tree",
    difficulty: "easy",
    tags: ["Pairs of nodes"],
    desc: "Return true if two binary trees have the same structure and the same values.",
    example: "[1,2,3] and [1,2,3]  →  true,   [1,2] and [1,null,2]  →  false",
    hint: "Recurse on pairs: both null → true; one null → false; values differ → false.",
    approach: "f(a, b) = a.val == b.val && f(a.left, b.left) && f(a.right, b.right).",
    complexity: "Time O(n) · Space O(h)",
    link: "https://leetcode.com/problems/same-tree/",
    code: {
      cpp: `bool isSameTree(TreeNode* a, TreeNode* b) {
    if (!a || !b) return a == b;
    return a->val == b->val && isSameTree(a->left, b->left) && isSameTree(a->right, b->right);
}`,
      java: `public boolean isSameTree(TreeNode a, TreeNode b) {
    if (a == null || b == null) return a == b;
    return a.val == b.val && isSameTree(a.left, b.left) && isSameTree(a.right, b.right);
}`,
      js: `function isSameTree(a, b) {
    if (!a || !b) return a === b;
    return a.val === b.val && isSameTree(a.left, b.left) && isSameTree(a.right, b.right);
}`
    }
  },
  {
    id: "tr-symmetric",
    title: "Symmetric Tree",
    difficulty: "easy",
    tags: ["Pairs of nodes"],
    desc: "Return true if the tree is a mirror image of itself around its centre.",
    example: "[1,2,2,3,4,4,3]  →  true,   [1,2,2,null,3,null,3]  →  false",
    hint: "Compare the left subtree with the right subtree as mirrors: outer pairs and inner pairs.",
    approach: "mirror(a, b) = a.val == b.val && mirror(a.left, b.right) && mirror(a.right, b.left).",
    complexity: "Time O(n) · Space O(h)",
    link: "https://leetcode.com/problems/symmetric-tree/",
    code: {
      cpp: `bool mirror(TreeNode* a, TreeNode* b) {
    if (!a || !b) return a == b;
    return a->val == b->val && mirror(a->left, b->right) && mirror(a->right, b->left);
}
bool isSymmetric(TreeNode* root) { return !root || mirror(root->left, root->right); }`,
      java: `public boolean isSymmetric(TreeNode root) {
    return root == null || mirror(root.left, root.right);
}
private boolean mirror(TreeNode a, TreeNode b) {
    if (a == null || b == null) return a == b;
    return a.val == b.val && mirror(a.left, b.right) && mirror(a.right, b.left);
}`,
      js: `function isSymmetric(root) {
    const mirror = (a, b) => {
        if (!a || !b) return a === b;
        return a.val === b.val && mirror(a.left, b.right) && mirror(a.right, b.left);
    };
    return !root || mirror(root.left, root.right);
}`
    }
  },
  {
    id: "tr-diameter",
    title: "Diameter of Binary Tree",
    difficulty: "easy",
    tags: ["Return + global"],
    desc: "Return the number of edges on the longest path between any two nodes (it may not pass through the root).",
    example: "[1,2,3,4,5]  →  3   (4 → 2 → 1 → 3)",
    hint: "The longest path through a node = height(left) + height(right). Compute heights and track the best sum.",
    approach: "Return height to the parent; at every node update best = max(best, l + r). One pass, not O(n²).",
    complexity: "Time O(n) · Space O(h)",
    link: "https://leetcode.com/problems/diameter-of-binary-tree/",
    code: {
      cpp: `class Solution {
    int best = 0;
    int depth(TreeNode* n) {
        if (!n) return 0;
        int l = depth(n->left), r = depth(n->right);
        best = max(best, l + r);
        return 1 + max(l, r);
    }
public:
    int diameterOfBinaryTree(TreeNode* root) { depth(root); return best; }
};`,
      java: `private int best = 0;
public int diameterOfBinaryTree(TreeNode root) {
    best = 0;
    depth(root);
    return best;
}
private int depth(TreeNode n) {
    if (n == null) return 0;
    int l = depth(n.left), r = depth(n.right);
    best = Math.max(best, l + r);
    return 1 + Math.max(l, r);
}`,
      js: `function diameterOfBinaryTree(root) {
    let best = 0;
    const depth = n => {
        if (!n) return 0;
        const l = depth(n.left), r = depth(n.right);
        best = Math.max(best, l + r);
        return 1 + Math.max(l, r);
    };
    depth(root);
    return best;
}`
    }
  },
  {
    id: "tr-path-sum",
    title: "Path Sum",
    difficulty: "easy",
    tags: ["Pass info down"],
    desc: "Return true if some root-to-leaf path adds up to targetSum.",
    example: "[5,4,8,11,null,13,4,7,2,null,null,null,1], target 22  →  true",
    hint: "Subtract the node's value on the way down. At a leaf, check whether what's left is exactly zero.",
    approach: "hasPathSum(node, t) = leaf ? node.val == t : hasPathSum(left, t − val) || hasPathSum(right, t − val). Careful: an empty tree has no path.",
    complexity: "Time O(n) · Space O(h)",
    link: "https://leetcode.com/problems/path-sum/",
    code: {
      cpp: `bool hasPathSum(TreeNode* root, int t) {
    if (!root) return false;
    if (!root->left && !root->right) return root->val == t;
    return hasPathSum(root->left, t - root->val) || hasPathSum(root->right, t - root->val);
}`,
      java: `public boolean hasPathSum(TreeNode root, int t) {
    if (root == null) return false;
    if (root.left == null && root.right == null) return root.val == t;
    return hasPathSum(root.left, t - root.val) || hasPathSum(root.right, t - root.val);
}`,
      js: `function hasPathSum(root, t) {
    if (!root) return false;
    if (!root.left && !root.right) return root.val === t;
    return hasPathSum(root.left, t - root.val) || hasPathSum(root.right, t - root.val);
}`
    }
  },
  {
    id: "tr-balanced",
    title: "Balanced Binary Tree",
    difficulty: "easy",
    tags: ["Return info up"],
    desc: "Return true if, at every node, the heights of the left and right subtrees differ by at most 1.",
    example: "[3,9,20,null,null,15,7]  →  true,   [1,2,2,3,3,null,null,4,4]  →  false",
    hint: "Calling height() at every node is O(n²). Return height and balance together — use −1 to mean “unbalanced”.",
    approach: "check(n) returns the height, or −1 as soon as any subtree is unbalanced; the −1 propagates up immediately.",
    complexity: "Time O(n) · Space O(h)",
    link: "https://leetcode.com/problems/balanced-binary-tree/",
    code: {
      cpp: `int check(TreeNode* n) {                 // height, or -1 if unbalanced
    if (!n) return 0;
    int l = check(n->left);
    if (l < 0) return -1;
    int r = check(n->right);
    if (r < 0 || abs(l - r) > 1) return -1;
    return 1 + max(l, r);
}
bool isBalanced(TreeNode* root) { return check(root) >= 0; }`,
      java: `public boolean isBalanced(TreeNode root) { return check(root) >= 0; }
private int check(TreeNode n) {          // height, or -1 if unbalanced
    if (n == null) return 0;
    int l = check(n.left);
    if (l < 0) return -1;
    int r = check(n.right);
    if (r < 0 || Math.abs(l - r) > 1) return -1;
    return 1 + Math.max(l, r);
}`,
      js: `function isBalanced(root) {
    const check = n => {                 // height, or -1 if unbalanced
        if (!n) return 0;
        const l = check(n.left);
        if (l < 0) return -1;
        const r = check(n.right);
        if (r < 0 || Math.abs(l - r) > 1) return -1;
        return 1 + Math.max(l, r);
    };
    return check(root) >= 0;
}`
    }
  },
  {
    id: "tr-level-order",
    title: "Binary Tree Level Order Traversal",
    difficulty: "medium",
    tags: ["BFS"],
    desc: "Return the node values level by level, left to right.",
    example: "[3,9,20,null,null,15,7]  →  [[3],[9,20],[15,7]]",
    hint: "Use a queue. Before processing a level, record how many nodes it has.",
    approach: "BFS with the queue-size snapshot (or swap whole level arrays).",
    complexity: "Time O(n) · Space O(width)",
    link: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    code: {
      cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> res;
    if (!root) return res;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        vector<int> level;
        for (int sz = q.size(); sz > 0; sz--) {
            TreeNode* n = q.front(); q.pop();
            level.push_back(n->val);
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
        res.push_back(level);
    }
    return res;
}`,
      java: `public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    while (!q.isEmpty()) {
        List<Integer> level = new ArrayList<>();
        for (int sz = q.size(); sz > 0; sz--) {
            TreeNode n = q.poll();
            level.add(n.val);
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        res.add(level);
    }
    return res;
}`,
      js: `function levelOrder(root) {
    const res = [];
    let level = root ? [root] : [];
    while (level.length) {
        res.push(level.map(n => n.val));
        const next = [];
        for (const n of level) {
            if (n.left) next.push(n.left);
            if (n.right) next.push(n.right);
        }
        level = next;
    }
    return res;
}`
    }
  },
  {
    id: "tr-right-view",
    title: "Binary Tree Right Side View",
    difficulty: "medium",
    tags: ["DFS with depth", "BFS"],
    desc: "Return the values you'd see looking at the tree from the right side, top to bottom.",
    example: "[1,2,3,null,5,null,4]  →  [1,3,4]",
    hint: "It's the last node of every level. Or: DFS visiting right before left — the first node you meet at each depth is visible.",
    approach: "DFS(node, depth): if depth == result.size, this is the first node at that depth → record it. Recurse right, then left.",
    complexity: "Time O(n) · Space O(h)",
    link: "https://leetcode.com/problems/binary-tree-right-side-view/",
    code: {
      cpp: `void dfs(TreeNode* n, int depth, vector<int>& res) {
    if (!n) return;
    if (depth == res.size()) res.push_back(n->val);   // first seen at this depth
    dfs(n->right, depth + 1, res);                     // right first!
    dfs(n->left, depth + 1, res);
}
vector<int> rightSideView(TreeNode* root) {
    vector<int> res;
    dfs(root, 0, res);
    return res;
}`,
      java: `public List<Integer> rightSideView(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    dfs(root, 0, res);
    return res;
}
private void dfs(TreeNode n, int depth, List<Integer> res) {
    if (n == null) return;
    if (depth == res.size()) res.add(n.val);           // first seen at this depth
    dfs(n.right, depth + 1, res);                      // right first!
    dfs(n.left, depth + 1, res);
}`,
      js: `function rightSideView(root) {
    const res = [];
    const dfs = (n, depth) => {
        if (!n) return;
        if (depth === res.length) res.push(n.val);     // first seen at this depth
        dfs(n.right, depth + 1);                       // right first!
        dfs(n.left, depth + 1);
    };
    dfs(root, 0);
    return res;
}`
    }
  },
  {
    id: "tr-validate",
    title: "Validate Binary Search Tree",
    difficulty: "medium",
    tags: ["Pass info down", "BST"],
    desc: "Return true if the tree is a valid BST (strictly smaller on the left, strictly larger on the right, for every subtree).",
    example: "[2,1,3]  →  true,   [5,1,4,null,null,3,6]  →  false",
    hint: "Checking only a node against its children misses violations deeper down. Every node has an allowed (lo, hi) range.",
    approach: "Pass bounds down: left child gets (lo, node.val), right child gets (node.val, hi). Use 64-bit bounds or null/±∞. (Alternative: inorder must be strictly increasing.)",
    complexity: "Time O(n) · Space O(h)",
    link: "https://leetcode.com/problems/validate-binary-search-tree/",
    code: {
      cpp: `bool valid(TreeNode* n, long long lo, long long hi) {
    if (!n) return true;
    if (n->val <= lo || n->val >= hi) return false;
    return valid(n->left, lo, n->val) && valid(n->right, n->val, hi);
}
bool isValidBST(TreeNode* root) { return valid(root, LLONG_MIN, LLONG_MAX); }`,
      java: `public boolean isValidBST(TreeNode root) {
    return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
}
private boolean valid(TreeNode n, long lo, long hi) {
    if (n == null) return true;
    if (n.val <= lo || n.val >= hi) return false;
    return valid(n.left, lo, n.val) && valid(n.right, n.val, hi);
}`,
      js: `function isValidBST(root) {
    const valid = (n, lo, hi) => {
        if (!n) return true;
        if (n.val <= lo || n.val >= hi) return false;
        return valid(n.left, lo, n.val) && valid(n.right, n.val, hi);
    };
    return valid(root, -Infinity, Infinity);
}`
    }
  },
  {
    id: "tr-kth-smallest",
    title: "Kth Smallest Element in a BST",
    difficulty: "medium",
    tags: ["Inorder", "BST"],
    desc: "Return the k-th smallest value (1-indexed) in a BST.",
    example: "[5,3,6,2,4,null,null,1], k = 3  →  3",
    hint: "Inorder traversal of a BST visits values in sorted order. Stop at the k-th one.",
    approach: "Iterative inorder with a stack, decrementing k on each visit — stops early after k visits.",
    complexity: "Time O(h + k) · Space O(h)",
    link: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
    code: {
      cpp: `int kthSmallest(TreeNode* root, int k) {
    stack<TreeNode*> st;
    TreeNode* cur = root;
    while (true) {
        while (cur) { st.push(cur); cur = cur->left; }
        cur = st.top(); st.pop();
        if (--k == 0) return cur->val;
        cur = cur->right;
    }
}`,
      java: `public int kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> st = new ArrayDeque<>();
    TreeNode cur = root;
    while (true) {
        while (cur != null) { st.push(cur); cur = cur.left; }
        cur = st.pop();
        if (--k == 0) return cur.val;
        cur = cur.right;
    }
}`,
      js: `function kthSmallest(root, k) {
    const st = [];
    let cur = root;
    while (true) {
        while (cur) { st.push(cur); cur = cur.left; }
        cur = st.pop();
        if (--k === 0) return cur.val;
        cur = cur.right;
    }
}`
    }
  },
  {
    id: "tr-lca",
    title: "Lowest Common Ancestor of a Binary Tree",
    difficulty: "medium",
    tags: ["Return info up"],
    desc: "Given two nodes p and q, return their lowest common ancestor (a node may be its own ancestor).",
    example: "[3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1  →  3;   p = 5, q = 4  →  5",
    hint: "Ask each subtree: “did you find p or q?” If both sides say yes, you are the LCA.",
    approach: "If node is null, p or q, return it. Recurse both sides. Both non-null → this node; otherwise return whichever side is non-null.",
    complexity: "Time O(n) · Space O(h)",
    link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
    code: {
      cpp: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    TreeNode* l = lowestCommonAncestor(root->left, p, q);
    TreeNode* r = lowestCommonAncestor(root->right, p, q);
    if (l && r) return root;            // p and q on different sides
    return l ? l : r;
}`,
      java: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode l = lowestCommonAncestor(root.left, p, q);
    TreeNode r = lowestCommonAncestor(root.right, p, q);
    if (l != null && r != null) return root;   // p and q on different sides
    return l != null ? l : r;
}`,
      js: `function lowestCommonAncestor(root, p, q) {
    if (!root || root === p || root === q) return root;
    const l = lowestCommonAncestor(root.left, p, q);
    const r = lowestCommonAncestor(root.right, p, q);
    if (l && r) return root;            // p and q on different sides
    return l || r;
}`
    }
  },
  {
    id: "tr-lca-bst",
    title: "Lowest Common Ancestor of a BST",
    difficulty: "medium",
    tags: ["BST"],
    desc: "Same question, but the tree is a BST — use that to avoid searching both sides.",
    example: "[6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8  →  6;   p = 2, q = 4  →  2",
    hint: "If both values are smaller, the LCA is on the left; if both are larger, on the right; otherwise you're at the split point.",
    approach: "Walk down from the root without recursion; the first node where p and q fall on different sides (or equal) is the LCA.",
    complexity: "Time O(h) · Space O(1)",
    link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    code: {
      cpp: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    TreeNode* n = root;
    while (n) {
        if (p->val < n->val && q->val < n->val) n = n->left;
        else if (p->val > n->val && q->val > n->val) n = n->right;
        else return n;                  // split point
    }
    return nullptr;
}`,
      java: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    TreeNode n = root;
    while (n != null) {
        if (p.val < n.val && q.val < n.val) n = n.left;
        else if (p.val > n.val && q.val > n.val) n = n.right;
        else return n;                  // split point
    }
    return null;
}`,
      js: `function lowestCommonAncestor(root, p, q) {
    let n = root;
    while (n) {
        if (p.val < n.val && q.val < n.val) n = n.left;
        else if (p.val > n.val && q.val > n.val) n = n.right;
        else return n;                  // split point
    }
    return null;
}`
    }
  },
  {
    id: "tr-build",
    title: "Construct Binary Tree from Preorder and Inorder",
    difficulty: "medium",
    tags: ["Divide & conquer"],
    desc: "Rebuild the tree from its preorder and inorder traversals (values are unique).",
    example: "preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]  →  [3,9,20,null,null,15,7]",
    hint: "The next preorder value is the root of the current subtree. Its position in inorder splits left from right.",
    approach: "Map value → inorder index for O(1) lookups. Recurse on inorder ranges, consuming preorder left to right: build the left subtree first, then the right.",
    complexity: "Time O(n) · Space O(n)",
    link: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
    code: {
      cpp: `class Solution {
    unordered_map<int, int> pos;
    int p = 0;
    TreeNode* build(vector<int>& pre, int lo, int hi) {   // inorder range [lo, hi]
        if (lo > hi) return nullptr;
        TreeNode* root = new TreeNode(pre[p++]);
        int m = pos[root->val];
        root->left = build(pre, lo, m - 1);
        root->right = build(pre, m + 1, hi);
        return root;
    }
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        for (int i = 0; i < inorder.size(); i++) pos[inorder[i]] = i;
        return build(preorder, 0, inorder.size() - 1);
    }
};`,
      java: `private Map<Integer, Integer> pos;
private int p;
public TreeNode buildTree(int[] preorder, int[] inorder) {
    pos = new HashMap<>();
    p = 0;
    for (int i = 0; i < inorder.length; i++) pos.put(inorder[i], i);
    return build(preorder, 0, inorder.length - 1);
}
private TreeNode build(int[] pre, int lo, int hi) {   // inorder range [lo, hi]
    if (lo > hi) return null;
    TreeNode root = new TreeNode(pre[p++]);
    int m = pos.get(root.val);
    root.left = build(pre, lo, m - 1);
    root.right = build(pre, m + 1, hi);
    return root;
}`,
      js: `function buildTree(preorder, inorder) {
    const pos = new Map(inorder.map((v, i) => [v, i]));
    let p = 0;
    const build = (lo, hi) => {                        // inorder range [lo, hi]
        if (lo > hi) return null;
        const root = new TreeNode(preorder[p++]);
        const m = pos.get(root.val);
        root.left = build(lo, m - 1);
        root.right = build(m + 1, hi);
        return root;
    };
    return build(0, inorder.length - 1);
}`
    }
  },
  {
    id: "tr-zigzag",
    title: "Binary Tree Zigzag Level Order Traversal",
    difficulty: "medium",
    tags: ["BFS"],
    desc: "Level order traversal, but alternate direction: left→right, then right→left, and so on.",
    example: "[3,9,20,null,null,15,7]  →  [[3],[20,9],[15,7]]",
    hint: "Do a normal BFS; reverse every second level before adding it.",
    approach: "Standard level order with a flag that flips each level.",
    complexity: "Time O(n) · Space O(width)",
    link: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
    code: {
      cpp: `vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
    vector<vector<int>> res;
    if (!root) return res;
    queue<TreeNode*> q;
    q.push(root);
    bool rev = false;
    while (!q.empty()) {
        vector<int> level;
        for (int sz = q.size(); sz > 0; sz--) {
            TreeNode* n = q.front(); q.pop();
            level.push_back(n->val);
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
        if (rev) reverse(level.begin(), level.end());
        res.push_back(level);
        rev = !rev;
    }
    return res;
}`,
      java: `public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    boolean rev = false;
    while (!q.isEmpty()) {
        List<Integer> level = new ArrayList<>();
        for (int sz = q.size(); sz > 0; sz--) {
            TreeNode n = q.poll();
            level.add(n.val);
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        if (rev) Collections.reverse(level);
        res.add(level);
        rev = !rev;
    }
    return res;
}`,
      js: `function zigzagLevelOrder(root) {
    const res = [];
    let level = root ? [root] : [], rev = false;
    while (level.length) {
        const vals = level.map(n => n.val);
        res.push(rev ? vals.reverse() : vals);
        rev = !rev;
        const next = [];
        for (const n of level) {
            if (n.left) next.push(n.left);
            if (n.right) next.push(n.right);
        }
        level = next;
    }
    return res;
}`
    }
  },
  {
    id: "tr-good-nodes",
    title: "Count Good Nodes in Binary Tree",
    difficulty: "medium",
    tags: ["Pass info down"],
    desc: "A node is good if no node on the path from the root to it has a greater value. Count the good nodes.",
    example: "[3,1,4,3,null,1,5]  →  4",
    hint: "Carry the maximum value seen so far on the path as you go down.",
    approach: "dfs(node, maxSoFar): good if node.val ≥ maxSoFar; recurse with max(maxSoFar, node.val).",
    complexity: "Time O(n) · Space O(h)",
    link: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/",
    code: {
      cpp: `int dfs(TreeNode* n, int mx) {
    if (!n) return 0;
    int good = n->val >= mx ? 1 : 0;
    mx = max(mx, n->val);
    return good + dfs(n->left, mx) + dfs(n->right, mx);
}
int goodNodes(TreeNode* root) { return dfs(root, INT_MIN); }`,
      java: `public int goodNodes(TreeNode root) { return dfs(root, Integer.MIN_VALUE); }
private int dfs(TreeNode n, int mx) {
    if (n == null) return 0;
    int good = n.val >= mx ? 1 : 0;
    mx = Math.max(mx, n.val);
    return good + dfs(n.left, mx) + dfs(n.right, mx);
}`,
      js: `function goodNodes(root) {
    const dfs = (n, mx) => {
        if (!n) return 0;
        const good = n.val >= mx ? 1 : 0;
        mx = Math.max(mx, n.val);
        return good + dfs(n.left, mx) + dfs(n.right, mx);
    };
    return dfs(root, -Infinity);
}`
    }
  },
  {
    id: "tr-delete-bst",
    title: "Delete Node in a BST",
    difficulty: "medium",
    tags: ["BST"],
    desc: "Delete the node with value key from a BST and return the (possibly new) root.",
    example: "[5,3,6,2,4,null,7], key = 3  →  [5,4,6,2,null,null,7]",
    hint: "Find the node, then handle three cases: no children, one child, two children (use the inorder successor).",
    approach: "Recursive delete that returns the new subtree root, so the parent re-links automatically.",
    complexity: "Time O(h) · Space O(h)",
    link: "https://leetcode.com/problems/delete-node-in-a-bst/",
    code: {
      cpp: `TreeNode* deleteNode(TreeNode* n, int key) {
    if (!n) return nullptr;
    if (key < n->val) n->left = deleteNode(n->left, key);
    else if (key > n->val) n->right = deleteNode(n->right, key);
    else {
        if (!n->left) return n->right;
        if (!n->right) return n->left;
        TreeNode* s = n->right;
        while (s->left) s = s->left;          // inorder successor
        n->val = s->val;
        n->right = deleteNode(n->right, s->val);
    }
    return n;
}`,
      java: `public TreeNode deleteNode(TreeNode n, int key) {
    if (n == null) return null;
    if (key < n.val) n.left = deleteNode(n.left, key);
    else if (key > n.val) n.right = deleteNode(n.right, key);
    else {
        if (n.left == null) return n.right;
        if (n.right == null) return n.left;
        TreeNode s = n.right;
        while (s.left != null) s = s.left;    // inorder successor
        n.val = s.val;
        n.right = deleteNode(n.right, s.val);
    }
    return n;
}`,
      js: `function deleteNode(n, key) {
    if (!n) return null;
    if (key < n.val) n.left = deleteNode(n.left, key);
    else if (key > n.val) n.right = deleteNode(n.right, key);
    else {
        if (!n.left) return n.right;
        if (!n.right) return n.left;
        let s = n.right;
        while (s.left) s = s.left;            // inorder successor
        n.val = s.val;
        n.right = deleteNode(n.right, s.val);
    }
    return n;
}`
    }
  },
  {
    id: "tr-max-path",
    title: "Binary Tree Maximum Path Sum",
    difficulty: "hard",
    tags: ["Return + global"],
    desc: "A path is any sequence of connected nodes (each used once, not necessarily through the root). Return the maximum path sum. Values may be negative.",
    example: "[-10,9,20,null,null,15,7]  →  42   (15 → 20 → 7)",
    hint: "Like diameter: a path peaks at some node. The parent can only use ONE branch of a child, and never a negative one.",
    approach: "gain(n) = n.val + max(0, gain(left), gain(right)) is returned upward; at each node update best with n.val + max(0, gainL) + max(0, gainR). Start best at −∞.",
    complexity: "Time O(n) · Space O(h)",
    link: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    code: {
      cpp: `class Solution {
    int best = INT_MIN;
    int gain(TreeNode* n) {
        if (!n) return 0;
        int l = max(0, gain(n->left)), r = max(0, gain(n->right));
        best = max(best, n->val + l + r);   // path peaking here
        return n->val + max(l, r);          // parent can use one branch
    }
public:
    int maxPathSum(TreeNode* root) { gain(root); return best; }
};`,
      java: `private int best;
public int maxPathSum(TreeNode root) {
    best = Integer.MIN_VALUE;
    gain(root);
    return best;
}
private int gain(TreeNode n) {
    if (n == null) return 0;
    int l = Math.max(0, gain(n.left)), r = Math.max(0, gain(n.right));
    best = Math.max(best, n.val + l + r);   // path peaking here
    return n.val + Math.max(l, r);          // parent can use one branch
}`,
      js: `function maxPathSum(root) {
    let best = -Infinity;
    const gain = n => {
        if (!n) return 0;
        const l = Math.max(0, gain(n.left)), r = Math.max(0, gain(n.right));
        best = Math.max(best, n.val + l + r);   // path peaking here
        return n.val + Math.max(l, r);          // parent can use one branch
    };
    gain(root);
    return best;
}`
    }
  },
  {
    id: "tr-serialize",
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "hard",
    tags: ["Preorder", "Design"],
    desc: "Design functions that turn a binary tree into a string and back into an identical tree.",
    example: "[1,2,3,null,null,4,5]  ⇄  \"1,2,#,#,3,4,#,#,5,#,#\"",
    hint: "Preorder alone isn't enough… unless you also record the nulls. Then the string describes the tree uniquely.",
    approach: "Serialize: preorder, writing '#' for null. Deserialize: read tokens in the same preorder, building left then right recursively.",
    complexity: "Time O(n) · Space O(n)",
    link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    code: {
      cpp: `class Codec {
    void ser(TreeNode* n, string& s) {
        if (!n) { s += "#,"; return; }
        s += to_string(n->val) + ",";
        ser(n->left, s);
        ser(n->right, s);
    }
    TreeNode* des(stringstream& ss) {
        string t;
        getline(ss, t, ',');
        if (t == "#") return nullptr;
        TreeNode* n = new TreeNode(stoi(t));
        n->left = des(ss);
        n->right = des(ss);
        return n;
    }
public:
    string serialize(TreeNode* root) { string s; ser(root, s); return s; }
    TreeNode* deserialize(string data) { stringstream ss(data); return des(ss); }
};`,
      java: `class Codec {
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        ser(root, sb);
        return sb.toString();
    }
    private void ser(TreeNode n, StringBuilder sb) {
        if (n == null) { sb.append("#,"); return; }
        sb.append(n.val).append(',');
        ser(n.left, sb);
        ser(n.right, sb);
    }
    private String[] tokens;
    private int i;
    public TreeNode deserialize(String data) {
        tokens = data.split(",");
        i = 0;
        return des();
    }
    private TreeNode des() {
        String t = tokens[i++];
        if (t.equals("#")) return null;
        TreeNode n = new TreeNode(Integer.parseInt(t));
        n.left = des();
        n.right = des();
        return n;
    }
}`,
      js: `function serialize(root) {
    const out = [];
    const ser = n => {
        if (!n) { out.push("#"); return; }
        out.push(n.val);
        ser(n.left);
        ser(n.right);
    };
    ser(root);
    return out.join(",");
}
function deserialize(data) {
    const tokens = data.split(",");
    let i = 0;
    const des = () => {
        const t = tokens[i++];
        if (t === "#") return null;
        const n = new TreeNode(Number(t));
        n.left = des();
        n.right = des();
        return n;
    };
    return des();
}`
    }
  },
  {
    id: "tr-cameras",
    title: "Binary Tree Cameras",
    difficulty: "hard",
    tags: ["Post-order greedy"],
    desc: "A camera at a node watches its parent, itself and its children. Return the minimum number of cameras to watch every node.",
    example: "[0,0,null,0,0]  →  1,   [0,0,null,0,null,0,null,null,0]  →  2",
    hint: "Never put a camera on a leaf — putting it on the leaf's parent covers strictly more. Decide bottom-up.",
    approach: "Post-order states: 0 = not covered, 1 = has camera, 2 = covered. Null → 2. If any child is 0, place a camera (return 1). Else if any child has a camera, return 2. Else return 0. If the root ends at 0, add one more.",
    complexity: "Time O(n) · Space O(h)",
    link: "https://leetcode.com/problems/binary-tree-cameras/",
    code: {
      cpp: `class Solution {
    int cams = 0;
    int dfs(TreeNode* n) {               // 0 not covered, 1 camera, 2 covered
        if (!n) return 2;
        int l = dfs(n->left), r = dfs(n->right);
        if (l == 0 || r == 0) { cams++; return 1; }
        if (l == 1 || r == 1) return 2;
        return 0;
    }
public:
    int minCameraCover(TreeNode* root) { return (dfs(root) == 0 ? 1 : 0) + cams; }
};`,
      java: `private int cams;
public int minCameraCover(TreeNode root) {
    cams = 0;
    return (dfs(root) == 0 ? 1 : 0) + cams;
}
private int dfs(TreeNode n) {            // 0 not covered, 1 camera, 2 covered
    if (n == null) return 2;
    int l = dfs(n.left), r = dfs(n.right);
    if (l == 0 || r == 0) { cams++; return 1; }
    if (l == 1 || r == 1) return 2;
    return 0;
}`,
      js: `function minCameraCover(root) {
    let cams = 0;
    const dfs = n => {                   // 0 not covered, 1 camera, 2 covered
        if (!n) return 2;
        const l = dfs(n.left), r = dfs(n.right);
        if (l === 0 || r === 0) { cams++; return 1; }
        if (l === 1 || r === 1) return 2;
        return 0;
    };
    return (dfs(root) === 0 ? 1 : 0) + cams;
}`
    }
  }
];

window.QUIZ = [
  {
    q: "Which traversal of a binary search tree outputs the values in sorted order?",
    opts: ["Preorder", "Inorder", "Postorder", "Level order"],
    a: 1,
    exp: "Inorder visits left subtree, node, right subtree — exactly smaller values, then the node, then larger values."
  },
  {
    q: "Preorder of a tree is [A, B, D, E, C]. Which node is the root?",
    opts: ["A", "B", "C", "E"],
    a: 0,
    exp: "Preorder visits the node before its children, so the first element is always the root."
  },
  {
    q: "What is the height of a BST after inserting 1, 2, 3, 4, 5 in that order (height in edges)?",
    opts: ["2", "3", "4", "5"],
    a: 2,
    exp: "Each value goes to the right of the previous one, forming a chain (a linked list) of 5 nodes: height 4. This is why balanced trees exist."
  },
  {
    q: "Which data structure does level-order traversal use?",
    opts: ["Stack", "Queue", "Hash map", "Heap"],
    a: 1,
    exp: "A queue processes nodes in the order they were discovered — level by level."
  },
  {
    q: "Why is checking “left.val < node.val < right.val” at every node NOT enough to validate a BST?",
    opts: [
      "It is enough",
      "A deeper node can violate an ancestor's bound, e.g. a right-subtree value smaller than the root",
      "It doesn't handle null nodes",
      "Values could be negative"
    ],
    a: 1,
    exp: "In [5,1,6,null,null,3,7], 3 is a valid left child of 6 but sits in 5's right subtree. Pass (lo, hi) bounds down instead."
  },
  {
    q: "Deleting a BST node with two children — what replaces its value?",
    opts: ["Its left child", "Its right child", "The inorder successor (min of the right subtree)", "The root"],
    a: 2,
    exp: "The inorder successor (or predecessor) keeps the BST order. Then delete that successor, which has at most one child."
  },
  {
    q: "A binary tree with n nodes has how many edges?",
    opts: ["n", "n − 1", "2n", "log n"],
    a: 1,
    exp: "Every node except the root has exactly one edge to its parent."
  },
  {
    q: "What is the space complexity of a recursive DFS on a tree of height h?",
    opts: ["O(1)", "O(h)", "O(n²)", "O(log n) always"],
    a: 1,
    exp: "The call stack holds one frame per level on the current path. h is log n when balanced but can be n when skewed."
  }
];
