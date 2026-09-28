export const categories = ['OOP', 'DSA', 'OS', 'Networks', 'DBMS'];

export const starterQuestions = [
  {
    id: 1,
    category: 'OOP',
    topic: 'OOP pillars',
    difficulty: 'Beginner',
    question: 'What are the four pillars of object-oriented programming, and what does each one mean?',
    modelAnswer: 'Encapsulation bundles state and behavior while controlling access. Abstraction exposes essential behavior and hides implementation details. Inheritance derives a type from another type to reuse or specialize behavior. Polymorphism lets different implementations respond to the same interface or operation.',
    acceptedKeywords: ['encapsulation', 'abstraction', 'inheritance', 'polymorphism'],
    demo: {
      type: 'oop-pillars',
      title: 'OOP pillars explorer',
      description: 'Inspect how encapsulation, abstraction, inheritance, and polymorphism work together.'
    }
  },
  {
    id: 2,
    category: 'OOP',
    topic: 'Abstract class vs. interface',
    difficulty: 'Intermediate',
    question: 'How does an abstract class differ from an interface, and when would you choose each?',
    modelAnswer: 'An abstract class is a shared base that can hold state, constructors, and both implemented and abstract methods. An interface describes a capability or contract that unrelated types can implement. Use an abstract class for closely related types sharing implementation or state, and an interface for a contract that can be implemented across a type hierarchy.',
    acceptedKeywords: ['shared implementation', 'state', 'abstract methods', 'contract', 'unrelated types'],
    demo: {
      type: 'abstract-vs-interface',
      title: 'Type relationship explorer',
      description: 'Compare shared base behavior with capabilities implemented by unrelated types.'
    }
  },
  {
    id: 3,
    category: 'DSA',
    topic: 'Array vs. linked list',
    difficulty: 'Beginner',
    question: 'Compare arrays and linked lists for indexing, insertion, memory layout, and common use cases.',
    modelAnswer: 'Arrays store elements contiguously and support constant-time indexed access, but inserting in the middle usually shifts elements. Linked lists store nodes connected by references, so indexed access takes linear time, while insertion or deletion is constant time when the node position is already known. Arrays suit frequent indexed reads; linked lists suit workloads with frequent local edits and known positions.',
    acceptedKeywords: ['contiguous', 'constant-time indexed', 'linear time', 'shifts elements', 'node'],
    demo: {
      type: 'array-vs-linked-list',
      title: 'Data structure operations',
      description: 'Compare how indexing and insertion move through arrays and linked lists.'
    }
  },
  {
    id: 4,
    category: 'DSA',
    topic: 'Hash tables',
    difficulty: 'Intermediate',
    question: 'How does a hash table store and retrieve a value, and how can it handle collisions?',
    modelAnswer: 'A hash function maps a key to an array index, where the table stores the key-value entry. A collision occurs when keys map to the same index. Separate chaining stores multiple entries in a bucket; open addressing probes for another available slot. Lookup is expected O(1) with a good hash function and controlled load factor, but can degrade to O(n).',
    acceptedKeywords: ['hash function', 'index', 'collision', 'chaining', 'open addressing', 'O(1)'],
    demo: {
      type: 'hash-collision',
      title: 'Hash collision visualizer',
      description: 'Insert keys into buckets and compare separate chaining with open addressing.'
    }
  },
  {
    id: 5,
    category: 'DSA',
    topic: 'Two-sum problem',
    difficulty: 'Intermediate',
    question: 'Given an integer array and a target, how would you return the indices of two values that add up to the target?',
    modelAnswer: 'Scan the array once while storing each previously seen value and its index in a hash map. For each value, compute target minus value and check whether that complement is already in the map. If so, return both indices; otherwise store the current value. This takes expected O(n) time and O(n) extra space.',
    acceptedKeywords: ['complement', 'hash map', 'previously seen', 'O(n)', 'indices'],
    demo: {
      type: 'two-sum',
      title: 'Two-sum trace',
      description: 'Step through a hash-map lookup for each value and its target complement.'
    }
  },
  {
    id: 6,
    category: 'OS',
    topic: 'Process vs. thread',
    difficulty: 'Beginner',
    question: 'What is the difference between a process and a thread, particularly in memory and communication?',
    modelAnswer: 'A process is an executing program with its own virtual address space and operating-system resources. Threads are execution paths within a process; they share that process memory and resources but have separate stacks and registers. Processes provide stronger isolation, while threads are lighter to create and can communicate through shared memory, which requires synchronization.',
    acceptedKeywords: ['address space', 'shared memory', 'separate stacks', 'isolation', 'synchronization'],
    demo: {
      type: 'process-thread',
      title: 'Process memory map',
      description: 'Compare isolated process memory with shared thread memory and private stacks.'
    }
  },
  {
    id: 7,
    category: 'OS',
    topic: 'Deadlock',
    difficulty: 'Advanced',
    question: 'What conditions are required for deadlock, and how can a system prevent or avoid it?',
    modelAnswer: 'Deadlock requires mutual exclusion, hold and wait, no preemption, and circular wait. Prevention breaks at least one of these conditions, such as imposing a global lock order to prevent circular wait. Avoidance grants a resource request only if the resulting state remains safe; detection and recovery are alternatives when prevention is not practical.',
    acceptedKeywords: ['mutual exclusion', 'hold and wait', 'no preemption', 'circular wait', 'safe state'],
    demo: {
      type: 'deadlock',
      title: 'Two threads, two locks',
      description: 'Interleave lock requests to create deadlock, then try a global lock order.'
    }
  },
  {
    id: 8,
    category: 'Networks',
    topic: 'TCP vs. UDP',
    difficulty: 'Beginner',
    question: 'Compare TCP and UDP in connection setup, reliability, ordering, and typical use cases.',
    modelAnswer: 'TCP is connection-oriented and provides reliable, ordered delivery with retransmission and flow control, at the cost of additional setup and protocol overhead. UDP is connectionless and does not guarantee delivery, ordering, or retransmission, so it has lower overhead and latency. TCP suits web pages and file transfer; UDP suits real-time voice, video, and latency-sensitive traffic that can tolerate some loss.',
    acceptedKeywords: ['connection-oriented', 'reliable', 'ordered', 'connectionless', 'lower overhead', 'retransmission'],
    demo: {
      type: 'tcp-handshake',
      title: 'TCP three-way handshake',
      description: 'Animate SYN, SYN-ACK, and ACK packets between a client and a server.'
    }
  },
  {
    id: 9,
    category: 'Networks',
    topic: 'URL-to-page-load flow',
    difficulty: 'Advanced',
    question: 'What are the main steps from entering an HTTPS URL in a browser to seeing the page?',
    modelAnswer: 'The browser parses the URL and checks caches, resolves the hostname through DNS, and establishes a connection to the server (typically TCP plus a TLS handshake, or QUIC for HTTP/3). It sends an HTTP request; the server responds with a status, headers, and content. The browser parses HTML, fetches dependent resources, builds the DOM and CSSOM, runs JavaScript, lays out the page, and paints pixels.',
    acceptedKeywords: ['DNS', 'TLS', 'HTTP request', 'HTML', 'DOM', 'CSSOM', 'paint'],
    demo: {
      type: 'url-load',
      title: 'Browser request timeline',
      description: 'Follow DNS, connection setup, the HTTP response, parsing, layout, and paint.'
    }
  },
  {
    id: 10,
    category: 'DBMS',
    topic: 'Database normalization',
    difficulty: 'Advanced',
    question: 'Explain how you would take a table of students, courses, and instructors from an unnormalized form to 3NF.',
    modelAnswer: 'First make each cell atomic and remove repeating groups to reach 1NF. In 2NF, remove partial dependencies on part of a composite key by separating student, course, and enrollment facts. In 3NF, remove transitive dependencies: store each course and its instructor relationship in a course table, and reference it from enrollment. The resulting tables avoid update, insert, and delete anomalies.',
    acceptedKeywords: ['1NF', 'atomic', '2NF', 'partial dependency', '3NF', 'transitive dependency', 'anomalies'],
    demo: {
      type: 'normalization',
      title: 'Normalize a course table',
      description: 'Split repeating data into 1NF, 2NF, and 3NF tables to remove anomalies.'
    }
  }
];