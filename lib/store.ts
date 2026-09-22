import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Task,
  Decision,
  Procedure,
  Activity,
  WorkMemoryContext,
  WorkspaceType
} from './types';
import {
  engineeringTasks,
  engineeringDecisions,
  engineeringProcedures,
  engineeringMemory,
  engineeringActivity,
  mbaTasks,
  mbaDecisions,
  mbaProcedures,
  mbaMemory,
  mbaActivity
} from './mockData';

interface AppState {
  workspace: WorkspaceType;
  demoMode: boolean;
  tasks: Task[];
  decisions: Decision[];
  procedures: Procedure[];
  memory: WorkMemoryContext;
  activity: Activity[];
  
  // Settings
  groundedResponses: boolean;
  humanApprovalGates: boolean;
  evidenceRequirement: boolean;
  
  // Actions
  setWorkspace: (workspace: WorkspaceType) => void;
  resetDemoData: () => void;
  
  // Task Actions
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  
  // Settings Actions
  toggleGroundedResponses: () => void;
  toggleHumanApprovalGates: () => void;
  toggleEvidenceRequirement: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      workspace: 'Engineering Demo',
      demoMode: true,
      
      tasks: engineeringTasks,
      decisions: engineeringDecisions,
      procedures: engineeringProcedures,
      memory: engineeringMemory,
      activity: engineeringActivity,
      
      groundedResponses: true,
      humanApprovalGates: true,
      evidenceRequirement: true,
      
      setWorkspace: (workspace) => set((state) => {
        if (workspace === 'Engineering Demo') {
          return {
            workspace,
            tasks: engineeringTasks,
            decisions: engineeringDecisions,
            procedures: engineeringProcedures,
            memory: engineeringMemory,
            activity: engineeringActivity
          };
        } else {
          return {
            workspace,
            tasks: mbaTasks,
            decisions: mbaDecisions,
            procedures: mbaProcedures,
            memory: mbaMemory,
            activity: mbaActivity
          };
        }
      }),
      
      resetDemoData: () => set((state) => {
        if (state.workspace === 'Engineering Demo') {
          return {
            tasks: engineeringTasks,
            decisions: engineeringDecisions,
            procedures: engineeringProcedures,
            memory: engineeringMemory,
            activity: engineeringActivity
          };
        } else {
          return {
            tasks: mbaTasks,
            decisions: mbaDecisions,
            procedures: mbaProcedures,
            memory: mbaMemory,
            activity: mbaActivity
          };
        }
      }),
      
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (updatedTask) => set((state) => ({
        tasks: state.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
      })),
      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== taskId)
      })),
      
      toggleGroundedResponses: () => set(state => ({ groundedResponses: !state.groundedResponses })),
      toggleHumanApprovalGates: () => set(state => ({ humanApprovalGates: !state.humanApprovalGates })),
      toggleEvidenceRequirement: () => set(state => ({ evidenceRequirement: !state.evidenceRequirement })),
    }),
    {
      name: 'aurevex-storage',
    }
  )
);
