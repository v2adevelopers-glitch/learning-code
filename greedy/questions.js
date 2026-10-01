// Question bank for the "Important questions" section.
// Each entry: id, title, difficulty, tags, desc, example, hint, approach, complexity, link, code{cpp,java,js}
window.QUESTIONS = [
  {
    id: "g-cookies",
    title: "Assign Cookies",
    difficulty: "easy",
    tags: ["Sort + two pointers"],
    desc: "Child i is content with a cookie of size ≥ g[i]. Each child gets at most one cookie. Maximise the number of content children.",
    example: "g = [1,2,3], s = [1,1]  →  1",
    hint: "Give each cookie to the least greedy child it can satisfy. Sort both arrays.",
    approach: "Walk cookies from smallest to largest; whenever the current cookie satisfies the current (least greedy) child, move to the next child.",
    complexity: "Time O(n log n + m log m) · Space O(1)",
    link: "https://leetcode.com/problems/assign-cookies/",
    code: {
      cpp: `int findContentChildren(vector<int>& g, vector<int>& s) {
    sort(g.begin(), g.end());
    sort(s.begin(), s.end());
    int child = 0;
    for (int c : s)
        if (child < g.size() && c >= g[child]) child++;
    return child;
}`,
      java: `public int findContentChildren(int[] g, int[] s) {
    Arrays.sort(g);
    Arrays.sort(s);
    int child = 0;
    for (int c : s)
        if (child < g.length && c >= g[child]) child++;
    return child;
}`,
      js: `function findContentChildren(g, s) {
    g.sort((a, b) => a - b);                 // numeric sort, not the default string sort
    s.sort((a, b) => a - b);
    let child = 0;
    for (const c of s)
        if (child < g.length && c >= g[child]) child++;
    return child;
}`
    }
  },
  {
    id: "g-lemonade",
    title: "Lemonade Change",
    difficulty: "easy",
    tags: ["Simulation"],
    desc: "Lemonade costs $5. Customers pay with $5, $10 or $20 bills in order. You start with no change. Can you give everyone correct change?",
    example: "bills = [5,5,5,10,20]  →  true",
    hint: "For $20, prefer giving $10 + $5 over three $5s — $5 bills are more flexible.",
    approach: "Count $5 and $10 bills. Pay change with the largest bills first; fail if you can't.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/lemonade-change/",
    code: {
      cpp: `bool lemonadeChange(vector<int>& bills) {
    int five = 0, ten = 0;
    for (int b : bills) {
        if (b == 5) five++;
        else if (b == 10) { if (!five) return false; five--; ten++; }
        else if (ten && five) { ten--; five--; }
        else if (five >= 3) five -= 3;
        else return false;
    }
    return true;
}`,
      java: `public boolean lemonadeChange(int[] bills) {
    int five = 0, ten = 0;
    for (int b : bills) {
        if (b == 5) five++;
        else if (b == 10) { if (five == 0) return false; five--; ten++; }
        else if (ten > 0 && five > 0) { ten--; five--; }
        else if (five >= 3) five -= 3;
        else return false;
    }
    return true;
}`,
      js: `function lemonadeChange(bills) {
    let five = 0, ten = 0;
    for (const b of bills) {
        if (b === 5) five++;
        else if (b === 10) { if (!five) return false; five--; ten++; }
        else if (ten && five) { ten--; five--; }
        else if (five >= 3) five -= 3;
        else return false;
    }
    return true;
}`
    }
  },
  {
    id: "g-stock-ii",
    title: "Best Time to Buy and Sell Stock II",
    difficulty: "easy",
    tags: ["Local gains"],
    desc: "You may buy and sell many times (holding at most one share). Return the maximum profit.",
    example: "prices = [7,1,5,3,6,4]  →  7   (buy 1 sell 5, buy 3 sell 6)",
    hint: "Any rising stretch can be split into one-day gains. Collect every positive day-to-day difference.",
    approach: "profit += max(0, prices[i] − prices[i−1]) for every i. Summing the positive steps equals the sum of all rising runs.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
    code: {
      cpp: `int maxProfit(vector<int>& p) {
    int profit = 0;
    for (int i = 1; i < p.size(); i++)
        profit += max(0, p[i] - p[i - 1]);
    return profit;
}`,
      java: `public int maxProfit(int[] p) {
    int profit = 0;
    for (int i = 1; i < p.length; i++)
        profit += Math.max(0, p[i] - p[i - 1]);
    return profit;
}`,
      js: `function maxProfit(p) {
    let profit = 0;
    for (let i = 1; i < p.length; i++)
        profit += Math.max(0, p[i] - p[i - 1]);
    return profit;
}`
    }
  },
  {
    id: "g-truck",
    title: "Maximum Units on a Truck",
    difficulty: "easy",
    tags: ["Sort by value"],
    desc: "boxTypes[i] = [count, unitsPerBox]. The truck holds at most truckSize boxes. Maximise total units.",
    example: "[[1,3],[2,2],[3,1]], truckSize = 4  →  8",
    hint: "Every box takes one slot, so take boxes with the most units first.",
    approach: "Sort by unitsPerBox descending; take min(count, remaining) boxes of each type until the truck is full.",
    complexity: "Time O(n log n) · Space O(1)",
    link: "https://leetcode.com/problems/maximum-units-on-a-truck/",
    code: {
      cpp: `int maximumUnits(vector<vector<int>>& boxes, int truckSize) {
    sort(boxes.begin(), boxes.end(), [](auto& a, auto& b) { return a[1] > b[1]; });
    int units = 0;
    for (auto& b : boxes) {
        int take = min(truckSize, b[0]);
        units += take * b[1];
        truckSize -= take;
        if (truckSize == 0) break;
    }
    return units;
}`,
      java: `public int maximumUnits(int[][] boxes, int truckSize) {
    Arrays.sort(boxes, (a, b) -> Integer.compare(b[1], a[1]));
    int units = 0;
    for (int[] b : boxes) {
        int take = Math.min(truckSize, b[0]);
        units += take * b[1];
        truckSize -= take;
        if (truckSize == 0) break;
    }
    return units;
}`,
      js: `function maximumUnits(boxes, truckSize) {
    boxes.sort((a, b) => b[1] - a[1]);
    let units = 0;
    for (const [count, per] of boxes) {
        const take = Math.min(truckSize, count);
        units += take * per;
        truckSize -= take;
        if (truckSize === 0) break;
    }
    return units;
}`
    }
  },
  {
    id: "g-flowers",
    title: "Can Place Flowers",
    difficulty: "easy",
    tags: ["Scan"],
    desc: "A flowerbed is 0 (empty) / 1 (planted); flowers can't be adjacent. Can you plant k new flowers?",
    example: "flowerbed = [1,0,0,0,1], k = 1  →  true",
    hint: "Scanning left to right, plant as early as possible whenever both neighbours are empty — it never hurts later spots.",
    approach: "For each empty spot with empty (or missing) neighbours, plant and decrement k. Return k ≤ 0.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/can-place-flowers/",
    code: {
      cpp: `bool canPlaceFlowers(vector<int>& f, int k) {
    int n = f.size();
    for (int i = 0; i < n && k > 0; i++) {
        if (f[i] == 0 && (i == 0 || f[i - 1] == 0) && (i == n - 1 || f[i + 1] == 0)) {
            f[i] = 1;
            k--;
        }
    }
    return k <= 0;
}`,
      java: `public boolean canPlaceFlowers(int[] f, int k) {
    int n = f.length;
    for (int i = 0; i < n && k > 0; i++) {
        if (f[i] == 0 && (i == 0 || f[i - 1] == 0) && (i == n - 1 || f[i + 1] == 0)) {
            f[i] = 1;
            k--;
        }
    }
    return k <= 0;
}`,
      js: `function canPlaceFlowers(f, k) {
    const n = f.length;
    for (let i = 0; i < n && k > 0; i++) {
        if (f[i] === 0 && (i === 0 || f[i - 1] === 0) && (i === n - 1 || f[i + 1] === 0)) {
            f[i] = 1;
            k--;
        }
    }
    return k <= 0;
}`
    }
  },
  {
    id: "g-jump",
    title: "Jump Game",
    difficulty: "medium",
    tags: ["Farthest reach"],
    desc: "nums[i] is the maximum jump length from index i. Starting at index 0, can you reach the last index?",
    example: "[2,3,1,1,4]  →  true,   [3,2,1,0,4]  →  false",
    hint: "Keep the farthest index reachable so far. If you ever stand beyond it, you're stuck.",
    approach: "reach = max(reach, i + nums[i]) for each i ≤ reach. Success if reach ≥ n − 1.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/jump-game/",
    code: {
      cpp: `bool canJump(vector<int>& a) {
    int reach = 0;
    for (int i = 0; i < a.size(); i++) {
        if (i > reach) return false;
        reach = max(reach, i + a[i]);
    }
    return true;
}`,
      java: `public boolean canJump(int[] a) {
    int reach = 0;
    for (int i = 0; i < a.length; i++) {
        if (i > reach) return false;
        reach = Math.max(reach, i + a[i]);
    }
    return true;
}`,
      js: `function canJump(a) {
    let reach = 0;
    for (let i = 0; i < a.length; i++) {
        if (i > reach) return false;
        reach = Math.max(reach, i + a[i]);
    }
    return true;
}`
    }
  },
  {
    id: "g-jump-ii",
    title: "Jump Game II",
    difficulty: "medium",
    tags: ["Farthest reach", "BFS levels"],
    desc: "Return the minimum number of jumps to reach the last index (it's always reachable).",
    example: "[2,3,1,1,4]  →  2   (0 → 1 → 4)",
    hint: "Think of BFS levels: all indices reachable with j jumps form a window. The next window ends at the farthest reach from this one.",
    approach: "Scan i up to n−2, updating farthest. When i hits the end of the current window, take a jump and set the window end to farthest.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/jump-game-ii/",
    code: {
      cpp: `int jump(vector<int>& a) {
    int jumps = 0, end = 0, farthest = 0;
    for (int i = 0; i + 1 < a.size(); i++) {
        farthest = max(farthest, i + a[i]);
        if (i == end) { jumps++; end = farthest; }
    }
    return jumps;
}`,
      java: `public int jump(int[] a) {
    int jumps = 0, end = 0, farthest = 0;
    for (int i = 0; i + 1 < a.length; i++) {
        farthest = Math.max(farthest, i + a[i]);
        if (i == end) { jumps++; end = farthest; }
    }
    return jumps;
}`,
      js: `function jump(a) {
    let jumps = 0, end = 0, farthest = 0;
    for (let i = 0; i + 1 < a.length; i++) {
        farthest = Math.max(farthest, i + a[i]);
        if (i === end) { jumps++; end = farthest; }
    }
    return jumps;
}`
    }
  },
  {
    id: "g-gas",
    title: "Gas Station",
    difficulty: "medium",
    tags: ["Reset on negative"],
    desc: "Stations on a circle: gas[i] fuel available, cost[i] fuel to reach the next one. Return the start index to complete the loop, or −1.",
    example: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]  →  3",
    hint: "If total gas < total cost it's impossible. Otherwise, if the tank goes negative at i, no start between the current start and i works — start at i + 1.",
    approach: "One pass tracking total and the current tank; reset start whenever the tank drops below zero.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/gas-station/",
    code: {
      cpp: `int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int total = 0, tank = 0, start = 0;
    for (int i = 0; i < gas.size(); i++) {
        int d = gas[i] - cost[i];
        total += d;
        tank += d;
        if (tank < 0) { start = i + 1; tank = 0; }
    }
    return total < 0 ? -1 : start;
}`,
      java: `public int canCompleteCircuit(int[] gas, int[] cost) {
    int total = 0, tank = 0, start = 0;
    for (int i = 0; i < gas.length; i++) {
        int d = gas[i] - cost[i];
        total += d;
        tank += d;
        if (tank < 0) { start = i + 1; tank = 0; }
    }
    return total < 0 ? -1 : start;
}`,
      js: `function canCompleteCircuit(gas, cost) {
    let total = 0, tank = 0, start = 0;
    for (let i = 0; i < gas.length; i++) {
        const d = gas[i] - cost[i];
        total += d;
        tank += d;
        if (tank < 0) { start = i + 1; tank = 0; }
    }
    return total < 0 ? -1 : start;
}`
    }
  },
  {
    id: "g-non-overlap",
    title: "Non-overlapping Intervals",
    difficulty: "medium",
    tags: ["Sort by end", "Intervals"],
    desc: "Return the minimum number of intervals to remove so the rest don't overlap (touching ends are fine).",
    example: "[[1,2],[2,3],[3,4],[1,3]]  →  1",
    hint: "Minimum removals = n − maximum non-overlapping intervals. Keep the one that ends first.",
    approach: "Sort by end. Keep an interval if it starts at or after the last kept end; otherwise it's removed.",
    complexity: "Time O(n log n) · Space O(1) besides sorting",
    link: "https://leetcode.com/problems/non-overlapping-intervals/",
    code: {
      cpp: `int eraseOverlapIntervals(vector<vector<int>>& iv) {
    sort(iv.begin(), iv.end(), [](auto& a, auto& b) { return a[1] < b[1]; });
    int kept = 1, end = iv[0][1];
    for (int i = 1; i < iv.size(); i++)
        if (iv[i][0] >= end) { kept++; end = iv[i][1]; }
    return iv.size() - kept;
}`,
      java: `public int eraseOverlapIntervals(int[][] iv) {
    Arrays.sort(iv, (a, b) -> Integer.compare(a[1], b[1]));
    int kept = 1, end = iv[0][1];
    for (int i = 1; i < iv.length; i++)
        if (iv[i][0] >= end) { kept++; end = iv[i][1]; }
    return iv.length - kept;
}`,
      js: `function eraseOverlapIntervals(iv) {
    iv.sort((a, b) => a[1] - b[1]);
    let kept = 1, end = iv[0][1];
    for (let i = 1; i < iv.length; i++)
        if (iv[i][0] >= end) { kept++; end = iv[i][1]; }
    return iv.length - kept;
}`
    }
  },
  {
    id: "g-arrows",
    title: "Minimum Number of Arrows to Burst Balloons",
    difficulty: "medium",
    tags: ["Sort by end", "Intervals"],
    desc: "Balloons are horizontal intervals [start, end]. A vertical arrow at x bursts all balloons with start ≤ x ≤ end. Minimum arrows?",
    example: "[[10,16],[2,8],[1,6],[7,12]]  →  2",
    hint: "Shoot each arrow at the end of the balloon that ends first — that hits the most balloons it can.",
    approach: "Sort by end. Fire at the first end; skip every balloon that starts ≤ that x; fire a new arrow at the next balloon's end.",
    complexity: "Time O(n log n) · Space O(1)",
    link: "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",
    code: {
      cpp: `int findMinArrowShots(vector<vector<int>>& p) {
    sort(p.begin(), p.end(), [](auto& a, auto& b) { return a[1] < b[1]; });
    int arrows = 1;
    long long x = p[0][1];
    for (auto& b : p)
        if (b[0] > x) { arrows++; x = b[1]; }
    return arrows;
}`,
      java: `public int findMinArrowShots(int[][] p) {
    Arrays.sort(p, (a, b) -> Integer.compare(a[1], b[1]));   // not a[1] - b[1]: overflow!
    int arrows = 1;
    long x = p[0][1];
    for (int[] b : p)
        if (b[0] > x) { arrows++; x = b[1]; }
    return arrows;
}`,
      js: `function findMinArrowShots(p) {
    p.sort((a, b) => a[1] - b[1]);
    let arrows = 1, x = p[0][1];
    for (const [s, e] of p)
        if (s > x) { arrows++; x = e; }
    return arrows;
}`
    }
  },
  {
    id: "g-merge-intervals",
    title: "Merge Intervals",
    difficulty: "medium",
    tags: ["Sort by start", "Intervals"],
    desc: "Merge all overlapping intervals.",
    example: "[[1,3],[2,6],[8,10],[15,18]]  →  [[1,6],[8,10],[15,18]]",
    hint: "Here we want to combine, not select — so sort by start. Each interval either extends the last merged one or starts a new one.",
    approach: "Sort by start. If the current start ≤ last merged end, extend end = max(end, current end); else append.",
    complexity: "Time O(n log n) · Space O(n) for the output",
    link: "https://leetcode.com/problems/merge-intervals/",
    code: {
      cpp: `vector<vector<int>> merge(vector<vector<int>>& iv) {
    sort(iv.begin(), iv.end());
    vector<vector<int>> out;
    for (auto& x : iv) {
        if (!out.empty() && x[0] <= out.back()[1]) out.back()[1] = max(out.back()[1], x[1]);
        else out.push_back(x);
    }
    return out;
}`,
      java: `public int[][] merge(int[][] iv) {
    Arrays.sort(iv, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> out = new ArrayList<>();
    for (int[] x : iv) {
        if (!out.isEmpty() && x[0] <= out.get(out.size() - 1)[1])
            out.get(out.size() - 1)[1] = Math.max(out.get(out.size() - 1)[1], x[1]);
        else out.add(x);
    }
    return out.toArray(new int[0][]);
}`,
      js: `function merge(iv) {
    iv.sort((a, b) => a[0] - b[0]);
    const out = [];
    for (const [s, e] of iv) {
        const last = out[out.length - 1];
        if (last && s <= last[1]) last[1] = Math.max(last[1], e);
        else out.push([s, e]);
    }
    return out;
}`
    }
  },
  {
    id: "g-meeting-rooms",
    title: "Meeting Rooms II",
    difficulty: "medium",
    tags: ["Heap", "Intervals"],
    desc: "Given meeting intervals, return the minimum number of rooms required. (LeetCode premium; also on LintCode 919.)",
    example: "[[0,30],[5,10],[15,20]]  →  2",
    hint: "Process meetings by start time. Reuse the room that frees up earliest — a min-heap of end times.",
    approach: "Sort by start. If the earliest-ending room is free (end ≤ start), pop it. Push the current end. The heap size at the end is the answer.",
    complexity: "Time O(n log n) · Space O(n)",
    link: "https://leetcode.com/problems/meeting-rooms-ii/",
    code: {
      cpp: `int minMeetingRooms(vector<vector<int>>& iv) {
    sort(iv.begin(), iv.end());
    priority_queue<int, vector<int>, greater<int>> ends;
    for (auto& x : iv) {
        if (!ends.empty() && ends.top() <= x[0]) ends.pop();
        ends.push(x[1]);
    }
    return ends.size();
}`,
      java: `public int minMeetingRooms(int[][] iv) {
    Arrays.sort(iv, (a, b) -> Integer.compare(a[0], b[0]));
    PriorityQueue<Integer> ends = new PriorityQueue<>();
    for (int[] x : iv) {
        if (!ends.isEmpty() && ends.peek() <= x[0]) ends.poll();
        ends.add(x[1]);
    }
    return ends.size();
}`,
      js: `// JS has no built-in heap, so use the equivalent "two sorted arrays" sweep:
// a meeting can reuse a room if it starts after the earliest unused end time.
function minMeetingRooms(iv) {
    const starts = iv.map(x => x[0]).sort((a, b) => a - b);
    const ends = iv.map(x => x[1]).sort((a, b) => a - b);
    let rooms = 0, e = 0;
    for (const s of starts) {
        if (s >= ends[e]) e++;      // a room freed up: reuse it
        else rooms++;               // all busy: open a new room
    }
    return rooms;
}`
    }
  },
  {
    id: "g-boats",
    title: "Boats to Save People",
    difficulty: "medium",
    tags: ["Sort + two pointers"],
    desc: "Each boat carries at most two people with total weight ≤ limit. Return the minimum number of boats.",
    example: "people = [3,2,2,1], limit = 3  →  3",
    hint: "The heaviest person must take a boat. Pair them with the lightest person if possible — nobody else could fit better.",
    approach: "Sort; i at lightest, j at heaviest. Every step uses one boat for j, and also takes i if p[i] + p[j] ≤ limit.",
    complexity: "Time O(n log n) · Space O(1)",
    link: "https://leetcode.com/problems/boats-to-save-people/",
    code: {
      cpp: `int numRescueBoats(vector<int>& p, int limit) {
    sort(p.begin(), p.end());
    int i = 0, j = p.size() - 1, boats = 0;
    while (i <= j) {
        if (p[i] + p[j] <= limit) i++;
        j--;
        boats++;
    }
    return boats;
}`,
      java: `public int numRescueBoats(int[] p, int limit) {
    Arrays.sort(p);
    int i = 0, j = p.length - 1, boats = 0;
    while (i <= j) {
        if (p[i] + p[j] <= limit) i++;
        j--;
        boats++;
    }
    return boats;
}`,
      js: `function numRescueBoats(p, limit) {
    p.sort((a, b) => a - b);
    let i = 0, j = p.length - 1, boats = 0;
    while (i <= j) {
        if (p[i] + p[j] <= limit) i++;
        j--;
        boats++;
    }
    return boats;
}`
    }
  },
  {
    id: "g-partition-labels",
    title: "Partition Labels",
    difficulty: "medium",
    tags: ["Last occurrence"],
    desc: "Split a string into as many parts as possible so each letter appears in at most one part. Return the part sizes.",
    example: "\"ababcbacadefegdehijhklij\"  →  [9,7,8]",
    hint: "Record the last index of every letter. A part can only end once you've passed the last occurrence of every letter in it.",
    approach: "Extend end = max(end, last[c]) as you scan. When i == end, close the part and start a new one.",
    complexity: "Time O(n) · Space O(1) (26 letters)",
    link: "https://leetcode.com/problems/partition-labels/",
    code: {
      cpp: `vector<int> partitionLabels(string s) {
    int last[26] = {};
    for (int i = 0; i < s.size(); i++) last[s[i] - 'a'] = i;
    vector<int> parts;
    int start = 0, end = 0;
    for (int i = 0; i < s.size(); i++) {
        end = max(end, last[s[i] - 'a']);
        if (i == end) { parts.push_back(end - start + 1); start = i + 1; }
    }
    return parts;
}`,
      java: `public List<Integer> partitionLabels(String s) {
    int[] last = new int[26];
    for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;
    List<Integer> parts = new ArrayList<>();
    int start = 0, end = 0;
    for (int i = 0; i < s.length(); i++) {
        end = Math.max(end, last[s.charAt(i) - 'a']);
        if (i == end) { parts.add(end - start + 1); start = i + 1; }
    }
    return parts;
}`,
      js: `function partitionLabels(s) {
    const last = {};
    for (let i = 0; i < s.length; i++) last[s[i]] = i;
    const parts = [];
    let start = 0, end = 0;
    for (let i = 0; i < s.length; i++) {
        end = Math.max(end, last[s[i]]);
        if (i === end) { parts.push(end - start + 1); start = i + 1; }
    }
    return parts;
}`
    }
  },
  {
    id: "g-task-scheduler",
    title: "Task Scheduler",
    difficulty: "medium",
    tags: ["Counting", "Formula"],
    desc: "CPU tasks (letters) take one unit each; the same task needs n units of cooldown between runs. Return the minimum total time.",
    example: "tasks = [A,A,A,B,B,B], n = 2  →  8   (A B idle A B idle A B)",
    hint: "The most frequent task sets the skeleton: (maxFreq − 1) blocks of length n + 1, plus one slot per task tied for maxFreq.",
    approach: "answer = max(len(tasks), (maxFreq − 1) · (n + 1) + countOfMaxFreq). If there are enough other tasks, they fill all idle slots.",
    complexity: "Time O(len) · Space O(1)",
    link: "https://leetcode.com/problems/task-scheduler/",
    code: {
      cpp: `int leastInterval(vector<char>& tasks, int n) {
    int freq[26] = {}, maxF = 0, cntMax = 0;
    for (char t : tasks) maxF = max(maxF, ++freq[t - 'A']);
    for (int f : freq) if (f == maxF) cntMax++;
    return max((int)tasks.size(), (maxF - 1) * (n + 1) + cntMax);
}`,
      java: `public int leastInterval(char[] tasks, int n) {
    int[] freq = new int[26];
    int maxF = 0, cntMax = 0;
    for (char t : tasks) maxF = Math.max(maxF, ++freq[t - 'A']);
    for (int f : freq) if (f == maxF) cntMax++;
    return Math.max(tasks.length, (maxF - 1) * (n + 1) + cntMax);
}`,
      js: `function leastInterval(tasks, n) {
    const freq = new Array(26).fill(0);
    for (const t of tasks) freq[t.charCodeAt(0) - 65]++;
    const maxF = Math.max(...freq);
    const cntMax = freq.filter(f => f === maxF).length;
    return Math.max(tasks.length, (maxF - 1) * (n + 1) + cntMax);
}`
    }
  },
  {
    id: "g-straights",
    title: "Hand of Straights",
    difficulty: "medium",
    tags: ["Sorted map", "Counting"],
    desc: "Can the cards be split into groups of size W, each made of W consecutive values?",
    example: "hand = [1,2,3,6,2,3,4,7,8], W = 3  →  true   ([1,2,3],[2,3,4],[6,7,8])",
    hint: "The smallest remaining card must start a group — nothing smaller exists to precede it.",
    approach: "Count cards in a sorted map. For the smallest value x with count c > 0, values x … x+W−1 must each have at least c copies; subtract c from each.",
    complexity: "Time O(n log n) · Space O(n)",
    link: "https://leetcode.com/problems/hand-of-straights/",
    code: {
      cpp: `bool isNStraightHand(vector<int>& hand, int W) {
    if (hand.size() % W) return false;
    map<int, int> cnt;
    for (int x : hand) cnt[x]++;
    for (auto& [x, c] : cnt) {
        if (c == 0) continue;
        int need = c;
        for (int k = x; k < x + W; k++) {
            if (cnt[k] < need) return false;
            cnt[k] -= need;
        }
    }
    return true;
}`,
      java: `public boolean isNStraightHand(int[] hand, int W) {
    if (hand.length % W != 0) return false;
    TreeMap<Integer, Integer> cnt = new TreeMap<>();
    for (int x : hand) cnt.merge(x, 1, Integer::sum);
    for (int x : cnt.keySet()) {
        int need = cnt.get(x);
        if (need == 0) continue;
        for (int k = x; k < x + W; k++) {
            int have = cnt.getOrDefault(k, 0);
            if (have < need) return false;
            cnt.put(k, have - need);
        }
    }
    return true;
}`,
      js: `function isNStraightHand(hand, W) {
    if (hand.length % W) return false;
    const cnt = new Map();
    for (const x of hand) cnt.set(x, (cnt.get(x) || 0) + 1);
    const keys = [...cnt.keys()].sort((a, b) => a - b);
    for (const x of keys) {
        const need = cnt.get(x);
        if (need === 0) continue;
        for (let k = x; k < x + W; k++) {
            const have = cnt.get(k) || 0;
            if (have < need) return false;
            cnt.set(k, have - need);
        }
    }
    return true;
}`
    }
  },
  {
    id: "g-paren-star",
    title: "Valid Parenthesis String",
    difficulty: "medium",
    tags: ["Range tracking"],
    desc: "A string has '(', ')' and '*', where '*' can be '(', ')' or empty. Is it valid?",
    example: "\"(*))\"  →  true",
    hint: "Instead of trying every choice, track the range [lo, hi] of possible open-bracket counts.",
    approach: "'(' → lo++, hi++. ')' → lo−−, hi−−. '*' → lo−−, hi++. If hi < 0 fail; clamp lo at 0. Valid if lo == 0 at the end.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/valid-parenthesis-string/",
    code: {
      cpp: `bool checkValidString(string s) {
    int lo = 0, hi = 0;
    for (char c : s) {
        if (c == '(') { lo++; hi++; }
        else if (c == ')') { lo--; hi--; }
        else { lo--; hi++; }
        if (hi < 0) return false;
        lo = max(lo, 0);
    }
    return lo == 0;
}`,
      java: `public boolean checkValidString(String s) {
    int lo = 0, hi = 0;
    for (char c : s.toCharArray()) {
        if (c == '(') { lo++; hi++; }
        else if (c == ')') { lo--; hi--; }
        else { lo--; hi++; }
        if (hi < 0) return false;
        lo = Math.max(lo, 0);
    }
    return lo == 0;
}`,
      js: `function checkValidString(s) {
    let lo = 0, hi = 0;
    for (const c of s) {
        if (c === "(") { lo++; hi++; }
        else if (c === ")") { lo--; hi--; }
        else { lo--; hi++; }
        if (hi < 0) return false;
        lo = Math.max(lo, 0);
    }
    return lo === 0;
}`
    }
  },
  {
    id: "g-fractional-knapsack",
    title: "Fractional Knapsack",
    difficulty: "medium",
    tags: ["Sort by ratio", "Classic"],
    desc: "Items have values and weights; you may take fractions of items. Maximise the value that fits in capacity W.",
    example: "values = [60,100,120], weights = [10,20,30], W = 50  →  240.0",
    hint: "Since fractions are allowed, every unit of capacity should go to the highest value-per-weight available.",
    approach: "Sort by value/weight descending. Take whole items while they fit, then a fraction of the next one. (With 0/1 items this greedy fails — use DP.)",
    complexity: "Time O(n log n) · Space O(n)",
    link: "https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1",
    code: {
      cpp: `double fractionalKnapsack(vector<int>& val, vector<int>& wt, int W) {
    vector<int> idx(val.size());
    iota(idx.begin(), idx.end(), 0);
    sort(idx.begin(), idx.end(), [&](int a, int b) {
        return (double)val[a] / wt[a] > (double)val[b] / wt[b];
    });
    double total = 0;
    for (int i : idx) {
        if (W == 0) break;
        int take = min(W, wt[i]);
        total += (double)val[i] * take / wt[i];
        W -= take;
    }
    return total;
}`,
      java: `public double fractionalKnapsack(int[] val, int[] wt, int W) {
    Integer[] idx = new Integer[val.length];
    for (int i = 0; i < idx.length; i++) idx[i] = i;
    Arrays.sort(idx, (a, b) -> Double.compare((double) val[b] / wt[b], (double) val[a] / wt[a]));
    double total = 0;
    for (int i : idx) {
        if (W == 0) break;
        int take = Math.min(W, wt[i]);
        total += (double) val[i] * take / wt[i];
        W -= take;
    }
    return total;
}`,
      js: `function fractionalKnapsack(val, wt, W) {
    const idx = val.map((_, i) => i)
        .sort((a, b) => val[b] / wt[b] - val[a] / wt[a]);
    let total = 0;
    for (const i of idx) {
        if (W === 0) break;
        const take = Math.min(W, wt[i]);
        total += val[i] * take / wt[i];
        W -= take;
    }
    return total;
}`
    }
  },
  {
    id: "g-candy",
    title: "Candy",
    difficulty: "hard",
    tags: ["Two passes"],
    desc: "Children stand in a line with ratings. Everyone gets ≥ 1 candy, and a child with a higher rating than a neighbour gets more than that neighbour. Minimum total candies?",
    example: "ratings = [1,0,2]  →  5   (2, 1, 2)",
    hint: "Handle the two constraints separately: left neighbours in a left-to-right pass, right neighbours in a right-to-left pass.",
    approach: "Pass 1: if r[i] > r[i−1], c[i] = c[i−1] + 1. Pass 2: if r[i] > r[i+1], c[i] = max(c[i], c[i+1] + 1). Sum.",
    complexity: "Time O(n) · Space O(n)",
    link: "https://leetcode.com/problems/candy/",
    code: {
      cpp: `int candy(vector<int>& r) {
    int n = r.size();
    vector<int> c(n, 1);
    for (int i = 1; i < n; i++)
        if (r[i] > r[i - 1]) c[i] = c[i - 1] + 1;
    for (int i = n - 2; i >= 0; i--)
        if (r[i] > r[i + 1]) c[i] = max(c[i], c[i + 1] + 1);
    return accumulate(c.begin(), c.end(), 0);
}`,
      java: `public int candy(int[] r) {
    int n = r.length;
    int[] c = new int[n];
    Arrays.fill(c, 1);
    for (int i = 1; i < n; i++)
        if (r[i] > r[i - 1]) c[i] = c[i - 1] + 1;
    for (int i = n - 2; i >= 0; i--)
        if (r[i] > r[i + 1]) c[i] = Math.max(c[i], c[i + 1] + 1);
    int sum = 0;
    for (int x : c) sum += x;
    return sum;
}`,
      js: `function candy(r) {
    const n = r.length, c = new Array(n).fill(1);
    for (let i = 1; i < n; i++)
        if (r[i] > r[i - 1]) c[i] = c[i - 1] + 1;
    for (let i = n - 2; i >= 0; i--)
        if (r[i] > r[i + 1]) c[i] = Math.max(c[i], c[i + 1] + 1);
    return c.reduce((s, x) => s + x, 0);
}`
    }
  },
  {
    id: "g-ipo",
    title: "IPO",
    difficulty: "hard",
    tags: ["Heap", "Unlocking choices"],
    desc: "Start with capital w; each project needs capital[i] and adds profits[i]. Do at most k projects to maximise final capital.",
    example: "k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]  →  4",
    hint: "Among projects you can afford right now, the most profitable is always the best pick — and doing it can only unlock more.",
    approach: "Sort projects by capital. Each round, push all newly affordable profits into a max-heap, then pop the largest. Stop early if the heap is empty.",
    complexity: "Time O(n log n + k log n) · Space O(n)",
    link: "https://leetcode.com/problems/ipo/",
    code: {
      cpp: `int findMaximizedCapital(int k, int w, vector<int>& profits, vector<int>& capital) {
    int n = profits.size();
    vector<pair<int, int>> proj(n);
    for (int i = 0; i < n; i++) proj[i] = {capital[i], profits[i]};
    sort(proj.begin(), proj.end());
    priority_queue<int> pq;
    int i = 0;
    while (k--) {
        while (i < n && proj[i].first <= w) pq.push(proj[i++].second);
        if (pq.empty()) break;
        w += pq.top(); pq.pop();
    }
    return w;
}`,
      java: `public int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
    int n = profits.length;
    int[][] proj = new int[n][];
    for (int i = 0; i < n; i++) proj[i] = new int[]{capital[i], profits[i]};
    Arrays.sort(proj, (a, b) -> Integer.compare(a[0], b[0]));
    PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
    int i = 0;
    while (k-- > 0) {
        while (i < n && proj[i][0] <= w) pq.add(proj[i++][1]);
        if (pq.isEmpty()) break;
        w += pq.poll();
    }
    return w;
}`,
      js: `// JS has no built-in priority queue, so keep a small one handy:
class MinHeap {
    constructor() { this.a = []; }
    get size() { return this.a.length; }
    push(x) {
        const a = this.a;
        a.push(x);
        for (let i = a.length - 1; i > 0; ) {
            const p = (i - 1) >> 1;
            if (a[p] <= a[i]) break;
            [a[p], a[i]] = [a[i], a[p]];
            i = p;
        }
    }
    pop() {
        const a = this.a, top = a[0], last = a.pop();
        if (a.length) {
            a[0] = last;
            for (let i = 0; ; ) {
                const l = 2 * i + 1, r = l + 1;
                let m = i;
                if (l < a.length && a[l] < a[m]) m = l;
                if (r < a.length && a[r] < a[m]) m = r;
                if (m === i) break;
                [a[m], a[i]] = [a[i], a[m]];
                i = m;
            }
        }
        return top;
    }
}

function findMaximizedCapital(k, w, profits, capital) {
    const proj = capital.map((c, i) => [c, profits[i]]).sort((a, b) => a[0] - b[0]);
    const pq = new MinHeap();                     // store -profit to get a max-heap
    let i = 0;
    while (k-- > 0) {
        while (i < proj.length && proj[i][0] <= w) pq.push(-proj[i++][1]);
        if (pq.size === 0) break;
        w -= pq.pop();
    }
    return w;
}`
    }
  }
];

