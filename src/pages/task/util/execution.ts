// in a task's back-end state, the execution will be 0-indexed,
// but will be 1-indexed wherever it is visible to users
export const ExecutionAsDisplay = (execution: number) => execution + 1;
export const ExecutionAsData = (execution: number) => execution - 1;
