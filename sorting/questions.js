// Question bank for the "Important questions" section.
// Each entry: id, title, difficulty, tags, desc, example, hint, approach, complexity, link, code{cpp,java,js}
window.QUESTIONS = [
  {
    id: "so-merge-sorted",
    title: "Merge Sorted Array",
    difficulty: "easy",
    tags: ["Merge", "Two pointers"],
    desc: "nums1 has length m + n (last n slots empty). Merge sorted nums2 (length n) into nums1 in place, sorted.",
    example: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3  →  [1,2,2,3,5,6]",
    hint: "Fill from the back: the largest remaining element goes into the last free slot, so nothing gets overwritten.",
    approach: "Pointers i = m − 1, j = n − 1, k = m + n − 1. Copy the larger of nums1[i] and nums2[j] to k. Stop when nums2 is used up.",
    complexity: "Time O(m + n) · Space O(1)",
    link: "https://leetcode.com/problems/merge-sorted-array/",
    code: {
      cpp: `void merge(vector<int>& a, int m, vector<int>& b, int n) {
    int i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && a[i] > b[j]) a[k--] = a[i--];
        else a[k--] = b[j--];
    }
}`,
      java: `public void merge(int[] a, int m, int[] b, int n) {
    int i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && a[i] > b[j]) a[k--] = a[i--];
        else a[k--] = b[j--];
    }
}`,
      js: `function merge(a, m, b, n) {
    let i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && a[i] > b[j]) a[k--] = a[i--];
        else a[k--] = b[j--];
    }
}`
    }
  },
  {
    id: "so-squares",
    title: "Squares of a Sorted Array",
    difficulty: "easy",
    tags: ["Two pointers"],
    desc: "Given a sorted array (with negatives), return the squares of each number, sorted — in O(n).",
    example: "[-4,-1,0,3,10]  →  [0,1,9,16,100]",
    hint: "The largest square is at one of the two ends. Fill the result from the back.",
    approach: "Compare |a[l]| and |a[r]|; write the bigger square at position k (from n − 1 down) and move that pointer inward.",
    complexity: "Time O(n) · Space O(n) for the output",
    link: "https://leetcode.com/problems/squares-of-a-sorted-array/",
    code: {
      cpp: `vector<int> sortedSquares(vector<int>& a) {
    int n = a.size(), l = 0, r = n - 1;
    vector<int> res(n);
    for (int k = n - 1; k >= 0; k--) {
        if (abs(a[l]) > abs(a[r])) { res[k] = a[l] * a[l]; l++; }
        else { res[k] = a[r] * a[r]; r--; }
    }
    return res;
}`,
      java: `public int[] sortedSquares(int[] a) {
    int n = a.length, l = 0, r = n - 1;
    int[] res = new int[n];
    for (int k = n - 1; k >= 0; k--) {
        if (Math.abs(a[l]) > Math.abs(a[r])) { res[k] = a[l] * a[l]; l++; }
        else { res[k] = a[r] * a[r]; r--; }
    }
    return res;
}`,
      js: `function sortedSquares(a) {
    const n = a.length, res = new Array(n);
    let l = 0, r = n - 1;
    for (let k = n - 1; k >= 0; k--) {
        if (Math.abs(a[l]) > Math.abs(a[r])) { res[k] = a[l] * a[l]; l++; }
        else { res[k] = a[r] * a[r]; r--; }
    }
    return res;
}`
    }
  },
  {
    id: "so-anagram",
    title: "Valid Anagram",
    difficulty: "easy",
    tags: ["Counting"],
    desc: "Return true if t is an anagram of s (same letters, same counts).",
    example: "s = \"anagram\", t = \"nagaram\"  →  true",
    hint: "Sorting both strings and comparing works in O(n log n). Counting letters is O(n).",
    approach: "Count letters of s up and letters of t down in one array of 26; every count must end at 0. (This is counting sort's idea.)",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/valid-anagram/",
    code: {
      cpp: `bool isAnagram(string s, string t) {
    if (s.size() != t.size()) return false;
    int cnt[26] = {};
    for (int i = 0; i < s.size(); i++) { cnt[s[i] - 'a']++; cnt[t[i] - 'a']--; }
    for (int c : cnt) if (c != 0) return false;
    return true;
}`,
      java: `public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] cnt = new int[26];
    for (int i = 0; i < s.length(); i++) { cnt[s.charAt(i) - 'a']++; cnt[t.charAt(i) - 'a']--; }
    for (int c : cnt) if (c != 0) return false;
    return true;
}`,
      js: `function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    const cnt = new Array(26).fill(0);
    for (let i = 0; i < s.length; i++) {
        cnt[s.charCodeAt(i) - 97]++;
        cnt[t.charCodeAt(i) - 97]--;
    }
    return cnt.every(c => c === 0);
}`
    }
  },
  {
    id: "so-contains-dup",
    title: "Contains Duplicate",
    difficulty: "easy",
    tags: ["Sort then scan"],
    desc: "Return true if any value appears at least twice.",
    example: "[1,2,3,1]  →  true,   [1,2,3,4]  →  false",
    hint: "After sorting, equal values sit next to each other.",
    approach: "Sort a copy and compare neighbours: O(n log n), O(1) extra if sorting in place. (A hash set gives O(n) time but O(n) memory — mention both.)",
    complexity: "Time O(n log n) · Space O(1)–O(n) depending on the sort",
    link: "https://leetcode.com/problems/contains-duplicate/",
    code: {
      cpp: `bool containsDuplicate(vector<int>& a) {
    sort(a.begin(), a.end());
    for (int i = 1; i < a.size(); i++)
        if (a[i] == a[i - 1]) return true;
    return false;
}`,
      java: `public boolean containsDuplicate(int[] a) {
    Arrays.sort(a);
    for (int i = 1; i < a.length; i++)
        if (a[i] == a[i - 1]) return true;
    return false;
}`,
      js: `function containsDuplicate(a) {
    const s = [...a].sort((x, y) => x - y);    // numeric comparator!
    for (let i = 1; i < s.length; i++)
        if (s[i] === s[i - 1]) return true;
    return false;
    // O(n) alternative: return new Set(a).size !== a.length;
}`
    }
  },
  {
    id: "so-height-checker",
    title: "Height Checker",
    difficulty: "easy",
    tags: ["Counting sort"],
    desc: "Count how many students are not standing where they would be if the heights (1…100) were sorted.",
    example: "[1,1,4,2,1,3]  →  3",
    hint: "Heights are tiny integers — counting sort gives the expected order in O(n + 100).",
    approach: "Count each height, then walk the array while generating the sorted sequence from the counts; count mismatches.",
    complexity: "Time O(n + k) · Space O(k), k = 101",
    link: "https://leetcode.com/problems/height-checker/",
    code: {
      cpp: `int heightChecker(vector<int>& h) {
    int cnt[101] = {}, v = 0, wrong = 0;
    for (int x : h) cnt[x]++;
    for (int x : h) {
        while (cnt[v] == 0) v++;            // next value in sorted order
        if (x != v) wrong++;
        cnt[v]--;
    }
    return wrong;
}`,
      java: `public int heightChecker(int[] h) {
    int[] cnt = new int[101];
    int v = 0, wrong = 0;
    for (int x : h) cnt[x]++;
    for (int x : h) {
        while (cnt[v] == 0) v++;            // next value in sorted order
        if (x != v) wrong++;
        cnt[v]--;
    }
    return wrong;
}`,
      js: `function heightChecker(h) {
    const cnt = new Array(101).fill(0);
    for (const x of h) cnt[x]++;
    let v = 0, wrong = 0;
    for (const x of h) {
        while (cnt[v] === 0) v++;           // next value in sorted order
        if (x !== v) wrong++;
        cnt[v]--;
    }
    return wrong;
}`
    }
  },
  {
    id: "so-relative-sort",
    title: "Relative Sort Array",
    difficulty: "easy",
    tags: ["Counting sort", "Custom order"],
    desc: "Sort arr1 so its elements follow the order of arr2; elements not in arr2 go at the end in ascending order. Values are 0…1000.",
    example: "arr1 = [2,3,1,3,2,4,6,7,9,2,19], arr2 = [2,1,4,3,9,6]  →  [2,2,2,1,4,3,3,9,6,7,19]",
    hint: "Count every value of arr1, emit arr2's values in its order, then the leftovers by value.",
    approach: "Counting sort with a custom emission order. (Comparator alternative: rank = index in arr2, else 1000 + value.)",
    complexity: "Time O(n + m + 1000) · Space O(1000)",
    link: "https://leetcode.com/problems/relative-sort-array/",
    code: {
      cpp: `vector<int> relativeSortArray(vector<int>& a1, vector<int>& a2) {
    vector<int> cnt(1001, 0), out;
    for (int x : a1) cnt[x]++;
    for (int x : a2) while (cnt[x]-- > 0) out.push_back(x);
    for (int v = 0; v <= 1000; v++) while (cnt[v]-- > 0) out.push_back(v);
    return out;
}`,
      java: `public int[] relativeSortArray(int[] a1, int[] a2) {
    int[] cnt = new int[1001], out = new int[a1.length];
    int k = 0;
    for (int x : a1) cnt[x]++;
    for (int x : a2) while (cnt[x]-- > 0) out[k++] = x;
    for (int v = 0; v <= 1000; v++) while (cnt[v]-- > 0) out[k++] = v;
    return out;
}`,
      js: `function relativeSortArray(a1, a2) {
    const cnt = new Array(1001).fill(0), out = [];
    for (const x of a1) cnt[x]++;
    for (const x of a2) while (cnt[x]-- > 0) out.push(x);
    for (let v = 0; v <= 1000; v++) while (cnt[v]-- > 0) out.push(v);
    return out;
}`
    }
  },
  {
    id: "so-parity",
    title: "Sort Array By Parity",
    difficulty: "easy",
    tags: ["Partition"],
    desc: "Move all even numbers before all odd numbers (any order within each group), in place.",
    example: "[3,1,2,4]  →  [2,4,3,1] (any valid answer)",
    hint: "This is exactly quick sort's partition step, with “is even” as the test instead of “< pivot”.",
    approach: "Lomuto-style: i marks the end of the even zone; whenever a[j] is even, swap it into position i and advance i.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/sort-array-by-parity/",
    code: {
      cpp: `vector<int> sortArrayByParity(vector<int>& a) {
    int i = 0;
    for (int j = 0; j < a.size(); j++)
        if (a[j] % 2 == 0) swap(a[i++], a[j]);
    return a;
}`,
      java: `public int[] sortArrayByParity(int[] a) {
    int i = 0;
    for (int j = 0; j < a.length; j++)
        if (a[j] % 2 == 0) { int t = a[i]; a[i] = a[j]; a[j] = t; i++; }
    return a;
}`,
      js: `function sortArrayByParity(a) {
    let i = 0;
    for (let j = 0; j < a.length; j++)
        if (a[j] % 2 === 0) { [a[i], a[j]] = [a[j], a[i]]; i++; }
    return a;
}`
    }
  },
  {
    id: "so-colors",
    title: "Sort Colors (Dutch National Flag)",
    difficulty: "medium",
    tags: ["3-way partition"],
    desc: "Sort an array of 0s, 1s and 2s in place in one pass, without the library sort.",
    example: "[2,0,2,1,1,0]  →  [0,0,1,1,2,2]",
    hint: "Keep three zones: [0, lo) are 0s, [lo, i) are 1s, (hi, end] are 2s. Process a[i].",
    approach: "0 → swap with lo, lo++, i++. 1 → i++. 2 → swap with hi, hi−− (don't advance i: the swapped-in value is unexamined).",
    complexity: "Time O(n), one pass · Space O(1)",
    link: "https://leetcode.com/problems/sort-colors/",
    code: {
      cpp: `void sortColors(vector<int>& a) {
    int lo = 0, i = 0, hi = a.size() - 1;
    while (i <= hi) {
        if (a[i] == 0) swap(a[lo++], a[i++]);
        else if (a[i] == 2) swap(a[i], a[hi--]);
        else i++;
    }
}`,
      java: `public void sortColors(int[] a) {
    int lo = 0, i = 0, hi = a.length - 1;
    while (i <= hi) {
        if (a[i] == 0) { int t = a[lo]; a[lo++] = a[i]; a[i++] = t; }
        else if (a[i] == 2) { int t = a[hi]; a[hi--] = a[i]; a[i] = t; }
        else i++;
    }
}`,
      js: `function sortColors(a) {
    let lo = 0, i = 0, hi = a.length - 1;
    while (i <= hi) {
        if (a[i] === 0) { [a[lo], a[i]] = [a[i], a[lo]]; lo++; i++; }
        else if (a[i] === 2) { [a[i], a[hi]] = [a[hi], a[i]]; hi--; }
        else i++;
    }
}`
    }
  },
  {
    id: "so-sort-array",
    title: "Sort an Array (no built-in sort)",
    difficulty: "medium",
    tags: ["Merge sort"],
    desc: "Sort an integer array in O(n log n) without using any built-in sort function.",
    example: "[5,2,3,1]  →  [1,2,3,5]",
    hint: "Merge sort is guaranteed O(n log n) on every input (quick sort with a fixed pivot can time out on sorted or all-equal tests).",
    approach: "Top-down merge sort with one shared temp buffer to avoid allocating at every level.",
    complexity: "Time O(n log n) · Space O(n)",
    link: "https://leetcode.com/problems/sort-an-array/",
    code: {
      cpp: `void msort(vector<int>& a, int lo, int hi, vector<int>& tmp) {   // [lo, hi)
    if (hi - lo < 2) return;
    int mid = (lo + hi) / 2;
    msort(a, lo, mid, tmp); msort(a, mid, hi, tmp);
    int i = lo, j = mid, k = lo;
    while (i < mid && j < hi) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
    while (i < mid) tmp[k++] = a[i++];
    while (j < hi) tmp[k++] = a[j++];
    copy(tmp.begin() + lo, tmp.begin() + hi, a.begin() + lo);
}
vector<int> sortArray(vector<int>& a) {
    vector<int> tmp(a.size());
    msort(a, 0, a.size(), tmp);
    return a;
}`,
      java: `public int[] sortArray(int[] a) {
    msort(a, 0, a.length, new int[a.length]);
    return a;
}
private void msort(int[] a, int lo, int hi, int[] tmp) {   // [lo, hi)
    if (hi - lo < 2) return;
    int mid = (lo + hi) >>> 1;
    msort(a, lo, mid, tmp); msort(a, mid, hi, tmp);
    int i = lo, j = mid, k = lo;
    while (i < mid && j < hi) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
    while (i < mid) tmp[k++] = a[i++];
    while (j < hi) tmp[k++] = a[j++];
    System.arraycopy(tmp, lo, a, lo, hi - lo);
}`,
      js: `function sortArray(a) {
    const tmp = new Array(a.length);
    const msort = (lo, hi) => {                  // [lo, hi)
        if (hi - lo < 2) return;
        const mid = (lo + hi) >> 1;
        msort(lo, mid); msort(mid, hi);
        let i = lo, j = mid, k = lo;
        while (i < mid && j < hi) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
        while (i < mid) tmp[k++] = a[i++];
        while (j < hi) tmp[k++] = a[j++];
        for (k = lo; k < hi; k++) a[k] = tmp[k];
    };
    msort(0, a.length);
    return a;
}`
    }
  },
  {
    id: "so-kth-largest",
    title: "Kth Largest Element in an Array",
    difficulty: "medium",
    tags: ["Quickselect"],
    desc: "Return the k-th largest element (not necessarily distinct) without fully sorting.",
    example: "[3,2,3,1,2,4,5,5,6], k = 4  →  4",
    hint: "The k-th largest sits at index n − k of the sorted array. Partition like quick sort, but only continue into the side that contains that index.",
    approach: "Quickselect with a random pivot and a 3-way partition (so arrays full of duplicates don't degrade to O(n²)). (Min-heap of size k is the O(n log k) alternative.)",
    complexity: "Time O(n) average, O(n²) worst (unlikely) · Space O(1)",
    link: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    code: {
      cpp: `int findKthLargest(vector<int>& a, int k) {
    int target = a.size() - k, lo = 0, hi = a.size() - 1;
    while (true) {
        int p = a[lo + rand() % (hi - lo + 1)];
        int lt = lo, i = lo, gt = hi;              // [lo,lt) < p, [lt,gt] == p, (gt,hi] > p
        while (i <= gt) {
            if (a[i] < p) swap(a[lt++], a[i++]);
            else if (a[i] > p) swap(a[i], a[gt--]);
            else i++;
        }
        if (target < lt) hi = lt - 1;
        else if (target > gt) lo = gt + 1;
        else return p;
    }
}`,
      java: `public int findKthLargest(int[] a, int k) {
    int target = a.length - k, lo = 0, hi = a.length - 1;
    Random rnd = new Random();
    while (true) {
        int p = a[lo + rnd.nextInt(hi - lo + 1)];
        int lt = lo, i = lo, gt = hi;              // [lo,lt) < p, [lt,gt] == p, (gt,hi] > p
        while (i <= gt) {
            if (a[i] < p) { int t = a[lt]; a[lt++] = a[i]; a[i++] = t; }
            else if (a[i] > p) { int t = a[gt]; a[gt--] = a[i]; a[i] = t; }
            else i++;
        }
        if (target < lt) hi = lt - 1;
        else if (target > gt) lo = gt + 1;
        else return p;
    }
}`,
      js: `function findKthLargest(a, k) {
    const target = a.length - k;
    let lo = 0, hi = a.length - 1;
    while (true) {
        const p = a[lo + Math.floor(Math.random() * (hi - lo + 1))];
        let lt = lo, i = lo, gt = hi;              // [lo,lt) < p, [lt,gt] == p, (gt,hi] > p
        while (i <= gt) {
            if (a[i] < p) { [a[lt], a[i]] = [a[i], a[lt]]; lt++; i++; }
            else if (a[i] > p) { [a[i], a[gt]] = [a[gt], a[i]]; gt--; }
            else i++;
        }
        if (target < lt) hi = lt - 1;
        else if (target > gt) lo = gt + 1;
        else return p;
    }
}`
    }
  },
  {
    id: "so-top-k",
    title: "Top K Frequent Elements",
    difficulty: "medium",
    tags: ["Bucket sort", "Counting"],
    desc: "Return the k most frequent elements (any order), faster than O(n log n).",
    example: "[1,1,1,2,2,3], k = 2  →  [1,2]",
    hint: "A frequency is between 1 and n — use it as a bucket index instead of sorting by it.",
    approach: "Count frequencies, put each value into bucket[freq], then collect from the highest bucket down until you have k values.",
    complexity: "Time O(n) · Space O(n)",
    link: "https://leetcode.com/problems/top-k-frequent-elements/",
    code: {
      cpp: `vector<int> topKFrequent(vector<int>& a, int k) {
    unordered_map<int, int> freq;
    for (int x : a) freq[x]++;
    vector<vector<int>> bucket(a.size() + 1);
    for (auto& [x, f] : freq) bucket[f].push_back(x);
    vector<int> res;
    for (int f = a.size(); f >= 1 && res.size() < k; f--)
        for (int x : bucket[f]) if (res.size() < k) res.push_back(x);
    return res;
}`,
      java: `public int[] topKFrequent(int[] a, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : a) freq.merge(x, 1, Integer::sum);
    List<List<Integer>> bucket = new ArrayList<>();
    for (int i = 0; i <= a.length; i++) bucket.add(new ArrayList<>());
    for (var e : freq.entrySet()) bucket.get(e.getValue()).add(e.getKey());
    int[] res = new int[k];
    int n = 0;
    for (int f = a.length; f >= 1 && n < k; f--)
        for (int x : bucket.get(f)) if (n < k) res[n++] = x;
    return res;
}`,
      js: `function topKFrequent(a, k) {
    const freq = new Map();
    for (const x of a) freq.set(x, (freq.get(x) || 0) + 1);
    const bucket = Array.from({ length: a.length + 1 }, () => []);
    for (const [x, f] of freq) bucket[f].push(x);
    const res = [];
    for (let f = a.length; f >= 1 && res.length < k; f--)
        for (const x of bucket[f]) if (res.length < k) res.push(x);
    return res;
}`
    }
  },
  {
    id: "so-largest-number",
    title: "Largest Number",
    difficulty: "medium",
    tags: ["Custom comparator"],
    desc: "Arrange non-negative integers to form the largest possible number; return it as a string.",
    example: "[3,30,34,5,9]  →  \"9534330\"",
    hint: "Compare two numbers by which concatenation is bigger: a + b vs b + a (as strings).",
    approach: "Sort the strings with comparator (a, b) → b + a vs a + b, join. If the first is \"0\", the answer is \"0\".",
    complexity: "Time O(n log n · L) for L-digit numbers · Space O(n · L)",
    link: "https://leetcode.com/problems/largest-number/",
    code: {
      cpp: `string largestNumber(vector<int>& nums) {
    vector<string> s;
    for (int x : nums) s.push_back(to_string(x));
    sort(s.begin(), s.end(), [](const string& a, const string& b) { return a + b > b + a; });
    if (s[0] == "0") return "0";
    string res;
    for (auto& x : s) res += x;
    return res;
}`,
      java: `public String largestNumber(int[] nums) {
    String[] s = new String[nums.length];
    for (int i = 0; i < nums.length; i++) s[i] = String.valueOf(nums[i]);
    Arrays.sort(s, (a, b) -> (b + a).compareTo(a + b));
    if (s[0].equals("0")) return "0";
    return String.join("", s);
}`,
      js: `function largestNumber(nums) {
    const s = nums.map(String)
        .sort((a, b) => (b + a > a + b ? 1 : b + a < a + b ? -1 : 0));
    return s[0] === "0" ? "0" : s.join("");
}`
    }
  },
  {
    id: "so-freq-sort",
    title: "Sort Characters By Frequency",
    difficulty: "medium",
    tags: ["Counting", "Custom comparator"],
    desc: "Sort a string so characters appear in decreasing order of frequency (ties in any order).",
    example: "\"tree\"  →  \"eert\" (or \"eetr\")",
    hint: "Count, sort the distinct characters by count, then expand each one count times.",
    approach: "Sort only the distinct characters (at most 62/128), not the whole string. Bucket-by-frequency also works in O(n).",
    complexity: "Time O(n + k log k) for k distinct chars · Space O(n)",
    link: "https://leetcode.com/problems/sort-characters-by-frequency/",
    code: {
      cpp: `string frequencySort(string s) {
    int cnt[128] = {};
    for (char c : s) cnt[c]++;
    vector<char> chars;
    for (int c = 0; c < 128; c++) if (cnt[c]) chars.push_back(c);
    sort(chars.begin(), chars.end(), [&](char a, char b) { return cnt[a] > cnt[b]; });
    string res;
    for (char c : chars) res.append(cnt[c], c);
    return res;
}`,
      java: `public String frequencySort(String s) {
    int[] cnt = new int[128];
    for (char c : s.toCharArray()) cnt[c]++;
    List<Character> chars = new ArrayList<>();
    for (char c = 0; c < 128; c++) if (cnt[c] > 0) chars.add(c);
    chars.sort((a, b) -> cnt[b] - cnt[a]);
    StringBuilder res = new StringBuilder();
    for (char c : chars) res.append(String.valueOf(c).repeat(cnt[c]));
    return res.toString();
}`,
      js: `function frequencySort(s) {
    const cnt = new Map();
    for (const c of s) cnt.set(c, (cnt.get(c) || 0) + 1);
    return [...cnt.keys()]
        .sort((a, b) => cnt.get(b) - cnt.get(a))
        .map(c => c.repeat(cnt.get(c)))
        .join("");
}`
    }
  },
  {
    id: "so-h-index",
    title: "H-Index",
    difficulty: "medium",
    tags: ["Sort then scan"],
    desc: "A researcher has index h if h of their papers have at least h citations each. Return the largest h.",
    example: "[3,0,6,1,5]  →  3",
    hint: "Sort ascending. At index i there are n − i papers with at least c[i] citations.",
    approach: "Scan the sorted array; the first i where c[i] ≥ n − i gives h = n − i. (Counting sort with buckets 0…n makes it O(n).)",
    complexity: "Time O(n log n) · Space O(1) extra",
    link: "https://leetcode.com/problems/h-index/",
    code: {
      cpp: `int hIndex(vector<int>& c) {
    sort(c.begin(), c.end());
    int n = c.size();
    for (int i = 0; i < n; i++)
        if (c[i] >= n - i) return n - i;
    return 0;
}`,
      java: `public int hIndex(int[] c) {
    Arrays.sort(c);
    int n = c.length;
    for (int i = 0; i < n; i++)
        if (c[i] >= n - i) return n - i;
    return 0;
}`,
      js: `function hIndex(c) {
    c.sort((a, b) => a - b);
    const n = c.length;
    for (let i = 0; i < n; i++)
        if (c[i] >= n - i) return n - i;
    return 0;
}`
    }
  },
  {
    id: "so-3sum",
    title: "3Sum",
    difficulty: "medium",
    tags: ["Sort + two pointers"],
    desc: "Return all unique triplets [a, b, c] in the array with a + b + c = 0.",
    example: "[-1,0,1,2,-1,-4]  →  [[-1,-1,2],[-1,0,1]]",
    hint: "Sort first. Fix the smallest element, then find pairs with two pointers. Sorting also makes skipping duplicates easy.",
    approach: "For each i (skipping repeated values), move l and r inward depending on the sum. After a hit, skip equal values on both sides.",
    complexity: "Time O(n²) · Space O(1) extra (besides output and sort)",
    link: "https://leetcode.com/problems/3sum/",
    code: {
      cpp: `vector<vector<int>> threeSum(vector<int>& a) {
    sort(a.begin(), a.end());
    vector<vector<int>> res;
    int n = a.size();
    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && a[i] == a[i - 1]) continue;
        int l = i + 1, r = n - 1;
        while (l < r) {
            int s = a[i] + a[l] + a[r];
            if (s < 0) l++;
            else if (s > 0) r--;
            else {
                res.push_back({a[i], a[l], a[r]});
                l++; r--;
                while (l < r && a[l] == a[l - 1]) l++;
            }
        }
    }
    return res;
}`,
      java: `public List<List<Integer>> threeSum(int[] a) {
    Arrays.sort(a);
    List<List<Integer>> res = new ArrayList<>();
    int n = a.length;
    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && a[i] == a[i - 1]) continue;
        int l = i + 1, r = n - 1;
        while (l < r) {
            int s = a[i] + a[l] + a[r];
            if (s < 0) l++;
            else if (s > 0) r--;
            else {
                res.add(List.of(a[i], a[l], a[r]));
                l++; r--;
                while (l < r && a[l] == a[l - 1]) l++;
            }
        }
    }
    return res;
}`,
      js: `function threeSum(a) {
    a.sort((x, y) => x - y);
    const res = [], n = a.length;
    for (let i = 0; i < n - 2; i++) {
        if (i > 0 && a[i] === a[i - 1]) continue;
        let l = i + 1, r = n - 1;
        while (l < r) {
            const s = a[i] + a[l] + a[r];
            if (s < 0) l++;
            else if (s > 0) r--;
            else {
                res.push([a[i], a[l], a[r]]);
                l++; r--;
                while (l < r && a[l] === a[l - 1]) l++;
            }
        }
    }
    return res;
}`
    }
  },
  {
    id: "so-insertion-list",
    title: "Insertion Sort List",
    difficulty: "medium",
    tags: ["Insertion sort", "Linked list"],
    desc: "Sort a singly linked list using insertion sort and return the new head.",
    example: "4 → 2 → 1 → 3  →  1 → 2 → 3 → 4",
    hint: "Build a new sorted list behind a dummy node. Take nodes one by one from the input and splice each into place.",
    approach: "For each node, walk from the dummy until prev.next is ≥ the node's value, then insert it after prev.",
    complexity: "Time O(n²) · Space O(1)",
    link: "https://leetcode.com/problems/insertion-sort-list/",
    code: {
      cpp: `ListNode* insertionSortList(ListNode* head) {
    ListNode dummy(0);                       // sorted list starts empty
    while (head) {
        ListNode* next = head->next;
        ListNode* prev = &dummy;
        while (prev->next && prev->next->val < head->val) prev = prev->next;
        head->next = prev->next;
        prev->next = head;
        head = next;
    }
    return dummy.next;
}`,
      java: `public ListNode insertionSortList(ListNode head) {
    ListNode dummy = new ListNode(0);        // sorted list starts empty
    while (head != null) {
        ListNode next = head.next;
        ListNode prev = dummy;
        while (prev.next != null && prev.next.val < head.val) prev = prev.next;
        head.next = prev.next;
        prev.next = head;
        head = next;
    }
    return dummy.next;
}`,
      js: `function insertionSortList(head) {
    const dummy = new ListNode(0);           // sorted list starts empty
    while (head) {
        const next = head.next;
        let prev = dummy;
        while (prev.next && prev.next.val < head.val) prev = prev.next;
        head.next = prev.next;
        prev.next = head;
        head = next;
    }
    return dummy.next;
}`
    }
  },
  {
    id: "so-inversions",
    title: "Count Inversions",
    difficulty: "medium",
    tags: ["Merge sort", "Counting"],
    desc: "Count pairs (i, j) with i < j and a[i] > a[j] — a measure of how unsorted the array is.",
    example: "[2,4,1,3,5]  →  3   ((2,1), (4,1), (4,3))",
    hint: "During merge, when you take an element from the right half, it is smaller than every element still waiting in the left half.",
    approach: "Merge sort; each time right[j] is placed before left[i], add (mid − i) inversions. Use 64-bit counts (up to n²/2).",
    complexity: "Time O(n log n) · Space O(n)",
    link: "https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1",
    code: {
      cpp: `long long sortCount(vector<int>& a, int lo, int hi, vector<int>& tmp) {   // [lo, hi)
    if (hi - lo < 2) return 0;
    int mid = (lo + hi) / 2;
    long long cnt = sortCount(a, lo, mid, tmp) + sortCount(a, mid, hi, tmp);
    int i = lo, j = mid, k = lo;
    while (i < mid && j < hi) {
        if (a[i] <= a[j]) tmp[k++] = a[i++];
        else { cnt += mid - i; tmp[k++] = a[j++]; }   // a[j] beats all of a[i..mid)
    }
    while (i < mid) tmp[k++] = a[i++];
    while (j < hi) tmp[k++] = a[j++];
    copy(tmp.begin() + lo, tmp.begin() + hi, a.begin() + lo);
    return cnt;
}
long long countInversions(vector<int> a) {
    vector<int> tmp(a.size());
    return sortCount(a, 0, a.size(), tmp);
}`,
      java: `public long countInversions(int[] a) {
    return sortCount(a.clone(), 0, a.length, new int[a.length]);
}
private long sortCount(int[] a, int lo, int hi, int[] tmp) {   // [lo, hi)
    if (hi - lo < 2) return 0;
    int mid = (lo + hi) >>> 1;
    long cnt = sortCount(a, lo, mid, tmp) + sortCount(a, mid, hi, tmp);
    int i = lo, j = mid, k = lo;
    while (i < mid && j < hi) {
        if (a[i] <= a[j]) tmp[k++] = a[i++];
        else { cnt += mid - i; tmp[k++] = a[j++]; }   // a[j] beats all of a[i..mid)
    }
    while (i < mid) tmp[k++] = a[i++];
    while (j < hi) tmp[k++] = a[j++];
    System.arraycopy(tmp, lo, a, lo, hi - lo);
    return cnt;
}`,
      js: `function countInversions(arr) {
    const a = [...arr], tmp = new Array(a.length);
    const sortCount = (lo, hi) => {             // [lo, hi)
        if (hi - lo < 2) return 0;
        const mid = (lo + hi) >> 1;
        let cnt = sortCount(lo, mid) + sortCount(mid, hi);
        let i = lo, j = mid, k = lo;
        while (i < mid && j < hi) {
            if (a[i] <= a[j]) tmp[k++] = a[i++];
            else { cnt += mid - i; tmp[k++] = a[j++]; }   // a[j] beats all of a[i..mid)
        }
        while (i < mid) tmp[k++] = a[i++];
        while (j < hi) tmp[k++] = a[j++];
        for (k = lo; k < hi; k++) a[k] = tmp[k];
        return cnt;
    };
    return sortCount(0, a.length);
}`
    }
  },
  {
    id: "so-reverse-pairs",
    title: "Reverse Pairs",
    difficulty: "hard",
    tags: ["Merge sort", "Counting"],
    desc: "Count pairs (i, j) with i < j and nums[i] > 2 · nums[j].",
    example: "[1,3,2,3,1]  →  2",
    hint: "Like counting inversions, but count before merging: both halves are sorted, so a single forward-moving pointer works.",
    approach: "In each merge step, for every i in the left half advance j in the right half while a[i] > 2·a[j]; add j − mid. Then merge normally. Beware overflow of 2·a[j].",
    complexity: "Time O(n log n) · Space O(n)",
    link: "https://leetcode.com/problems/reverse-pairs/",
    code: {
      cpp: `int sortCount(vector<int>& a, int lo, int hi, vector<int>& tmp) {   // [lo, hi)
    if (hi - lo < 2) return 0;
    int mid = (lo + hi) / 2;
    int cnt = sortCount(a, lo, mid, tmp) + sortCount(a, mid, hi, tmp);
    for (int i = lo, j = mid; i < mid; i++) {
        while (j < hi && (long long)a[i] > 2LL * a[j]) j++;
        cnt += j - mid;
    }
    merge(a.begin() + lo, a.begin() + mid, a.begin() + mid, a.begin() + hi, tmp.begin() + lo);
    copy(tmp.begin() + lo, tmp.begin() + hi, a.begin() + lo);
    return cnt;
}
int reversePairs(vector<int>& a) {
    vector<int> tmp(a.size());
    return sortCount(a, 0, a.size(), tmp);
}`,
      java: `public int reversePairs(int[] a) {
    return sortCount(a, 0, a.length, new int[a.length]);
}
private int sortCount(int[] a, int lo, int hi, int[] tmp) {   // [lo, hi)
    if (hi - lo < 2) return 0;
    int mid = (lo + hi) >>> 1;
    int cnt = sortCount(a, lo, mid, tmp) + sortCount(a, mid, hi, tmp);
    for (int i = lo, j = mid; i < mid; i++) {
        while (j < hi && (long) a[i] > 2L * a[j]) j++;
        cnt += j - mid;
    }
    int i = lo, j = mid, k = lo;
    while (i < mid && j < hi) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
    while (i < mid) tmp[k++] = a[i++];
    while (j < hi) tmp[k++] = a[j++];
    System.arraycopy(tmp, lo, a, lo, hi - lo);
    return cnt;
}`,
      js: `function reversePairs(a) {
    const tmp = new Array(a.length);
    const sortCount = (lo, hi) => {             // [lo, hi)
        if (hi - lo < 2) return 0;
        const mid = (lo + hi) >> 1;
        let cnt = sortCount(lo, mid) + sortCount(mid, hi);
        for (let i = lo, j = mid; i < mid; i++) {
            while (j < hi && a[i] > 2 * a[j]) j++;
            cnt += j - mid;
        }
        let i = lo, j = mid, k = lo;
        while (i < mid && j < hi) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
        while (i < mid) tmp[k++] = a[i++];
        while (j < hi) tmp[k++] = a[j++];
        for (k = lo; k < hi; k++) a[k] = tmp[k];
        return cnt;
    };
    return sortCount(0, a.length);
}`
    }
  },
  {
    id: "so-max-gap",
    title: "Maximum Gap",
    difficulty: "hard",
    tags: ["Bucket sort", "Pigeonhole"],
    desc: "Return the largest difference between successive elements in the sorted form of the array — in linear time.",
    example: "[3,6,9,1]  →  3",
    hint: "With n numbers between min and max, the answer is at least (max − min)/(n − 1). Make buckets that narrow — the max gap can't be inside a bucket.",
    approach: "Bucket width = max(1, ⌊(max − min)/(n − 1)⌋). Track only min and max per bucket. The answer is the largest (bucket min − previous non-empty bucket max).",
    complexity: "Time O(n) · Space O(n)",
    link: "https://leetcode.com/problems/maximum-gap/",
    code: {
      cpp: `int maximumGap(vector<int>& a) {
    int n = a.size();
    if (n < 2) return 0;
    int mn = *min_element(a.begin(), a.end()), mx = *max_element(a.begin(), a.end());
    if (mn == mx) return 0;
    int width = max(1, (mx - mn) / (n - 1)), cnt = (mx - mn) / width + 1;
    vector<int> bmin(cnt, INT_MAX), bmax(cnt, INT_MIN);
    for (int x : a) {
        int b = (x - mn) / width;
        bmin[b] = min(bmin[b], x);
        bmax[b] = max(bmax[b], x);
    }
    int gap = 0, prev = mn;
    for (int b = 0; b < cnt; b++) {
        if (bmin[b] == INT_MAX) continue;      // empty bucket
        gap = max(gap, bmin[b] - prev);
        prev = bmax[b];
    }
    return gap;
}`,
      java: `public int maximumGap(int[] a) {
    int n = a.length;
    if (n < 2) return 0;
    int mn = Integer.MAX_VALUE, mx = Integer.MIN_VALUE;
    for (int x : a) { mn = Math.min(mn, x); mx = Math.max(mx, x); }
    if (mn == mx) return 0;
    int width = Math.max(1, (mx - mn) / (n - 1)), cnt = (mx - mn) / width + 1;
    int[] bmin = new int[cnt], bmax = new int[cnt];
    Arrays.fill(bmin, Integer.MAX_VALUE);
    Arrays.fill(bmax, Integer.MIN_VALUE);
    for (int x : a) {
        int b = (x - mn) / width;
        bmin[b] = Math.min(bmin[b], x);
        bmax[b] = Math.max(bmax[b], x);
    }
    int gap = 0, prev = mn;
    for (int b = 0; b < cnt; b++) {
        if (bmin[b] == Integer.MAX_VALUE) continue;   // empty bucket
        gap = Math.max(gap, bmin[b] - prev);
        prev = bmax[b];
    }
    return gap;
}`,
      js: `function maximumGap(a) {
    const n = a.length;
    if (n < 2) return 0;
    const mn = Math.min(...a), mx = Math.max(...a);
    if (mn === mx) return 0;
    const width = Math.max(1, Math.floor((mx - mn) / (n - 1)));
    const cnt = Math.floor((mx - mn) / width) + 1;
    const bmin = new Array(cnt).fill(Infinity), bmax = new Array(cnt).fill(-Infinity);
    for (const x of a) {
        const b = Math.floor((x - mn) / width);
        bmin[b] = Math.min(bmin[b], x);
        bmax[b] = Math.max(bmax[b], x);
    }
    let gap = 0, prev = mn;
    for (let b = 0; b < cnt; b++) {
        if (bmin[b] === Infinity) continue;    // empty bucket
        gap = Math.max(gap, bmin[b] - prev);
        prev = bmax[b];
    }
    return gap;
}`
    }
  },
  {
    id: "so-count-smaller",
    title: "Count of Smaller Numbers After Self",
    difficulty: "hard",
    tags: ["Merge sort on indices"],
    desc: "For each nums[i], count how many elements to its right are strictly smaller.",
    example: "[5,2,6,1]  →  [2,1,1,0]",
    hint: "Merge sort the indices by value. When a left element is placed, every right element already placed was smaller and came after it.",
    approach: "During merge keep rightCount = number of right-half elements emitted so far. Emitting left index i adds rightCount to ans[i]. Take left on ties (equal isn't smaller).",
    complexity: "Time O(n log n) · Space O(n)",
    link: "https://leetcode.com/problems/count-of-smaller-numbers-after-self/",
    code: {
      cpp: `void msort(vector<int>& a, vector<int>& idx, vector<int>& ans, vector<int>& tmp, int lo, int hi) {
    if (hi - lo < 2) return;
    int mid = (lo + hi) / 2;
    msort(a, idx, ans, tmp, lo, mid); msort(a, idx, ans, tmp, mid, hi);
    int i = lo, j = mid, k = lo, rightCount = 0;
    while (i < mid || j < hi) {
        if (j == hi || (i < mid && a[idx[i]] <= a[idx[j]])) {
            ans[idx[i]] += rightCount;          // smaller ones that jumped ahead
            tmp[k++] = idx[i++];
        } else { rightCount++; tmp[k++] = idx[j++]; }
    }
    copy(tmp.begin() + lo, tmp.begin() + hi, idx.begin() + lo);
}
vector<int> countSmaller(vector<int>& a) {
    int n = a.size();
    vector<int> idx(n), ans(n, 0), tmp(n);
    iota(idx.begin(), idx.end(), 0);
    msort(a, idx, ans, tmp, 0, n);
    return ans;
}`,
      java: `public List<Integer> countSmaller(int[] a) {
    int n = a.length;
    int[] idx = new int[n], ans = new int[n], tmp = new int[n];
    for (int i = 0; i < n; i++) idx[i] = i;
    msort(a, idx, ans, tmp, 0, n);
    List<Integer> res = new ArrayList<>();
    for (int x : ans) res.add(x);
    return res;
}
private void msort(int[] a, int[] idx, int[] ans, int[] tmp, int lo, int hi) {
    if (hi - lo < 2) return;
    int mid = (lo + hi) >>> 1;
    msort(a, idx, ans, tmp, lo, mid); msort(a, idx, ans, tmp, mid, hi);
    int i = lo, j = mid, k = lo, rightCount = 0;
    while (i < mid || j < hi) {
        if (j == hi || (i < mid && a[idx[i]] <= a[idx[j]])) {
            ans[idx[i]] += rightCount;          // smaller ones that jumped ahead
            tmp[k++] = idx[i++];
        } else { rightCount++; tmp[k++] = idx[j++]; }
    }
    System.arraycopy(tmp, lo, idx, lo, hi - lo);
}`,
      js: `function countSmaller(a) {
    const n = a.length, idx = a.map((_, i) => i), ans = new Array(n).fill(0), tmp = new Array(n);
    const msort = (lo, hi) => {
        if (hi - lo < 2) return;
        const mid = (lo + hi) >> 1;
        msort(lo, mid); msort(mid, hi);
        let i = lo, j = mid, k = lo, rightCount = 0;
        while (i < mid || j < hi) {
            if (j === hi || (i < mid && a[idx[i]] <= a[idx[j]])) {
                ans[idx[i]] += rightCount;      // smaller ones that jumped ahead
                tmp[k++] = idx[i++];
            } else { rightCount++; tmp[k++] = idx[j++]; }
        }
        for (k = lo; k < hi; k++) idx[k] = tmp[k];
    };
    msort(0, n);
    return ans;
}`
    }
  }
];

