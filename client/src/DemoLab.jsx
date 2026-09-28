import { useState } from 'react';
import { ArrowRight, Check, Play, RotateCcw, StepForward } from 'lucide-react';

function PillarDemo() {
  const [selected, setSelected] = useState('Encapsulation');
  const details = {
    Encapsulation: 'Keep data and the operations that protect it together. A private balance changes only through deposit and withdraw methods.',
    Abstraction: 'Show a useful contract while hiding the mechanism. Call pay() without needing to know how a card network settles it.',
    Inheritance: 'Create a specialized type from a shared base. A SavingsAccount can reuse Account behavior and add its own rules.',
    Polymorphism: 'Send the same message to different types. Each payment method can implement pay() in its own way.'
  };
  return (
    <div className="lab-demo">
      <div className="pillar-tabs">{Object.keys(details).map((pillar) => <button className={selected === pillar ? 'is-active' : ''} key={pillar} onClick={() => setSelected(pillar)} type="button">{pillar}</button>)}</div>
      <div className="demo-explanation"><span className="demo-step-index">01 / 04</span><p><strong>{selected}.</strong> {details[selected]}</p></div>
    </div>
  );
}

function TypeDemo() {
  const [type, setType] = useState('abstract');
  const isAbstract = type === 'abstract';
  return (
    <div className="lab-demo">
      <div className="demo-segmented"><button className={isAbstract ? 'is-active' : ''} onClick={() => setType('abstract')} type="button">Abstract class</button><button className={!isAbstract ? 'is-active' : ''} onClick={() => setType('interface')} type="button">Interface</button></div>
      <div className="type-diagram"><span className="type-node type-node-root">{isAbstract ? 'BaseAccount' : 'Payable'}</span><span className="type-connector" /><div className="type-children"><span className="type-node">{isAbstract ? 'SavingsAccount' : 'Invoice'}</span><span className="type-node">{isAbstract ? 'BusinessAccount' : 'CardPayment'}</span></div></div>
      <p className="demo-caption">{isAbstract ? 'Share state and implemented methods among related types.' : 'Define a capability that different types can implement.'}</p>
    </div>
  );
}

function ArrayListDemo() {
  const [values, setValues] = useState([3, 8, 12, 17]);
  function insertValue() {
    if (values.length < 7) setValues((current) => [...current.slice(0, 2), 10, ...current.slice(2)]);
  }
  function removeValue() {
    setValues((current) => current.filter((value) => value !== 8));
  }
  return (
    <div className="lab-demo">
      <div className="structure-controls"><button onClick={insertValue} type="button">Insert 10</button><button onClick={removeValue} type="button">Remove 8</button><button className="reset-control" onClick={() => setValues([3, 8, 12, 17])} type="button"><RotateCcw size={13} /> Reset</button></div>
      <div className="structure-compare">
        <div className="structure-example"><span className="structure-title">ARRAY <small>contiguous slots</small></span><div className="array-cells">{values.map((value, index) => <span className="array-cell" key={`${index}-${value}`}><b>{value}</b><small>{index}</small></span>)}</div></div>
        <div className="structure-example"><span className="structure-title">LINKED LIST <small>connected nodes</small></span><div className="linked-nodes">{values.map((value, index) => <span className="linked-node-pair" key={`${index}-${value}`}><span className="linked-node">{value}</span>{index < values.length - 1 && <ArrowRight size={14} />}</span>)}</div></div>
      </div>
      <p className="demo-caption">Each insert shifts later array slots; a linked-list node can be relinked once its position is found.</p>
    </div>
  );
}

function hashIndex(key, size) {
  return [...key].reduce((total, character) => total + character.charCodeAt(0), 0) % size;
}

