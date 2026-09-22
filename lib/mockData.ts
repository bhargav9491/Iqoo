import { Task, Decision, Procedure, Activity, WorkMemoryContext } from './types';

export const engineeringTasks: Task[] = [
  {
    id: 't-1',
    title: 'Telemetry ingestion pipeline and gateway failover validation',
    project: 'Smart Infrastructure Monitoring',
    owner: 'Demo Engineer',
    status: 'In Progress',
    priority: 'High',
    progress: 78,
    description: 'Validate telemetry ingestion under extreme conditions and ensure gateway failovers operate within sub-5ms latency limits.',
    subtasks: [
      { id: 'st-1', text: 'Deploy ingestion pipeline', completed: true },
      { id: 'st-2', text: 'Benchmark ring-buffer', completed: true },
      { id: 'st-3', text: 'Configure failover protocol', completed: true },
      { id: 'st-4', text: 'Validate Gateway Node B thermal drift', completed: false },
      { id: 'st-5', text: 'Complete Step 05 engineer sign-off', completed: false },
    ],
    updatedAt: 'Today, 6:42 PM'
  }
];

export const engineeringDecisions: Decision[] = [
  {
    id: 'ADR-01',
    title: 'Asynchronous Lock-Free Ring Buffer',
    status: 'ACCEPTED',
    problem: 'Ingest 50,000 edge sensor telemetry metrics/second with low detection latency.',
    rejectedOption: 'Synchronous Polling',
    reasonRejected: 'Failed at 32k metrics/sec due to thread contention and latency spikes.',
    selectedApproach: 'Lock-Free Ring Buffer',
    evidence: '64k metrics/sec steady throughput with sub-2.4ms processing floor.',
    date: 'Oct 14, 2026'
  }
];

export const engineeringProcedures: Procedure[] = [
  {
    id: 'p-1',
    title: 'Gateway Failover Trigger & Thermal Delta Protocol',
    warning: 'Execution Halted',
    reason: 'Thermistor calibration drift detected on Gateway Node B during 120W peak power injection.',
    steps: [
      { id: 's-1', text: 'Step 01 — Verified', status: 'Verified' },
      { id: 's-2', text: 'Step 02 — Verified', status: 'Verified' },
      { id: 's-3', text: 'Step 03 — Deviation', status: 'Deviation' },
      { id: 's-4', text: 'Step 04 — Active', status: 'Active' },
      { id: 's-5', text: 'Step 05 — Sign-off Required', status: 'Sign-off Required' },
    ]
  }
];

export const engineeringMemory: WorkMemoryContext = {
  project: 'Smart Infrastructure Monitoring',
  branch: 'feature/telemetry-buffer',
  lastActivityTime: 'Today, 6:42 PM',
  progress: 78,
  lastCompleted: 'Ring-buffer benchmark completed.',
  currentBlocker: 'Gateway Node B thermal drift',
  lastCommand: 'npm run test:load --target=node-b',
  failedAttempt: 'Synchronous polling caused latency spikes at 32k metrics/sec.',
  nextStep: 'Validate lock-free buffer under sustained 64k metrics/sec load.',
  recommendedAction: 'Recalibrate Node B thermistor'
};

export const engineeringActivity: Activity[] = [
  { id: 'a-1', text: 'Ring-buffer benchmark completed.', time: '6:42 PM', category: 'Tasks' },
  { id: 'a-2', text: 'ADR-01 updated.', time: '6:31 PM', category: 'Decisions' },
  { id: 'a-3', text: 'Gateway Node B drift detected.', time: '6:18 PM', category: 'Alerts' },
  { id: 'a-4', text: 'Failover protocol configured.', time: '5:55 PM', category: 'Procedures' },
  { id: 'a-5', text: 'Telemetry ingestion deployed.', time: '5:20 PM', category: 'Tasks' },
];

export const mbaTasks: Task[] = [
  {
    id: 't-2',
    title: 'Prepare Market Entry Strategy for a New EV Product',
    project: 'MBA Strategic Management',
    owner: 'MBA Student',
    status: 'In Progress',
    priority: 'High',
    progress: 65,
    description: 'Analyze the electric vehicle market and prepare a market-entry strategy for a hypothetical EV brand entering the Indian market.',
    subtasks: [
      { id: 'st-6', text: 'Define target customer segment', completed: false },
      { id: 'st-7', text: 'Analyze competitors', completed: true },
      { id: 'st-8', text: 'Conduct SWOT analysis', completed: true },
      { id: 'st-9', text: 'Estimate market opportunity', completed: false },
      { id: 'st-10', text: 'Compare pricing strategies', completed: false },
      { id: 'st-11', text: 'Develop positioning strategy', completed: false },
      { id: 'st-12', text: 'Prepare final presentation', completed: false },
    ],
    updatedAt: 'Today, 2:15 PM'
  }
];

export const mbaDecisions: Decision[] = [
  {
    id: 'DEC-01',
    title: 'Target Segment Definition',
    status: 'ACCEPTED',
    problem: 'Identify the most viable initial customer base for EV adoption.',
    rejectedOption: 'All Urban Consumers',
    reasonRejected: 'The segment lacked a clearly defined purchasing profile and made marketing efforts too diffuse.',
    selectedApproach: 'Urban professionals aged 25–40 seeking affordable premium EVs',
    evidence: 'Market research shows this demographic has the highest intent-to-purchase and disposable income for home charging setups.',
    date: 'Oct 15, 2026'
  }
];

export const mbaProcedures: Procedure[] = [
  {
    id: 'p-2',
    title: 'Market Entry Viability Assessment',
    warning: 'Review Required',
    reason: 'Initial pricing estimates exceed competitor baseline by 15%.',
    steps: [
      { id: 's-6', text: 'Step 01 — Competitor Matrix Verified', status: 'Verified' },
      { id: 's-7', text: 'Step 02 — Supplier Network Verified', status: 'Verified' },
      { id: 's-8', text: 'Step 03 — Pricing Deviation', status: 'Deviation' },
      { id: 's-9', text: 'Step 04 — Margin Check', status: 'Active' },
      { id: 's-10', text: 'Step 05 — Advisor Sign-off Required', status: 'Sign-off Required' },
    ]
  }
];

export const mbaMemory: WorkMemoryContext = {
  project: 'MBA Strategic Management',
  branch: 'Market Strategy Doc v2',
  lastActivityTime: 'Today, 2:15 PM',
  progress: 65,
  lastCompleted: 'Competitor analysis completed.',
  currentBlocker: 'Need to finalize the target customer segment.',
  failedAttempt: 'Initial segmentation was too broad and included all urban consumers.',
  failedReason: 'The segment lacked a clearly defined purchasing profile.',
  decision: 'Focus on urban professionals aged 25–40 seeking affordable premium EVs.',
  nextStep: 'Validate the segment against pricing and competitor positioning.',
  recommendedAction: 'Complete customer persona and TAM/SAM/SOM analysis.'
};

export const mbaActivity: Activity[] = [
  { id: 'a-6', text: 'Competitor analysis completed.', time: '2:15 PM', category: 'Tasks' },
  { id: 'a-7', text: 'Target Segment decision updated.', time: '1:45 PM', category: 'Decisions' },
  { id: 'a-8', text: 'Pricing deviation identified.', time: '1:12 PM', category: 'Alerts' },
  { id: 'a-9', text: 'Market Entry structure outlined.', time: '11:30 AM', category: 'Tasks' },
];
