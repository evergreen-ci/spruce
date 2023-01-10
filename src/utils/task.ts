// in a task's back-end state, the execution will be 0-indexed,
// but will be 1-indexed wherever it is visible to users
export const executionAsDisplay = (execution: number) => execution + 1;
