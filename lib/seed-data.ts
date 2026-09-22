import { prisma } from './prisma';
import { hashPassword } from './auth';

export async function seedDemoData() {
  // 1. Create or get Default User
  const email = 'alex.chen@northstar.systems';
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const passwordHash = await hashPassword('password123');
    user = await prisma.user.create({
      data: {
        email,
        name: 'Alex Chen',
        passwordHash,
        role: 'Principal Systems Architect',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
    });
  }

  // Check if primary project already exists
  const existingProject = await prisma.project.findFirst({
    where: { name: 'Smart Infrastructure Monitoring' },
  });

  if (existingProject) {
    return existingProject;
  }

  // Clear existing legacy seed records to ensure clean Northstar Systems environment
  await prisma.activityEvent.deleteMany({});
  await prisma.assistantQuery.deleteMany({});
  await prisma.procedureObservation.deleteMany({});
  await prisma.procedureStep.deleteMany({});
  await prisma.procedure.deleteMany({});
  await prisma.handover.deleteMany({});
  await prisma.decision.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.workContext.deleteMany({});
  await prisma.project.deleteMany({});

  // ---------------------------------------------------------------------------------
  // PROJECT 1: Smart Infrastructure Monitoring (Primary Demonstration Project)
  // ---------------------------------------------------------------------------------
  const project1 = await prisma.project.create({
    data: {
      name: 'Smart Infrastructure Monitoring',
      description: 'Real-time telemetry ingestion, anomaly detection, and automated failover routing for Northstar Systems edge infrastructure.',
      objective: 'Ingest 50,000 sensor telemetry metrics/sec with sub-5ms anomaly detection and zero unacknowledged edge sensor dropouts.',
      status: 'ACTIVE',
      priority: 'CRITICAL',
      teamMembers: JSON.stringify([
        'Alex Chen (Principal Systems Architect)',
        'Sarah Lin (Infrastructure Engineer)',
        'Marcus Vance (Edge Networks Lead)',
        'Elena Rostova (Reliability Engineer)'
      ]),
      userId: user.id,
    },
  });

  // Work Contexts for Project 1
  await prisma.workContext.createMany({
    data: [
      {
        projectId: project1.id,
        category: 'PROGRESS',
        title: 'Edge Sensor Broker Ingestion Pipeline (Kafka / MQTT)',
        content: 'Refactored edge stream broker to process 50,000 metrics/sec. Zero-copy ring buffer tested with 10Gbps link on test cluster without dropped frames.',
        tags: JSON.stringify(['infrastructure', 'telemetry', 'kafka', 'edge']),
        files: JSON.stringify([
          { name: 'pipeline/northstar_edge_broker.go', size: '32.4 KB' },
          { name: 'benchmark_telemetry_run_802.csv', size: '2.1 MB' }
        ]),
        author: 'Alex Chen',
      },
      {
        projectId: project1.id,
        category: 'ATTEMPT',
        title: 'Failed Approach: Synchronous Polling Over High-Latency Cellular Edge',
        content: 'Attempted synchronous REST polling of remote sensor nodes over high-latency cellular links. Caused 850ms latency spikes and socket timeouts under heavy load. Strategy replaced with asynchronous push stream.',
        tags: JSON.stringify(['failed-attempt', 'networking', 'latency']),
        files: JSON.stringify([]),
        author: 'Sarah Lin',
      },
      {
        projectId: project1.id,
        category: 'BLOCKED',
        title: 'Gateway Node B Sensor Calibration Offset Variance',
        content: 'Gateway Node B sensor cluster displays a +3.2°C temperature calibration offset during high-load switching. Awaiting updated factory EEPROM coefficient table from hardware vendor.',
        tags: JSON.stringify(['blocker', 'hardware', 'calibration']),
        files: JSON.stringify([{ name: 'calibration_offset_variance_v3.pdf', size: '512 KB' }]),
        author: 'Elena Rostova',
      },
      {
        projectId: project1.id,
        category: 'NOTE',
        title: 'Continuous Memory Note for Shift Handover',
        content: 'Leaving for regional infrastructure sync. Staging release 1.4-rc2 contains the updated asynchronous failover listener. Ready for bench protocol step 3.',
        tags: JSON.stringify(['handover', 'shift-change']),
        files: JSON.stringify([]),
        author: 'Alex Chen',
      },
    ],
  });

  // Tasks for Project 1
  await prisma.task.createMany({
    data: [
      {
        projectId: project1.id,
        title: 'Deploy Distributed Ring Buffer for High-Throughput Ingestion',
        description: 'Decouple sensor ingestion from metric persistence to prevent pipeline lockups.',
        status: 'COMPLETED',
        priority: 'HIGH',
        assignee: 'Sarah Lin',
      },
      {
        projectId: project1.id,
        title: 'Validate Automated Regional Failover Under 90% Network Drop',
        description: 'Simulate packet loss and verify sub-second routing shift to secondary cluster.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignee: 'Marcus Vance',
      },
      {
        projectId: project1.id,
        title: 'Patch Gateway Node B Sensor Calibration Offsets',
        description: 'Apply newly calibrated temperature and voltage offsets to device tree configuration.',
        status: 'BLOCKED',
        priority: 'MEDIUM',
        assignee: 'Alex Chen',
      },
      {
        projectId: project1.id,
        title: 'Execute 72-Hour Continuous Load Benchmark',
        description: 'Run uninterrupted synthetic workload across 12 distributed edge gateway nodes.',
        status: 'PENDING',
        priority: 'LOW',
        assignee: 'Elena Rostova',
      },
    ],
  });

  // Decisions (ADRs) for Project 1
  await prisma.decision.create({
    data: {
      projectId: project1.id,
      title: 'ADR-01: Asynchronous Lock-Free Ring Buffer vs Synchronous Polling',
      context: 'Under high telemetry burst rates, synchronous REST polling caused TCP buffer starvation and watchdog resets across distributed edge nodes.',
      optionsConsidered: JSON.stringify([
        'Option A: Synchronous HTTP polling at 100ms interval',
        'Option B: Periodic batch worker with 500ms sleep',
        'Option C: Asynchronous lock-free ring buffer with DMA direct-memory transfer'
      ]),
      selectedOption: 'Option C: Asynchronous lock-free ring buffer with DMA direct-memory transfer',
      reasoning: 'Provides deterministic microsecond telemetry ingestion without thread contention, ensuring zero dropped metric packets during peak traffic.',
      expectedImpact: 'Zero packet loss during bursts, -34% CPU utilization, and strictly guaranteed 100Hz safety telemetry.',
      status: 'ACCEPTED',
      author: 'Alex Chen',
    },
  });

  await prisma.decision.create({
    data: {
      projectId: project1.id,
      title: 'ADR-02: Distributed Consensus Protocol for Edge Node Failover',
      context: 'Multi-region failovers require deterministic quorum without split-brain risk during network partitions.',
      optionsConsidered: JSON.stringify([
        'Option A: Master-worker heartbeat with single-point failover orchestrator',
        'Option B: Raft-based distributed state machine consensus'
      ]),
      selectedOption: 'Option B: Raft-based distributed state machine consensus',
      reasoning: 'Guarantees sub-second leader election during network splits while avoiding single points of failure across remote nodes.',
      expectedImpact: 'Failover transition latency reduced from 8.2s to 420ms.',
      status: 'ACCEPTED',
      author: 'Marcus Vance',
    },
  });

  // Procedures for Project 1
  const procedure1 = await prisma.procedure.create({
    data: {
      projectId: project1.id,
      title: 'Edge Node Telemetry Calibration & Automated Failover Protocol',
      description: 'Standardized physical and digital verification protocol for Northstar Systems edge infrastructure before deployment to production clusters.',
      category: 'DEPLOYMENT',
      status: 'IN_REVIEW',
    },
  });

  const step1 = await prisma.procedureStep.create({
    data: {
      procedureId: procedure1.id,
      stepOrder: 1,
      title: 'Edge Gateway Telemetry Channel Calibration',
      expectedAction: 'Connect differential probe across primary sensor shunt. Verify zero-current baseline offset is within ±5mV.',
      evidenceRequired: true,
      reviewStatus: 'VERIFIED',
      observationNotes: 'Baseline verified at 0.0002A idle offset. Signal noise floor within acceptable enterprise tolerance.',
      verificationOutcome: 'VERIFIED',
    },
  });

  const step2 = await prisma.procedureStep.create({
    data: {
      procedureId: procedure1.id,
      stepOrder: 2,
      title: 'Initial 50k Metric Ingestion Throughput Verification',
      expectedAction: 'Inject 50,000 synthetic sensor packets per second. Verify pipeline latency remains <5ms.',
      evidenceRequired: true,
      reviewStatus: 'VERIFIED',
      observationNotes: 'Pipeline sustained 52,400 packets/sec at 3.8ms average latency. No dropped buffer frames.',
      verificationOutcome: 'VERIFIED',
    },
  });

  const step3 = await prisma.procedureStep.create({
    data: {
      procedureId: procedure1.id,
      stepOrder: 3,
      title: 'Gateway Failover Trigger & Thermal Delta Monitoring',
      expectedAction: 'Simulate primary link cut. Verify secondary node assumes traffic in <500ms and thermal rise remains <1.5°C/min.',
      evidenceRequired: true,
      reviewStatus: 'DEVIATION_DETECTED',
      observationNotes: 'Observation note: Gateway Node B registered +2.8°C/min temperature gradient during traffic transition. Potential deviation detected against standard <1.5°C threshold.',
      verificationOutcome: 'POTENTIAL_DEVIATION',
    },
  });

  const step4 = await prisma.procedureStep.create({
    data: {
      procedureId: procedure1.id,
      stepOrder: 4,
      title: 'Audit Log & State Consistency Verification',
      expectedAction: 'Verify consensus state matches across all edge nodes and export verification log.',
      evidenceRequired: false,
      reviewStatus: 'PENDING',
      observationNotes: null,
      verificationOutcome: null,
    },
  });

  await prisma.procedureObservation.create({
    data: {
      stepId: step3.id,
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
      observationText: 'Thermal sensor telemetry indicates +2.8°C/min rise during high-traffic failover. Thermal curve slope is steeper than 1.5°C nominal threshold.',
      confidence: 0.94,
      deviationDetected: true,
      deviationDetails: 'Potential deviation detected: Temperature gradient (+2.8°C/min) exceeds safe baseline threshold (<1.5°C/min). Requires hardware thermal interface pad inspection.',
      verificationStatus: 'PENDING_HUMAN_CONFIRMATION',
    },
  });

  // Generated Handover for Project 1
  await prisma.handover.create({
    data: {
      projectId: project1.id,
      title: 'Handover Brief: Smart Infrastructure Monitoring',
      executiveSummary: 'Comprehensive project handover for Northstar Systems "Smart Infrastructure Monitoring". Objective: Ingest 50,000 metrics/sec with sub-5ms anomaly detection. The project currently has 1 completed milestone, 3 pending tasks, and 2 recorded architectural decisions. Continuity state is validated based on live work memory.',
      completedWork: JSON.stringify([
        'Edge Sensor Broker Ingestion Pipeline (Kafka / MQTT)',
        'Deploy Distributed Ring Buffer for High-Throughput Ingestion'
      ]),
      pendingWork: JSON.stringify([
        'Validate Automated Regional Failover Under 90% Network Drop (HIGH priority)',
        'Patch Gateway Node B Sensor Calibration Offsets (MEDIUM priority)',
        'Execute 72-Hour Continuous Load Benchmark (LOW priority)'
      ]),
      blockers: JSON.stringify([
        'Task blocked: Patch Gateway Node B Sensor Calibration Offsets',
        'Gateway Node B sensor cluster displays a +3.2°C temperature calibration offset. Awaiting updated factory EEPROM coefficients from vendor.'
      ]),
      keyDecisions: JSON.stringify([
        'ADR-01: Asynchronous Lock-Free Ring Buffer vs Synchronous Polling: Selected "Option C: Asynchronous lock-free ring buffer with DMA direct-memory transfer" because Provides deterministic microsecond telemetry ingestion without thread contention',
        'ADR-02: Distributed Consensus Protocol for Edge Node Failover: Selected "Option B: Raft-based distributed state machine consensus" because Guarantees sub-second leader election during network splits'
      ]),
      failedApproaches: JSON.stringify([
        'Failed Approach: Synchronous Polling Over High-Latency Cellular Edge: Attempted synchronous REST polling of remote sensor nodes over high-latency cellular links. Caused 850ms latency spikes and socket timeouts under load.'
      ]),
      recommendedNextSteps: JSON.stringify([
        'Execute pending priority item: "Validate Automated Regional Failover Under 90% Network Drop"',
        'Unblock current constraint: "Task blocked: Patch Gateway Node B Sensor Calibration Offsets"',
        'Verify end-to-end integration and run validation suite prior to release.'
      ]),
      verificationChecklist: JSON.stringify([
        { item: 'All recorded architectural decisions reviewed and acknowledged', checked: true },
        { item: 'Pending blocker resolutions verified with infrastructure leads', checked: false },
        { item: 'Procedure intelligence verification passed with no unresolved deviations', checked: false },
        { item: 'Access credentials and environment configs transferred securely', checked: true }
      ]),
    },
  });

  // Activity Events for Project 1
  await prisma.activityEvent.createMany({
    data: [
      {
        projectId: project1.id,
        userId: user.id,
        type: 'PROJECT_CREATED',
        title: 'Project Initialized',
        description: 'Alex Chen initialized Smart Infrastructure Monitoring for Northstar Systems.',
      },
      {
        projectId: project1.id,
        userId: user.id,
        type: 'DECISION_RECORDED',
        title: 'Architectural Decision ADR-01 Recorded',
        description: 'Adopted Asynchronous Lock-Free Ring Buffer over Synchronous Polling.',
      },
      {
        projectId: project1.id,
        userId: user.id,
        type: 'PROCEDURE_CHECKED',
        title: 'Procedure Step 3 Flagged for Review',
        description: 'AUREVEX AI flagged potential thermal deviation (+2.8°C/min). Awaiting human engineer confirmation.',
      },
    ],
  });

  // ---------------------------------------------------------------------------------
  // PROJECT 2: Operations Workflow Automation
  // ---------------------------------------------------------------------------------
  const project2 = await prisma.project.create({
    data: {
      name: 'Operations Workflow Automation',
      description: 'Automated incident triage, runbook execution, and cross-departmental approval orchestration across Northstar Systems operations.',
      objective: 'Reduce manual incident response time from 42 minutes to <3 minutes via automated policy routing and continuous audit logging.',
      status: 'ACTIVE',
      priority: 'HIGH',
      teamMembers: JSON.stringify([
        'Marcus Vance (Operations Lead)',
        'Sarah Lin (Infrastructure Engineer)',
        'Jordan Reed (Workflow Automation Engineer)'
      ]),
      userId: user.id,
    },
  });

  await prisma.workContext.createMany({
    data: [
      {
        projectId: project2.id,
        category: 'PROGRESS',
        title: 'Event-Driven Webhook Dispatcher Implemented',
        content: 'Built asynchronous webhook routing engine capable of dispatching 10,000 incident events/sec with automated retry exponential backoff.',
        tags: JSON.stringify(['automation', 'webhooks', 'incident-triage']),
        files: JSON.stringify([{ name: 'workflows/triage_dispatcher.ts', size: '18.2 KB' }]),
        author: 'Jordan Reed',
      },
      {
        projectId: project2.id,
        category: 'ATTEMPT',
        title: 'Failed Approach: Synchronous Polling for Incident State Updates',
        content: 'Attempted to poll incident ticket state synchronously every 2 seconds. Exhausted downstream database connections during incident surges. Replaced with WebSocket push notifications.',
        tags: JSON.stringify(['failed-attempt', 'database', 'polling']),
        files: JSON.stringify([]),
        author: 'Marcus Vance',
      },
    ],
  });

  await prisma.task.createMany({
    data: [
      {
        projectId: project2.id,
        title: 'Integrate Real-Time Alert Triage Pipeline',
        description: 'Connect PagerDuty and internal alert channels to automated dispatch worker.',
        status: 'COMPLETED',
        priority: 'HIGH',
        assignee: 'Jordan Reed',
      },
      {
        projectId: project2.id,
        title: 'Configure Automated Pager Escalation Matrix',
        description: 'Define secondary and tertiary on-call schedules based on incident severity.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        assignee: 'Marcus Vance',
      },
      {
        projectId: project2.id,
        title: 'Audit Regulatory Compliance Trail for Automated Runbooks',
        description: 'Verify SOC2 audit log immutability for all automated remediation steps.',
        status: 'PENDING',
        priority: 'LOW',
        assignee: 'Sarah Lin',
      },
    ],
  });

  await prisma.decision.create({
    data: {
      projectId: project2.id,
      title: 'ADR-03: Decoupled Message Queue vs Direct HTTP Webhook Dispatch',
      context: 'Direct HTTP webhooks failed silently when downstream receiver services experienced brief restarts.',
      optionsConsidered: JSON.stringify([
        'Option A: Direct synchronous HTTP POST with 3 retries',
        'Option B: Distributed message queue with dead-letter recovery'
      ]),
      selectedOption: 'Option B: Distributed message queue with dead-letter recovery',
      reasoning: 'Guarantees at-least-once delivery semantics and allows downstream services to drain queues at their own rate.',
      expectedImpact: 'Zero lost incident notifications, guaranteed audit trail.',
      status: 'ACCEPTED',
      author: 'Jordan Reed',
    },
  });

  // ---------------------------------------------------------------------------------
  // PROJECT 3: Intelligent Asset Management
  // ---------------------------------------------------------------------------------
  const project3 = await prisma.project.create({
    data: {
      name: 'Intelligent Asset Management',
      description: 'Predictive lifecycle tracking, hardware health telemetry, and automated maintenance scheduling for Northstar Systems physical data centers.',
      objective: 'Prevent unplanned hardware outages with predictive thermal degradation modeling and automated parts requisition.',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      teamMembers: JSON.stringify([
        'Elena Rostova (Reliability Lead)',
        'Alex Chen (Principal Architect)',
        'David Kim (Field Operations)'
      ]),
      userId: user.id,
    },
  });

  await prisma.workContext.createMany({
    data: [
      {
        projectId: project3.id,
        category: 'PROGRESS',
        title: 'Predictive Thermal Aging Algorithm Trained on 18-Month Telemetry',
        content: 'Trained random forest classifier on historical fan RPM, ambient inlet temps, and drive health logs. Achieved 94.2% precision on predicting drive failure 7 days in advance.',
        tags: JSON.stringify(['ml', 'predictive-maintenance', 'telemetry']),
        files: JSON.stringify([{ name: 'models/thermal_aging_v2.onnx', size: '4.8 MB' }]),
        author: 'Elena Rostova',
      },
      {
        projectId: project3.id,
        category: 'BLOCKED',
        title: 'Power Distribution Unit (PDU) SNMP v3 Credential Rotation',
        content: 'Awaiting security team authorization to complete automated SNMP v3 credential rotation for Rack Rows D and E.',
        tags: JSON.stringify(['blocker', 'security', 'snmp']),
        files: JSON.stringify([]),
        author: 'David Kim',
      },
    ],
  });

  await prisma.task.createMany({
    data: [
      {
        projectId: project3.id,
        title: 'Deploy Telemetry Collector for Server Rack PDUs',
        description: 'Ingest real-time wattage, phase balance, and temperature from rack power strips.',
        status: 'COMPLETED',
        priority: 'HIGH',
        assignee: 'David Kim',
      },
      {
        projectId: project3.id,
        title: 'Calibrate Predictive Maintenance Thresholds on Cluster C',
        description: 'Tune degradation alert threshold to minimize false maintenance calls.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignee: 'Elena Rostova',
      },
      {
        projectId: project3.id,
        title: 'Automate RMA Requisition Triggers for Degraded NVMe Drives',
        description: 'Generate supplier RMA dispatch requests when wear-level indicator exceeds 92%.',
        status: 'PENDING',
        priority: 'MEDIUM',
        assignee: 'Alex Chen',
      },
    ],
  });

  await prisma.decision.create({
    data: {
      projectId: project3.id,
      title: 'ADR-04: Bayesian Predictive Degradation Model vs Static Threshold Alerts',
      context: 'Static 85°C thermal thresholds generated frequent false alarms during ambient temperature seasonal shifts.',
      optionsConsidered: JSON.stringify([
        'Option A: Fixed temperature threshold rule (+10°C over nominal)',
        'Option B: Dynamic Bayesian degradation model accounting for ambient inlet delta'
      ]),
      selectedOption: 'Option B: Dynamic Bayesian degradation model accounting for ambient inlet delta',
      reasoning: 'Reduces nuisance alerts by 38% while catching subtle hardware degradation weeks earlier than static limits.',
      expectedImpact: '38% reduction in false alerts, estimated $42,000 annual savings in hardware replacement costs.',
      status: 'ACCEPTED',
      author: 'Elena Rostova',
    },
  });

  return project1;
}