window.QUIZ = [
  {
    q: "Which of these sorts is stable?",
    opts: ["Selection sort", "Quick sort", "Heap sort", "Merge sort"],
    a: 3,
    exp: "Merge sort takes from the left half on ties, so equal elements keep their order. Selection, quick and heap sort can jump equal elements past each other."
  },
  {
    q: "What does [10, 9, 1, 100].sort() return in JavaScript?",
    opts: ["[1, 9, 10, 100]", "[1, 10, 100, 9]", "[100, 10, 9, 1]", "It throws"],
    a: 1,
    exp: "Without a comparator, elements are compared as strings: \"1\" < \"10\" < \"100\" < \"9\". Use .sort((a, b) => a - b)."
  },
  {
    q: "Why can't any comparison sort beat O(n log n) in the worst case?",
    opts: ["Memory is limited", "It must distinguish n! orders with yes/no comparisons, needing log₂(n!) ≈ n log n of them", "Computers compare slowly", "Recursion is expensive"],
    a: 1,
    exp: "Each comparison at best halves the remaining possible orders; log₂(n!) is Θ(n log n)."
  },
  {
    q: "Insertion sort on an already-sorted array of n elements takes…",
    opts: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
    a: 1,
    exp: "Each new element is compared once with its left neighbour and stays put — one pass, O(n). That's why it's used for small or nearly-sorted data."
  },
  {
    q: "Quick sort with the LAST element as pivot, on an already-sorted array, runs in…",
    opts: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    a: 2,
    exp: "Every partition splits off just one element, giving n levels of O(n) work. A random pivot fixes this in practice."
  },
  {
    q: "You need only the k-th largest element. Fastest typical approach?",
    opts: ["Sort, then index: O(n log n)", "Quickselect: O(n) average", "Bubble sort k passes", "Binary search"],
    a: 1,
    exp: "Quickselect partitions like quick sort but recurses into only one side, giving O(n) on average."
  },
  {
    q: "Counting sort is a good choice when…",
    opts: ["Values are arbitrary strings", "Values are integers in a small range", "The array is huge and values are 64-bit", "You need an in-place sort"],
    a: 1,
    exp: "It's O(n + k) for values in [0, k): great for ages, grades, colours — wasteful when k is huge."
  },
  {
    q: "Which built-in sort is NOT stable?",
    opts: ["Java Collections.sort", "JavaScript Array.prototype.sort", "C++ std::sort", "C++ std::stable_sort"],
    a: 2,
    exp: "std::sort is introsort (quick + heap + insertion) and may reorder equal elements. Java's object sort and JS sort are TimSort-based and stable."
  }
];
