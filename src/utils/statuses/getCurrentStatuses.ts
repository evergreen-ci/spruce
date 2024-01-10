import { TreeDataEntry } from "components/TreeSelect";

const allKey = "all";

/**
 * `getCurrentStatuses` returns a list of statuses that are currently selected in a TreeSelect tree.
 * @param statuses - list of statuses to filter
 * @param treeData - treeData to filter by
 * @returns - a list of statuses that are currently selected in the TreeSelect.
 */
export const getCurrentStatuses = (
  statuses: string[],
  treeData: TreeDataEntry[],
): TreeDataEntry[] => {
  const currentStatuses = [];
  treeData.forEach((status) => {
    const { children, key } = status;
    if (key === allKey) {
      currentStatuses.push(status);
    }
    if (children) {
      const currentChildStatuses = getCurrentStatuses(statuses, children);
      if (currentChildStatuses.length > 1) {
        const newStatus = { ...status };
        newStatus.children = currentChildStatuses;
        currentStatuses.push(newStatus);
      }
      if (currentChildStatuses.length === 1) {
        currentStatuses.push(currentChildStatuses[0]);
      }
    }
    if (statuses.includes(key)) {
      currentStatuses.push(status);
    }
  });
  return currentStatuses;
};
