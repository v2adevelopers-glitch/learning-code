// Question bank for the "Important questions" section.
// Each entry: id, title, difficulty, tags, desc, example, hint, approach, complexity, link, code{cpp,java,python}
window.QUESTIONS = [
  {
    id: "bs-classic",
    title: "Binary Search",
    difficulty: "easy",
    tags: ["Classic"],
    desc: "Given a sorted array of distinct integers and a target, return its index or −1.",
    example: "nums = [-1,0,3,5,9,12], target = 9  →  4",
    hint: "Closed range [lo, hi]; loop while lo <= hi; move lo to mid + 1 or hi to mid − 1.",
    approach: "Compare a[mid] with target. Equal → return. Smaller → the answer is right of mid. Larger → left of mid.",
    complexity: "Time O(log n) · Space O(1)",
    link: "https://leetcode.com/problems/binary-search/",
    code: {
      cpp: `int search(vector<int>& a, int target) {
    int lo = 0, hi = a.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
      java: `public int search(int[] a, int target) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
      python: `def search(a, target):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == target:
            return mid
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`
    }
  },
  {
    id: "search-insert",
    title: "Search Insert Position",
    difficulty: "easy",
    tags: ["Lower bound"],
    desc: "Return the index of target in a sorted array, or the index where it would be inserted to keep it sorted.",
    example: "nums = [1,3,5,6], target = 2  →  1",
    hint: "This is exactly lower bound: the first index with a[i] >= target. The answer can be n.",
    approach: "Half-open search with hi = n. If a[mid] >= target, hi = mid; otherwise lo = mid + 1. Return lo.",
    complexity: "Time O(log n) · Space O(1)",
    link: "https://leetcode.com/problems/search-insert-position/",
    code: {
      cpp: `int searchInsert(vector<int>& a, int target) {
    int lo = 0, hi = a.size();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] >= target) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
      java: `public int searchInsert(int[] a, int target) {
    int lo = 0, hi = a.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] >= target) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
      python: `def search_insert(a, target):
    lo, hi = 0, len(a)
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] >= target:
            hi = mid
        else:
            lo = mid + 1
    return lo
    # or: return bisect.bisect_left(a, target)`
    }
  },
  {
    id: "sqrt",
    title: "Sqrt(x)",
    difficulty: "easy",
    tags: ["On the answer", "Last true"],
    desc: "Return the integer square root of a non-negative x (rounded down), without using built-in sqrt.",
    example: "x = 8  →  2   (since 2² = 4 ≤ 8 < 9 = 3²)",
    hint: "Find the LAST m with m·m ≤ x. Moving lo = mid means mid must round up. Use long for m·m.",
    approach: "Search m in [0, x]. If mid·mid ≤ x, lo = mid; else hi = mid − 1. Round mid up to avoid an infinite loop.",
    complexity: "Time O(log x) · Space O(1)",
    link: "https://leetcode.com/problems/sqrtx/",
    code: {
      cpp: `int mySqrt(int x) {
    long long lo = 0, hi = x;
    while (lo < hi) {
        long long mid = lo + (hi - lo + 1) / 2;   // round up
        if (mid * mid <= x) lo = mid;
        else hi = mid - 1;
    }
    return (int)lo;
}`,
      java: `public int mySqrt(int x) {
    long lo = 0, hi = x;
    while (lo < hi) {
        long mid = lo + (hi - lo + 1) / 2;        // round up
        if (mid * mid <= x) lo = mid;
        else hi = mid - 1;
    }
    return (int) lo;
}`,
      python: `def my_sqrt(x):
    lo, hi = 0, x
    while lo < hi:
        mid = (lo + hi + 1) // 2                  # round up
        if mid * mid <= x:
            lo = mid
        else:
            hi = mid - 1
    return lo`
    }
  },
  {
    id: "first-bad",
    title: "First Bad Version",
    difficulty: "easy",
    tags: ["First true", "Predicate"],
    desc: "Versions 1…n; once a version is bad, all later ones are bad. Using isBadVersion(v), find the first bad one with the fewest calls.",
    example: "n = 5, first bad = 4  →  4",
    hint: "isBadVersion is the monotonic predicate: false, false, …, true, true. Find the first true.",
    approach: "lo = 1, hi = n. If isBadVersion(mid), hi = mid (mid may be the first); else lo = mid + 1. Use lo + (hi − lo) / 2 — n can be 2³¹ − 1.",
    complexity: "Time O(log n) calls · Space O(1)",
    link: "https://leetcode.com/problems/first-bad-version/",
    code: {
      cpp: `int firstBadVersion(int n) {
    int lo = 1, hi = n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;   // (lo + hi) / 2 overflows here!
        if (isBadVersion(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
      java: `public int firstBadVersion(int n) {
    int lo = 1, hi = n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;   // (lo + hi) / 2 overflows here!
        if (isBadVersion(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
      python: `def first_bad_version(n):
    lo, hi = 1, n
    while lo < hi:
        mid = (lo + hi) // 2
        if isBadVersion(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`
    }
  },
  {
    id: "perfect-square",
    title: "Valid Perfect Square",
    difficulty: "easy",
    tags: ["Classic", "Overflow"],
    desc: "Return true if num is a perfect square, without using sqrt.",
    example: "num = 16  →  true,   num = 14  →  false",
    hint: "Exact-match binary search over m in [1, num], comparing m·m with num. Use 64-bit math.",
    approach: "Classic lo <= hi search: m·m == num → true, smaller → lo = m + 1, larger → hi = m − 1.",
    complexity: "Time O(log num) · Space O(1)",
    link: "https://leetcode.com/problems/valid-perfect-square/",
    code: {
      cpp: `bool isPerfectSquare(int num) {
    long long lo = 1, hi = num;
    while (lo <= hi) {
        long long mid = lo + (hi - lo) / 2, sq = mid * mid;
        if (sq == num) return true;
        if (sq < num) lo = mid + 1;
        else hi = mid - 1;
    }
    return false;
}`,
      java: `public boolean isPerfectSquare(int num) {
    long lo = 1, hi = num;
    while (lo <= hi) {
        long mid = lo + (hi - lo) / 2, sq = mid * mid;
        if (sq == num) return true;
        if (sq < num) lo = mid + 1;
        else hi = mid - 1;
    }
    return false;
}`,
      python: `def is_perfect_square(num):
    lo, hi = 1, num
    while lo <= hi:
        mid = (lo + hi) // 2
        sq = mid * mid
        if sq == num:
            return True
        if sq < num:
            lo = mid + 1
        else:
            hi = mid - 1
    return False`
    }
  },
  {
    id: "kth-missing",
    title: "Kth Missing Positive Number",
    difficulty: "easy",
    tags: ["First true", "Index math"],
    desc: "Given a strictly increasing array of positive integers, return the k-th positive integer missing from it.",
    example: "arr = [2,3,4,7,11], k = 5  →  9   (missing: 1,5,6,8,9,…)",
    hint: "Numbers missing before index i = a[i] − (i + 1). That count is non-decreasing → binary search it.",
    approach: "Find the first index i where a[i] − (i + 1) ≥ k. Exactly i array values sit below the answer, so the answer is i + k.",
    complexity: "Time O(log n) · Space O(1)",
    link: "https://leetcode.com/problems/kth-missing-positive-number/",
    code: {
      cpp: `int findKthPositive(vector<int>& a, int k) {
    int lo = 0, hi = a.size();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] - (mid + 1) >= k) hi = mid;
        else lo = mid + 1;
    }
    return lo + k;
}`,
      java: `public int findKthPositive(int[] a, int k) {
    int lo = 0, hi = a.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] - (mid + 1) >= k) hi = mid;
        else lo = mid + 1;
    }
    return lo + k;
}`,
      python: `def find_kth_positive(a, k):
    lo, hi = 0, len(a)
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] - (mid + 1) >= k:
            hi = mid
        else:
            lo = mid + 1
    return lo + k`
    }
  },
  {
    id: "first-last",
    title: "Find First and Last Position of Element",
    difficulty: "medium",
    tags: ["Lower / upper bound"],
    desc: "In a sorted array (with duplicates), return [first, last] index of target, or [−1, −1].",
    example: "nums = [5,7,7,8,8,10], target = 8  →  [3,4]",
    hint: "first = lower_bound(t). last = upper_bound(t) − 1. Check that first is in range and equals t.",
    approach: "Write one helper that finds the first index with a[i] >= t (or > t when strict). Two calls, each O(log n).",
    complexity: "Time O(log n) · Space O(1)",
    link: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
    code: {
      cpp: `int bound(vector<int>& a, int t, bool strict) {   // first a[i] >= t (or > t)
    int lo = 0, hi = a.size();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (strict ? a[mid] > t : a[mid] >= t) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}
vector<int> searchRange(vector<int>& a, int t) {
    int first = bound(a, t, false);
    if (first == a.size() || a[first] != t) return {-1, -1};
    return {first, bound(a, t, true) - 1};
}`,
      java: `public int[] searchRange(int[] a, int t) {
    int first = bound(a, t, false);
    if (first == a.length || a[first] != t) return new int[]{-1, -1};
    return new int[]{first, bound(a, t, true) - 1};
}
private int bound(int[] a, int t, boolean strict) {   // first a[i] >= t (or > t)
    int lo = 0, hi = a.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (strict ? a[mid] > t : a[mid] >= t) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}`,
      python: `from bisect import bisect_left, bisect_right

def search_range(a, t):
    first = bisect_left(a, t)
    if first == len(a) or a[first] != t:
        return [-1, -1]
    return [first, bisect_right(a, t) - 1]`
    }
  },
  {
    id: "rotated-search",
    title: "Search in Rotated Sorted Array",
    difficulty: "medium",
    tags: ["Rotated"],
    desc: "A sorted array of distinct values was rotated at an unknown pivot. Find target in O(log n).",
    example: "nums = [4,5,6,7,0,1,2], target = 0  →  4",
    hint: "One half around mid is always sorted. If a[lo] <= a[mid], the left half is sorted.",
    approach: "Determine the sorted half. If the target lies inside its range, search there; otherwise search the other half.",
    complexity: "Time O(log n) · Space O(1)",
    link: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    code: {
      cpp: `int search(vector<int>& a, int t) {
    int lo = 0, hi = a.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == t) return mid;
        if (a[lo] <= a[mid]) {                       // left half sorted
            if (a[lo] <= t && t < a[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {                                     // right half sorted
            if (a[mid] < t && t <= a[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
      java: `public int search(int[] a, int t) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == t) return mid;
        if (a[lo] <= a[mid]) {                       // left half sorted
            if (a[lo] <= t && t < a[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {                                     // right half sorted
            if (a[mid] < t && t <= a[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
      python: `def search_rotated(a, t):
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == t:
            return mid
        if a[lo] <= a[mid]:                 # left half sorted
            if a[lo] <= t < a[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                               # right half sorted
            if a[mid] < t <= a[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1`
    }
  },
  {
    id: "rotated-min",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "medium",
    tags: ["Rotated", "Compare with hi"],
    desc: "Find the minimum of a rotated sorted array of distinct values in O(log n).",
    example: "nums = [3,4,5,1,2]  →  1",
    hint: "Compare a[mid] with a[hi], not a[lo]. If a[mid] > a[hi], the drop (minimum) is to the right of mid.",
    approach: "While lo < hi: a[mid] > a[hi] → lo = mid + 1; else hi = mid. The predicate a[i] <= a[last] is false…true.",
    complexity: "Time O(log n) · Space O(1)",
    link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    code: {
      cpp: `int findMin(vector<int>& a) {
    int lo = 0, hi = a.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] > a[hi]) lo = mid + 1;
        else hi = mid;
    }
    return a[lo];
}`,
      java: `public int findMin(int[] a) {
    int lo = 0, hi = a.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] > a[hi]) lo = mid + 1;
        else hi = mid;
    }
    return a[lo];
}`,
      python: `def find_min(a):
    lo, hi = 0, len(a) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] > a[hi]:
            lo = mid + 1
        else:
            hi = mid
    return a[lo]`
    }
  },
  {
    id: "peak",
    title: "Find Peak Element",
    difficulty: "medium",
    tags: ["Compare with neighbour"],
    desc: "Return the index of any element strictly greater than its neighbours (a[−1] = a[n] = −∞). Adjacent values differ.",
    example: "nums = [1,2,1,3,5,6,4]  →  1 or 5",
    hint: "If a[mid] < a[mid+1] you're on an upward slope — a peak must exist to the right.",
    approach: "While lo < hi: if a[mid] < a[mid+1], lo = mid + 1; else hi = mid. Works on unsorted data because the slope direction is the predicate.",
    complexity: "Time O(log n) · Space O(1)",
    link: "https://leetcode.com/problems/find-peak-element/",
    code: {
      cpp: `int findPeakElement(vector<int>& a) {
    int lo = 0, hi = a.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < a[mid + 1]) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
      java: `public int findPeakElement(int[] a) {
    int lo = 0, hi = a.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < a[mid + 1]) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
      python: `def find_peak_element(a):
    lo, hi = 0, len(a) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] < a[mid + 1]:
            lo = mid + 1
        else:
            hi = mid
    return lo`
    }
  },
  {
    id: "single-element",
    title: "Single Element in a Sorted Array",
    difficulty: "medium",
    tags: ["Parity trick"],
    desc: "Every element appears exactly twice except one. Find it in O(log n) time and O(1) space.",
    example: "nums = [1,1,2,3,3,4,4,8,8]  →  2",
    hint: "Before the single element, pairs start at even indices. After it, they start at odd indices.",
    approach: "Make mid even. If a[mid] == a[mid+1], the single is to the right (lo = mid + 2); otherwise it's at mid or left (hi = mid).",
    complexity: "Time O(log n) · Space O(1)",
    link: "https://leetcode.com/problems/single-element-in-a-sorted-array/",
    code: {
      cpp: `int singleNonDuplicate(vector<int>& a) {
    int lo = 0, hi = a.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (mid % 2 == 1) mid--;            // pair starts at an even index
        if (a[mid] == a[mid + 1]) lo = mid + 2;
        else hi = mid;
    }
    return a[lo];
}`,
      java: `public int singleNonDuplicate(int[] a) {
    int lo = 0, hi = a.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (mid % 2 == 1) mid--;            // pair starts at an even index
        if (a[mid] == a[mid + 1]) lo = mid + 2;
        else hi = mid;
    }
    return a[lo];
}`,
      python: `def single_non_duplicate(a):
    lo, hi = 0, len(a) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if mid % 2 == 1:                    # pair starts at an even index
            mid -= 1
        if a[mid] == a[mid + 1]:
            lo = mid + 2
        else:
            hi = mid
    return a[lo]`
    }
  },
  {
    id: "matrix-search",
    title: "Search a 2D Matrix",
    difficulty: "medium",
    tags: ["Index mapping", "Matrix"],
    desc: "Each row is sorted and each row starts after the previous one ends. Find target in O(log(R·C)).",
    example: "[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3  →  true",
    hint: "Treat the matrix as one sorted array of length R·C. Flat index k → a[k / C][k % C].",
    approach: "Classic binary search over k in [0, R·C − 1], reading values through the index mapping.",
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
    id: "koko",
    title: "Koko Eating Bananas",
    difficulty: "medium",
    tags: ["On the answer"],
    desc: "Piles of bananas, h hours. At speed k Koko eats up to k bananas from one pile per hour. Return the minimum k to finish within h hours.",
    example: "piles = [3,6,7,11], h = 8  →  4",
    hint: "Hours needed at speed k = Σ ⌈p / k⌉, which only decreases as k grows. Search k in [1, max(piles)].",
    approach: "First true of ok(k) = hours(k) ≤ h. ⌈p / k⌉ = (p + k − 1) / k. Sum in 64-bit.",
    complexity: "Time O(n · log max) · Space O(1)",
    link: "https://leetcode.com/problems/koko-eating-bananas/",
    code: {
      cpp: `int minEatingSpeed(vector<int>& piles, int h) {
    int lo = 1, hi = *max_element(piles.begin(), piles.end());
    while (lo < hi) {
        int k = lo + (hi - lo) / 2;
        long long hours = 0;
        for (int p : piles) hours += (p + k - 1) / k;
        if (hours <= h) hi = k;
        else lo = k + 1;
    }
    return lo;
}`,
      java: `public int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = 0;
    for (int p : piles) hi = Math.max(hi, p);
    while (lo < hi) {
        int k = lo + (hi - lo) / 2;
        long hours = 0;
        for (int p : piles) hours += (p + k - 1) / k;
        if (hours <= h) hi = k;
        else lo = k + 1;
    }
    return lo;
}`,
      python: `def min_eating_speed(piles, h):
    lo, hi = 1, max(piles)
    while lo < hi:
        k = (lo + hi) // 2
        hours = sum((p + k - 1) // k for p in piles)
        if hours <= h:
            hi = k
        else:
            lo = k + 1
    return lo`
    }
  },
  {
    id: "ship",
    title: "Capacity To Ship Packages Within D Days",
    difficulty: "medium",
    tags: ["On the answer", "Greedy check"],
    desc: "Ship packages in the given order; each day load as many as fit under the capacity. Return the minimum capacity to finish in `days` days.",
    example: "weights = [1..10], days = 5  →  15",
    hint: "Capacity is between max(weights) (must carry the heaviest) and sum(weights) (one day).",
    approach: "Greedy check: fill a day until the next package overflows, then start a new day. First capacity whose day count ≤ days.",
    complexity: "Time O(n · log(sum)) · Space O(1)",
    link: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
    code: {
      cpp: `int shipWithinDays(vector<int>& w, int days) {
    int lo = *max_element(w.begin(), w.end());
    int hi = accumulate(w.begin(), w.end(), 0);
    while (lo < hi) {
        int cap = lo + (hi - lo) / 2, need = 1, cur = 0;
        for (int x : w) {
            if (cur + x > cap) { need++; cur = 0; }
            cur += x;
        }
        if (need <= days) hi = cap;
        else lo = cap + 1;
    }
    return lo;
}`,
      java: `public int shipWithinDays(int[] w, int days) {
    int lo = 0, hi = 0;
    for (int x : w) { lo = Math.max(lo, x); hi += x; }
    while (lo < hi) {
        int cap = lo + (hi - lo) / 2, need = 1, cur = 0;
        for (int x : w) {
            if (cur + x > cap) { need++; cur = 0; }
            cur += x;
        }
        if (need <= days) hi = cap;
        else lo = cap + 1;
    }
    return lo;
}`,
      python: `def ship_within_days(w, days):
    def need(cap):
        d, cur = 1, 0
        for x in w:
            if cur + x > cap:
                d, cur = d + 1, 0
            cur += x
        return d

    lo, hi = max(w), sum(w)
    while lo < hi:
        cap = (lo + hi) // 2
        if need(cap) <= days:
            hi = cap
        else:
            lo = cap + 1
    return lo`
    }
  },
  {
    id: "bouquets",
    title: "Minimum Number of Days to Make m Bouquets",
    difficulty: "medium",
    tags: ["On the answer"],
    desc: "bloomDay[i] is when flower i blooms. A bouquet needs k adjacent bloomed flowers. Return the minimum day to make m bouquets, or −1.",
    example: "bloomDay = [1,10,3,10,2], m = 3, k = 1  →  3",
    hint: "If m·k > n it's impossible. Otherwise search the day in [min, max] of bloomDay.",
    approach: "Check(day): scan, count consecutive bloomed flowers, every k of them make a bouquet. First day where bouquets ≥ m.",
    complexity: "Time O(n · log(max day)) · Space O(1)",
    link: "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/",
    code: {
      cpp: `int minDays(vector<int>& bloom, int m, int k) {
    if ((long long)m * k > bloom.size()) return -1;
    int lo = *min_element(bloom.begin(), bloom.end());
    int hi = *max_element(bloom.begin(), bloom.end());
    while (lo < hi) {
        int day = lo + (hi - lo) / 2, run = 0, made = 0;
        for (int b : bloom) {
            if (b <= day) { if (++run == k) { made++; run = 0; } }
            else run = 0;
        }
        if (made >= m) hi = day;
        else lo = day + 1;
    }
    return lo;
}`,
      java: `public int minDays(int[] bloom, int m, int k) {
    if ((long) m * k > bloom.length) return -1;
    int lo = Integer.MAX_VALUE, hi = 0;
    for (int b : bloom) { lo = Math.min(lo, b); hi = Math.max(hi, b); }
    while (lo < hi) {
        int day = lo + (hi - lo) / 2, run = 0, made = 0;
        for (int b : bloom) {
            if (b <= day) { if (++run == k) { made++; run = 0; } }
            else run = 0;
        }
        if (made >= m) hi = day;
        else lo = day + 1;
    }
    return lo;
}`,
      python: `def min_days(bloom, m, k):
    if m * k > len(bloom):
        return -1

    def bouquets(day):
        made = run = 0
        for b in bloom:
            run = run + 1 if b <= day else 0
            if run == k:
                made, run = made + 1, 0
        return made

    lo, hi = min(bloom), max(bloom)
    while lo < hi:
        day = (lo + hi) // 2
        if bouquets(day) >= m:
            hi = day
        else:
            lo = day + 1
    return lo`
    }
  },
  {
    id: "k-closest",
    title: "Find K Closest Elements",
    difficulty: "medium",
    tags: ["Window start search"],
    desc: "Given a sorted array, return the k elements closest to x, in sorted order (ties prefer the smaller value).",
    example: "arr = [1,2,3,4,5], k = 4, x = 3  →  [1,2,3,4]",
    hint: "Binary search the START of the window in [0, n − k]. Compare x − a[mid] with a[mid + k] − x.",
    approach: "If x − a[mid] > a[mid+k] − x, the window starting at mid is worse than shifting right → lo = mid + 1; otherwise hi = mid.",
    complexity: "Time O(log(n − k) + k) · Space O(1) besides output",
    link: "https://leetcode.com/problems/find-k-closest-elements/",
    code: {
      cpp: `vector<int> findClosestElements(vector<int>& a, int k, int x) {
    int lo = 0, hi = a.size() - k;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (x - a[mid] > a[mid + k] - x) lo = mid + 1;
        else hi = mid;
    }
    return vector<int>(a.begin() + lo, a.begin() + lo + k);
}`,
      java: `public List<Integer> findClosestElements(int[] a, int k, int x) {
    int lo = 0, hi = a.length - k;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (x - a[mid] > a[mid + k] - x) lo = mid + 1;
        else hi = mid;
    }
    List<Integer> res = new ArrayList<>();
    for (int i = lo; i < lo + k; i++) res.add(a[i]);
    return res;
}`,
      python: `def find_closest_elements(a, k, x):
    lo, hi = 0, len(a) - k
    while lo < hi:
        mid = (lo + hi) // 2
        if x - a[mid] > a[mid + k] - x:
            lo = mid + 1
        else:
            hi = mid
    return a[lo:lo + k]`
    }
  },
  {
    id: "aggressive-cows",
    title: "Aggressive Cows (maximise the minimum distance)",
    difficulty: "medium",
    tags: ["On the answer", "Last true"],
    desc: "Place c cows in stalls at given positions so that the minimum distance between any two cows is as large as possible. Return that distance.",
    example: "stalls = [1,2,4,8,9], c = 3  →  3   (cows at 1, 4, 8)",
    hint: "Sort. If distance d is achievable, every smaller d is too → true…true, false…false. Find the LAST true.",
    approach: "Greedy check(d): put a cow in the first stall, then in every stall at least d past the previous cow. Search d in [1, max − min] with mid rounded up.",
    complexity: "Time O(n log n + n · log(range)) · Space O(1)",
    link: "https://www.spoj.com/problems/AGGRCOW/",
    code: {
      cpp: `bool canPlace(vector<int>& s, int c, int d) {
    int placed = 1, last = s[0];
    for (int x : s)
        if (x - last >= d) { placed++; last = x; }
    return placed >= c;
}
int aggressiveCows(vector<int> s, int c) {
    sort(s.begin(), s.end());
    int lo = 1, hi = s.back() - s[0];
    while (lo < hi) {
        int mid = lo + (hi - lo + 1) / 2;   // round up: we set lo = mid
        if (canPlace(s, c, mid)) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}`,
      java: `public int aggressiveCows(int[] s, int c) {
    Arrays.sort(s);
    int lo = 1, hi = s[s.length - 1] - s[0];
    while (lo < hi) {
        int mid = lo + (hi - lo + 1) / 2;   // round up: we set lo = mid
        if (canPlace(s, c, mid)) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}
private boolean canPlace(int[] s, int c, int d) {
    int placed = 1, last = s[0];
    for (int x : s)
        if (x - last >= d) { placed++; last = x; }
    return placed >= c;
}`,
      python: `def aggressive_cows(stalls, c):
    s = sorted(stalls)

    def can_place(d):
        placed, last = 1, s[0]
        for x in s:
            if x - last >= d:
                placed, last = placed + 1, x
        return placed >= c

    lo, hi = 1, s[-1] - s[0]
    while lo < hi:
        mid = (lo + hi + 1) // 2            # round up: we set lo = mid
        if can_place(mid):
            lo = mid
        else:
            hi = mid - 1
    return lo`
    }
  },
  {
    id: "rotated-min-dups",
    title: "Find Minimum in Rotated Sorted Array II",
    difficulty: "hard",
    tags: ["Rotated", "Duplicates"],
    desc: "Same as the rotated-minimum problem, but the array may contain duplicates.",
    example: "nums = [2,2,2,0,1]  →  0",
    hint: "When a[mid] == a[hi] you can't tell which side the minimum is on — but you can safely drop hi.",
    approach: "a[mid] > a[hi] → lo = mid + 1; a[mid] < a[hi] → hi = mid; equal → hi−−. Worst case O(n) (e.g. all equal), which is unavoidable.",
    complexity: "Time O(log n) average, O(n) worst · Space O(1)",
    link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/",
    code: {
      cpp: `int findMin(vector<int>& a) {
    int lo = 0, hi = a.size() - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] > a[hi]) lo = mid + 1;
        else if (a[mid] < a[hi]) hi = mid;
        else hi--;
    }
    return a[lo];
}`,
      java: `public int findMin(int[] a) {
    int lo = 0, hi = a.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] > a[hi]) lo = mid + 1;
        else if (a[mid] < a[hi]) hi = mid;
        else hi--;
    }
    return a[lo];
}`,
      python: `def find_min_dups(a):
    lo, hi = 0, len(a) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] > a[hi]:
            lo = mid + 1
        elif a[mid] < a[hi]:
            hi = mid
        else:
            hi -= 1
    return a[lo]`
    }
  },
  {
    id: "split-array",
    title: "Split Array Largest Sum",
    difficulty: "hard",
    tags: ["On the answer", "Minimise the max"],
    desc: "Split nums into k non-empty contiguous subarrays to minimise the largest subarray sum. Return that minimum.",
    example: "nums = [7,2,5,10,8], k = 2  →  18   ([7,2,5] | [10,8])",
    hint: "Same structure as shipping packages: can we split so every part has sum ≤ cap using at most k parts?",
    approach: "Search cap in [max(nums), sum(nums)]. Greedy count of parts; first cap with parts ≤ k. (Fewer parts is fine — you can always split further.)",
    complexity: "Time O(n · log(sum)) · Space O(1)",
    link: "https://leetcode.com/problems/split-array-largest-sum/",
    code: {
      cpp: `int splitArray(vector<int>& a, int k) {
    long long lo = *max_element(a.begin(), a.end());
    long long hi = accumulate(a.begin(), a.end(), 0LL);
    while (lo < hi) {
        long long cap = lo + (hi - lo) / 2, cur = 0;
        int parts = 1;
        for (int x : a) {
            if (cur + x > cap) { parts++; cur = 0; }
            cur += x;
        }
        if (parts <= k) hi = cap;
        else lo = cap + 1;
    }
    return (int)lo;
}`,
      java: `public int splitArray(int[] a, int k) {
    long lo = 0, hi = 0;
    for (int x : a) { lo = Math.max(lo, x); hi += x; }
    while (lo < hi) {
        long cap = lo + (hi - lo) / 2, cur = 0;
        int parts = 1;
        for (int x : a) {
            if (cur + x > cap) { parts++; cur = 0; }
            cur += x;
        }
        if (parts <= k) hi = cap;
        else lo = cap + 1;
    }
    return (int) lo;
}`,
      python: `def split_array(a, k):
    def parts(cap):
        p, cur = 1, 0
        for x in a:
            if cur + x > cap:
                p, cur = p + 1, 0
            cur += x
        return p

    lo, hi = max(a), sum(a)
    while lo < hi:
        cap = (lo + hi) // 2
        if parts(cap) <= k:
            hi = cap
        else:
            lo = cap + 1
    return lo`
    }
  },
  {
    id: "median-two",
    title: "Median of Two Sorted Arrays",
    difficulty: "hard",
    tags: ["Partition search"],
    desc: "Return the median of two sorted arrays in O(log(min(m, n))).",
    example: "nums1 = [1,3], nums2 = [2]  →  2.0;   nums1 = [1,2], nums2 = [3,4]  →  2.5",
    hint: "Binary search how many elements i to take from the smaller array into the left half; j = (m + n + 1) / 2 − i comes from the other.",
    approach: "A valid split has A[i−1] ≤ B[j] and B[j−1] ≤ A[i] (use ±∞ at the edges). If A[i−1] > B[j], take fewer from A; else take more. Median comes from the max of the lefts / min of the rights.",
    complexity: "Time O(log(min(m, n))) · Space O(1)",
    link: "https://leetcode.com/problems/median-of-two-sorted-arrays/",
    code: {
      cpp: `double findMedianSortedArrays(vector<int>& A, vector<int>& B) {
    if (A.size() > B.size()) return findMedianSortedArrays(B, A);
    int m = A.size(), n = B.size(), lo = 0, hi = m;
    while (lo <= hi) {
        int i = (lo + hi) / 2, j = (m + n + 1) / 2 - i;
        int aL = i == 0 ? INT_MIN : A[i - 1], aR = i == m ? INT_MAX : A[i];
        int bL = j == 0 ? INT_MIN : B[j - 1], bR = j == n ? INT_MAX : B[j];
        if (aL <= bR && bL <= aR) {
            if ((m + n) % 2) return max(aL, bL);
            return (max(aL, bL) + (double)min(aR, bR)) / 2.0;
        }
        if (aL > bR) hi = i - 1;
        else lo = i + 1;
    }
    return 0.0;
}`,
      java: `public double findMedianSortedArrays(int[] A, int[] B) {
    if (A.length > B.length) return findMedianSortedArrays(B, A);
    int m = A.length, n = B.length, lo = 0, hi = m;
    while (lo <= hi) {
        int i = (lo + hi) / 2, j = (m + n + 1) / 2 - i;
        int aL = i == 0 ? Integer.MIN_VALUE : A[i - 1], aR = i == m ? Integer.MAX_VALUE : A[i];
        int bL = j == 0 ? Integer.MIN_VALUE : B[j - 1], bR = j == n ? Integer.MAX_VALUE : B[j];
        if (aL <= bR && bL <= aR) {
            if ((m + n) % 2 == 1) return Math.max(aL, bL);
            return (Math.max(aL, bL) + (double) Math.min(aR, bR)) / 2.0;
        }
        if (aL > bR) hi = i - 1;
        else lo = i + 1;
    }
    return 0.0;
}`,
      python: `def find_median_sorted_arrays(A, B):
    if len(A) > len(B):
        A, B = B, A
    m, n = len(A), len(B)
    lo, hi = 0, m
    INF = float("inf")
    while lo <= hi:
        i = (lo + hi) // 2
        j = (m + n + 1) // 2 - i
        aL = A[i - 1] if i > 0 else -INF
        aR = A[i] if i < m else INF
        bL = B[j - 1] if j > 0 else -INF
        bR = B[j] if j < n else INF
        if aL <= bR and bL <= aR:
            if (m + n) % 2:
                return float(max(aL, bL))
            return (max(aL, bL) + min(aR, bR)) / 2
        if aL > bR:
            hi = i - 1
        else:
            lo = i + 1`
    }
  }
];

window.QUIZ = [
  {
    q: "What is the one property binary search really needs?",
    opts: ["The data must be stored in an array", "A monotonic yes/no condition over the search range", "All values must be distinct", "The size must be a power of two"],
    a: 1,
    exp: "Sorted arrays are just one source of monotonicity. Any false…false, true…true condition (over indices or over answer values) can be binary searched."
  },
  {
    q: "At most how many comparisons does binary search need for 1,000,000 sorted items?",
    opts: ["1,000", "100", "20", "6"],
    a: 2,
    exp: "2²⁰ ≈ 1,048,576, so about 20 halvings reduce the range to a single element."
  },
  {
    q: "Why write mid = lo + (hi - lo) / 2 instead of (lo + hi) / 2?",
    opts: ["It is faster", "lo + hi can overflow a 32-bit int", "It rounds up", "It works on unsorted arrays"],
    a: 1,
    exp: "With lo and hi near 2³¹, lo + hi overflows to a negative number. hi − lo never overflows."
  },
  {
    q: "Loop: while (lo < hi) { mid = lo + (hi - lo) / 2; if (ok(mid)) lo = mid; else hi = mid - 1; } — what's wrong?",
    opts: ["Nothing", "It can loop forever when hi = lo + 1", "It skips the answer", "It overflows"],
    a: 1,
    exp: "When hi = lo + 1, mid rounds down to lo. If ok(mid) is true, lo = mid changes nothing → infinite loop. Round up: lo + (hi − lo + 1) / 2."
  },
  {
    q: "a = [1, 2, 2, 2, 5]. What do lower_bound(2) and upper_bound(2) return?",
    opts: ["1 and 3", "1 and 4", "0 and 4", "2 and 3"],
    a: 1,
    exp: "lower_bound = first index with a[i] ≥ 2 → 1. upper_bound = first index with a[i] > 2 → 4. Count of 2s = 4 − 1 = 3."
  },
  {
    q: "In a rotated sorted array (distinct values), which statement is always true for any mid?",
    opts: ["Both halves are sorted", "At least one of [lo, mid] or [mid, hi] is sorted", "The minimum is at mid", "a[lo] < a[hi]"],
    a: 1,
    exp: "The rotation point can only be in one half, so the other half is a normal sorted range — check the target against it."
  },
  {
    q: "“Find the minimum ship capacity to deliver all packages in D days.” What do you binary search over?",
    opts: ["The indices of the weights array", "The capacity value, between max(weights) and sum(weights)", "The number of days", "The sorted weights"],
    a: 1,
    exp: "Binary search on the answer: feasibility is monotonic in capacity, and each check is an O(n) greedy pass."
  },
  {
    q: "Python: bisect_left([1, 3, 3, 7], 3) returns…",
    opts: ["0", "1", "2", "3"],
    a: 1,
    exp: "bisect_left is lower bound: the first position where 3 could be inserted keeping order, i.e. before the existing 3s → 1."
  }
];
