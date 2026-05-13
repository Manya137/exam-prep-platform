import { createHash } from 'crypto'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DATA_PATH = join(__dirname, 'data.json')

function hashPassword(password) {
  return createHash('sha256').update(password + 'exam-prep-salt').digest('hex')
}

function readData() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'))
}

function writeData(data) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
}

console.log('Seeding database with GATE/CAT data...')

const initialData = {
  users: [
    { id: 1, email: 'admin@examprep.com', password: hashPassword('admin123'), name: 'Admin', role: 'admin', created_at: new Date().toISOString() },
    { id: 2, email: 'student@examprep.com', password: hashPassword('password123'), name: 'Demo Student', role: 'student', created_at: new Date().toISOString() }
  ],
  exams: [
    { id: 1, name: 'GATE', code: 'GATE', description: 'Graduate Aptitude Test in Engineering' },
    { id: 2, name: 'CAT', code: 'CAT', description: 'Common Admission Test for IIMs' }
  ],
  branches: [
    { id: 1, exam_id: 1, name: 'Computer Science & IT', code: 'CS' },
    { id: 2, exam_id: 1, name: 'Electronics & Communication', code: 'EC' },
    { id: 3, exam_id: 1, name: 'Electrical Engineering', code: 'EE' },
    { id: 4, exam_id: 2, name: 'Quantitative Aptitude', code: 'QA' },
    { id: 5, exam_id: 2, name: 'Logical Reasoning', code: 'LR' }
  ],
  subjects: [
    { id: 1, branch_id: 1, name: 'Data Structures & Algorithms', code: 'DSA' },
    { id: 2, branch_id: 1, name: 'Algorithms', code: 'ALGO' },
    { id: 3, branch_id: 1, name: 'Operating Systems', code: 'OS' },
    { id: 4, branch_id: 1, name: 'Database Management', code: 'DBMS' },
    { id: 5, branch_id: 1, name: 'Computer Networks', code: 'CN' },
    { id: 6, branch_id: 1, name: 'Theory of Computation', code: 'TOC' },
    { id: 7, branch_id: 4, name: 'Quantitative Aptitude', code: 'QA' },
    { id: 8, branch_id: 5, name: 'Logical Reasoning', code: 'LR' }
  ],
  units: [],
  topics: [],
  questions: [],
  userProgress: [],
  studyPlans: [],
  notebookEntries: [],
  mcqAttempts: [],
  nextId: { users: 3, exams: 3, branches: 6, subjects: 9, units: 1, topics: 1, questions: 1, studyPlans: 1, notebookEntries: 1 }
}