function HashDemo() {
  const [keys, setKeys] = useState(['oak', 'fig']);
  const [keyInput, setKeyInput] = useState('');
  const [strategy, setStrategy] = useState('chaining');
  const size = 5;
  const buckets = Array.from({ length: size }, () => []);
  keys.forEach((key) => {
    const home = hashIndex(key, size);
    let slot = home;
    if (strategy === 'open') {
      while (buckets[slot].length && buckets[slot][0].key !== key) slot = (slot + 1) % size;
    }
    buckets[slot].push({ key, hasCollision: slot !== home || buckets[slot].length > 0 });
  });
  function addKey(event) {
    event.preventDefault();
    const key = keyInput.trim().toLowerCase();
    if (key && !keys.includes(key) && keys.length < size * 2) setKeys((current) => [...current, key]);
    setKeyInput('');
  }
  return (
    <div className="lab-demo">
      <div className="hash-controls"><div className="demo-segmented"><button className={strategy === 'chaining' ? 'is-active' : ''} onClick={() => setStrategy('chaining')} type="button">Chaining</button><button className={strategy === 'open' ? 'is-active' : ''} onClick={() => setStrategy('open')} type="button">Linear probe</button></div><form onSubmit={addKey}><input aria-label="Key to insert" maxLength={12} onChange={(event) => setKeyInput(event.target.value)} placeholder="Add a key" value={keyInput} /><button aria-label="Insert key" type="submit"><ArrowRight size={15} /></button></form></div>
      <div className="hash-table">{buckets.map((bucket, index) => <div className={`hash-bucket ${bucket.some((item) => item.hasCollision) ? 'has-collision' : ''}`} key={index}><span className="hash-index">{index}</span><span className="hash-slot">{bucket.length ? bucket.map((item, itemIndex) => <span className="hash-key" key={`${item.key}-${itemIndex}`}>{item.key}</span>) : <span className="hash-empty">empty</span>}</span></div>)}</div>
      <p className="demo-caption">hash(key) = sum of character codes mod 5. <span className="collision-note">Oak and fig collide at bucket 0.</span></p>
    </div>
  );
}

function TwoSumDemo() {
  const values = [2, 7, 11, 15];
  const target = 9;
  const [step, setStep] = useState(-1);
  const seen = new Map();
  const trace = values.map((value, index) => {
    const complement = target - value;
    const match = seen.has(complement);
    const state = { value, index, complement, match, matchIndex: seen.get(complement) };
    if (!match) seen.set(value, index);
    return state;
  });
  const current = trace[Math.min(step, trace.length - 1)];
  return (
    <div className="lab-demo">
      <div className="two-sum-top"><span>target <b>{target}</b></span><button className="demo-action" onClick={() => setStep((currentStep) => currentStep >= values.length - 1 ? -1 : currentStep + 1)} type="button">{step >= values.length - 1 ? <><RotateCcw size={14} /> Run again</> : <><StepForward size={14} /> Next step</>}</button></div>
      <div className="two-sum-values">{values.map((value, index) => <span className={`two-sum-value ${index === step ? 'is-current' : ''} ${step >= 0 && trace[index].match ? 'is-match' : ''}`} key={index}><b>{value}</b><small>i={index}</small></span>)}</div>
      <div className="two-sum-trace">{step < 0 ? <span>Step through the values to find the pair.</span> : current.match ? <span><Check size={14} /> {current.value} + {current.complement} = {target}; indices {current.matchIndex} and {current.index}.</span> : <span>{target} − {current.value} = {current.complement}; not seen yet, so store {current.value}.</span>}</div>
    </div>
  );
}

function ProcessDemo() {
  const [mode, setMode] = useState('threads');
  const threads = mode === 'threads';
  return (
    <div className="lab-demo">
      <div className="demo-segmented"><button className={!threads ? 'is-active' : ''} onClick={() => setMode('processes')} type="button">Two processes</button><button className={threads ? 'is-active' : ''} onClick={() => setMode('threads')} type="button">Two threads</button></div>
      <div className={`memory-diagram ${threads ? 'is-shared' : ''}`}><div className="memory-group"><span className="memory-group-title">{threads ? 'PROCESS A' : 'PROCESS A'}</span><div className="memory-box memory-common">{threads ? 'Shared heap' : 'Private address space'}</div><div className="memory-private">{threads ? <><span>Thread 1 stack</span><span>Thread 2 stack</span></> : <span>Code · heap · stack</span>}</div></div>{!threads && <div className="memory-group"><span className="memory-group-title">PROCESS B</span><div className="memory-box memory-common">Private address space</div><div className="memory-private"><span>Code · heap · stack</span></div></div>}</div>
      <p className="demo-caption">{threads ? 'Threads share the process heap and resources, but keep their own stacks.' : 'Separate processes have isolated address spaces and need IPC to communicate.'}</p>
    </div>
  );
}

