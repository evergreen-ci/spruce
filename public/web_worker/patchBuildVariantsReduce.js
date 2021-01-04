// Iterate through PatchBuildVariants and determine if a task should be
// selected or not based on if the task status correlates with the 2 filters.
// if 1 of the 2 filters is empty, ignore the empty filter
onmessage = function (e) {
  const {
    patchBuildVariants,
    patchStatusFilterTerm,
    baseStatusFilterTerm,
    selectedTasks,
  } = e.data;
  // the following logic is captured in usePatchStatusSelect.ts
  // in the case where web workers are unavailable
  const baseStatuses = new Set(baseStatusFilterTerm);
  const statuses = new Set(patchStatusFilterTerm);
  const nextState =
    patchBuildVariants?.reduce(
      (accumA, patchBuildVariant) =>
        patchBuildVariant.tasks?.reduce(
          (accumB, task) => ({
            ...accumB,
            [task.id]:
              (!!patchStatusFilterTerm?.length ||
                !!baseStatusFilterTerm?.length) &&
              (patchStatusFilterTerm?.length
                ? statuses.has(task.status)
                : true) &&
              (baseStatusFilterTerm?.length
                ? baseStatuses.has(task.baseStatus)
                : true),
          }),
          accumA
        ),
      { ...selectedTasks }
    ) ?? {};

  postMessage(nextState);
};