const dsUnits = [
  { name: 'Arrays & Linked Lists', topics: ['Arrays', 'Linked Lists', 'Doubly Linked Lists', 'Circular Linked Lists'] },
  { name: 'Stacks & Queues', topics: ['Stack Operations', 'Queue Operations', 'Circular Queue', 'Priority Queue'] },
  { name: 'Trees', topics: ['Binary Trees', 'BST', 'AVL Trees', 'Tree Traversals', 'Heap'] },
  { name: 'Graphs', topics: ['Graph Representations', 'BFS', 'DFS', 'Dijkstra', 'MST'] },
  { name: 'Sorting & Searching', topics: ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Binary Search', 'Hashing'] },
  { name: 'Dynamic Programming', topics: ['0/1 Knapsack', 'LCS', 'MCM', 'Edit Distance'] }
]

const osUnits = [
  { name: 'Process Management', topics: ['Processes', 'Threads', 'Scheduling', 'Synchronization'] },
  { name: 'Memory Management', topics: ['Paging', 'Segmentation', 'Virtual Memory', 'Page Replacement'] },
  { name: 'Deadlock', topics: ['Conditions', 'Prevention', 'Avoidance', 'Banker\'s Algorithm'] },
  { name: 'File Systems', topics: ['Directory', 'Allocation', 'Disk Scheduling'] }
]

const dbmsUnits = [
  { name: 'SQL', topics: ['DDL', 'DML', 'Joins', 'Subqueries', 'Aggregation'] },
  { name: 'Normalization', topics: ['1NF', '2NF', '3NF', 'BCNF'] },
  { name: 'Transactions', topics: ['ACID', 'Concurrency', 'Locking', 'Serializability'] }
]

const cnUnits = [
  { name: 'OSI Model', topics: ['7 Layers', 'TCP/IP', 'Protocols'] },
  { name: 'Transport Layer', topics: ['TCP', 'UDP', 'Flow Control', 'Congestion'] },
  { name: 'Network Layer', topics: ['IP Addressing', 'Routing', 'Subnetting', 'CIDR'] }
]

const tocUnits = [
  { name: 'Automata Theory', topics: ['DFA', 'NFA', 'Regular Expressions', 'Regular Languages'] },
  { name: 'Context-Free Languages', topics: ['CFG', 'CNF', 'PDA'] },
  { name: 'Turing Machines', topics: ['TM', 'Recursively Enumerable', 'Decidability'] }
]

const subjectUnits = { 1: dsUnits, 3: osUnits, 4: dbmsUnits, 5: cnUnits, 6: tocUnits }

for (const [subjectId, units] of Object.entries(subjectUnits)) {
  units.forEach((unit, uIdx) => {
    const unitId = initialData.units.length + 1
    initialData.units.push({ id: unitId, subject_id: parseInt(subjectId), name: unit.name, order_index: uIdx })
    unit.topics.forEach((topic, tIdx) => {
      initialData.topics.push({ id: initialData.topics.length + 1, unit_id: unitId, name: topic, order_index: tIdx })
    })
  })
}

const questions = [
  { topic: 'Binary Trees', difficulty: 'medium', year: 2024, question: 'In a complete binary tree with n nodes, where is the minimum element found in a min-heap?', options: ['Root', 'Last level', 'Left leaf', 'Right leaf'], correct: 0, explanation: 'In a min-heap (complete binary tree), the minimum element is always at the root index 1.', marks: 1 },
  { topic: 'BST', difficulty: 'medium', year: 2024, question: 'What is the time complexity of searching in a balanced BST?', options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(1)'], correct: 0, explanation: 'Balanced BST has O(log n) height, so search takes O(log n).', marks: 1 },
  { topic: 'Scheduling', difficulty: 'easy', year: 2024, question: 'Round Robin scheduling with very large time quantum behaves like?', options: ['FCFS', 'SJF', 'Priority', 'MLQ'], correct: 0, explanation: 'Large quantum means processes complete before quantum expires, behaving like FCFS.', marks: 1 },
  { topic: 'Deadlock', difficulty: 'medium', year: 2024, question: 'Which is NOT a Coffman condition for deadlock?', options: ['Preemption', 'Mutual Exclusion', 'Hold and Wait', 'Circular Wait'], correct: 0, explanation: 'Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.', marks: 2 },
  { topic: 'Banker\'s Algorithm', difficulty: 'hard', year: 2024, question: 'Banker\'s algorithm is used for?', options: ['Deadlock Avoidance', 'Deadlock Prevention', 'Deadlock Detection', 'Recovery'], correct: 0, explanation: 'Banker\'s algorithm avoids deadlock by checking safe state before resource allocation.', marks: 2 },
  { topic: 'Virtual Memory', difficulty: 'medium', year: 2024, question: 'What is thrashing?', options: ['Excessive paging', 'Process termination', 'Memory leak', 'Cache miss'], correct: 0, explanation: 'Thrashing: system spends more time paging than executing processes.', marks: 1 },
  { topic: 'Paging', difficulty: 'hard', year: 2024, question: 'In a system with 4KB pages and 32-bit addresses, how many bits for page number?', options: ['20', '12', '16', '8'], correct: 0, explanation: 'Offset bits = log2(4096) = 12. Page bits = 32 - 12 = 20.', marks: 2 },
  { topic: 'SQL', difficulty: 'easy', year: 2024, question: 'Which clause filters grouped results after GROUP BY?', options: ['HAVING', 'WHERE', 'GROUP BY', 'ORDER BY'], correct: 0, explanation: 'HAVING filters groups; WHERE cannot filter aggregates.', marks: 1 },
  { topic: 'Joins', difficulty: 'medium', year: 2024, question: 'What type of join returns all rows from left table and matched rows from right?', options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'], correct: 0, explanation: 'LEFT JOIN returns all left rows plus matching right rows.', marks: 1 },
  { topic: 'Normalization', difficulty: 'hard', year: 2024, question: 'Which normal form removes transitive dependencies?', options: ['3NF', '2NF', 'BCNF', '1NF'], correct: 0, explanation: '3NF ensures no transitive dependency: non-prime attribute depends only on candidate key.', marks: 2 },
  { topic: 'TCP', difficulty: 'easy', year: 2024, question: 'TCP three-way handshake sequence?', options: ['SYN, SYN-ACK, ACK', 'SYN, ACK, FIN', 'SYN, SYN, ACK', 'ACK, SYN, ACK'], correct: 0, explanation: 'TCP: Client SYN, Server SYN-ACK, Client ACK.', marks: 1 },
  { topic: 'IP Addressing', difficulty: 'medium', year: 2024, question: 'Default mask for Class B IP address?', options: ['255.255.0.0', '255.0.0.0', '255.255.255.0', '255.255.255.255'], correct: 0, explanation: 'Class B: first 2 octets network ID (255.255.x.x).', marks: 1 },
  { topic: 'Subnetting', difficulty: 'hard', year: 2024, question: '/24 network has how many usable hosts?', options: ['254', '256', '252', '248'], correct: 0, explanation: '/24 = 8 host bits = 256 total - 2 (network/broadcast) = 254.', marks: 2 },
  { topic: 'Quick Sort', difficulty: 'easy', year: 2024, question: 'Worst case time complexity of Quick Sort?', options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'], correct: 0, explanation: 'Worst case O(n²) when pivot is always smallest/largest.', marks: 1 },
  { topic: 'Merge Sort', difficulty: 'medium', year: 2024, question: 'Which sorting algorithm is stable?', options: ['Merge Sort', 'Quick Sort', 'Heap Sort', 'Selection Sort'], correct: 0, explanation: 'Merge Sort is stable; Quick Sort and Heap Sort are unstable.', marks: 1 },
  { topic: 'Binary Search', difficulty: 'easy', year: 2024, question: 'Worst case time complexity of binary search?', options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(1)'], correct: 0, explanation: 'Binary search halves search space: O(log n) iterations.', marks: 1 },
  { topic: 'LCS', difficulty: 'hard', year: 2024, question: 'Time complexity of LCS using DP?', options: ['O(mn)', 'O(m+n)', 'O(2^n)', 'O(n log n)'], correct: 0, explanation: 'LCS builds m×n table, each cell O(1): O(mn).', marks: 2 },
  { topic: 'DFA', difficulty: 'hard', year: 2024, question: 'Language {0ⁿ1ⁿ2ⁿ | n≥1} is?', options: ['Not context-free', 'Context-free', 'Regular', 'Recursive'], correct: 0, explanation: 'Requires matching 3 variables - beyond CFL capability.', marks: 2 },
  { topic: 'Page Replacement', difficulty: 'medium', year: 2024, question: 'Belady\'s anomaly occurs in?', options: ['FIFO', 'LRU', 'Optimal', 'Clock'], correct: 0, explanation: 'FIFO can have more page faults with more frames - anomaly.', marks: 1 },
  { topic: 'Semaphores', difficulty: 'medium', year: 2024, question: 'P() and V() operations are also called?', options: ['wait() and signal()', 'lock() and unlock()', 'acquire() and release()', 'All of above'], correct: 3, explanation: 'All are synchronization primitives with same semantics.', marks: 1 }
]

const topicMap = {}
initialData.topics.forEach(t => {
  const key = t.name.toLowerCase().replace(/\s+/g, '')
  topicMap[key] = t.id
  if (t.name.toLowerCase().includes('tree')) topicMap['tree'] = t.id
  if (t.name.toLowerCase().includes('scheduling')) topicMap['scheduling'] = t.id
  if (t.name.toLowerCase().includes('deadlock')) topicMap['deadlock'] = t.id
  if (t.name.toLowerCase().includes('sql') || t.name.toLowerCase().includes('joins')) topicMap['sql'] = t.id
  if (t.name.toLowerCase().includes('tcp') || t.name.toLowerCase().includes('network')) topicMap['tcp'] = t.id
  if (t.name.toLowerCase().includes('sort') || t.name.toLowerCase().includes('search')) topicMap['sort'] = t.id
  if (t.name.toLowerCase().includes('dfa') || t.name.toLowerCase().includes('automata')) topicMap['dfa'] = t.id
})

questions.forEach(q => {
  let topicId = 1
  const qKey = q.topic.toLowerCase().replace(/\s+/g, '')
  if (topicMap[qKey]) topicId = topicMap[qKey]
  else if (q.topic.includes('Tree') && topicMap['tree']) topicId = topicMap['tree']
  else if (q.topic.includes('Scheduling') && topicMap['scheduling']) topicId = topicMap['scheduling']
  else if (q.topic.includes('Deadlock') && topicMap['deadlock']) topicId = topicMap['deadlock']
  else if (q.topic.includes('SQL') && topicMap['sql']) topicId = topicMap['sql']
  
  initialData.questions.push({
    id: initialData.questions.length + 1,
    topic_id: topicId,
    exam_id: 1,
    year: q.year,
    difficulty: q.difficulty,
    question: q.question,
    option_a: q.options[0],
    option_b: q.options[1],
    option_c: q.options[2],
    option_d: q.options[3],
    correct_option: String.fromCharCode(97 + q.correct),
    explanation: q.explanation,
    marks: q.marks,
    negative_marks: 0.33
  })
})

writeData(initialData)
console.log('Database seeded successfully!')
console.log('- Users: admin@examprep.com (admin123), student@examprep.com (password123)')
console.log(`- ${initialData.subjects.length} subjects, ${initialData.units.length} units, ${initialData.topics.length} topics`)
console.log(`- ${initialData.questions.length} questions from GATE/CSIR exams`)