function DeadlockDemo() {
  const [step, setStep] = useState(-1);
  const [ordered, setOrdered] = useState(false);
  const operations = ['Thread 1 acquires Lock A.', 'Thread 2 acquires Lock B.', 'Thread 1 waits for Lock B.', 'Thread 2 waits for Lock A. Both threads are now deadlocked.'];
  const deadlocked = !ordered && step >= 3;
  const lockA = ordered || step < 0 ? 'Available' : step >= 0 ? 'Thread 1' : 'Available';
  const lockB = ordered || step < 0 ? 'Available' : step >= 1 ? 'Thread 2' : 'Available';
  return (
    <div className="lab-demo">
      <div className="deadlock-stage">
        <div className={`thread-lane ${deadlocked && step === 2 ? 'is-waiting' : ''}`}><span>THREAD 1</span><span>{ordered ? 'Requests A, then B' : step >= 2 ? 'Waiting for Lock B' : step >= 0 ? 'Holds Lock A' : 'Ready'}</span></div>
        <div className="lock-pair"><span className={`lock-chip ${lockA !== 'Available' ? 'is-held' : ''}`}>A <small>{lockA}</small></span><span className={`lock-chip ${lockB !== 'Available' ? 'is-held' : ''}`}>B <small>{lockB}</small></span></div>
        <div className={`thread-lane ${deadlocked ? 'is-waiting' : ''}`}><span>THREAD 2</span><span>{ordered ? 'Requests A, then B' : deadlocked ? 'Waiting for Lock A' : step >= 1 ? 'Holds Lock B' : 'Ready'}</span></div>
      </div>
      <div className="deadlock-controls"><button className="demo-action" onClick={() => { setOrdered(false); setStep((currentStep) => currentStep >= 3 ? -1 : currentStep + 1); }} type="button"><StepForward size={14} /> {deadlocked ? 'Reset simulation' : 'Run next operation'}</button><button className="text-action" onClick={() => { setOrdered(true); setStep(-1); }} type="button">Try global lock order</button></div>
      <p className={`demo-caption ${deadlocked ? 'caption-alert' : ''}`}>{ordered ? 'Both threads request locks in A → B order; circular wait is prevented.' : step < 0 ? 'Run the operations in sequence to see the circular wait form.' : operations[Math.min(step, operations.length - 1)]}</p>
    </div>
  );
}

function TcpDemo() {
  const [step, setStep] = useState(0);
  const signals = ['SYN', 'SYN + ACK', 'ACK'];
  return (
    <div className="lab-demo">
      <div className="network-diagram"><span className="network-endpoint">CLIENT</span><div className="network-wire"><span className={`packet packet-${step + 1}`}>{signals[step]}</span><i /></div><span className="network-endpoint">SERVER</span></div>
      <div className="handshake-steps">{signals.map((signal, index) => <span className={step >= index ? 'is-done' : ''} key={signal}><i>{step > index ? <Check size={11} /> : index + 1}</i>{signal}</span>)}</div>
      <div className="demo-action-row"><p className="demo-caption">{['Client requests a connection.', 'Server acknowledges and sends its own sequence number.', 'Client acknowledges; the connection is established.'][step]}</p><button className="demo-action" onClick={() => setStep((currentStep) => (currentStep + 1) % 3)} type="button">{step === 2 ? <><RotateCcw size={14} /> Restart</> : <><Play size={13} fill="currentColor" /> Send packet</>}</button></div>
    </div>
  );
}

function UrlFlowDemo() {
  const [step, setStep] = useState(0);
  const stages = [
    ['01', 'Parse URL', 'Read the scheme, host, path, and port.'],
    ['02', 'Resolve DNS', 'Look up the host and find the server IP.'],
    ['03', 'Connect securely', 'Establish TCP and negotiate TLS for HTTPS.'],
    ['04', 'Request document', 'Send an HTTP request; receive the response.'],
    ['05', 'Build the page', 'Parse HTML and CSS, run scripts, then paint.']
  ];
  const [number, title, description] = stages[step];
  return (
    <div className="lab-demo">
      <div className="url-browser-bar"><span /><span /><span /><code>https://example.dev/notes</code><span className="url-secure">TLS</span></div>
      <div className="url-stage"><span className="url-stage-number">{number}</span><div><strong>{title}</strong><p>{description}</p></div></div>
      <div className="url-flow-footer"><div className="url-flow-dots">{stages.map((stage, index) => <button aria-label={`Show step ${index + 1}: ${stage[1]}`} aria-current={step === index ? 'step' : undefined} className={step === index ? 'is-active' : ''} key={stage[0]} onClick={() => setStep(index)} type="button" />)}</div><button className="demo-action" onClick={() => setStep((currentStep) => (currentStep + 1) % stages.length)} type="button">Next step <ArrowRight size={14} /></button></div>
    </div>
  );
}

