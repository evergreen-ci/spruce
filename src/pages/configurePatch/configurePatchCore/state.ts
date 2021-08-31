export type DownstreamPatchState = {
  [alias: string]: boolean;
};
export type TasksState = {
  [task: string]: boolean;
};
export type VariantTasksState = {
  [variant: string]: TasksState;
};
