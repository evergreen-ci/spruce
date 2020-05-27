import { SortDirection } from "gql/generated/types";
import { ColumnProps } from "antd/es/table";

export const useSetColumnDefaultSortOrder = <T>(
  columns: ColumnProps<T>[],
  category: string,
  direction: string
) => {
  const targetColumnHeader = columns.find(({ key }) => key === category);
  if (targetColumnHeader) {
    // eslint-disable-next-line no-param-reassign
    targetColumnHeader.defaultSortOrder =
      direction === SortDirection.Asc ? "ascend" : "descend";
  }
};
