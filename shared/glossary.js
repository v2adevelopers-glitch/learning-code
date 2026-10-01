// Plain-English glossary shared by every topic page.
// Words in normal text that match an entry get a dotted underline; clicking one opens a
// small popup with a definition and an example. A "Words used on this page" list is
// added at the end of each topic page.
(function () {
  "use strict";

  // id, term (title shown in the popup), def, ex (example), match (case-insensitive phrases),
  // cs (case-sensitive phrases, used for acronyms), re (extra raw regex sources).
  const ENTRIES = [
    // ---------- general programming ----------
    { id: "algorithm", term: "Algorithm", match: ["algorithm", "algorithms"],
      def: "A step-by-step recipe for solving a problem that a computer can follow.",
      ex: "“Look at each number and remember the biggest one so far” is an algorithm for finding the maximum." },
    { id: "array", term: "Array", match: ["array", "arrays"],
      def: "A list of values stored side by side, where each value has a numbered position.",
      ex: "[7, 3, 9] is an array with 3 elements: 7 at position 0, 3 at position 1, 9 at position 2." },
    { id: "element", term: "Element", match: ["element", "elements"],
      def: "One value stored inside an array, list or other collection.",
      ex: "In [4, 8, 15], the number 8 is an element." },
    { id: "index", term: "Index", match: ["index", "indices", "indexes", "indexing", "0-indexed", "1-indexed"],
      def: "The position number of an element. Most languages start counting at 0, not 1.",
      ex: "In ['a', 'b', 'c'], 'a' is at index 0 and 'c' is at index 2." },
    { id: "variable", term: "Variable", match: ["variable", "variables"],
      def: "A named box that stores a value your program can read and change.",
      ex: "let count = 0; creates a variable called count that holds 0." },
    { id: "function", term: "Function", match: ["function", "functions"],
      def: "A named, reusable block of code that takes inputs and gives back a result.",
      ex: "max(a, b) is a function that returns the bigger of two numbers." },
    { id: "loop", term: "Loop", match: ["loop", "loops", "nested loops", "nested loop"],
      def: "Code that repeats a block of instructions, usually once for every item or until a condition is met. Nested loops are loops inside loops.",
      ex: "for (let i = 0; i < 5; i++) runs its body 5 times, with i = 0, 1, 2, 3, 4." },
    { id: "integer", term: "Integer", match: ["integer", "integers", "int"],
      def: "A whole number with no fractional part. It can be negative, zero or positive.",
      ex: "−3, 0 and 42 are integers; 2.5 is not." },
    { id: "string", term: "String", match: ["string", "strings"],
      def: "A piece of text: a sequence of characters.",
      ex: "\"hello\" is a string of 5 characters." },
    { id: "boolean", term: "Boolean", match: ["boolean", "true/false", "yes/no question", "yes/no"],
      def: "A value that is either true or false — the answer to a yes/no question.",
      ex: "isEven(4) returns true; isEven(7) returns false." },
    { id: "null", term: "null", match: ["null", "nullptr"],
      def: "A special value meaning “nothing here” — for example, a pointer that doesn't point to anything.",
      ex: "The last node of a linked list has next = null because nothing comes after it." },
    { id: "pointer", term: "Pointer / reference", match: ["pointer", "pointers", "reference", "references"],
      def: "A value that tells you where something else is stored, so you can reach it. In Java and JavaScript these are called references.",
      ex: "A linked-list node's next pointer leads you to the following node." },
    { id: "modulo", term: "Modulo (%)", match: ["modulo", "remainder"], re: ["k % C", "% k", "% cap", "% n"],
      def: "The remainder left over after division. Written % in most languages.",
      ex: "17 % 5 = 2, because 17 = 3 × 5 + 2. Handy for wrapping around: (index + 1) % size." },
    { id: "floor", term: "Floor / integer division", match: ["floor", "rounds down", "round down", "rounded down", "truncate", "truncates", "truncated", "round up", "rounds up", "rounded up"],
      def: "Dropping the fractional part of a division result. Rounding down goes toward −∞; truncating goes toward 0 (they differ only for negative numbers).",
      ex: "7 / 2 = 3.5 → floor gives 3. −7 / 2 = −3.5 → floor gives −4, truncation gives −3." },
    { id: "overflow", term: "Integer overflow", match: ["overflow", "overflows", "overflowing", "integer overflow"],
      def: "When a number gets too big for its type and wraps around to a wrong (often negative) value. A 32-bit int can only hold up to about 2.1 billion.",
      ex: "In Java, 2,000,000,000 + 2,000,000,000 as ints gives −294,967,296. Use long (64-bit) to be safe." },
    { id: "edge-case", term: "Edge case", match: ["edge case", "edge cases", "corner case", "corner cases"],
      def: "An unusual or extreme input that often breaks code that works on normal inputs.",
      ex: "For a sorting function: an empty list, a list with one item, or a list where every value is the same." },
    { id: "brute-force", term: "Brute force", match: ["brute force", "brute-force", "naive"],
      def: "Solving a problem by trying every possibility. Simple and correct, but usually too slow for large inputs.",
      ex: "To find two numbers that add up to 10, check every possible pair — about n² checks." },
    { id: "constraints", term: "Constraints", match: ["constraint", "constraints"],
      def: "The limits given in a problem, such as the maximum input size. They tell you how fast your solution must be.",
      ex: "If n ≤ 100,000, an O(n²) solution (10 billion steps) is too slow, but O(n log n) is fine." },
    { id: "leetcode", term: "LeetCode", cs: ["LeetCode", "LintCode", "GeeksforGeeks", "SPOJ"],
      def: "Websites with thousands of programming practice problems, widely used to prepare for coding interviews. The “Practice ↗” links go there.",
      ex: "“LeetCode 704” means problem number 704 on leetcode.com." },
    { id: "comparator", term: "Comparator", match: ["comparator", "comparators"],
      def: "A small function that tells a sort which of two items should come first. It returns a negative number, zero or a positive number.",
      ex: "(a, b) => a - b sorts numbers smallest first; (a, b) => b - a sorts largest first." },
    { id: "lexicographic", term: "Lexicographic (dictionary) order", match: ["lexicographic", "lexicographically", "as strings", "compared as strings", "string order"],
      def: "Ordering text the way a dictionary does: compare the first character, then the second, and so on.",
      ex: "As strings, \"10\" comes before \"9\" because '1' < '9' — which is why [10, 9].sort() in JavaScript gives [10, 9]." },
    { id: "cache", term: "Cache / cache-friendly", match: ["cache-friendly", "cache", "caches"],
      def: "A cache is a small, fast store that keeps recently used data so it can be reached again quickly. The processor has one for memory (so reading neighbouring values is fast — “cache-friendly” code does that), and programs build their own, like an LRU cache.",
      ex: "Looping through a 2D array row by row is faster than column by column. A web browser caches images so revisiting a page loads instantly." },
    { id: "call-stack", term: "Call stack", match: ["call stack", "stack overflow", "recursion depth", "stack frame"],
      def: "The memory that keeps track of functions that are still running. Each nested call adds a layer; very deep recursion can run out of space (a stack overflow).",
      ex: "A recursive function calling itself 100,000 times deep can crash with “Maximum call stack size exceeded”." },
    { id: "bitwise", term: "Bitwise operations", match: ["bitwise", "bit tricks", "bits"],
      def: "Operations on the individual 0/1 bits of a number. & keeps bits set in both, | sets bits, >> shifts bits right.",
      ex: "5 is 101 in binary. 5 & 1 = 1 (lowest bit). 5 >> 1 = 2 (binary 10)." },

    { id: "swap", term: "Swap", match: ["swap", "swaps", "swapped", "swapping"],
      def: "Exchanging the positions (or values) of two items.",
      ex: "Swapping a[0] and a[2] in [5, 8, 1] gives [1, 8, 5]." },
    { id: "ascending", term: "Ascending / descending", match: ["ascending", "descending", "non-decreasing", "increasing order", "decreasing order"],
      def: "Ascending = smallest to largest. Descending = largest to smallest.",
      ex: "[1, 3, 7] is ascending; [7, 3, 1] is descending." },
    { id: "parity", term: "Parity (even / odd)", match: ["parity"],
      def: "Whether a number is even or odd.",
      ex: "4 and 10 have even parity; 3 and 7 have odd parity. In code: x % 2 === 0 means even." },
    { id: "frequency", term: "Frequency", match: ["frequency", "frequencies"],
      def: "How many times something appears.",
      ex: "In \"banana\", the letter 'a' has frequency 3." },
    { id: "builtin", term: "Built-in / library function", match: ["built-in", "built-ins", "library", "libraries", "standard library"],
      def: "Ready-made code that comes with the programming language, so you don't have to write it yourself.",
      ex: "JavaScript's array.sort(), C++'s std::sort and Java's Arrays.sort are built-in sorting functions." },
    { id: "template-code", term: "Template (code pattern)", pages: ["binary-search", "trees"], match: ["template", "templates"],
      def: "A general code shape you can reuse for many problems by changing only a small part.",
      ex: "The “first true” binary search template works for any yes/no question — you only swap in a new check." },
    { id: "class-object", term: "Class / object", match: ["class", "classes", "object", "objects", "instance", "instances"],
      def: "A class is a blueprint describing data plus the functions that work on it. An object (instance) is one thing built from that blueprint.",
      ex: "class ListNode { val; next } is a blueprint; new ListNode(7) creates an object holding 7." },
    { id: "token", term: "Token", match: ["token", "tokens"],
      def: "One meaningful piece of a longer text after it has been split up.",
      ex: "\"2 1 + 3 *\" split by spaces gives the tokens \"2\", \"1\", \"+\", \"3\", \"*\"." },
    { id: "operator", term: "Operator / operand", match: ["operator", "operators", "operand", "operands", "unary minus", "unary"],
      def: "An operator is a symbol for an action (+, −, ×, ÷). Operands are the values it works on. A unary minus applies to a single value, as in −5.",
      ex: "In 3 + 4, + is the operator and 3 and 4 are the operands." },
    { id: "encode", term: "Encode / decode", match: ["encode", "encoded", "encoding", "decode", "decoded", "decoding"],
      def: "Encoding writes information in a special format; decoding turns it back into the original.",
      ex: "\"3[a]\" is an encoded form of \"aaa\"; decoding it gives \"aaa\"." },
    { id: "unix-path", term: "Unix path", match: ["unix path", "unix-style path", "unix", "absolute path", "canonical path", "canonical"],
      def: "A file location written with forward slashes, starting from the top folder “/”. “.” means the current folder and “..” means the parent folder. The canonical form is the simplest equivalent path.",
      ex: "/home/ana/../bob/./notes simplifies to /home/bob/notes." },
    { id: "undefined-behaviour", term: "Undefined behaviour", match: ["undefined behaviour", "undefined behavior"],
      def: "In C/C++, doing something the language rules forbid. The program might crash, give wrong answers, or seem to work — anything can happen.",
      ex: "Reading past the end of an array, or popping from an empty std::stack." },
    { id: "thread-safe", term: "Synchronised (thread-safe)", match: ["synchronised", "synchronized", "thread-safe"],
      def: "Code protected so several parts of a program running at the same time can use it safely. The protection adds overhead, so it's slower when you don't need it.",
      ex: "Java's old Stack class is synchronised; ArrayDeque isn't, so it's faster in normal code." },
    { id: "optimal", term: "Optimal", match: ["optimal", "optimum", "suboptimal", "optimally", "optimise", "optimize"],
      def: "The best possible — no other answer is better (for example, cheapest, shortest or largest).",
      ex: "Coins {1, 3, 4} for 6: two coins (3 + 3) is optimal; three coins (4 + 1 + 1) is not." },
    { id: "feasible", term: "Feasible", match: ["feasible", "feasibility", "infeasible"],
      def: "Possible: meets all the rules of the problem (it doesn't have to be the best).",
      ex: "Shipping capacity 20 is feasible if all packages can go within the day limit." },
    { id: "greedy-choice", term: "Greedy-choice property / optimal substructure", match: ["greedy-choice property", "greedy-choice", "optimal substructure"],
      def: "Greedy-choice property: making the locally best choice never rules out the best overall answer. Optimal substructure: the best answer is built from best answers to smaller pieces.",
      ex: "Picking the meeting that ends first is always part of some best schedule — so the greedy choice is safe." },
    { id: "cases", term: "Worst / average / best case", match: ["worst case", "worst-case", "average case", "best case", "on average"],
      def: "How fast an algorithm runs on the hardest possible input (worst), on typical input (average), and on the easiest input (best).",
      ex: "Quick sort: O(n log n) on average, but O(n²) in the worst case if the pivot is always the smallest value." },
    { id: "linear-search", term: "Linear search", match: ["linear search", "linear scan", "one pass", "single pass", "one linear pass"],
      def: "Checking items one by one from start to end. Simple, but O(n).",
      ex: "Looking for a name by reading a list from the top until you find it." },
    { id: "bounds", term: "Out of bounds", match: ["out of bounds", "out-of-bounds", "bounds check", "bounds-check", "inside the grid"],
      def: "Trying to use a position that doesn't exist in an array or grid, like index −1 or index n.",
      ex: "In a 3×3 grid, the neighbour above row 0 would be row −1 — out of bounds, so skip it." },
    { id: "flatten", term: "Flatten", match: ["flatten", "flattened", "flattening"],
      def: "Turning a nested structure (like a 2D grid) into one flat list.",
      ex: "[[1, 2], [3, 4]] flattened is [1, 2, 3, 4]." },
    { id: "dot-product", term: "Matrix multiplication / dot product", match: ["matrix multiplication", "dot product"],
      def: "A dot product multiplies two lists of numbers position by position and adds the results. In matrix multiplication, each result cell is the dot product of a row and a column.",
      ex: "[1, 2] · [3, 4] = 1×3 + 2×4 = 11." },
    { id: "immutable", term: "Immutable", match: ["immutable", "mutable"],
      def: "Cannot be changed after it's created. (Mutable means it can.)",
      ex: "In “Range Sum Query – Immutable”, the grid never changes, so precomputing sums once is safe." },
    { id: "comparison-sort", term: "Comparison sort", match: ["comparison sort", "comparison sorts", "comparison-based"],
      def: "A sort that learns about the data only by asking “is a smaller than b?”.",
      ex: "Merge, quick and heap sort are comparison sorts; counting sort is not." },
    { id: "sweep", term: "Sweep", match: ["sweep", "sweeps", "line sweep"],
      def: "Processing items in sorted order in one pass from left to right, keeping track of what's “currently active”.",
      ex: "Sort meetings by start time, then sweep through them counting how many rooms are in use." },

    // ---------- complexity ----------
    { id: "big-o", term: "Big-O notation", match: ["big-o", "big o", "time complexity", "space complexity", "complexity", "linear time", "constant time", "quadratic", "logarithmic"],
      re: ["O\\((?:[^()]|\\([^()]*\\))*\\)"],
      def: "A way to describe how the work (or memory) grows as the input size n grows, ignoring small details. O(1) = same speed no matter the size, O(n) = grows in step with n, O(n²) = grows with n × n, O(log n) = grows very slowly.",
      ex: "For n = 1,000,000: O(log n) ≈ 20 steps, O(n) = 1 million, O(n²) = 1 trillion steps." },
    { id: "log", term: "Logarithm (log n)", match: ["logarithm", "log n", "log₂ n", "log₂(n)", "log₂"],
      def: "How many times you can halve n until you reach 1. It grows very slowly.",
      ex: "log₂(8) = 3 because 8 → 4 → 2 → 1. log₂(1,000,000) ≈ 20." },
    { id: "factorial", term: "Factorial (n!)", match: ["factorial"], re: ["\\bn!"],
      def: "The product 1 × 2 × … × n. It counts how many different orders n items can be arranged in.",
      ex: "3! = 6: the orders of A, B, C are ABC, ACB, BAC, BCA, CAB, CBA." },
    { id: "amortised", term: "Amortised", match: ["amortised", "amortized"],
      def: "The average cost per operation over a long sequence. An occasional slow step is fine if it's rare enough.",
      ex: "A dynamic array sometimes copies itself to grow (slow), but adding an item is O(1) amortised." },

    // ---------- techniques ----------
    { id: "recursion", term: "Recursion", match: ["recursion", "recursive", "recursively", "recurse", "recurses", "recursing"],
      def: "A function that solves a problem by calling itself on a smaller version of the same problem.",
      ex: "height(tree) = 1 + max(height(left subtree), height(right subtree))." },
    { id: "base-case", term: "Base case", match: ["base case", "base cases"],
      def: "The simplest input a recursive function answers directly, without calling itself again. It stops the recursion.",
      ex: "In height(node), “if node is null, return 0” is the base case." },
    { id: "iterative", term: "Iterative", match: ["iterative", "iteratively", "iteration", "iterate", "iterates"],
      def: "Solved with loops instead of recursion.",
      ex: "An iterative DFS uses an explicit stack and a while loop instead of calling itself." },
    { id: "in-place", term: "In place", match: ["in place", "in-place"],
      def: "Changes the input directly, using only a tiny amount of extra memory instead of building a copy.",
      ex: "Reversing [1, 2, 3] in place swaps values inside the same array to make [3, 2, 1]." },
    { id: "invariant", term: "Invariant", match: ["invariant", "invariants"],
      def: "A fact that stays true at every step of a loop. Writing it down helps you prove the code is correct.",
      ex: "In binary search: “if the target exists, it is always between lo and hi”." },
    { id: "monotonic", term: "Monotonic", match: ["monotonic", "monotonicity", "monotonically"],
      def: "Only ever goes one way — never increasing, or never decreasing.",
      ex: "[no, no, no, yes, yes] is monotonic. A monotonic stack keeps its values in sorted order." },
    { id: "predicate", term: "Predicate", match: ["predicate", "predicates"],
      def: "A yes/no test you can ask about a value.",
      ex: "isBad(version) or “can Koko finish at speed k?” are predicates." },
    { id: "two-pointers", term: "Two pointers", match: ["two pointers", "two-pointer", "two pointer"],
      def: "A technique that walks two positions through the data — often from both ends towards the middle — to avoid checking every pair.",
      ex: "To check if \"racecar\" is a palindrome, compare the first and last letters, then move both inward." },
    { id: "sliding-window", term: "Sliding window", match: ["sliding window", "sliding-window", "window"],
      def: "Looking at a fixed-size (or growing/shrinking) chunk of consecutive items and moving it along one step at a time.",
      ex: "Max of every 3 consecutive numbers in [1, 3, −1, −3, 5]: windows [1,3,−1], [3,−1,−3], [−1,−3,5]." },
    { id: "prefix-sum", term: "Prefix sum", match: ["prefix sum", "prefix sums", "prefix-sum"],
      def: "A running total: position i stores the sum of everything before it. Then any range sum is one subtraction.",
      ex: "For [3, 1, 4, 1]: prefix = [0, 3, 4, 8, 9]. Sum of items 1..2 = 8 − 3 = 5." },
    { id: "divide-conquer", term: "Divide and conquer", match: ["divide and conquer", "divide & conquer"],
      def: "Split a problem into smaller pieces, solve each piece, then combine the answers.",
      ex: "Merge sort splits a list in half, sorts both halves, then merges them." },
    { id: "dp", term: "Dynamic programming (DP)", match: ["dynamic programming"], cs: ["DP"],
      def: "Solving a problem by building on answers to smaller sub-problems and storing them, so nothing is computed twice.",
      ex: "Largest square of 1s: the answer at each cell = 1 + the smallest answer of its top, left and top-left neighbours." },
    { id: "memo", term: "Memoisation", match: ["memoisation", "memoization", "memoise", "memoize", "memo", "memoised"],
      def: "Remembering the result of a function call so the next call with the same input returns instantly.",
      ex: "Store the longest path from each cell the first time you compute it; reuse it later." },
    { id: "greedy", term: "Greedy algorithm", match: ["greedy"],
      def: "Builds an answer step by step, always taking the option that looks best right now and never going back.",
      ex: "Making change with the largest coin that fits: 63¢ → 25, 25, 10, 1, 1, 1." },
    { id: "exchange", term: "Exchange argument", match: ["exchange argument", "exchange-argument"],
      def: "A way to prove a greedy choice is safe: show you can swap it into any best solution without making it worse.",
      ex: "If a best schedule doesn't start with the meeting that ends first, swapping that meeting in still leaves room for the rest." },
    { id: "hash", term: "Hash map / hash set", match: ["hash map", "hash maps", "hashmap", "hash set", "hash table", "hashing", "hash"],
      def: "A structure that stores items by key and finds them almost instantly (O(1) on average) — like looking a word up directly instead of reading the whole dictionary.",
      ex: "A map from name → phone number: map.get(\"Ana\") returns her number immediately." },
    { id: "bucket", term: "Bucket", match: ["bucket", "buckets"],
      def: "A group (often a list in an array slot) that collects items sharing some property, such as the same frequency or value range.",
      ex: "Bucket[3] holds every number that appears exactly 3 times." },
    { id: "pigeonhole", term: "Pigeonhole principle", match: ["pigeonhole"],
      def: "If you put more items into boxes than there are boxes, some box gets at least two items.",
      ex: "With 13 people, at least two share a birth month." },
    { id: "simulation", term: "Simulation", match: ["simulation", "simulate", "simulating"],
      def: "Solving a problem by carefully acting out exactly what the problem describes, step by step.",
      ex: "Lemonade Change: hand out change customer by customer, tracking which bills you hold." },

    // ---------- arrays & matrices ----------
    { id: "matrix", term: "Matrix / 2D array", match: ["matrix", "matrices", "2d array", "2d arrays", "grid", "grids"],
      def: "A table of values arranged in rows and columns. You reach a value with two numbers: a[row][column].",
      ex: "[[1, 2, 3], [4, 5, 6]] has 2 rows and 3 columns; a[1][0] is 4." },
    { id: "row-major", term: "Row-major order", match: ["row-major", "row major", "column-major", "column major"],
      def: "Storing a table in memory row by row: all of row 0, then all of row 1, and so on. Column-major is the opposite.",
      ex: "[[1, 2], [3, 4]] is stored as 1, 2, 3, 4 in row-major order (1, 3, 2, 4 in column-major)." },
    { id: "jagged", term: "Jagged array", match: ["jagged", "jagged array", "jagged arrays"],
      def: "A 2D array whose rows have different lengths.",
      ex: "[[1], [1, 1], [1, 2, 1]] — row 0 has 1 item, row 2 has 3." },
    { id: "transpose", term: "Transpose", match: ["transpose", "transposed", "transposing"],
      def: "Flipping a matrix over its main diagonal: rows become columns.",
      ex: "[[1, 2, 3], [4, 5, 6]] transposed is [[1, 4], [2, 5], [3, 6]]." },
    { id: "diagonal", term: "Diagonal / anti-diagonal", match: ["anti-diagonal", "anti-diagonals", "main diagonal", "diagonal", "diagonals"],
      def: "The main diagonal runs from top-left to bottom-right (cells where row = column). An anti-diagonal runs top-right to bottom-left (row + column is the same).",
      ex: "In a 3×3 grid, (0,0), (1,1), (2,2) is the main diagonal; (0,2), (1,1), (2,0) is an anti-diagonal." },
    { id: "spiral", term: "Spiral order", match: ["spiral"],
      def: "Reading a matrix around its edge clockwise, then the next ring inside, like a snail shell.",
      ex: "[[1,2,3],[4,5,6],[7,8,9]] in spiral order is 1, 2, 3, 6, 9, 8, 7, 4, 5." },
    { id: "subarray", term: "Subarray / contiguous", match: ["subarray", "subarrays", "contiguous", "consecutive"],
      def: "A run of neighbouring elements taken from an array without skipping any (contiguous = next to each other).",
      ex: "In [5, 2, 8, 1], [2, 8] is a subarray; [5, 8] is not (it skips 2)." },
    { id: "interval", term: "Interval", match: ["interval", "intervals"],
      def: "A range with a start and an end, such as a meeting from 9 to 11.",
      ex: "[1, 3] and [2, 5] overlap; [1, 2] and [3, 4] don't." },
    { id: "manhattan", term: "Manhattan distance", match: ["manhattan distance", "manhattan"],
      def: "Distance measured like walking city blocks: horizontal steps + vertical steps.",
      ex: "From (0, 0) to (3, 4): 3 + 4 = 7." },
    { id: "flood-fill", term: "Flood fill", match: ["flood fill", "flood-fill", "flood fills", "flood from", "flood-fills"],
      def: "Starting from one cell and spreading to every connected cell of the same kind, like the paint-bucket tool in a drawing app.",
      ex: "Click inside a shape with the bucket tool and every touching pixel of that colour changes." },
    { id: "island", term: "Island (grid problems)", match: ["island", "islands"],
      def: "A group of land cells (1s) connected up, down, left or right, surrounded by water (0s).",
      ex: "In [[1,1,0],[0,0,1]] there are 2 islands." },

    // ---------- searching & sorting ----------
    { id: "binary-search", term: "Binary search", match: ["binary search", "binary-search"],
      def: "Finding something in sorted data by checking the middle and throwing away the half that can't contain it — repeat until found.",
      ex: "Guess a number from 1–100: “50?” “Too high.” “25?”… at most 7 guesses." },
    { id: "lower-bound", term: "Lower bound / upper bound", match: ["lower bound", "lower_bound", "upper bound", "upper_bound"],
      def: "In a sorted array, lower bound = first position with a value ≥ x. Upper bound = first position with a value > x.",
      ex: "In [1, 2, 2, 2, 5], lower bound of 2 is index 1, upper bound is index 4 — so 2 appears 4 − 1 = 3 times." },
    { id: "rotated", term: "Rotated sorted array", match: ["rotated sorted array", "rotated array", "rotated arrays", "rotated"],
      def: "A sorted array that was cut at some point and the two parts swapped.",
      ex: "[0, 1, 2, 4, 5, 6, 7] rotated becomes [4, 5, 6, 7, 0, 1, 2]." },
    { id: "stable", term: "Stable sort", match: ["stable", "stability", "unstable"],
      def: "A sort is stable if items that compare equal stay in the order they started in.",
      ex: "Sorting students by grade: if Ana was before Ben and both got a B, a stable sort keeps Ana before Ben." },
    { id: "adaptive", term: "Adaptive sort", match: ["adaptive"],
      def: "A sort that runs faster when the data is already partly in order.",
      ex: "Insertion sort on an already sorted list does just one comparison per item." },
    { id: "pivot", pages: ["sorting"], term: "Pivot", match: ["pivot", "pivots"],
      def: "The value quick sort (or quickselect) uses to split the data: smaller values go to one side, bigger to the other.",
      ex: "With pivot 5, [7, 2, 9, 1, 5] is partitioned into [2, 1] 5 [7, 9]." },
    { id: "partition", term: "Partition", match: ["partition", "partitions", "partitioning", "partitioned"],
      def: "Rearranging an array so all items passing a test come before all items failing it.",
      ex: "Partition [3, 8, 1, 6] by “less than 5” → [3, 1, 8, 6]." },
    { id: "merge-sort", term: "Merge sort", match: ["merge sort", "merge-sort", "mergesort"],
      def: "Split the list in half, sort each half, then merge the two sorted halves by repeatedly taking the smaller front item.",
      ex: "[5, 2, 4, 1] → [5, 2] and [4, 1] → [2, 5] and [1, 4] → [1, 2, 4, 5]." },
    { id: "quick-sort", term: "Quick sort", match: ["quick sort", "quicksort", "quick-sort"],
      def: "Pick a pivot, move smaller values left and larger values right, then sort each side the same way.",
      ex: "Usually the fastest sort in practice; most library sorts are built on it." },
    { id: "quickselect", term: "Quickselect", match: ["quickselect"],
      def: "Like quick sort, but after partitioning you only continue into the side containing the position you want.",
      ex: "To find the 3rd smallest of 1 million numbers, you don't need to sort all of them." },
    { id: "insertion-sort", term: "Insertion sort", match: ["insertion sort"],
      def: "Build a sorted list one item at a time, sliding each new item left until it's in place — like sorting cards in your hand.",
      ex: "Great for small or almost-sorted lists." },
    { id: "heap-sort", term: "Heap sort", match: ["heap sort", "heapsort"],
      def: "Arrange the array into a max-heap, then repeatedly move the largest item to the end.",
      ex: "Always O(n log n) with no extra memory, but not stable." },
    { id: "counting-sort", term: "Counting / radix / bucket sort", match: ["counting sort", "radix sort", "bucket sort"],
      def: "Sorts that don't compare items: they count how many times each value appears (or group by digit/range) and write them back in order.",
      ex: "Sorting exam scores 0–100: count how many got each score, then list them out." },
    { id: "hybrid-sorts", term: "Introsort / TimSort", match: ["introsort", "timsort", "dual-pivot quicksort"],
      def: "The real-world sorts used by programming languages. They combine simple sorts: quick sort + heap sort + insertion sort (introsort), or merge sort + insertion sort (TimSort).",
      ex: "C++ std::sort uses introsort; Java and JavaScript sort objects with TimSort." },
    { id: "inversion", term: "Inversion", match: ["inversion", "inversions"],
      def: "A pair of positions where the earlier item is bigger than the later one. It measures how unsorted a list is.",
      ex: "[2, 4, 1] has 2 inversions: (2, 1) and (4, 1)." },
    { id: "dutch-flag", term: "Dutch national flag", match: ["dutch national flag", "3-way partition", "three-way partition"],
      def: "Splitting an array into three groups (less than, equal to, greater than a value) in a single pass.",
      ex: "Sorting [2, 0, 1, 0, 2] of three colours into [0, 0, 1, 2, 2]." },
    { id: "lomuto", term: "Lomuto partition", match: ["lomuto"],
      def: "A simple way to partition: walk left to right and swap every “small” item into the next slot of a growing front section.",
      ex: "Used in many textbook quick sort implementations." },

    // ---------- linked lists, stacks, queues ----------
    { id: "node", term: "Node", match: ["node", "nodes"],
      def: "One item in a linked structure (list, tree or graph). It holds a value plus links to other nodes.",
      ex: "A linked-list node: { val: 7, next: → the next node }." },
    { id: "linked-list", term: "Linked list", match: ["linked list", "linked lists", "singly linked", "doubly linked", "singly linked list", "doubly linked list"],
      def: "A chain of nodes where each node points to the next one. Doubly linked nodes also point back to the previous one.",
      ex: "head → 7 → 3 → 9 → null." },
    { id: "head-tail", pages: ["linked-list", "stack-queue"], term: "Head / tail", match: ["head", "tail"],
      def: "The head is the first node of a list (or front of a queue); the tail is the last.",
      ex: "In 7 → 3 → 9, the head is 7 and the tail is 9." },
    { id: "dummy", term: "Dummy / sentinel", match: ["dummy node", "dummy", "sentinel", "sentinels"],
      def: "A fake extra item — a node or a value — added at the start or end of the data so the edge cases disappear and every real item can be handled the same way.",
      ex: "A linked list dummy → 7 → 3: deleting 7 is just dummy.next = dummy.next.next. In the histogram problem, adding a height 0 at the end empties the stack." },
    { id: "fast-slow", term: "Fast & slow pointers", match: ["fast & slow", "fast/slow", "fast and slow", "slow/fast", "tortoise and hare", "floyd’s", "floyd's"],
      def: "Two pointers moving through a list at different speeds — slow takes 1 step, fast takes 2. Finds the middle, or detects a loop when they meet.",
      ex: "In 1→2→3→4→5, when fast reaches 5, slow is at 3 — the middle." },
    { id: "cycle", term: "Cycle", match: ["cycle", "cycles", "cyclic", "acyclic"],
      def: "A path that leads back to where it started. Acyclic means “has no cycles”.",
      ex: "A → B → C → A is a cycle. A list whose last node points back to an earlier node has a cycle." },
    { id: "lifo", term: "LIFO / FIFO", cs: ["LIFO", "FIFO"], match: ["last in, first out", "first in, first out", "last-in-first-out", "first-in-first-out"],
      def: "LIFO = Last In, First Out (like a pile of plates: a stack). FIFO = First In, First Out (like a line at a shop: a queue).",
      ex: "Push 1, 2, 3 then remove one: a stack gives 3 (LIFO), a queue gives 1 (FIFO)." },
    { id: "stack", term: "Stack", match: ["stack", "stacks"],
      def: "A collection where you add (push) and remove (pop) only at the top — the last thing added is the first removed.",
      ex: "The browser's back button: the most recently visited page comes back first." },
    { id: "queue", term: "Queue", match: ["queue", "queues", "enqueue", "dequeue", "enqueued", "dequeued"],
      def: "A collection where you add at the back (enqueue) and remove from the front (dequeue) — first come, first served.",
      ex: "A printer queue: documents print in the order they were sent." },
    { id: "deque", term: "Deque", match: ["deque", "deques", "double-ended"],
      def: "A “double-ended queue”: you can add or remove at both the front and the back.",
      ex: "Sliding-window maximum keeps useful positions in a deque." },
    { id: "ring-buffer", term: "Circular queue / ring buffer", match: ["ring buffer", "circular queue", "circular", "wraps around", "wrap around"],
      def: "A fixed-size array used as a queue where positions wrap from the end back to the start, so nothing needs shifting.",
      ex: "With size 4, after slot 3 the next item goes into slot 0 (if it's free)." },
    { id: "priority-queue", term: "Priority queue / heap", match: ["priority queue", "min-heap", "max-heap", "min heap", "max heap", "heap", "heaps"],
      def: "A collection that always lets you take out the smallest (min-heap) or largest (max-heap) item quickly, in O(log n).",
      ex: "A hospital waiting room: the most urgent patient is seen next, not the first to arrive." },
    { id: "monotonic-stack", term: "Monotonic stack / deque", match: ["monotonic stack", "monotonic deque", "monotonic-stack"],
      def: "A stack (or deque) kept in sorted order: before pushing a new value, pop everything that would break the order.",
      ex: "Finding the next bigger temperature for each day in one pass." },
    { id: "lru", term: "LRU cache", cs: ["LRU"], match: ["least recently used"],
      def: "A fixed-size store that, when full, throws out the item that hasn't been used for the longest time.",
      ex: "Your phone keeping only the 20 most recently opened apps in memory." },
    { id: "expression", term: "Postfix / RPN", match: ["reverse polish notation", "postfix", "infix"], cs: ["RPN"],
      def: "Infix is normal maths (2 + 3). Postfix (Reverse Polish Notation) puts the operator after its numbers (2 3 +), which a stack can evaluate easily.",
      ex: "(2 + 1) × 3 in postfix is 2 1 + 3 ×." },

    // ---------- trees ----------
    { id: "tree", term: "Tree", match: ["tree", "trees"],
      def: "A structure of nodes connected like a family tree: one root at the top, and every other node has exactly one parent. No loops.",
      ex: "A computer's folders: one top folder, each folder inside exactly one parent folder." },
    { id: "binary-tree", term: "Binary tree", match: ["binary tree", "binary trees"],
      def: "A tree where every node has at most two children, called left and right.",
      ex: "A family tree where each person lists at most two children." },
    { id: "bst", term: "Binary search tree (BST)", match: ["binary search tree", "binary search trees"], cs: ["BST", "BSTs"],
      def: "A binary tree where every value in a node's left subtree is smaller and every value in its right subtree is larger.",
      ex: "Root 50 with 30 on the left and 70 on the right: to find 70, go right — no need to look left." },
    { id: "root", pages: ["trees"], term: "Root", match: ["root"],
      def: "The top node of a tree — the only node with no parent.",
      ex: "In a folder tree, C:\\ or / is the root." },
    { id: "leaf", pages: ["trees"], term: "Leaf", match: ["leaf", "leaves"],
      def: "A node with no children — the end of a branch.",
      ex: "In a folder tree, a folder with nothing inside it is a leaf." },
    { id: "parent-child", pages: ["trees", "graphs"], term: "Parent / child / sibling", match: ["parent", "parents", "child", "children", "sibling", "siblings", "ancestor", "ancestors", "descendant", "descendants"],
      def: "Family words for trees: a node's parent is directly above it, its children directly below. Siblings share a parent. Ancestors are everything above, descendants everything below.",
      ex: "If folder Photos contains 2024 and 2025, Photos is the parent and 2024/2025 are siblings." },
    { id: "subtree", term: "Subtree", match: ["subtree", "subtrees"],
      def: "A node together with everything below it. Every subtree is itself a tree.",
      ex: "The “Documents” folder and all its contents form a subtree of your drive." },
    { id: "depth-height", pages: ["trees"], term: "Depth / height", match: ["depth", "height"],
      def: "Depth of a node = how many steps it is below the root. Height of a tree = the depth of its deepest node (the longest path down).",
      ex: "Root has depth 0; its children depth 1. A tree that's just a root and one child has height 1 (counting edges)." },
    { id: "balanced", pages: ["trees", "sorting", "binary-search", "graphs"], term: "Balanced tree", match: ["balanced", "self-balancing", "avl", "red-black", "skewed", "lopsided"],
      def: "A tree whose left and right sides have about the same height everywhere, so it stays short: height ≈ log n. A skewed tree leans to one side and becomes as tall as a list.",
      ex: "Inserting 1, 2, 3, 4, 5 into a plain BST makes a skewed “staircase”. AVL and red-black trees rebalance themselves automatically." },
    { id: "traversal", term: "Traversal", match: ["traversal", "traversals", "traverse", "traverses", "traversing"],
      def: "Visiting every node (or element) of a structure exactly once, in some order.",
      ex: "Reading every file in every folder is a traversal of the folder tree." },
    { id: "pre-in-post", term: "Preorder / inorder / postorder", match: ["preorder", "pre-order", "inorder", "in-order", "postorder", "post-order"],
      def: "The three depth-first orders for visiting a binary tree. Pre: node, then left, then right. In: left, node, right. Post: left, right, node.",
      ex: "For the tree 2 (left 1, right 3): preorder 2 1 3, inorder 1 2 3, postorder 1 3 2." },
    { id: "level-order", term: "Level order", match: ["level order", "level-order", "level by level"],
      def: "Visiting a tree one level at a time, top to bottom and left to right — breadth-first search on a tree.",
      ex: "A company chart read row by row: CEO, then managers, then their teams." },
    { id: "successor", pages: ["trees"], term: "Inorder successor", match: ["inorder successor", "successor"],
      def: "The next larger value in a BST — the leftmost node of the right subtree.",
      ex: "In a BST holding 20, 30, 40, 50, the successor of 30 is 40." },
    { id: "lca", term: "Lowest common ancestor (LCA)", match: ["lowest common ancestor"], cs: ["LCA"],
      def: "The deepest node that has both given nodes underneath it (a node counts as its own ancestor).",
      ex: "In a family tree, the LCA of two cousins is their shared grandparent." },
    { id: "serialize", term: "Serialize / deserialize", match: ["serialize", "deserialize", "serialization", "serialise", "serializes"],
      def: "Turning a structure into text (or bytes) so it can be saved or sent, and rebuilding it from that text later.",
      ex: "Saving a tree as \"1,2,#,#,3,#,#\" and rebuilding the same tree from that string." },

    // ---------- graphs ----------
    { id: "graph", term: "Graph", match: ["graph", "graphs"],
      def: "A set of points (vertices) connected by lines (edges). Trees, grids and road maps are all graphs.",
      ex: "Cities connected by roads; people connected by friendships." },
    { id: "vertex", term: "Vertex", match: ["vertex", "vertices"],
      def: "A point in a graph (also called a node).",
      ex: "In a road map graph, each city is a vertex." },
    { id: "edge", pages: ["trees", "graphs"], term: "Edge", match: ["edge", "edges"],
      def: "A connection between two vertices (or a parent and child in a tree).",
      ex: "The road between Paris and Lyon is an edge." },
    { id: "directed", pages: ["graphs", "trees"], term: "Directed / undirected", match: ["directed", "undirected"],
      def: "In a directed graph edges are one-way arrows (A → B). In an undirected graph they work both ways (A — B).",
      ex: "Following someone on social media is directed; a two-way friendship is undirected." },
    { id: "weighted", pages: ["graphs"], term: "Weighted graph", match: ["weighted", "weight", "weights", "unweighted"],
      def: "A graph whose edges carry a number — a distance, cost or time.",
      ex: "A map where the road Paris–Lyon has weight 465 (km)." },
    { id: "degree", pages: ["graphs"], term: "Degree / in-degree", match: ["in-degree", "out-degree", "indegree", "degree", "degrees"],
      def: "A vertex's degree is how many edges touch it. In directed graphs, in-degree counts arrows coming in and out-degree arrows going out.",
      ex: "If 3 courses require Math, Math has out-degree 3; a course with 2 prerequisites has in-degree 2." },
    { id: "path", term: "Path", match: ["path", "paths"],
      def: "A route through a graph or tree, following edges from one vertex to another.",
      ex: "Home → School → Library is a path with 2 edges." },
    { id: "component", term: "Connected component", match: ["connected component", "connected components", "component", "components", "connected", "connectivity"],
      def: "A group of vertices that can all reach each other. Separate groups are separate components.",
      ex: "Islands in an ocean: each island is its own connected component of land." },
    { id: "dag", term: "DAG (directed acyclic graph)", cs: ["DAG", "DAGs"], match: ["directed acyclic graph"],
      def: "A directed graph with no cycles — you can never follow arrows back to where you started.",
      ex: "Course prerequisites: Intro → Data Structures → Algorithms." },
    { id: "bipartite", term: "Bipartite graph", match: ["bipartite", "2-colourable", "2-colour", "two-colour"],
      def: "A graph whose vertices can be split into two groups so that every edge goes between the groups, never inside one.",
      ex: "Students and the clubs they joined: edges only connect a student to a club." },
    { id: "adj-list", term: "Adjacency list / matrix", match: ["adjacency list", "adjacency lists", "adjacency matrix", "edge list", "adj"],
      def: "Ways to store a graph. Adjacency list: for each vertex, a list of its neighbours. Adjacency matrix: a table where cell [u][v] says whether u and v are connected. Edge list: just a list of all edges.",
      ex: "adj[0] = [1, 2] means vertex 0 connects to vertices 1 and 2." },
    { id: "neighbour", term: "Neighbour", match: ["neighbour", "neighbours", "neighbor", "neighbors", "adjacent"],
      def: "A vertex (or grid cell) directly connected to the current one.",
      ex: "In a grid, the cells above, below, left and right are a cell's 4 neighbours." },
    { id: "sparse-dense", term: "Sparse / dense graph", match: ["sparse", "dense"],
      def: "Sparse: few edges compared to the maximum possible. Dense: almost every pair of vertices is connected.",
      ex: "A road map is sparse (each city connects to a few others); “everyone knows everyone” is dense." },
    { id: "bfs", term: "BFS (breadth-first search)", cs: ["BFS"], match: ["breadth-first search", "breadth-first", "multi-source bfs"],
      def: "Explores a graph in rings: first everything 1 step away, then 2 steps, and so on, using a queue. Finds shortest paths when edges have no weights.",
      ex: "Ripples spreading out from a stone dropped in a pond." },
    { id: "dfs", term: "DFS (depth-first search)", cs: ["DFS"], match: ["depth-first search", "depth-first"],
      def: "Explores a graph by going as deep as possible along one path before backing up to try another, using recursion or a stack.",
      ex: "Exploring a maze by always taking the first unexplored turn and backtracking at dead ends." },
    { id: "visited", term: "Visited set", match: ["visited", "mark visited"],
      def: "A record of which vertices you've already explored, so you never process one twice (or loop forever around a cycle).",
      ex: "Leaving breadcrumbs in a maze so you know where you've been." },
    { id: "backtrack", term: "Backtracking", match: ["backtrack", "backtracking", "back up"],
      def: "Undoing your last choice and trying a different option when a path doesn't work out.",
      ex: "In a maze, returning to the last junction after hitting a dead end." },
    { id: "topo", term: "Topological sort", match: ["topological sort", "topological order", "topological ordering", "topo sort", "kahn", "kahn’s", "kahn's"],
      def: "Ordering the vertices of a DAG so every arrow points forward — every task comes after the tasks it depends on. Kahn's algorithm builds it by repeatedly taking a vertex with no remaining prerequisites.",
      ex: "Getting dressed: socks before shoes, underwear before trousers." },
    { id: "dijkstra", term: "Dijkstra's algorithm", match: ["dijkstra", "dijkstra’s", "dijkstra's"],
      def: "Finds the cheapest path from one start vertex to every other vertex when edge weights are never negative. It always finalises the closest unfinished vertex next.",
      ex: "A GPS working out the shortest driving distance from your home to every town." },
    { id: "relax", term: "Relax (an edge)", match: ["relax", "relaxes", "relaxation", "relaxing"],
      def: "Checking whether going through vertex u gives a cheaper way to reach v, and updating v's distance if so.",
      ex: "Known: dist[v] = 12. Via u: dist[u] + weight = 8 + 2 = 10 < 12, so update dist[v] to 10." },
    { id: "bellman-ford", term: "Bellman–Ford", match: ["bellman–ford", "bellman-ford", "bellman ford"],
      def: "A shortest-path algorithm that repeatedly relaxes every edge. Slower than Dijkstra, but works with negative weights and with a limit on the number of edges.",
      ex: "Cheapest flight with at most k stops." },
    { id: "floyd-warshall", term: "Floyd–Warshall", match: ["floyd–warshall", "floyd-warshall"],
      def: "Computes the shortest path between every pair of vertices using three nested loops (O(V³)).",
      ex: "A distance table between all pairs of cities on a small map." },
    { id: "mst", term: "Minimum spanning tree (MST)", match: ["minimum spanning tree", "spanning tree", "kruskal", "kruskal’s", "kruskal's", "prim", "prim’s", "prim's"], cs: ["MST"],
      def: "The cheapest set of edges that connects all vertices without any cycles. Kruskal's and Prim's are two greedy algorithms that build it.",
      ex: "Laying cable to connect every house in a village using the least total cable." },
    { id: "dsu", term: "Union-Find (DSU)", match: ["union-find", "union find", "disjoint set", "disjoint set union", "path compression", "union by size"], cs: ["DSU"],
      def: "A structure that tracks which items are in the same group. It can merge two groups (union) and tell which group an item is in (find) almost instantly.",
      ex: "Tracking friend circles: when Ana and Ben become friends, merge their circles." },
    { id: "tarjan", pages: ["graphs"], term: "Tarjan's algorithm / bridge", match: ["tarjan", "tarjan’s", "tarjan's", "bridge", "bridges", "articulation point", "articulation points", "critical connection", "critical connections", "low-link"],
      def: "A bridge is an edge whose removal splits the graph into separate pieces. Tarjan's algorithm finds all bridges in one DFS.",
      ex: "The only road to an island village is a bridge in the road network." },
    { id: "back-edge", term: "Back edge", match: ["back edge", "back edges"],
      def: "During DFS, an edge that leads back to a vertex still on the current path. In a directed graph that means there's a cycle.",
      ex: "Visiting A → B → C and finding an arrow from C back to A." },
    { id: "implicit-graph", term: "Implicit graph", match: ["implicit graph", "implicit"],
      def: "A graph you never store explicitly: vertices are states you generate on the fly, and edges are the moves between them.",
      ex: "Word Ladder: words are vertices; changing one letter is an edge." },
    { id: "huffman", term: "Huffman coding", match: ["huffman"],
      def: "A greedy way to compress data that gives common characters short codes and rare ones longer codes.",
      ex: "Used inside ZIP files and JPEG images." },
    { id: "kadane", term: "Kadane's algorithm", match: ["kadane", "kadane’s", "kadane's"],
      def: "Finds the subarray with the largest sum in one pass: keep a running total and restart it whenever it drops below zero.",
      ex: "For [−2, 1, −3, 4, −1, 2, 1], the best subarray is [4, −1, 2, 1] with sum 6." },
    { id: "knapsack", term: "Knapsack problem", match: ["knapsack", "0/1 knapsack", "fractional knapsack"],
      def: "Choosing items with values and weights to fit in a bag of limited capacity, maximising total value. Fractional: you can take part of an item. 0/1: each item is all or nothing.",
      ex: "Packing a backpack for a hike with a 10 kg limit." }
  ];

  // ---------- matching ----------
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const seg = location.pathname.split("/").filter(Boolean);
  if (seg.length && seg[seg.length - 1].includes(".")) seg.pop();   // drop "index.html"
  const page = seg.length ? seg[seg.length - 1] : "";
  const pats = [];
  for (const e of ENTRIES) {
    if (e.pages && !e.pages.includes(page)) continue;
    for (const m of e.match || []) pats.push({ src: esc(m), id: e.id, ci: true, len: m.length });
    for (const m of e.cs || []) pats.push({ src: esc(m), id: e.id, ci: false, len: m.length });
    for (const r of e.re || []) pats.push({ src: r, id: e.id, ci: false, len: 100 });
  }
  pats.sort((a, b) => b.len - a.len);                  // longest phrases first
  const B = "(?<![\\p{L}\\p{N}_])", A = "(?![\\p{L}\\p{N}_])";
  const ciRe = new RegExp(pats.filter(p => p.ci).map(p => `${B}(${p.src})${A}`).join("|"), "giu");
  const csRe = new RegExp(pats.filter(p => !p.ci).map(p => `${B}(${p.src})${A}`).join("|"), "gu");
  const ciIds = pats.filter(p => p.ci).map(p => p.id), csIds = pats.filter(p => !p.ci).map(p => p.id);
  const byId = Object.fromEntries(ENTRIES.map(e => [e.id, e]));

  const SKIP = "pre, code, button, a, svg, input, select, textarea, label, option, script, style, h1, h2, h3, th, " +
    ".nav, .brand, .tag, .badge, .eyebrow, .chip, .q-example, .lang-tag, .bs-status, .viz, .footer, .gl-term, .gl-pop, .gl-list, .tl-axis, .formula";
  // Scope: each term is underlined once per block, so text stays readable.
  const SCOPE = ".q-head, .q-panel, .quiz-q, .card, .callout, section";
  const used = new Set();

  function findMatches(text) {
    const found = [];
    for (const [re, ids] of [[csRe, csIds], [ciRe, ciIds]]) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(text))) {
        const g = m.slice(1).findIndex(x => x !== undefined);
        found.push({ start: m.index, end: m.index + m[0].length, id: ids[g] });
      }
    }
    found.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
    const out = [];
    let last = -1;
    for (const f of found) if (f.start >= last) { out.push(f); last = f.end; }
    return out;
  }

  function annotate(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const p = n.parentElement;
        if (!p || p.closest(SKIP)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const tn of nodes) {
      const scope = tn.parentElement.closest(SCOPE) || document.body;
      scope._gl = scope._gl || new Set();
      const text = tn.nodeValue;
      const ms = findMatches(text).filter(m => !scope._gl.has(m.id));
      if (!ms.length) continue;
      const frag = document.createDocumentFragment();
      let pos = 0;
      for (const m of ms) {
        if (scope._gl.has(m.id)) continue;               // same term twice in one text node
        scope._gl.add(m.id);
        used.add(m.id);
        frag.append(text.slice(pos, m.start));
        const b = document.createElement("button");
        b.type = "button";
        b.className = "gl-term";
        b.dataset.term = m.id;
        b.textContent = text.slice(m.start, m.end);
        b.setAttribute("aria-haspopup", "dialog");
        frag.append(b);
        pos = m.end;
      }
      frag.append(text.slice(pos));
      tn.replaceWith(frag);
    }
  }

  // ---------- popup ----------
  const pop = document.createElement("div");
  pop.className = "gl-pop";
  pop.setAttribute("role", "dialog");
  pop.hidden = true;
  document.body.append(pop);
  let openFor = null;

  function show(btn) {
    const e = byId[btn.dataset.term];
    if (!e) return;
    pop.innerHTML = `<button type="button" class="gl-close" aria-label="Close">×</button>
      <div class="gl-title">${e.term}</div>
      <p class="gl-def">${e.def}</p>
      <p class="gl-ex"><span>Example</span>${e.ex}</p>`;
    pop.setAttribute("aria-label", e.term);
    pop.hidden = false;
    openFor = btn;
    const r = btn.getBoundingClientRect(), vw = document.documentElement.clientWidth, vh = window.innerHeight;
    const w = Math.min(340, vw - 32);
    pop.style.width = w + "px";
    let left = Math.min(Math.max(16, r.left + r.width / 2 - w / 2), vw - w - 16);
    const h = pop.offsetHeight;
    let top = r.bottom + 8;
    if (top + h > vh - 8 && r.top - h - 8 > 8) top = r.top - h - 8;   // flip above if no room below
    pop.style.left = left + window.scrollX + "px";
    pop.style.top = top + window.scrollY + "px";
    pop.querySelector(".gl-close").focus({ preventScroll: true });
  }
  function hide() {
    if (pop.hidden) return;
    pop.hidden = true;
    if (openFor) openFor.focus({ preventScroll: true });
    openFor = null;
  }
  document.addEventListener("click", ev => {
    const t = ev.target.closest(".gl-term");
    if (t) { ev.preventDefault(); if (openFor === t && !pop.hidden) hide(); else show(t); return; }
    if (ev.target.closest(".gl-close") || !ev.target.closest(".gl-pop")) hide();
  });
  document.addEventListener("keydown", ev => { if (ev.key === "Escape") hide(); });
  window.addEventListener("resize", hide);

  // ---------- run ----------
  const main = document.querySelector("main") || document.body;
  annotate(main);

  // Quiz explanations appear after answering: annotate them when they do.
  new MutationObserver(muts => {
    for (const m of muts) {
      const el = m.target.nodeType === 1 ? m.target : m.target.parentElement;
      const exp = el && el.closest && el.closest(".quiz-exp");
      if (exp && !exp.querySelector(".gl-term") && !exp.hidden) annotate(exp);
    }
  }).observe(main, { childList: true, subtree: true, characterData: true });

  // Hint under the page intro.
  const lead = document.querySelector(".hero .lead");
  if (lead && used.size) {
    const hint = document.createElement("p");
    hint.className = "gl-hint";
    hint.innerHTML = `💡 Words with a <span class="gl-sample">dotted underline</span> have a plain-English explanation — tap or click them.` +
      (document.querySelector("#questions") ? ` All of them are also listed in <a href="#glossary">Words used on this page</a>.` : "");
    lead.after(hint);
  }

  // "Words used on this page" list (topic pages only).
  if (document.querySelector("#questions") && used.size) {
    const sec = document.createElement("section");
    sec.className = "section";
    sec.id = "glossary";
    const items = [...used].map(id => byId[id]).sort((a, b) => a.term.localeCompare(b.term));
    sec.innerHTML = `<h2><span class="num">A–Z</span> Words used on this page</h2>
      <p class="lead small-lead">Every underlined word on this page, in one place.</p>
      <div class="gl-list">${items.map(e => `<div class="card gl-item"><h3>${e.term}</h3><p>${e.def}</p><p class="gl-ex"><span>Example</span>${e.ex}</p></div>`).join("")}</div>`;
    main.append(sec);
    const nav = document.querySelector(".nav");
    const all = nav && [...nav.querySelectorAll("a")].find(a => a.getAttribute("href") === "../index.html");
    if (all) { const a = document.createElement("a"); a.href = "#glossary"; a.textContent = "Glossary"; all.before(a); }
  }
})();
