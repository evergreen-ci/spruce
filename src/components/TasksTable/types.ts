export type TaskTableInfo = {
  baseTask?: {
    id: string;
    execution: number;
    status: string;
  };
  buildVariant?: string;
  buildVariantDisplayName?: string;
  dependsOn?: Array<{ name: string }>;
  displayName: string;
  execution: number;
  executionTasksFull?: TaskTableInfo[];
  id: string;
  projectIdentifier?: string;
  status: string;
};
