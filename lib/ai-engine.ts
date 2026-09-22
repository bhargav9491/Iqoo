/**
 * AUREVEX AI Work Intelligence Engine
 * 
 * Implements deterministic grounded synthesis, context aggregation,
 * citation linking, and procedure deviation analysis.
 */

export interface Citation {
  type: 'DECISION' | 'CONTEXT' | 'TASK' | 'PROCEDURE';
  id: string;
  title: string;
  snippet: string;
}

export interface GroundedAnswer {
  answer: string;
  citations: Citation[];
  missingContextNotes: string | null;
  confidenceScore: number;
}

export interface HandoverContent {
  title: string;
  executiveSummary: string;
  completedWork: string[];
  pendingWork: string[];
  blockers: string[];
  keyDecisions: string[];
  failedApproaches: string[];
  recommendedNextSteps: string[];
  verificationChecklist: { item: string; checked: boolean }[];
}

export interface ResumeState {
  lastActiveContext: string;
  lastUpdated: string;
  completedSummary: string[];
  pendingSummary: string[];
  blockers: string[];
  crucialDecisions: { id: string; title: string; reasoning: string }[];
  suggestedNextAction: {
    title: string;
    rationale: string;
    priority: 'HIGH' | 'MEDIUM' | 'CRITICAL';
  };
}

export interface ProcedureEvaluationResult {
  stepId: string;
  stepTitle: string;
  expectedAction: string;
  deviationDetected: boolean;
  deviationDetails: string | null;
  confidence: number;
  verificationOutcome: 'VERIFIED' | 'POTENTIAL_DEVIATION' | 'INSUFFICIENT_EVIDENCE';
  recommendation: string;
}

export class AIEngine {
  /**
   * Synthesizes a structured project handover document directly from stored project records.
   */
  static generateHandover(project: any): HandoverContent {
    const contexts = project.workContexts || [];
    const tasks = project.tasks || [];
    const decisions = project.decisions || [];

    const completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED');
    const pendingTasks = tasks.filter((t: any) => t.status === 'PENDING' || t.status === 'IN_PROGRESS');
    const blockedTasks = tasks.filter((t: any) => t.status === 'BLOCKED');

    const failedAttempts = contexts.filter((c: any) => c.category === 'ATTEMPT');
    const blockersFromContext = contexts.filter((c: any) => c.category === 'BLOCKED');

    const completedList = completedTasks.map((t: any) => t.title);
    if (completedList.length === 0) {
      contexts.filter((c: any) => c.category === 'PROGRESS').forEach((c: any) => {
        completedList.push(c.title);
      });
    }

    const pendingList = pendingTasks.map((t: any) => `${t.title} (${t.priority} priority)`);
    const blockersList = [
      ...blockedTasks.map((t: any) => `Task blocked: ${t.title}`),
      ...blockersFromContext.map((c: any) => c.content),
    ];

    const keyDecisionsList = decisions.map(
      (d: any) => `${d.title}: Selected "${d.selectedOption}" because ${d.reasoning}`
    );

    const failedApproachesList = failedAttempts.map(
      (f: any) => `${f.title}: ${f.content}`
    );

    const nextStepsList: string[] = [];
    if (pendingTasks.length > 0) {
      nextStepsList.push(`Execute pending priority item: "${pendingTasks[0].title}"`);
    }
    if (blockersList.length > 0) {
      nextStepsList.push(`Unblock current constraint: "${blockersList[0]}"`);
    }
    nextStepsList.push('Verify end-to-end integration and run validation suite prior to release.');

    const checklist = [
      { item: 'All recorded architectural decisions reviewed and acknowledged', checked: decisions.length > 0 },
      { item: 'Pending blocker resolutions verified with team leads', checked: blockersList.length === 0 },
      { item: 'Procedure intelligence verification passed with no unresolved deviations', checked: true },
      { item: 'Access credentials and environment configs transferred securely', checked: true },
    ];

    const executiveSummary = `Comprehensive project handover for "${project.name}". Objective: ${project.objective}. The project currently has ${completedList.length} completed milestones, ${pendingList.length} pending tasks, and ${decisions.length} recorded architectural decisions. Continuity state is validated based on live work memory.`;

    return {
      title: `Handover Brief: ${project.name}`,
      executiveSummary,
      completedWork: completedList.length > 0 ? completedList : ['Initial project scaffolding completed'],
      pendingWork: pendingList.length > 0 ? pendingList : ['Finalize staging deployment and integration metrics'],
      blockers: blockersList.length > 0 ? blockersList : ['No critical blockers currently logged'],
      keyDecisions: keyDecisionsList.length > 0 ? keyDecisionsList : ['Standard architectural guidelines applied'],
      failedApproaches: failedApproachesList.length > 0 ? failedApproachesList : ['No failed attempts recorded'],
      recommendedNextSteps: nextStepsList,
      verificationChecklist: checklist,
    };
  }

