// Question bank for the "Important questions" section.
// Each entry: id, title, difficulty, tags, desc, example, hint, approach, complexity, link, code{cpp,java,python}
window.QUESTIONS = [
  {
    id: "transpose",
    title: "Transpose a Matrix",
    difficulty: "easy",
    tags: ["Basics"],
    desc: "Return the transpose of an R × C matrix: rows become columns.",
    example: "[[1,2,3],[4,5,6]]  →  [[1,4],[2,5],[3,6]]",
    hint: "The result has C rows and R columns. Cell (i, j) moves to (j, i).",
    approach: "Allocate a C × R matrix and copy res[j][i] = a[i][j]. (For a square matrix you can do it in place by swapping only the upper triangle, j > i.)",
    complexity: "Time O(R·C) · Space O(R·C) for the result",
    link: "https://leetcode.com/problems/transpose-matrix/",
    code: {
      cpp: `vector<vector<int>> transpose(vector<vector<int>>& a) {
    int R = a.size(), C = a[0].size();
    vector<vector<int>> res(C, vector<int>(R));
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++)
            res[j][i] = a[i][j];
    return res;
}`,
      java: `public int[][] transpose(int[][] a) {
    int R = a.length, C = a[0].length;
    int[][] res = new int[C][R];
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++)
            res[j][i] = a[i][j];
    return res;
}`,
      python: `def transpose(a):
    R, C = len(a), len(a[0])
    return [[a[i][j] for i in range(R)] for j in range(C)]
    # or simply: [list(row) for row in zip(*a)]`
    }
  },
  {
    id: "diagonal-sum",
    title: "Matrix Diagonal Sum",
    difficulty: "easy",
    tags: ["Diagonals"],
    desc: "Given a square matrix, return the sum of the primary and secondary diagonals. Count the centre cell only once.",
    example: "[[1,2,3],[4,5,6],[7,8,9]]  →  1+5+9+3+7 = 25",
    hint: "Primary: a[i][i]. Secondary: a[i][n-1-i]. They overlap only when n is odd.",
    approach: "One loop over i adds both diagonals. If n is odd, subtract the middle element once.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/matrix-diagonal-sum/",
    code: {
      cpp: `int diagonalSum(vector<vector<int>>& a) {
    int n = a.size(), sum = 0;
    for (int i = 0; i < n; i++)
        sum += a[i][i] + a[i][n - 1 - i];
    if (n % 2 == 1) sum -= a[n / 2][n / 2];
    return sum;
}`,
      java: `public int diagonalSum(int[][] a) {
    int n = a.length, sum = 0;
    for (int i = 0; i < n; i++)
        sum += a[i][i] + a[i][n - 1 - i];
    if (n % 2 == 1) sum -= a[n / 2][n / 2];
    return sum;
}`,
      python: `def diagonal_sum(a):
    n = len(a)
    s = sum(a[i][i] + a[i][n - 1 - i] for i in range(n))
    if n % 2 == 1:
        s -= a[n // 2][n // 2]
    return s`
    }
  },
  {
    id: "matmul",
    title: "Matrix Multiplication",
    difficulty: "easy",
    tags: ["Basics", "Math"],
    desc: "Multiply an R × K matrix A by a K × C matrix B. Return the R × C product.",
    example: "[[1,2],[3,4]] × [[5,6],[7,8]]  →  [[19,22],[43,50]]",
    hint: "res[i][j] is the dot product of row i of A and column j of B. Inner dimensions must match.",
    approach: "Triple loop over i, k, j. Ordering the loops i → k → j keeps the inner loop walking rows of B and res, which is cache-friendly.",
    complexity: "Time O(R·K·C) · Space O(R·C)",
    link: "https://en.wikipedia.org/wiki/Matrix_multiplication",
    code: {
      cpp: `vector<vector<long long>> multiply(vector<vector<int>>& A, vector<vector<int>>& B) {
    int R = A.size(), K = B.size(), C = B[0].size();
    vector<vector<long long>> res(R, vector<long long>(C, 0));
    for (int i = 0; i < R; i++)
        for (int k = 0; k < K; k++)
            for (int j = 0; j < C; j++)
                res[i][j] += (long long)A[i][k] * B[k][j];
    return res;
}`,
      java: `public long[][] multiply(int[][] A, int[][] B) {
    int R = A.length, K = B.length, C = B[0].length;
    long[][] res = new long[R][C];
    for (int i = 0; i < R; i++)
        for (int k = 0; k < K; k++)
            for (int j = 0; j < C; j++)
                res[i][j] += (long) A[i][k] * B[k][j];
    return res;
}`,
      python: `def multiply(A, B):
    R, K, C = len(A), len(B), len(B[0])
    res = [[0] * C for _ in range(R)]
    for i in range(R):
        for k in range(K):
            for j in range(C):
                res[i][j] += A[i][k] * B[k][j]
    return res`
    }
  },
  {
    id: "reshape",
    title: "Reshape the Matrix",
    difficulty: "easy",
    tags: ["Index mapping"],
    desc: "Reshape an m × n matrix into r × c, reading elements in row-major order. If impossible, return the original.",
    example: "[[1,2],[3,4]], r=1, c=4  →  [[1,2,3,4]]",
    hint: "Use the flat index k: old cell (k / n, k % n) goes to new cell (k / c, k % c).",
    approach: "If m·n ≠ r·c return the input. Otherwise loop k from 0 to m·n-1 and copy using the two index mappings.",
    complexity: "Time O(m·n) · Space O(m·n)",
    link: "https://leetcode.com/problems/reshape-the-matrix/",
    code: {
      cpp: `vector<vector<int>> matrixReshape(vector<vector<int>>& a, int r, int c) {
    int m = a.size(), n = a[0].size();
    if (m * n != r * c) return a;
    vector<vector<int>> res(r, vector<int>(c));
    for (int k = 0; k < m * n; k++)
        res[k / c][k % c] = a[k / n][k % n];
    return res;
}`,
      java: `public int[][] matrixReshape(int[][] a, int r, int c) {
    int m = a.length, n = a[0].length;
    if (m * n != r * c) return a;
    int[][] res = new int[r][c];
    for (int k = 0; k < m * n; k++)
        res[k / c][k % c] = a[k / n][k % n];
    return res;
}`,
      python: `def matrix_reshape(a, r, c):
    m, n = len(a), len(a[0])
    if m * n != r * c:
        return a
    res = [[0] * c for _ in range(r)]
    for k in range(m * n):
        res[k // c][k % c] = a[k // n][k % n]
    return res`
    }
  },
  {
    id: "toeplitz",
    title: "Toeplitz Matrix",
    difficulty: "easy",
    tags: ["Diagonals"],
    desc: "A matrix is Toeplitz if every top-left to bottom-right diagonal has the same value. Return true if it is.",
    example: "[[1,2,3,4],[5,1,2,3],[9,5,1,2]]  →  true",
    hint: "Each cell must equal the cell diagonally up-left of it.",
    approach: "For every cell with i > 0 and j > 0, check a[i][j] == a[i-1][j-1].",
    complexity: "Time O(R·C) · Space O(1)",
    link: "https://leetcode.com/problems/toeplitz-matrix/",
    code: {
      cpp: `bool isToeplitzMatrix(vector<vector<int>>& a) {
    for (int i = 1; i < a.size(); i++)
        for (int j = 1; j < a[0].size(); j++)
            if (a[i][j] != a[i - 1][j - 1]) return false;
    return true;
}`,
      java: `public boolean isToeplitzMatrix(int[][] a) {
    for (int i = 1; i < a.length; i++)
        for (int j = 1; j < a[0].length; j++)
            if (a[i][j] != a[i - 1][j - 1]) return false;
    return true;
}`,
      python: `def is_toeplitz(a):
    return all(a[i][j] == a[i - 1][j - 1]
               for i in range(1, len(a))
               for j in range(1, len(a[0])))`
    }
  },
  {
    id: "flood-fill",
    title: "Flood Fill",
    difficulty: "easy",
    tags: ["DFS", "Grid as graph"],
    desc: "Starting from (sr, sc), recolour the connected region of same-coloured cells (4-directionally) to a new colour.",
    example: "[[1,1,1],[1,1,0],[1,0,1]], sr=1, sc=1, color=2  →  [[2,2,2],[2,2,0],[2,0,1]]",
    hint: "DFS from the start. Watch out: if the new colour equals the old one, you'll loop forever — return early.",
    approach: "Remember the original colour. DFS: if out of bounds or colour differs, stop; otherwise paint and recurse in 4 directions.",
    complexity: "Time O(R·C) · Space O(R·C) recursion in the worst case",
    link: "https://leetcode.com/problems/flood-fill/",
    code: {
      cpp: `void dfs(vector<vector<int>>& g, int r, int c, int old, int color) {
    if (r < 0 || r >= g.size() || c < 0 || c >= g[0].size() || g[r][c] != old) return;
    g[r][c] = color;
    dfs(g, r + 1, c, old, color); dfs(g, r - 1, c, old, color);
    dfs(g, r, c + 1, old, color); dfs(g, r, c - 1, old, color);
}
vector<vector<int>> floodFill(vector<vector<int>>& g, int sr, int sc, int color) {
    if (g[sr][sc] != color) dfs(g, sr, sc, g[sr][sc], color);
    return g;
}`,
      java: `public int[][] floodFill(int[][] g, int sr, int sc, int color) {
    if (g[sr][sc] != color) dfs(g, sr, sc, g[sr][sc], color);
    return g;
}
private void dfs(int[][] g, int r, int c, int old, int color) {
    if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] != old) return;
    g[r][c] = color;
    dfs(g, r + 1, c, old, color); dfs(g, r - 1, c, old, color);
    dfs(g, r, c + 1, old, color); dfs(g, r, c - 1, old, color);
}`,
      python: `def flood_fill(g, sr, sc, color):
    R, C, old = len(g), len(g[0]), g[sr][sc]
    if old == color:
        return g
    def dfs(r, c):
        if 0 <= r < R and 0 <= c < C and g[r][c] == old:
            g[r][c] = color
            dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)
    dfs(sr, sc)
    return g`
    }
  },
  {
    id: "rotate",
    title: "Rotate Image (90° clockwise, in place)",
    difficulty: "medium",
    tags: ["Transpose", "In-place"],
    desc: "Rotate an n × n matrix by 90° clockwise without allocating another matrix.",
    example: "[[1,2,3],[4,5,6],[7,8,9]]  →  [[7,4,1],[8,5,2],[9,6,3]]",
    hint: "Rotation = transpose + reverse each row. Transpose only the upper triangle (j > i).",
    approach: "Swap a[i][j] with a[j][i] for j > i, then reverse every row. (Alternative: rotate four cells at a time layer by layer.)",
    complexity: "Time O(n²) · Space O(1)",
    link: "https://leetcode.com/problems/rotate-image/",
    code: {
      cpp: `void rotate(vector<vector<int>>& a) {
    int n = a.size();
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            swap(a[i][j], a[j][i]);
    for (auto& row : a) reverse(row.begin(), row.end());
}`,
      java: `public void rotate(int[][] a) {
    int n = a.length;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++) {
            int t = a[i][j]; a[i][j] = a[j][i]; a[j][i] = t;
        }
    for (int[] row : a)
        for (int l = 0, r = n - 1; l < r; l++, r--) {
            int t = row[l]; row[l] = row[r]; row[r] = t;
        }
}`,
      python: `def rotate(a):
    n = len(a)
    for i in range(n):
        for j in range(i + 1, n):
            a[i][j], a[j][i] = a[j][i], a[i][j]
    for row in a:
        row.reverse()`
    }
  },
  {
    id: "spiral",
    title: "Spiral Matrix",
    difficulty: "medium",
    tags: ["Simulation", "Boundaries"],
    desc: "Return all elements of an R × C matrix in clockwise spiral order.",
    example: "[[1,2,3],[4,5,6],[7,8,9]]  →  [1,2,3,6,9,8,7,4,5]",
    hint: "Track top, bottom, left, right. After walking a side, move that boundary inward.",
    approach: "Walk right along top, down along right, left along bottom (if top ≤ bottom), up along left (if left ≤ right). Repeat while boundaries are valid.",
    complexity: "Time O(R·C) · Space O(1) besides output",
    link: "https://leetcode.com/problems/spiral-matrix/",
    code: {
      cpp: `vector<int> spiralOrder(vector<vector<int>>& a) {
    vector<int> out;
    int top = 0, bottom = a.size() - 1, left = 0, right = a[0].size() - 1;
    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++) out.push_back(a[top][j]);
        top++;
        for (int i = top; i <= bottom; i++) out.push_back(a[i][right]);
        right--;
        if (top <= bottom) {
            for (int j = right; j >= left; j--) out.push_back(a[bottom][j]);
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--) out.push_back(a[i][left]);
            left++;
        }
    }
    return out;
}`,
      java: `public List<Integer> spiralOrder(int[][] a) {
    List<Integer> out = new ArrayList<>();
    int top = 0, bottom = a.length - 1, left = 0, right = a[0].length - 1;
    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++) out.add(a[top][j]);
        top++;
        for (int i = top; i <= bottom; i++) out.add(a[i][right]);
        right--;
        if (top <= bottom) {
            for (int j = right; j >= left; j--) out.add(a[bottom][j]);
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--) out.add(a[i][left]);
            left++;
        }
    }
    return out;
}`,
      python: `def spiral_order(a):
    out = []
    top, bottom, left, right = 0, len(a) - 1, 0, len(a[0]) - 1
    while top <= bottom and left <= right:
        for j in range(left, right + 1): out.append(a[top][j])
        top += 1
        for i in range(top, bottom + 1): out.append(a[i][right])
        right -= 1
        if top <= bottom:
            for j in range(right, left - 1, -1): out.append(a[bottom][j])
            bottom -= 1
        if left <= right:
            for i in range(bottom, top - 1, -1): out.append(a[i][left])
            left += 1
    return out`
    }
  },
  {
    id: "set-zeroes",
    title: "Set Matrix Zeroes",
    difficulty: "medium",
    tags: ["In-place", "Markers"],
    desc: "If an element is 0, set its entire row and column to 0. Do it in place with O(1) extra space.",
    example: "[[1,1,1],[1,0,1],[1,1,1]]  →  [[1,0,1],[0,0,0],[1,0,1]]",
    hint: "Use the first row and first column as marker arrays. Remember separately whether column 0 itself must be zeroed.",
    approach: "Pass 1: for each zero at (i,j), set a[i][0] = a[0][j] = 0 (track col0 with a flag). Pass 2: fill from the bottom-right so markers aren't overwritten before use.",
    complexity: "Time O(R·C) · Space O(1)",
    link: "https://leetcode.com/problems/set-matrix-zeroes/",
    code: {
      cpp: `void setZeroes(vector<vector<int>>& a) {
    int R = a.size(), C = a[0].size();
    bool col0 = false;
    for (int i = 0; i < R; i++) {
        if (a[i][0] == 0) col0 = true;
        for (int j = 1; j < C; j++)
            if (a[i][j] == 0) a[i][0] = a[0][j] = 0;
    }
    for (int i = R - 1; i >= 0; i--) {
        for (int j = C - 1; j >= 1; j--)
            if (a[i][0] == 0 || a[0][j] == 0) a[i][j] = 0;
        if (col0) a[i][0] = 0;
    }
}`,
      java: `public void setZeroes(int[][] a) {
    int R = a.length, C = a[0].length;
    boolean col0 = false;
    for (int i = 0; i < R; i++) {
        if (a[i][0] == 0) col0 = true;
        for (int j = 1; j < C; j++)
            if (a[i][j] == 0) a[i][0] = a[0][j] = 0;
    }
    for (int i = R - 1; i >= 0; i--) {
        for (int j = C - 1; j >= 1; j--)
            if (a[i][0] == 0 || a[0][j] == 0) a[i][j] = 0;
        if (col0) a[i][0] = 0;
    }
}`,
      python: `def set_zeroes(a):
    R, C = len(a), len(a[0])
    col0 = False
    for i in range(R):
        if a[i][0] == 0:
            col0 = True
        for j in range(1, C):
            if a[i][j] == 0:
                a[i][0] = a[0][j] = 0
    for i in range(R - 1, -1, -1):
        for j in range(C - 1, 0, -1):
            if a[i][0] == 0 or a[0][j] == 0:
                a[i][j] = 0
        if col0:
            a[i][0] = 0`
    }
  },
  {
    id: "search-2d",
    title: "Search a 2D Matrix",
    difficulty: "medium",
    tags: ["Binary search", "Index mapping"],
    desc: "Rows are sorted and each row's first value is greater than the previous row's last. Find target in O(log(R·C)).",
    example: "[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=3  →  true",
    hint: "The whole matrix is one sorted array of length R·C in disguise.",
    approach: "Binary search k in [0, R·C − 1]; read the value at a[k / C][k % C].",
    complexity: "Time O(log(R·C)) · Space O(1)",
    link: "https://leetcode.com/problems/search-a-2d-matrix/",
    code: {
      cpp: `bool searchMatrix(vector<vector<int>>& a, int target) {
    int R = a.size(), C = a[0].size();
    int lo = 0, hi = R * C - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        int v = a[mid / C][mid % C];
        if (v == target) return true;
        if (v < target) lo = mid + 1; else hi = mid - 1;
    }
    return false;
}`,
      java: `public boolean searchMatrix(int[][] a, int target) {
    int R = a.length, C = a[0].length;
    int lo = 0, hi = R * C - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        int v = a[mid / C][mid % C];
        if (v == target) return true;
        if (v < target) lo = mid + 1; else hi = mid - 1;
    }
    return false;
}`,
      python: `def search_matrix(a, target):
    R, C = len(a), len(a[0])
    lo, hi = 0, R * C - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        v = a[mid // C][mid % C]
        if v == target:
            return True
        if v < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return False`
    }
  },
  {
    id: "search-2d-ii",
    title: "Search a 2D Matrix II (staircase)",
    difficulty: "medium",
    tags: ["Two pointers"],
    desc: "Each row is sorted left→right and each column top→bottom (rows may overlap). Find target efficiently.",
    example: "[[1,4,7],[2,5,8],[3,6,9]], target=5  →  true",
    hint: "From the top-right corner, every step eliminates a whole row or a whole column.",
    approach: "Start at (0, C−1). If value > target move left; if value < target move down; if equal, found.",
    complexity: "Time O(R + C) · Space O(1)",
    link: "https://leetcode.com/problems/search-a-2d-matrix-ii/",
    code: {
      cpp: `bool searchMatrix(vector<vector<int>>& a, int target) {
    int r = 0, c = a[0].size() - 1;
    while (r < a.size() && c >= 0) {
        if (a[r][c] == target) return true;
        if (a[r][c] > target) c--; else r++;
    }
    return false;
}`,
      java: `public boolean searchMatrix(int[][] a, int target) {
    int r = 0, c = a[0].length - 1;
    while (r < a.length && c >= 0) {
        if (a[r][c] == target) return true;
        if (a[r][c] > target) c--; else r++;
    }
    return false;
}`,
      python: `def search_matrix(a, target):
    r, c = 0, len(a[0]) - 1
    while r < len(a) and c >= 0:
        if a[r][c] == target:
            return True
        if a[r][c] > target:
            c -= 1
        else:
            r += 1
    return False`
    }
  },
  {
    id: "diag-traverse",
    title: "Diagonal Traverse (zig-zag)",
    difficulty: "medium",
    tags: ["Diagonals"],
    desc: "Return all elements in diagonal zig-zag order: up-right on even diagonals, down-left on odd ones.",
    example: "[[1,2,3],[4,5,6],[7,8,9]]  →  [1,2,4,7,5,3,6,8,9]",
    hint: "Cells on diagonal d satisfy i + j = d. Collect each diagonal, reverse it when d is even.",
    approach: "For d from 0 to R+C−2, walk i from max(0, d−C+1) to min(d, R−1) with j = d − i. That list goes down-left; reverse it for even d.",
    complexity: "Time O(R·C) · Space O(min(R,C)) per diagonal",
    link: "https://leetcode.com/problems/diagonal-traverse/",
    code: {
      cpp: `vector<int> findDiagonalOrder(vector<vector<int>>& a) {
    int R = a.size(), C = a[0].size();
    vector<int> out;
    for (int d = 0; d <= R + C - 2; d++) {
        vector<int> diag;
        for (int i = max(0, d - C + 1); i <= min(d, R - 1); i++)
            diag.push_back(a[i][d - i]);
        if (d % 2 == 0) reverse(diag.begin(), diag.end());
        out.insert(out.end(), diag.begin(), diag.end());
    }
    return out;
}`,
      java: `public int[] findDiagonalOrder(int[][] a) {
    int R = a.length, C = a[0].length, k = 0;
    int[] out = new int[R * C];
    for (int d = 0; d <= R + C - 2; d++) {
        int lo = Math.max(0, d - C + 1), hi = Math.min(d, R - 1);
        if (d % 2 == 0)
            for (int i = hi; i >= lo; i--) out[k++] = a[i][d - i];
        else
            for (int i = lo; i <= hi; i++) out[k++] = a[i][d - i];
    }
    return out;
}`,
      python: `def find_diagonal_order(a):
    R, C = len(a), len(a[0])
    out = []
    for d in range(R + C - 1):
        diag = [a[i][d - i] for i in range(max(0, d - C + 1), min(d, R - 1) + 1)]
        out.extend(reversed(diag) if d % 2 == 0 else diag)
    return out`
    }
  },
  {
    id: "game-of-life",
    title: "Game of Life (in place)",
    difficulty: "medium",
    tags: ["In-place", "Bit tricks"],
    desc: "Compute the next state of Conway's Game of Life on a 0/1 grid, updating in place.",
    example: "[[0,1,0],[0,0,1],[1,1,1],[0,0,0]]  →  [[0,0,0],[1,0,1],[0,1,1],[0,1,0]]",
    hint: "Store the next state in bit 1 while keeping the current state in bit 0. Read neighbours with (cell & 1).",
    approach: "For each cell count live neighbours using & 1. If it lives next round set bit 1 (|= 2). Finally shift every cell right by 1.",
    complexity: "Time O(R·C) · Space O(1)",
    link: "https://leetcode.com/problems/game-of-life/",
    code: {
      cpp: `void gameOfLife(vector<vector<int>>& b) {
    int R = b.size(), C = b[0].size();
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++) {
            int live = 0;
            for (int di = -1; di <= 1; di++)
                for (int dj = -1; dj <= 1; dj++) {
                    if (!di && !dj) continue;
                    int r = i + di, c = j + dj;
                    if (r >= 0 && r < R && c >= 0 && c < C) live += b[r][c] & 1;
                }
            if (live == 3 || (live == 2 && (b[i][j] & 1))) b[i][j] |= 2;
        }
    for (auto& row : b) for (int& x : row) x >>= 1;
}`,
      java: `public void gameOfLife(int[][] b) {
    int R = b.length, C = b[0].length;
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++) {
            int live = 0;
            for (int di = -1; di <= 1; di++)
                for (int dj = -1; dj <= 1; dj++) {
                    if (di == 0 && dj == 0) continue;
                    int r = i + di, c = j + dj;
                    if (r >= 0 && r < R && c >= 0 && c < C) live += b[r][c] & 1;
                }
            if (live == 3 || (live == 2 && (b[i][j] & 1) == 1)) b[i][j] |= 2;
        }
    for (int[] row : b) for (int j = 0; j < C; j++) row[j] >>= 1;
}`,
      python: `def game_of_life(b):
    R, C = len(b), len(b[0])
    for i in range(R):
        for j in range(C):
            live = sum(b[r][c] & 1
                       for r in range(max(0, i - 1), min(R, i + 2))
                       for c in range(max(0, j - 1), min(C, j + 2))
                       if (r, c) != (i, j))
            if live == 3 or (live == 2 and b[i][j] & 1):
                b[i][j] |= 2
    for i in range(R):
        for j in range(C):
            b[i][j] >>= 1`
    }
  },
  {
    id: "islands",
    title: "Number of Islands",
    difficulty: "medium",
    tags: ["DFS / BFS", "Grid as graph"],
    desc: "Given a grid of '1' (land) and '0' (water), count the islands (groups of land connected 4-directionally).",
    example: "[[1,1,0,0],[1,1,0,0],[0,0,1,0],[0,0,0,1]]  →  3",
    hint: "Every time you find unvisited land, that's a new island — then sink the whole island so you don't count it again.",
    approach: "Scan every cell. On a '1', increment the count and DFS/BFS to mark all connected land as '0'.",
    complexity: "Time O(R·C) · Space O(R·C) worst-case recursion",
    link: "https://leetcode.com/problems/number-of-islands/",
    code: {
      cpp: `void sink(vector<vector<char>>& g, int r, int c) {
    if (r < 0 || r >= g.size() || c < 0 || c >= g[0].size() || g[r][c] != '1') return;
    g[r][c] = '0';
    sink(g, r + 1, c); sink(g, r - 1, c); sink(g, r, c + 1); sink(g, r, c - 1);
}
int numIslands(vector<vector<char>>& g) {
    int count = 0;
    for (int i = 0; i < g.size(); i++)
        for (int j = 0; j < g[0].size(); j++)
            if (g[i][j] == '1') { count++; sink(g, i, j); }
    return count;
}`,
      java: `public int numIslands(char[][] g) {
    int count = 0;
    for (int i = 0; i < g.length; i++)
        for (int j = 0; j < g[0].length; j++)
            if (g[i][j] == '1') { count++; sink(g, i, j); }
    return count;
}
private void sink(char[][] g, int r, int c) {
    if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] != '1') return;
    g[r][c] = '0';
    sink(g, r + 1, c); sink(g, r - 1, c); sink(g, r, c + 1); sink(g, r, c - 1);
}`,
      python: `from collections import deque

def num_islands(g):
    R, C, count = len(g), len(g[0]), 0
    for i in range(R):
        for j in range(C):
            if g[i][j] == "1":
                count += 1
                g[i][j] = "0"
                q = deque([(i, j)])
                while q:            # BFS avoids recursion limits
                    r, c = q.popleft()
                    for nr, nc in ((r+1, c), (r-1, c), (r, c+1), (r, c-1)):
                        if 0 <= nr < R and 0 <= nc < C and g[nr][nc] == "1":
                            g[nr][nc] = "0"
                            q.append((nr, nc))
    return count`
    }
  },
  {
    id: "range-sum-2d",
    title: "Range Sum Query 2D – Immutable",
    difficulty: "medium",
    tags: ["Prefix sums"],
    desc: "Answer many queries for the sum of the rectangle (r1,c1) → (r2,c2) in O(1) each.",
    example: "sumRegion(2,1,4,3) on the LeetCode sample  →  8",
    hint: "Build P with one extra row and column of zeros. Use inclusion–exclusion.",
    approach: "P[i+1][j+1] = a[i][j] + P[i][j+1] + P[i+1][j] − P[i][j]. Query = P[r2+1][c2+1] − P[r1][c2+1] − P[r2+1][c1] + P[r1][c1].",
    complexity: "Build O(R·C) · Query O(1) · Space O(R·C)",
    link: "https://leetcode.com/problems/range-sum-query-2d-immutable/",
    code: {
      cpp: `class NumMatrix {
    vector<vector<int>> P;
public:
    NumMatrix(vector<vector<int>>& a) {
        int R = a.size(), C = a[0].size();
        P.assign(R + 1, vector<int>(C + 1, 0));
        for (int i = 0; i < R; i++)
            for (int j = 0; j < C; j++)
                P[i + 1][j + 1] = a[i][j] + P[i][j + 1] + P[i + 1][j] - P[i][j];
    }
    int sumRegion(int r1, int c1, int r2, int c2) {
        return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1];
    }
};`,
      java: `class NumMatrix {
    private final int[][] P;
    public NumMatrix(int[][] a) {
        int R = a.length, C = a[0].length;
        P = new int[R + 1][C + 1];
        for (int i = 0; i < R; i++)
            for (int j = 0; j < C; j++)
                P[i + 1][j + 1] = a[i][j] + P[i][j + 1] + P[i + 1][j] - P[i][j];
    }
    public int sumRegion(int r1, int c1, int r2, int c2) {
        return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1];
    }
}`,
      python: `class NumMatrix:
    def __init__(self, a):
        R, C = len(a), len(a[0])
        self.P = P = [[0] * (C + 1) for _ in range(R + 1)]
        for i in range(R):
            for j in range(C):
                P[i + 1][j + 1] = a[i][j] + P[i][j + 1] + P[i + 1][j] - P[i][j]

    def sum_region(self, r1, c1, r2, c2):
        P = self.P
        return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1]`
    }
  },
  {
    id: "sudoku",
    title: "Valid Sudoku",
    difficulty: "medium",
    tags: ["Hashing", "Index mapping"],
    desc: "Check whether a partially filled 9 × 9 Sudoku board is valid (no repeats in any row, column or 3 × 3 box).",
    example: "'.' marks empty cells; only filled cells are checked.",
    hint: "Box index of (i, j) is (i / 3) * 3 + j / 3.",
    approach: "Keep 9 seen-sets each for rows, columns and boxes. For every digit, check and insert into all three.",
    complexity: "Time O(81) · Space O(81)",
    link: "https://leetcode.com/problems/valid-sudoku/",
    code: {
      cpp: `bool isValidSudoku(vector<vector<char>>& b) {
    bool row[9][9] = {}, col[9][9] = {}, box[9][9] = {};
    for (int i = 0; i < 9; i++)
        for (int j = 0; j < 9; j++) {
            if (b[i][j] == '.') continue;
            int d = b[i][j] - '1', k = (i / 3) * 3 + j / 3;
            if (row[i][d] || col[j][d] || box[k][d]) return false;
            row[i][d] = col[j][d] = box[k][d] = true;
        }
    return true;
}`,
      java: `public boolean isValidSudoku(char[][] b) {
    boolean[][] row = new boolean[9][9], col = new boolean[9][9], box = new boolean[9][9];
    for (int i = 0; i < 9; i++)
        for (int j = 0; j < 9; j++) {
            if (b[i][j] == '.') continue;
            int d = b[i][j] - '1', k = (i / 3) * 3 + j / 3;
            if (row[i][d] || col[j][d] || box[k][d]) return false;
            row[i][d] = col[j][d] = box[k][d] = true;
        }
    return true;
}`,
      python: `def is_valid_sudoku(b):
    seen = set()
    for i in range(9):
        for j in range(9):
            v = b[i][j]
            if v == ".":
                continue
            keys = {("r", i, v), ("c", j, v), ("b", i // 3, j // 3, v)}
            if keys & seen:
                return False
            seen |= keys
    return True`
    }
  },
  {
    id: "kth-smallest",
    title: "Kth Smallest Element in a Sorted Matrix",
    difficulty: "medium",
    tags: ["Binary search on value", "Heap"],
    desc: "Rows and columns of an n × n matrix are sorted ascending. Return the k-th smallest element.",
    example: "[[1,5,9],[10,11,13],[12,13,15]], k=8  →  13",
    hint: "Binary search on the value range. Count elements ≤ mid with the staircase walk in O(n).",
    approach: "lo = a[0][0], hi = a[n−1][n−1]. While lo < hi: count(≤ mid); if count < k, lo = mid + 1, else hi = mid. Answer is lo.",
    complexity: "Time O(n · log(max − min)) · Space O(1)",
    link: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/",
    code: {
      cpp: `int kthSmallest(vector<vector<int>>& a, int k) {
    int n = a.size(), lo = a[0][0], hi = a[n - 1][n - 1];
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2, cnt = 0;
        for (int i = n - 1, j = 0; i >= 0 && j < n; ) {
            if (a[i][j] <= mid) { cnt += i + 1; j++; }
            else i--;
        }
        if (cnt < k) lo = mid + 1; else hi = mid;
    }
    return lo;
}`,
      java: `public int kthSmallest(int[][] a, int k) {
    int n = a.length, lo = a[0][0], hi = a[n - 1][n - 1];
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2, cnt = 0;
        for (int i = n - 1, j = 0; i >= 0 && j < n; ) {
            if (a[i][j] <= mid) { cnt += i + 1; j++; }
            else i--;
        }
        if (cnt < k) lo = mid + 1; else hi = mid;
    }
    return lo;
}`,
      python: `def kth_smallest(a, k):
    n = len(a)
    lo, hi = a[0][0], a[-1][-1]
    while lo < hi:
        mid = (lo + hi) // 2
        cnt, i, j = 0, n - 1, 0
        while i >= 0 and j < n:          # staircase count of values <= mid
            if a[i][j] <= mid:
                cnt += i + 1
                j += 1
            else:
                i -= 1
        if cnt < k:
            lo = mid + 1
        else:
            hi = mid
    return lo`
    }
  },
  {
    id: "maximal-square",
    title: "Maximal Square",
    difficulty: "medium",
    tags: ["DP"],
    desc: "In a 0/1 matrix, find the area of the largest square containing only 1s.",
    example: "[[1,0,1,0,0],[1,0,1,1,1],[1,1,1,1,1],[1,0,0,1,0]]  →  4",
    hint: "dp[i][j] = side of the largest square whose bottom-right corner is (i, j).",
    approach: "If a[i][j] is 1: dp[i][j] = 1 + min(top, left, top-left). Track the max side and return side².",
    complexity: "Time O(R·C) · Space O(R·C) (O(C) with a rolling row)",
    link: "https://leetcode.com/problems/maximal-square/",
    code: {
      cpp: `int maximalSquare(vector<vector<char>>& a) {
    int R = a.size(), C = a[0].size(), best = 0;
    vector<vector<int>> dp(R + 1, vector<int>(C + 1, 0));
    for (int i = 1; i <= R; i++)
        for (int j = 1; j <= C; j++)
            if (a[i - 1][j - 1] == '1') {
                dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
                best = max(best, dp[i][j]);
            }
    return best * best;
}`,
      java: `public int maximalSquare(char[][] a) {
    int R = a.length, C = a[0].length, best = 0;
    int[][] dp = new int[R + 1][C + 1];
    for (int i = 1; i <= R; i++)
        for (int j = 1; j <= C; j++)
            if (a[i - 1][j - 1] == '1') {
                dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));
                best = Math.max(best, dp[i][j]);
            }
    return best * best;
}`,
      python: `def maximal_square(a):
    R, C, best = len(a), len(a[0]), 0
    dp = [[0] * (C + 1) for _ in range(R + 1)]
    for i in range(1, R + 1):
        for j in range(1, C + 1):
            if a[i - 1][j - 1] == "1":
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
                best = max(best, dp[i][j])
    return best * best`
    }
  },
  {
    id: "maximal-rectangle",
    title: "Maximal Rectangle",
    difficulty: "hard",
    tags: ["Monotonic stack", "Histogram"],
    desc: "In a 0/1 matrix, find the area of the largest rectangle containing only 1s.",
    example: "[[1,0,1,0,0],[1,0,1,1,1],[1,1,1,1,1],[1,0,0,1,0]]  →  6",
    hint: "Treat each row as the floor of a histogram: heights[j] = consecutive 1s ending at this row. Then solve 'Largest Rectangle in Histogram'.",
    approach: "Update heights row by row; for each row run the monotonic-stack histogram algorithm and keep the max.",
    complexity: "Time O(R·C) · Space O(C)",
    link: "https://leetcode.com/problems/maximal-rectangle/",
    code: {
      cpp: `int largestInHistogram(vector<int>& h) {
    stack<int> st; int best = 0, n = h.size();
    for (int i = 0; i <= n; i++) {
        int cur = (i == n) ? 0 : h[i];
        while (!st.empty() && h[st.top()] >= cur) {
            int height = h[st.top()]; st.pop();
            int width = st.empty() ? i : i - st.top() - 1;
            best = max(best, height * width);
        }
        st.push(i);
    }
    return best;
}
int maximalRectangle(vector<vector<char>>& a) {
    int C = a[0].size(), best = 0;
    vector<int> h(C, 0);
    for (auto& row : a) {
        for (int j = 0; j < C; j++) h[j] = row[j] == '1' ? h[j] + 1 : 0;
        best = max(best, largestInHistogram(h));
    }
    return best;
}`,
      java: `public int maximalRectangle(char[][] a) {
    int C = a[0].length, best = 0;
    int[] h = new int[C];
    for (char[] row : a) {
        for (int j = 0; j < C; j++) h[j] = row[j] == '1' ? h[j] + 1 : 0;
        best = Math.max(best, largestInHistogram(h));
    }
    return best;
}
private int largestInHistogram(int[] h) {
    Deque<Integer> st = new ArrayDeque<>();
    int best = 0, n = h.length;
    for (int i = 0; i <= n; i++) {
        int cur = (i == n) ? 0 : h[i];
        while (!st.isEmpty() && h[st.peek()] >= cur) {
            int height = h[st.pop()];
            int width = st.isEmpty() ? i : i - st.peek() - 1;
            best = Math.max(best, height * width);
        }
        st.push(i);
    }
    return best;
}`,
      python: `def maximal_rectangle(a):
    C, best = len(a[0]), 0
    h = [0] * C
    for row in a:
        for j in range(C):
            h[j] = h[j] + 1 if row[j] == "1" else 0
        stack = []
        for i, cur in enumerate(h + [0]):
            while stack and h[stack[-1]] >= cur:
                height = h[stack.pop()]
                width = i if not stack else i - stack[-1] - 1
                best = max(best, height * width)
            stack.append(i)
    return best`
    }
  },
  {
    id: "lip",
    title: "Longest Increasing Path in a Matrix",
    difficulty: "hard",
    tags: ["DFS + memo", "Grid as graph"],
    desc: "Return the length of the longest strictly increasing path, moving up/down/left/right.",
    example: "[[9,9,4],[6,6,8],[2,1,1]]  →  4   (1 → 2 → 6 → 9)",
    hint: "Strictly increasing means no cycles — the grid is a DAG. Memoise the best path starting at each cell.",
    approach: "memo[r][c] = 1 + max(memo of larger neighbours). Compute with DFS; each cell is solved once.",
    complexity: "Time O(R·C) · Space O(R·C)",
    link: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/",
    code: {
      cpp: `int R, C;
vector<vector<int>> memo;
int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};
int dfs(vector<vector<int>>& a, int r, int c) {
    if (memo[r][c]) return memo[r][c];
    int best = 1;
    for (auto& d : dirs) {
        int nr = r + d[0], nc = c + d[1];
        if (nr >= 0 && nr < R && nc >= 0 && nc < C && a[nr][nc] > a[r][c])
            best = max(best, 1 + dfs(a, nr, nc));
    }
    return memo[r][c] = best;
}
int longestIncreasingPath(vector<vector<int>>& a) {
    R = a.size(); C = a[0].size();
    memo.assign(R, vector<int>(C, 0));
    int ans = 0;
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++) ans = max(ans, dfs(a, i, j));
    return ans;
}`,
      java: `private int R, C;
private int[][] memo;
private final int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
public int longestIncreasingPath(int[][] a) {
    R = a.length; C = a[0].length; memo = new int[R][C];
    int ans = 0;
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++) ans = Math.max(ans, dfs(a, i, j));
    return ans;
}
private int dfs(int[][] a, int r, int c) {
    if (memo[r][c] != 0) return memo[r][c];
    int best = 1;
    for (int[] d : dirs) {
        int nr = r + d[0], nc = c + d[1];
        if (nr >= 0 && nr < R && nc >= 0 && nc < C && a[nr][nc] > a[r][c])
            best = Math.max(best, 1 + dfs(a, nr, nc));
    }
    return memo[r][c] = best;
}`,
      python: `from functools import lru_cache

def longest_increasing_path(a):
    R, C = len(a), len(a[0])

    @lru_cache(maxsize=None)
    def dfs(r, c):
        best = 1
        for nr, nc in ((r+1, c), (r-1, c), (r, c+1), (r, c-1)):
            if 0 <= nr < R and 0 <= nc < C and a[nr][nc] > a[r][c]:
                best = max(best, 1 + dfs(nr, nc))
        return best

    return max(dfs(i, j) for i in range(R) for j in range(C))`
    }
  }
];

