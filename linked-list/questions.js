// Question bank for the "Important questions" section.
// Each entry: id, title, difficulty, tags, desc, example, hint, approach, complexity, link, code{cpp,java,python}
// Solutions use LeetCode's ListNode { val, next } definition.
window.QUESTIONS = [
  {
    id: "ll-reverse",
    title: "Reverse Linked List",
    difficulty: "easy",
    tags: ["Reversal"],
    desc: "Reverse a singly linked list and return the new head.",
    example: "1 → 2 → 3 → 4 → 5  →  5 → 4 → 3 → 2 → 1",
    hint: "Three pointers: prev, curr, next. Save next, flip curr.next to prev, advance both.",
    approach: "Iterate once, re-pointing each node to its predecessor. When curr becomes null, prev is the new head. (Recursive: reverse the rest, then head.next.next = head; head.next = null.)",
    complexity: "Time O(n) · Space O(1) iterative, O(n) recursive",
    link: "https://leetcode.com/problems/reverse-linked-list/",
    code: {
      cpp: `ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *curr = head;
    while (curr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
      java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
      python: `def reverse_list(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev, curr = curr, nxt
    return prev`
    }
  },
  {
    id: "ll-middle",
    title: "Middle of the Linked List",
    difficulty: "easy",
    tags: ["Fast & slow"],
    desc: "Return the middle node. If there are two middles, return the second one.",
    example: "1 → 2 → 3 → 4 → 5 → 6  →  node 4",
    hint: "Slow moves 1 step, fast moves 2. When fast can't move any more, slow is in the middle.",
    approach: "while (fast && fast.next) { slow = slow.next; fast = fast.next.next; } return slow.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/middle-of-the-linked-list/",
    code: {
      cpp: `ListNode* middleNode(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}`,
      java: `public ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}`,
      python: `def middle_node(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`
    }
  },
  {
    id: "ll-merge-two",
    title: "Merge Two Sorted Lists",
    difficulty: "easy",
    tags: ["Dummy node", "Merge"],
    desc: "Merge two sorted linked lists into one sorted list by splicing their nodes together.",
    example: "1 → 2 → 4  and  1 → 3 → 4  →  1 → 1 → 2 → 3 → 4 → 4",
    hint: "Dummy node + tail pointer. Attach the smaller of the two heads each time.",
    approach: "While both lists have nodes, link the smaller one to tail and advance it. Finally attach the non-empty remainder.",
    complexity: "Time O(n + m) · Space O(1)",
    link: "https://leetcode.com/problems/merge-two-sorted-lists/",
    code: {
      cpp: `ListNode* mergeTwoLists(ListNode* a, ListNode* b) {
    ListNode dummy(0), *tail = &dummy;
    while (a && b) {
        if (a->val <= b->val) { tail->next = a; a = a->next; }
        else                  { tail->next = b; b = b->next; }
        tail = tail->next;
    }
    tail->next = a ? a : b;
    return dummy.next;
}`,
      java: `public ListNode mergeTwoLists(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), tail = dummy;
    while (a != null && b != null) {
        if (a.val <= b.val) { tail.next = a; a = a.next; }
        else                { tail.next = b; b = b.next; }
        tail = tail.next;
    }
    tail.next = (a != null) ? a : b;
    return dummy.next;
}`,
      python: `def merge_two_lists(a, b):
    dummy = tail = ListNode(0)
    while a and b:
        if a.val <= b.val:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next`
    }
  },
  {
    id: "ll-cycle",
    title: "Linked List Cycle",
    difficulty: "easy",
    tags: ["Fast & slow", "Floyd"],
    desc: "Return true if the linked list contains a cycle. Use O(1) memory.",
    example: "3 → 2 → 0 → −4 → (back to 2)  →  true",
    hint: "If there is a loop, a pointer moving 2 steps will eventually catch one moving 1 step.",
    approach: "Floyd's tortoise and hare: if fast ever equals slow there is a cycle; if fast hits null there isn't.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/linked-list-cycle/",
    code: {
      cpp: `bool hasCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
      java: `public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
      python: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`
    }
  },
  {
    id: "ll-dedup",
    title: "Remove Duplicates from Sorted List",
    difficulty: "easy",
    tags: ["Traversal"],
    desc: "Delete all duplicates in a sorted list so each value appears only once.",
    example: "1 → 1 → 2 → 3 → 3  →  1 → 2 → 3",
    hint: "Duplicates are adjacent. Only advance cur when the next value is different.",
    approach: "If cur.val == cur.next.val, skip the next node (cur.next = cur.next.next); otherwise move cur forward.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/remove-duplicates-from-sorted-list/",
    code: {
      cpp: `ListNode* deleteDuplicates(ListNode* head) {
    ListNode* cur = head;
    while (cur && cur->next) {
        if (cur->val == cur->next->val) cur->next = cur->next->next;
        else cur = cur->next;
    }
    return head;
}`,
      java: `public ListNode deleteDuplicates(ListNode head) {
    ListNode cur = head;
    while (cur != null && cur.next != null) {
        if (cur.val == cur.next.val) cur.next = cur.next.next;
        else cur = cur.next;
    }
    return head;
}`,
      python: `def delete_duplicates(head):
    cur = head
    while cur and cur.next:
        if cur.val == cur.next.val:
            cur.next = cur.next.next
        else:
            cur = cur.next
    return head`
    }
  },
  {
    id: "ll-remove-elements",
    title: "Remove Linked List Elements",
    difficulty: "easy",
    tags: ["Dummy node"],
    desc: "Remove every node whose value equals val and return the new head.",
    example: "1 → 2 → 6 → 3 → 6, val = 6  →  1 → 2 → 3",
    hint: "The head itself may need removing — a dummy node makes that case disappear.",
    approach: "prev starts at dummy. If prev.next has the value, bypass it; otherwise advance prev.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/remove-linked-list-elements/",
    code: {
      cpp: `ListNode* removeElements(ListNode* head, int val) {
    ListNode dummy(0);
    dummy.next = head;
    ListNode* prev = &dummy;
    while (prev->next) {
        if (prev->next->val == val) prev->next = prev->next->next;
        else prev = prev->next;
    }
    return dummy.next;
}`,
      java: `public ListNode removeElements(ListNode head, int val) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode prev = dummy;
    while (prev.next != null) {
        if (prev.next.val == val) prev.next = prev.next.next;
        else prev = prev.next;
    }
    return dummy.next;
}`,
      python: `def remove_elements(head, val):
    dummy = prev = ListNode(0, head)
    while prev.next:
        if prev.next.val == val:
            prev.next = prev.next.next
        else:
            prev = prev.next
    return dummy.next`
    }
  },
  {
    id: "ll-palindrome",
    title: "Palindrome Linked List",
    difficulty: "easy",
    tags: ["Fast & slow", "Reversal"],
    desc: "Return true if the list reads the same forwards and backwards, in O(n) time and O(1) space.",
    example: "1 → 2 → 2 → 1  →  true",
    hint: "Find the middle, reverse the second half, then compare the two halves node by node.",
    approach: "Combine three techniques: fast/slow to find the middle, in-place reversal of the second half, and a two-pointer comparison.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/palindrome-linked-list/",
    code: {
      cpp: `bool isPalindrome(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
    ListNode* prev = nullptr;                  // reverse second half
    while (slow) {
        ListNode* next = slow->next;
        slow->next = prev;
        prev = slow;
        slow = next;
    }
    for (ListNode *l = head, *r = prev; r; l = l->next, r = r->next)
        if (l->val != r->val) return false;
    return true;
}`,
      java: `public boolean isPalindrome(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
    ListNode prev = null;                      // reverse second half
    while (slow != null) {
        ListNode next = slow.next;
        slow.next = prev;
        prev = slow;
        slow = next;
    }
    for (ListNode l = head, r = prev; r != null; l = l.next, r = r.next)
        if (l.val != r.val) return false;
    return true;
}`,
      python: `def is_palindrome(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    prev = None                                # reverse second half
    while slow:
        nxt = slow.next
        slow.next = prev
        prev, slow = slow, nxt
    left, right = head, prev
    while right:
        if left.val != right.val:
            return False
        left, right = left.next, right.next
    return True`
    }
  },
  {
    id: "ll-intersection",
    title: "Intersection of Two Linked Lists",
    difficulty: "easy",
    tags: ["Two pointers", "Node identity"],
    desc: "Return the node where two singly linked lists merge, or null if they never meet.",
    example: "A: 4 → 1 ↘ 8 → 4 → 5,   B: 5 → 6 → 1 ↗  →  node 8",
    hint: "Walk A then B, and B then A. Both pointers travel lenA + lenB, so they line up at the intersection.",
    approach: "When a pointer reaches the end, redirect it to the other list's head. They meet at the shared node, or both become null together.",
    complexity: "Time O(n + m) · Space O(1)",
    link: "https://leetcode.com/problems/intersection-of-two-linked-lists/",
    code: {
      cpp: `ListNode* getIntersectionNode(ListNode* headA, ListNode* headB) {
    ListNode *a = headA, *b = headB;
    while (a != b) {
        a = a ? a->next : headB;
        b = b ? b->next : headA;
    }
    return a;
}`,
      java: `public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
    ListNode a = headA, b = headB;
    while (a != b) {
        a = (a != null) ? a.next : headB;
        b = (b != null) ? b.next : headA;
    }
    return a;
}`,
      python: `def get_intersection_node(head_a, head_b):
    a, b = head_a, head_b
    while a is not b:
        a = a.next if a else head_b
        b = b.next if b else head_a
    return a`
    }
  },
  {
    id: "ll-nth-end",
    title: "Remove Nth Node From End of List",
    difficulty: "medium",
    tags: ["Gap of k", "Dummy node"],
    desc: "Remove the n-th node from the end in one pass and return the head.",
    example: "1 → 2 → 3 → 4 → 5, n = 2  →  1 → 2 → 3 → 5",
    hint: "Move fast n + 1 steps ahead of slow (both starting at a dummy). When fast is null, slow is just before the target.",
    approach: "The fixed gap makes slow stop at the predecessor of the node to delete; then slow.next = slow.next.next. The dummy handles deleting the head.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    code: {
      cpp: `ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode dummy(0);
    dummy.next = head;
    ListNode *fast = &dummy, *slow = &dummy;
    for (int i = 0; i <= n; i++) fast = fast->next;
    while (fast) { fast = fast->next; slow = slow->next; }
    slow->next = slow->next->next;
    return dummy.next;
}`,
      java: `public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode fast = dummy, slow = dummy;
    for (int i = 0; i <= n; i++) fast = fast.next;
    while (fast != null) { fast = fast.next; slow = slow.next; }
    slow.next = slow.next.next;
    return dummy.next;
}`,
      python: `def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    fast = slow = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        fast, slow = fast.next, slow.next
    slow.next = slow.next.next
    return dummy.next`
    }
  },
  {
    id: "ll-add-two",
    title: "Add Two Numbers",
    difficulty: "medium",
    tags: ["Dummy node", "Carry"],
    desc: "Two non-negative numbers are stored as lists with digits in reverse order. Return their sum as a list.",
    example: "2 → 4 → 3  +  5 → 6 → 4  →  7 → 0 → 8   (342 + 465 = 807)",
    hint: "Add digit by digit like on paper, carrying into the next node. Keep going while either list or the carry remains.",
    approach: "Dummy + tail. sum = carry + a.val + b.val; append sum % 10; carry = sum / 10.",
    complexity: "Time O(max(n, m)) · Space O(max(n, m)) for the result",
    link: "https://leetcode.com/problems/add-two-numbers/",
    code: {
      cpp: `ListNode* addTwoNumbers(ListNode* a, ListNode* b) {
    ListNode dummy(0), *tail = &dummy;
    int carry = 0;
    while (a || b || carry) {
        int sum = carry;
        if (a) { sum += a->val; a = a->next; }
        if (b) { sum += b->val; b = b->next; }
        tail->next = new ListNode(sum % 10);
        tail = tail->next;
        carry = sum / 10;
    }
    return dummy.next;
}`,
      java: `public ListNode addTwoNumbers(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), tail = dummy;
    int carry = 0;
    while (a != null || b != null || carry != 0) {
        int sum = carry;
        if (a != null) { sum += a.val; a = a.next; }
        if (b != null) { sum += b.val; b = b.next; }
        tail.next = new ListNode(sum % 10);
        tail = tail.next;
        carry = sum / 10;
    }
    return dummy.next;
}`,
      python: `def add_two_numbers(a, b):
    dummy = tail = ListNode(0)
    carry = 0
    while a or b or carry:
        s = carry
        if a:
            s, a = s + a.val, a.next
        if b:
            s, b = s + b.val, b.next
        tail.next = ListNode(s % 10)
        tail = tail.next
        carry = s // 10
    return dummy.next`
    }
  },
  {
    id: "ll-odd-even",
    title: "Odd Even Linked List",
    difficulty: "medium",
    tags: ["Re-linking"],
    desc: "Group all nodes at odd positions first, followed by those at even positions, in O(1) extra space.",
    example: "1 → 2 → 3 → 4 → 5  →  1 → 3 → 5 → 2 → 4",
    hint: "Build two chains at the same time (odd and even), then attach the even chain after the odd one.",
    approach: "odd = head, even = head.next, remember evenHead. Leapfrog: odd.next = even.next, even.next = odd.next. Finally odd.next = evenHead.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/odd-even-linked-list/",
    code: {
      cpp: `ListNode* oddEvenList(ListNode* head) {
    if (!head) return head;
    ListNode *odd = head, *even = head->next, *evenHead = even;
    while (even && even->next) {
        odd->next = even->next;
        odd = odd->next;
        even->next = odd->next;
        even = even->next;
    }
    odd->next = evenHead;
    return head;
}`,
      java: `public ListNode oddEvenList(ListNode head) {
    if (head == null) return head;
    ListNode odd = head, even = head.next, evenHead = even;
    while (even != null && even.next != null) {
        odd.next = even.next;
        odd = odd.next;
        even.next = odd.next;
        even = even.next;
    }
    odd.next = evenHead;
    return head;
}`,
      python: `def odd_even_list(head):
    if not head:
        return head
    odd, even = head, head.next
    even_head = even
    while even and even.next:
        odd.next = even.next
        odd = odd.next
        even.next = odd.next
        even = even.next
    odd.next = even_head
    return head`
    }
  },
  {
    id: "ll-cycle-start",
    title: "Linked List Cycle II (find the start)",
    difficulty: "medium",
    tags: ["Floyd", "Math"],
    desc: "Return the node where the cycle begins, or null if there is no cycle. Use O(1) memory.",
    example: "3 → 2 → 0 → −4 → (back to 2)  →  node 2",
    hint: "After slow and fast meet, start a new pointer from head. Move it and slow one step at a time — they meet at the cycle start.",
    approach: "If the tail has length a and the meeting point is b steps into the cycle of length c, then a ≡ c − b (mod c), so walking a steps from both head and the meeting point lands on the start.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/linked-list-cycle-ii/",
    code: {
      cpp: `ListNode* detectCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            ListNode* p = head;
            while (p != slow) { p = p->next; slow = slow->next; }
            return p;
        }
    }
    return nullptr;
}`,
      java: `public ListNode detectCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {
            ListNode p = head;
            while (p != slow) { p = p.next; slow = slow.next; }
            return p;
        }
    }
    return null;
}`,
      python: `def detect_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            p = head
            while p is not slow:
                p, slow = p.next, slow.next
            return p
    return None`
    }
  },
  {
    id: "ll-reorder",
    title: "Reorder List",
    difficulty: "medium",
    tags: ["Fast & slow", "Reversal", "Merge"],
    desc: "Reorder L0 → L1 → … → Ln into L0 → Ln → L1 → Ln−1 → L2 → … in place.",
    example: "1 → 2 → 3 → 4 → 5  →  1 → 5 → 2 → 4 → 3",
    hint: "Three steps: split at the middle, reverse the second half, weave the two halves together.",
    approach: "Find the end of the first half, cut the list there, reverse the second half, then alternately take one node from each half.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/reorder-list/",
    code: {
      cpp: `void reorderList(ListNode* head) {
    if (!head || !head->next) return;
    ListNode *slow = head, *fast = head;
    while (fast->next && fast->next->next) { slow = slow->next; fast = fast->next->next; }
    ListNode *second = slow->next, *prev = nullptr;
    slow->next = nullptr;                       // cut
    while (second) {                            // reverse 2nd half
        ListNode* next = second->next;
        second->next = prev;
        prev = second;
        second = next;
    }
    for (ListNode *a = head, *b = prev; b; ) {  // weave
        ListNode *an = a->next, *bn = b->next;
        a->next = b;
        b->next = an;
        a = an; b = bn;
    }
}`,
      java: `public void reorderList(ListNode head) {
    if (head == null || head.next == null) return;
    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) { slow = slow.next; fast = fast.next.next; }
    ListNode second = slow.next, prev = null;
    slow.next = null;                           // cut
    while (second != null) {                    // reverse 2nd half
        ListNode next = second.next;
        second.next = prev;
        prev = second;
        second = next;
    }
    for (ListNode a = head, b = prev; b != null; ) {   // weave
        ListNode an = a.next, bn = b.next;
        a.next = b;
        b.next = an;
        a = an; b = bn;
    }
}`,
      python: `def reorder_list(head):
    if not head or not head.next:
        return
    slow = fast = head
    while fast.next and fast.next.next:
        slow, fast = slow.next, fast.next.next
    second, slow.next = slow.next, None         # cut
    prev = None
    while second:                               # reverse 2nd half
        nxt = second.next
        second.next = prev
        prev, second = second, nxt
    a, b = head, prev
    while b:                                    # weave
        an, bn = a.next, b.next
        a.next = b
        b.next = an
        a, b = an, bn`
    }
  },
  {
    id: "ll-rotate",
    title: "Rotate List",
    difficulty: "medium",
    tags: ["Ring", "Length"],
    desc: "Rotate the list to the right by k places.",
    example: "1 → 2 → 3 → 4 → 5, k = 2  →  4 → 5 → 1 → 2 → 3",
    hint: "k can be huge — take k % length. Connecting the tail to the head turns it into a ring; then cut it at the right place.",
    approach: "Find length n and the tail. k %= n. Close the ring, walk n − k − 1 steps from head to the new tail, the new head is the next node; cut.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/rotate-list/",
    code: {
      cpp: `ListNode* rotateRight(ListNode* head, int k) {
    if (!head || !head->next) return head;
    int n = 1;
    ListNode* tail = head;
    while (tail->next) { tail = tail->next; n++; }
    k %= n;
    if (k == 0) return head;
    tail->next = head;                         // make a ring
    ListNode* newTail = head;
    for (int i = 0; i < n - k - 1; i++) newTail = newTail->next;
    ListNode* newHead = newTail->next;
    newTail->next = nullptr;                   // cut
    return newHead;
}`,
      java: `public ListNode rotateRight(ListNode head, int k) {
    if (head == null || head.next == null) return head;
    int n = 1;
    ListNode tail = head;
    while (tail.next != null) { tail = tail.next; n++; }
    k %= n;
    if (k == 0) return head;
    tail.next = head;                          // make a ring
    ListNode newTail = head;
    for (int i = 0; i < n - k - 1; i++) newTail = newTail.next;
    ListNode newHead = newTail.next;
    newTail.next = null;                       // cut
    return newHead;
}`,
      python: `def rotate_right(head, k):
    if not head or not head.next:
        return head
    n, tail = 1, head
    while tail.next:
        tail, n = tail.next, n + 1
    k %= n
    if k == 0:
        return head
    tail.next = head                           # make a ring
    new_tail = head
    for _ in range(n - k - 1):
        new_tail = new_tail.next
    new_head = new_tail.next
    new_tail.next = None                       # cut
    return new_head`
    }
  },
  {
    id: "ll-reverse-ii",
    title: "Reverse Linked List II (between left and right)",
    difficulty: "medium",
    tags: ["Reversal", "Dummy node"],
    desc: "Reverse the nodes from position left to position right (1-indexed) in one pass.",
    example: "1 → 2 → 3 → 4 → 5, left = 2, right = 4  →  1 → 4 → 3 → 2 → 5",
    hint: "Stop prev just before position left. Then repeatedly move the node after curr to the front of the sub-list.",
    approach: "‘Head insertion’: curr stays at the original left node; each step pulls curr.next out and inserts it right after prev. Repeat right − left times.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/reverse-linked-list-ii/",
    code: {
      cpp: `ListNode* reverseBetween(ListNode* head, int left, int right) {
    ListNode dummy(0);
    dummy.next = head;
    ListNode* prev = &dummy;
    for (int i = 1; i < left; i++) prev = prev->next;
    ListNode* curr = prev->next;
    for (int i = 0; i < right - left; i++) {
        ListNode* move = curr->next;
        curr->next = move->next;
        move->next = prev->next;
        prev->next = move;
    }
    return dummy.next;
}`,
      java: `public ListNode reverseBetween(ListNode head, int left, int right) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode prev = dummy;
    for (int i = 1; i < left; i++) prev = prev.next;
    ListNode curr = prev.next;
    for (int i = 0; i < right - left; i++) {
        ListNode move = curr.next;
        curr.next = move.next;
        move.next = prev.next;
        prev.next = move;
    }
    return dummy.next;
}`,
      python: `def reverse_between(head, left, right):
    dummy = prev = ListNode(0, head)
    for _ in range(left - 1):
        prev = prev.next
    curr = prev.next
    for _ in range(right - left):
        move = curr.next
        curr.next = move.next
        move.next = prev.next
        prev.next = move
    return dummy.next`
    }
  },
  {
    id: "ll-sort",
    title: "Sort List",
    difficulty: "medium",
    tags: ["Merge sort", "Fast & slow"],
    desc: "Sort a linked list in O(n log n) time.",
    example: "4 → 2 → 1 → 3  →  1 → 2 → 3 → 4",
    hint: "Merge sort is a perfect fit: splitting uses fast/slow, merging is ‘merge two sorted lists’.",
    approach: "Split at the middle (start fast at head.next so a 2-node list splits evenly), sort both halves recursively, merge.",
    complexity: "Time O(n log n) · Space O(log n) recursion",
    link: "https://leetcode.com/problems/sort-list/",
    code: {
      cpp: `ListNode* mergeLists(ListNode* a, ListNode* b) {
    ListNode dummy(0), *tail = &dummy;
    while (a && b) {
        if (a->val <= b->val) { tail->next = a; a = a->next; }
        else                  { tail->next = b; b = b->next; }
        tail = tail->next;
    }
    tail->next = a ? a : b;
    return dummy.next;
}
ListNode* sortList(ListNode* head) {
    if (!head || !head->next) return head;
    ListNode *slow = head, *fast = head->next;
    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
    ListNode* mid = slow->next;
    slow->next = nullptr;
    return mergeLists(sortList(head), sortList(mid));
}`,
      java: `public ListNode sortList(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode slow = head, fast = head.next;
    while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
    ListNode mid = slow.next;
    slow.next = null;
    return mergeLists(sortList(head), sortList(mid));
}
private ListNode mergeLists(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), tail = dummy;
    while (a != null && b != null) {
        if (a.val <= b.val) { tail.next = a; a = a.next; }
        else                { tail.next = b; b = b.next; }
        tail = tail.next;
    }
    tail.next = (a != null) ? a : b;
    return dummy.next;
}`,
      python: `def sort_list(head):
    if not head or not head.next:
        return head
    slow, fast = head, head.next
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
    mid, slow.next = slow.next, None
    a, b = sort_list(head), sort_list(mid)
    dummy = tail = ListNode(0)
    while a and b:
        if a.val <= b.val:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next`
    }
  },
  {
    id: "ll-random",
    title: "Copy List with Random Pointer",
    difficulty: "medium",
    tags: ["Hash map", "Deep copy"],
    desc: "Each node has next and a random pointer (to any node or null). Return a deep copy of the list.",
    example: "[[7,null],[13,0],[11,4],[10,2],[1,0]]  →  an identical, independent list",
    hint: "First create a copy of every node and store old → new in a map. Second pass: wire up next and random through the map.",
    approach: "Two passes with a hash map. (O(1)-space follow-up: interleave copies A → A' → B → B', set randoms, then split the lists.)",
    complexity: "Time O(n) · Space O(n)",
    link: "https://leetcode.com/problems/copy-list-with-random-pointer/",
    code: {
      cpp: `// struct Node { int val; Node* next; Node* random; Node(int v) : val(v), next(nullptr), random(nullptr) {} };
Node* copyRandomList(Node* head) {
    unordered_map<Node*, Node*> copy;
    for (Node* p = head; p; p = p->next) copy[p] = new Node(p->val);
    for (Node* p = head; p; p = p->next) {
        copy[p]->next = p->next ? copy[p->next] : nullptr;
        copy[p]->random = p->random ? copy[p->random] : nullptr;
    }
    return head ? copy[head] : nullptr;
}`,
      java: `// class Node { int val; Node next, random; Node(int v) { val = v; } }
public Node copyRandomList(Node head) {
    Map<Node, Node> copy = new HashMap<>();
    for (Node p = head; p != null; p = p.next) copy.put(p, new Node(p.val));
    for (Node p = head; p != null; p = p.next) {
        copy.get(p).next = copy.get(p.next);      // get(null) returns null
        copy.get(p).random = copy.get(p.random);
    }
    return copy.get(head);
}`,
      python: `def copy_random_list(head):
    copy = {None: None}
    p = head
    while p:
        copy[p] = Node(p.val)
        p = p.next
    p = head
    while p:
        copy[p].next = copy[p.next]
        copy[p].random = copy[p.random]
        p = p.next
    return copy[head]`
    }
  },
  {
    id: "ll-lru",
    title: "LRU Cache",
    difficulty: "medium",
    tags: ["Doubly linked list", "Hash map", "Design"],
    desc: "Design a cache with get(key) and put(key, value) in O(1), evicting the least recently used key when full.",
    example: "cap 2: put(1,1) put(2,2) get(1)=1 put(3,3) [evicts 2] get(2)=−1",
    hint: "Hash map: key → node, for O(1) lookup. Doubly linked list: most recent at the front, least recent at the back, for O(1) move/evict.",
    approach: "Use head/tail sentinels so unlink and push-front never hit null. On get/put, move the node to the front; on overflow, remove tail.prev.",
    complexity: "Time O(1) per operation · Space O(capacity)",
    link: "https://leetcode.com/problems/lru-cache/",
    code: {
      cpp: `class LRUCache {
    struct Node {
        int key, val; Node *prev = nullptr, *next = nullptr;
        Node(int k, int v) : key(k), val(v) {}
    };
    int cap;
    unordered_map<int, Node*> mp;
    Node *head = new Node(0, 0), *tail = new Node(0, 0);   // sentinels
    void unlink(Node* n) { n->prev->next = n->next; n->next->prev = n->prev; }
    void pushFront(Node* n) {
        n->next = head->next; n->prev = head;
        head->next->prev = n; head->next = n;
    }
public:
    LRUCache(int capacity) : cap(capacity) { head->next = tail; tail->prev = head; }
    int get(int key) {
        auto it = mp.find(key);
        if (it == mp.end()) return -1;
        unlink(it->second); pushFront(it->second);
        return it->second->val;
    }
    void put(int key, int value) {
        if (mp.count(key)) {
            Node* n = mp[key]; n->val = value;
            unlink(n); pushFront(n);
            return;
        }
        if ((int)mp.size() == cap) {
            Node* lru = tail->prev;
            unlink(lru); mp.erase(lru->key); delete lru;
        }
        Node* n = new Node(key, value);
        pushFront(n); mp[key] = n;
    }
};`,
      java: `class LRUCache {
    private static class Node {
        int key, val; Node prev, next;
        Node(int k, int v) { key = k; val = v; }
    }
    private final int cap;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0), tail = new Node(0, 0);   // sentinels

    public LRUCache(int capacity) { cap = capacity; head.next = tail; tail.prev = head; }

    private void unlink(Node n) { n.prev.next = n.next; n.next.prev = n.prev; }
    private void pushFront(Node n) {
        n.next = head.next; n.prev = head;
        head.next.prev = n; head.next = n;
    }
    public int get(int key) {
        Node n = map.get(key);
        if (n == null) return -1;
        unlink(n); pushFront(n);
        return n.val;
    }
    public void put(int key, int value) {
        Node n = map.get(key);
        if (n != null) { n.val = value; unlink(n); pushFront(n); return; }
        if (map.size() == cap) {
            Node lru = tail.prev;
            unlink(lru); map.remove(lru.key);
        }
        n = new Node(key, value);
        pushFront(n); map.put(key, n);
    }
}`,
      python: `class DNode:
    def __init__(self, key=0, val=0):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity):
        self.cap, self.map = capacity, {}
        self.head, self.tail = DNode(), DNode()          # sentinels
        self.head.next, self.tail.prev = self.tail, self.head

    def _unlink(self, n):
        n.prev.next, n.next.prev = n.next, n.prev

    def _push_front(self, n):
        n.next, n.prev = self.head.next, self.head
        self.head.next.prev = n
        self.head.next = n

    def get(self, key):
        n = self.map.get(key)
        if not n:
            return -1
        self._unlink(n)
        self._push_front(n)
        return n.val

    def put(self, key, value):
        if key in self.map:
            n = self.map[key]
            n.val = value
            self._unlink(n)
            self._push_front(n)
            return
        if len(self.map) == self.cap:
            lru = self.tail.prev
            self._unlink(lru)
            del self.map[lru.key]
        n = DNode(key, value)
        self._push_front(n)
        self.map[key] = n`
    }
  },
  {
    id: "ll-k-group",
    title: "Reverse Nodes in k-Group",
    difficulty: "hard",
    tags: ["Reversal", "Dummy node"],
    desc: "Reverse the nodes k at a time. A final group with fewer than k nodes stays as it is.",
    example: "1 → 2 → 3 → 4 → 5, k = 2  →  2 → 1 → 4 → 3 → 5",
    hint: "Keep groupPrev (node before the group). Check that k nodes exist, reverse them, then reconnect both ends.",
    approach: "Find kth node from groupPrev; if missing, stop. Reverse the group with prev initialised to kth.next so the tail reconnects automatically. Then groupPrev.next = kth, and groupPrev moves to the old first node.",
    complexity: "Time O(n) · Space O(1)",
    link: "https://leetcode.com/problems/reverse-nodes-in-k-group/",
    code: {
      cpp: `ListNode* reverseKGroup(ListNode* head, int k) {
    ListNode dummy(0);
    dummy.next = head;
    ListNode* groupPrev = &dummy;
    while (true) {
        ListNode* kth = groupPrev;
        for (int i = 0; i < k && kth; i++) kth = kth->next;
        if (!kth) break;
        ListNode* groupNext = kth->next;
        ListNode *prev = groupNext, *curr = groupPrev->next;
        while (curr != groupNext) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        ListNode* first = groupPrev->next;      // becomes the group's tail
        groupPrev->next = kth;
        groupPrev = first;
    }
    return dummy.next;
}`,
      java: `public ListNode reverseKGroup(ListNode head, int k) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode groupPrev = dummy;
    while (true) {
        ListNode kth = groupPrev;
        for (int i = 0; i < k && kth != null; i++) kth = kth.next;
        if (kth == null) break;
        ListNode groupNext = kth.next;
        ListNode prev = groupNext, curr = groupPrev.next;
        while (curr != groupNext) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        ListNode first = groupPrev.next;        // becomes the group's tail
        groupPrev.next = kth;
        groupPrev = first;
    }
    return dummy.next;
}`,
      python: `def reverse_k_group(head, k):
    dummy = ListNode(0, head)
    group_prev = dummy
    while True:
        kth = group_prev
        for _ in range(k):
            kth = kth.next if kth else None
        if not kth:
            break
        group_next = kth.next
        prev, curr = group_next, group_prev.next
        while curr is not group_next:
            nxt = curr.next
            curr.next = prev
            prev, curr = curr, nxt
        first = group_prev.next                 # becomes the group's tail
        group_prev.next = kth
        group_prev = first
    return dummy.next`
    }
  },
  {
    id: "ll-merge-k",
    title: "Merge k Sorted Lists",
    difficulty: "hard",
    tags: ["Heap", "Merge"],
    desc: "Merge k sorted linked lists into one sorted list.",
    example: "[1→4→5, 1→3→4, 2→6]  →  1→1→2→3→4→4→5→6",
    hint: "Keep the current head of every list in a min-heap. Repeatedly pop the smallest and push its successor.",
    approach: "Min-heap of size ≤ k with a dummy/tail for the output. (Alternative: divide and conquer — merge lists in pairs, also O(N log k).)",
    complexity: "Time O(N log k) for N total nodes · Space O(k)",
    link: "https://leetcode.com/problems/merge-k-sorted-lists/",
    code: {
      cpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
    for (ListNode* l : lists) if (l) pq.push(l);
    ListNode dummy(0), *tail = &dummy;
    while (!pq.empty()) {
        ListNode* node = pq.top(); pq.pop();
        tail->next = node;
        tail = node;
        if (node->next) pq.push(node->next);
    }
    return dummy.next;
}`,
      java: `public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));
    for (ListNode l : lists) if (l != null) pq.add(l);
    ListNode dummy = new ListNode(0), tail = dummy;
    while (!pq.isEmpty()) {
        ListNode node = pq.poll();
        tail.next = node;
        tail = node;
        if (node.next != null) pq.add(node.next);
    }
    return dummy.next;
}`,
      python: `import heapq