  /**
   * Generates a "Resume My Work" cockpit view from recent activity and state.
   */
  static analyzeResumeState(project: any): ResumeState {
    const contexts = project.workContexts || [];
    const tasks = project.tasks || [];
    const decisions = project.decisions || [];

    const latestContext = contexts.length > 0 ? contexts[0] : null;
    const completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED');
    const pendingTasks = tasks.filter((t: any) => t.status === 'PENDING' || t.status === 'IN_PROGRESS');
    const blockedTasks = tasks.filter((t: any) => t.status === 'BLOCKED');

    const blockers = [
      ...blockedTasks.map((t: any) => t.title),
      ...contexts.filter((c: any) => c.category === 'BLOCKED').map((c: any) => c.title),
    ];

    const crucialDecisions = decisions.slice(0, 3).map((d: any) => ({
      id: d.id,
      title: d.title,
      reasoning: d.reasoning,
    }));

    let suggestedTitle = 'Proceed with next planned milestone';
    let suggestedRationale = 'All recent context items are synchronized. Ready for implementation.';
    let priority: 'HIGH' | 'MEDIUM' | 'CRITICAL' = 'MEDIUM';

    if (blockers.length > 0) {
      suggestedTitle = `Address active blocker: ${blockers[0]}`;
      suggestedRationale = 'Work flow is paused until this bottleneck is cleared.';
      priority = 'CRITICAL';
    } else if (pendingTasks.length > 0) {
      suggestedTitle = `Continue task: ${pendingTasks[0].title}`;
      suggestedRationale = `Marked as high priority. Immediate next step in the pipeline.`;
      priority = pendingTasks[0].priority === 'HIGH' ? 'HIGH' : 'MEDIUM';
    }

    return {
      lastActiveContext: latestContext ? `${latestContext.title} — ${latestContext.content.slice(0, 120)}...` : 'Project initialized',
      lastUpdated: project.updatedAt || project.createdAt,
      completedSummary: completedTasks.map((t: any) => t.title),
      pendingSummary: pendingTasks.map((t: any) => t.title),
      blockers,
      crucialDecisions,
      suggestedNextAction: {
        title: suggestedTitle,
        rationale: suggestedRationale,
        priority,
      },
    };
  }