window.QUIZ = [
  {
    q: "For int a[5][8], what does a.length (Java) / len(a) (Python) return?",
    opts: ["8", "5", "40", "13"],
    a: 1,
    exp: "The outer array holds the rows, so its length is the number of rows: 5. Columns are a[0].length = 8."
  },
  {
    q: "In row-major order, at which flat index is cell (2, 3) of a 4 × 6 matrix stored?",
    opts: ["9", "15", "18", "14"],
    a: 1,
    exp: "index = i × C + j = 2 × 6 + 3 = 15."
  },
  {
    q: "Which cells lie on the same anti-diagonal as (1, 3)?",
    opts: ["Cells where i − j = −2", "Cells where i + j = 4", "Cells where i × j = 3", "Cells in row 1 or column 3"],
    a: 1,
    exp: "Anti-diagonals (top-right to bottom-left) share the same i + j. Main diagonals share i − j."
  },
  {
    q: "Rotating an n × n matrix 90° clockwise in place can be done by…",
    opts: ["Reversing each row, then each column", "Transposing, then reversing each row", "Transposing twice", "Reversing each column only"],
    a: 1,
    exp: "Transpose turns rows into columns; reversing each row then fixes the direction, giving a clockwise rotation."
  },
  {
    q: "What is wrong with grid = [[0] * 3] * 3 in Python?",
    opts: ["It creates a 1D list", "Nothing", "All three rows are the same list object", "It raises a TypeError"],
    a: 2,
    exp: "The outer * copies the reference, so changing grid[0][0] changes column 0 of every row. Use a comprehension."
  },
  {
    q: "Rows and columns are each sorted. Fastest simple way to search for a value?",
    opts: ["Linear scan, O(R·C)", "Start top-right and move left/down, O(R + C)", "Binary search on the flattened matrix", "Sort the matrix first"],
    a: 1,
    exp: "The staircase search eliminates a row or column every step. Flattened binary search only works if each row starts after the previous ends."
  },
  {
    q: "With a padded prefix-sum table P, the sum of the rectangle (r1,c1)→(r2,c2) is…",
    opts: [
      "P[r2][c2] − P[r1][c1]",
      "P[r2+1][c2+1] − P[r1][c2+1] − P[r2+1][c1] + P[r1][c1]",
      "P[r2+1][c2+1] − P[r1][c1]",
      "P[r2][c2] + P[r1][c1] − P[r1][c2] − P[r2][c1]"
    ],
    a: 1,
    exp: "Inclusion–exclusion: subtract the strip above and the strip to the left, then add back the top-left corner subtracted twice."
  },
  {
    q: "Time complexity of counting islands in an R × C grid with DFS?",
    opts: ["O(R + C)", "O(R·C)", "O((R·C)²)", "O(R·C·log(R·C))"],
    a: 1,
    exp: "Each cell is visited a constant number of times (once by the scan, once when it's sunk), so it's linear in the number of cells."
  }
];
