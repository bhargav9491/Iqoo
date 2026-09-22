export type TaskStatus = 'Not Started' | 'In Progress' | 'Blocked' | 'Review' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  project: string;
  owner: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
  description: string;
  subtasks: Subtask[];
  updatedAt: string;
}

export interface Decision {
  id: string;
  title: string;
  status: 'ACCEPTED' | 'REJECTED' | 'PROPOSED';
  problem: string;
  rejectedOption: string;
  reasonRejected: string;
  selectedApproach: string;
  evidence: string;
  date: string;
}

export type StepStatus = 'Verified' | 'Deviation' | 'Active' | 'Sign-off Required' | 'Pending';

export interface ProcedureStep {
  id: string;
  text: string;
  status: StepStatus;
}

export interface Procedure {
  id: string;
  title: string;
  steps: ProcedureStep[];
  warning?: string;
  reason?: string;
}

export interface Activity {
  id: string;
  text: string;
  time: string;
  category: 'Tasks' | 'Decisions' | 'Procedures' | 'Alerts' | 'Handover';
}

export interface WorkMemoryContext {
  project: string;
  branch: string;
  lastActivityTime: string;
  progress: number;
  lastCompleted: string;
  currentBlocker: string;
  lastCommand?: string;
  failedAttempt: string;
  failedReason?: string;
  decision?: string;
  nextStep: string;
  recommendedAction?: string;
}

export type WorkspaceType = 'Engineering Demo' | 'MBA Student Demo';