def merge_k_lists(lists):
    heap = [(l.val, i, l) for i, l in enumerate(lists) if l]
    heapq.heapify(heap)                # i breaks ties (nodes aren't comparable)
    dummy = tail = ListNode(0)
    while heap:
        _, i, node = heapq.heappop(heap)
        tail.next = tail = node
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next`
    }
  }
];

window.QUIZ = [
  {
    q: "What is the time complexity of accessing the k-th element of a singly linked list?",
    opts: ["O(1)", "O(log n)", "O(k)", "O(n²)"],
    a: 2,
    exp: "There is no indexing: you must follow k next-pointers from the head (O(n) in the worst case)."
  },
  {
    q: "To insert node X after node P, which order is correct?",
    opts: ["P.next = X; X.next = P.next", "X.next = P.next; P.next = X", "X.next = P; P.next = X", "Order doesn't matter"],
    a: 1,
    exp: "Connect before you cut. Doing P.next = X first loses the reference to the rest of the list, and X would point to itself."
  },
  {
    q: "Why use a dummy (sentinel) node?",
    opts: ["It makes the list faster", "It removes special cases when the head may change", "It is required by Java", "It stores the length"],
    a: 1,
    exp: "With a dummy in front, deleting or inserting at the head is the same code as anywhere else. Return dummy.next."
  },
  {
    q: "With slow moving 1 step and fast moving 2, where is slow when fast reaches the end of 1 → 2 → 3 → 4 → 5?",
    opts: ["Node 2", "Node 3", "Node 4", "Node 5"],
    a: 1,
    exp: "fast visits 1, 3, 5 while slow visits 1, 2, 3 — the middle."
  },
  {
    q: "In the iterative reversal, what does the function return?",
    opts: ["head", "curr", "prev", "head.next"],
    a: 2,
    exp: "When the loop ends, curr is null and prev points at the old last node — the new head."
  },
  {
    q: "Which data structures make an O(1) LRU cache?",
    opts: ["Array + binary search", "Hash map + doubly linked list", "Two stacks", "Singly linked list only"],
    a: 1,
    exp: "The map finds a node in O(1); the doubly linked list lets you unlink it and move it to the front in O(1)."
  },
  {
    q: "How do you detect a cycle using O(1) extra space?",
    opts: ["Store visited nodes in a set", "Count nodes until n + 1", "Floyd's fast/slow pointers", "Reverse the list"],
    a: 2,
    exp: "If there's a cycle, the fast pointer eventually laps the slow one and they point at the same node. A set works but uses O(n) space."
  },
  {
    q: "Deleting the node after P in a singly linked list costs…",
    opts: ["O(1)", "O(log n)", "O(n)", "Depends on the value"],
    a: 0,
    exp: "P.next = P.next.next — one pointer change. Finding P is what usually costs O(n)."
  }
];