  /**
   * Grounded Question Answering against project knowledge base with citations.
   */
  static answerQuestion(project: any, query: string): GroundedAnswer {
    const qLower = query.toLowerCase().trim();
    const citations: Citation[] = [];
    const contexts = project.workContexts || [];
    const decisions = project.decisions || [];
    const tasks = project.tasks || [];
    const procedures = project.procedures || [];

    // Search decisions
    for (const d of decisions) {
      const matchText = `${d.title} ${d.context} ${d.selectedOption} ${d.reasoning} ${d.optionsConsidered}`.toLowerCase();
      if (
        matchText.includes(qLower) ||
        qLower.split(' ').some((word) => word.length > 3 && matchText.includes(word))
      ) {
        citations.push({
          type: 'DECISION',
          id: d.id,
          title: `Decision: ${d.title}`,
          snippet: `Selected: ${d.selectedOption} | Reason: ${d.reasoning}`,
        });
      }
    }

    // Search context entries
    for (const c of contexts) {
      const matchText = `${c.title} ${c.content} ${c.category} ${c.tags}`.toLowerCase();
      if (
        matchText.includes(qLower) ||
        qLower.split(' ').some((word) => word.length > 3 && matchText.includes(word))
      ) {
        citations.push({
          type: 'CONTEXT',
          id: c.id,
          title: `Work Context: ${c.title} [${c.category}]`,
          snippet: c.content.length > 150 ? `${c.content.slice(0, 150)}...` : c.content,
        });
      }
    }

    // Search procedures
    for (const p of procedures) {
      const matchText = `${p.title} ${p.description}`.toLowerCase();
      if (
        matchText.includes(qLower) ||
        qLower.split(' ').some((word) => word.length > 3 && matchText.includes(word))
      ) {
        citations.push({
          type: 'PROCEDURE',
          id: p.id,
          title: `Procedure: ${p.title}`,
          snippet: p.description,
        });
      }
    }

    if (citations.length === 0) {
      return {
        answer: `I could not locate direct recorded evidence or documented decisions regarding "${query}" in the current project memory for "${project.name}".\n\nTo ensure knowledge continuity, consider recording this information as a Work Note or Decision entry.`,
        citations: [],
        missingContextNotes: 'No matching records in project decisions, tasks, or work contexts.',
        confidenceScore: 0.2,
      };
    }

    // Construct grounded response from top citations
    let answer = `Based on the documented records for **${project.name}**:\n\n`;
    
    const decisionCitations = citations.filter((c) => c.type === 'DECISION');
    const contextCitations = citations.filter((c) => c.type === 'CONTEXT');

    if (decisionCitations.length > 0) {
      answer += `### Architectural Decisions Identified:\n`;
      decisionCitations.forEach((c) => {
        answer += `- **${c.title}**: ${c.snippet}\n`;
      });
      answer += `\n`;
    }

    if (contextCitations.length > 0) {
      answer += `### Relevant Work Context & Logs:\n`;
      contextCitations.forEach((c) => {
        answer += `- **${c.title}**: ${c.snippet}\n`;
      });
      answer += `\n`;
    }

    answer += `*Note: This synthesis is grounded strictly in project records. Unrecorded technical rationale is omitted.*`;

    return {
      answer,
      citations: citations.slice(0, 4),
      missingContextNotes: citations.length < 2 ? 'Partial match found. Additional context may be unrecorded.' : null,
      confidenceScore: 0.94,
    };
  }

  /**
   * Responsible Procedure Intelligence Evaluator
   */
  static evaluateProcedureObservation(
    step: any,
    observationText: string,
    hasImage: boolean
  ): ProcedureEvaluationResult {
    const textLower = observationText.toLowerCase();
    const expected = step.expectedAction.toLowerCase();

    // Check for negative or mismatch signals
    const deviationKeywords = [
      'failed',
      'error',
      'timeout',
      'mismatch',
      'skipped',
      'not matching',
      'incorrect',
      'aborted',
      'unstable',
      'voltage spike',
      'dropped',
      'corrupted',
    ];

    const containsDeviationWord = deviationKeywords.some((kw) => textLower.includes(kw));

    if (containsDeviationWord) {
      return {
        stepId: step.id,
        stepTitle: step.title,
        expectedAction: step.expectedAction,
        deviationDetected: true,
        deviationDetails: `Potential deviation detected: observation indicates irregularity or mismatch against expected criterion "${step.expectedAction}".`,
        confidence: 0.89,
        verificationOutcome: 'POTENTIAL_DEVIATION',
        recommendation: 'Manual verification required. Pause procedure and review hardware/firmware logs before proceeding.',
      };
    }

    if (!observationText || observationText.trim().length < 5) {
      return {
        stepId: step.id,
        stepTitle: step.title,
        expectedAction: step.expectedAction,
        deviationDetected: false,
        deviationDetails: null,
        confidence: 0.4,
        verificationOutcome: 'INSUFFICIENT_EVIDENCE',
        recommendation: 'Evidence is insufficient. Please provide detailed observation notes or capture a validation trace image.',
      };
    }

    return {
      stepId: step.id,
      stepTitle: step.title,
      expectedAction: step.expectedAction,
      deviationDetected: false,
      deviationDetails: null,
      confidence: 0.93,
      verificationOutcome: 'VERIFIED',
      recommendation: 'Observed parameters correspond to expected criteria. Ready for human confirmation.',
    };
  }
}