window.QUIZ = [
  {
    q: "Which property says “some optimal solution begins with the greedy choice”?",
    opts: ["Optimal substructure", "Greedy-choice property", "Overlapping subproblems", "Memoisation"],
    a: 1,
    exp: "The greedy-choice property guarantees that committing to the greedy step never rules out an optimal answer."
  },
  {
    q: "To select the maximum number of non-overlapping intervals, sort by…",
    opts: ["Start time", "Duration", "End time", "Number of overlaps"],
    a: 2,
    exp: "The interval that ends first leaves the most room for the rest. Start time fails on one long early interval; duration fails on a short interval overlapping two others."
  },
  {
    q: "Coins {1, 3, 4}, amount 6. How many coins does largest-first greedy use, and what's optimal?",
    opts: ["2 and 2", "3 and 2", "3 and 3", "2 and 3"],
    a: 1,
    exp: "Greedy: 4 + 1 + 1 = 3 coins. Optimal: 3 + 3 = 2 coins. Arbitrary coin systems need DP."
  },
  {
    q: "Fractional knapsack vs 0/1 knapsack — which can greedy (by value/weight) solve optimally?",
    opts: ["Both", "Only fractional", "Only 0/1", "Neither"],
    a: 1,
    exp: "With fractions you can always fill leftover capacity with the best rate. With all-or-nothing items, a high-ratio item can waste space — 0/1 needs DP."
  },
  {
    q: "What does an exchange argument show?",
    opts: [
      "That greedy runs in O(n log n)",
      "That an optimal solution can be transformed into the greedy one without getting worse",
      "That DP and greedy give different answers",
      "That the input must be sorted"
    ],
    a: 1,
    exp: "Swap choices of an optimal solution for greedy's one at a time; if each swap keeps it optimal, greedy is optimal."
  },
  {
    q: "In Gas Station, the tank goes negative after station i. What can you conclude?",
    opts: ["No solution exists", "Start at i", "No start between the current start and i works — try i + 1", "Restart from 0"],
    a: 2,
    exp: "Every station in that window reached i with a non-negative tank that still wasn't enough, so starting later in the window is no better."
  },
  {
    q: "Why is Candy solved with two passes?",
    opts: ["To sort the ratings", "Each child must satisfy both the left and the right neighbour constraint", "To find the median", "To save memory"],
    a: 1,
    exp: "One pass enforces 'more than the left neighbour', the other 'more than the right'; taking the max satisfies both with the minimum candies."
  },
  {
    q: "Which of these famous algorithms is NOT greedy?",
    opts: ["Dijkstra's shortest path", "Kruskal's MST", "Huffman coding", "Floyd–Warshall all-pairs shortest paths"],
    a: 3,
    exp: "Floyd–Warshall is dynamic programming over intermediate vertices. The other three commit to a locally best choice each step."
  }
];