function NormalizationDemo() {
  const [stage, setStage] = useState(0);
  const labels = ['Before', '1NF', '2NF', '3NF'];
  const tables = [
    [{ title: 'Student record', columns: ['Student', 'Courses', 'Instructors'], rows: [['Ari', 'CS101, DB205', 'Lee, Rao'], ['Sam', 'CS101', 'Lee']] }],
    [{ title: 'Enrollment (atomic rows)', columns: ['Student ID', 'Student', 'Course ID', 'Course', 'Instructor'], rows: [['S1', 'Ari', 'C1', 'CS101', 'Lee'], ['S1', 'Ari', 'C2', 'DB205', 'Rao'], ['S2', 'Sam', 'C1', 'CS101', 'Lee']] }],
    [
      { title: 'Students', columns: ['Student ID', 'Name'], rows: [['S1', 'Ari'], ['S2', 'Sam']] },
      { title: 'Courses', columns: ['Course ID', 'Course', 'Instructor ID', 'Instructor'], rows: [['C1', 'CS101', 'I1', 'Lee'], ['C2', 'DB205', 'I2', 'Rao']] },
      { title: 'Enrollments', columns: ['Student ID', 'Course ID'], rows: [['S1', 'C1'], ['S1', 'C2'], ['S2', 'C1']] }
    ],
    [
      { title: 'Students', columns: ['Student ID', 'Name'], rows: [['S1', 'Ari'], ['S2', 'Sam']] },
      { title: 'Courses', columns: ['Course ID', 'Course', 'Instructor ID'], rows: [['C1', 'CS101', 'I1'], ['C2', 'DB205', 'I2']] },
      { title: 'Instructors', columns: ['Instructor ID', 'Name'], rows: [['I1', 'Lee'], ['I2', 'Rao']] },
      { title: 'Enrollments', columns: ['Student ID', 'Course ID'], rows: [['S1', 'C1'], ['S1', 'C2'], ['S2', 'C1']] }
    ]
  ];
  return (
    <div className="lab-demo normalization-demo">
      <div className="normalization-tabs">{labels.map((label, index) => <button className={stage === index ? 'is-active' : ''} key={label} onClick={() => setStage(index)} type="button">{label}</button>)}</div>
      <div className="normalized-tables">{tables[stage].map((table) => <div className="normalized-table-wrap" key={table.title}><span>{table.title}</span><div className="normalized-table-scroll"><table><thead><tr>{table.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{table.rows.map((row, index) => <tr key={index}>{row.map((value, cellIndex) => <td key={cellIndex}>{value}</td>)}</tr>)}</tbody></table></div></div>)}</div>
      <p className="demo-caption">{['Repeating lists hide multiple values in a single cell.', 'Atomic values, but student and course facts are still repeated.', 'Student and course facts are separated; instructor details still depend on instructor ID.', 'Instructor details live with the instructor key; transitive dependencies are removed.'][stage]}</p>
    </div>
  );
}

const demos = {
  'oop-pillars': PillarDemo,
  'abstract-vs-interface': TypeDemo,
  'array-vs-linked-list': ArrayListDemo,
  'hash-collision': HashDemo,
  'two-sum': TwoSumDemo,
  'process-thread': ProcessDemo,
  deadlock: DeadlockDemo,
  'tcp-handshake': TcpDemo,
  'url-load': UrlFlowDemo,
  normalization: NormalizationDemo
};

export default function DemoLab({ question }) {
  const Demo = demos[question.demo.type];
  return (
    <section className="concept-lab" aria-label={`${question.topic} interactive demo`}>
      <div className="concept-lab-heading"><span className="eyebrow">INTERACTIVE LAB</span><span className="lab-live-tag"><i /> TRY IT</span></div>
      {Demo ? <Demo /> : <p className="demo-caption">This lab is coming soon.</p>}
    </section>
  );
}