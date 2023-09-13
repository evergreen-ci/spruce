import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { SearchInput } from "@leafygreen-ui/search-input";
import { Skeleton, TableSkeleton } from "@leafygreen-ui/skeleton-loader";
import { TablePlaceholder } from "components/Table/TablePlaceholder";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import { TaskFilesQuery, TaskFilesQueryVariables } from "gql/generated/types";
import { GET_TASK_FILES } from "gql/queries";
import GroupedFilesTable from "./GroupedFilesTable";
import { filterGroupedFiles } from "./utils";

interface FilesTableTabProps {
  taskId: string;
  execution: number;
}
const FilesTableTab: React.FC<FilesTableTabProps> = ({ execution, taskId }) => {
  const [search, setSearch] = useState("");
  const dispatchToast = useToastContext();
  const { data, loading } = useQuery<TaskFilesQuery, TaskFilesQueryVariables>(
    GET_TASK_FILES,
    {
      variables: {
        taskId,
        execution,
      },
      onError: (err) => {
        dispatchToast.error(`Unable to load task files: ${err}`);
      },
    }
  );
  const { taskFiles } = data?.task ?? {};

  const { groupedFiles = [] } = taskFiles ?? {};
  const filteredGroupedFiles = filterGroupedFiles(groupedFiles, search);

  // We only want to show the file group name if there are multiple file groups.
  const hasMultipleFileGroups = groupedFiles.length > 1;

  return loading ? (
    <FilesTableTabSkeleton />
  ) : (
    <>
      <StyledSearchInput
        aria-label="Search file names"
        placeholder="Search file names"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        data-cy="file-search-input"
      />
      {filteredGroupedFiles.length === 0 && (
        <TablePlaceholder message="No files found" />
      )}
      {filteredGroupedFiles.map((groupedFile) => (
        <GroupedFilesTable
          key={groupedFile?.taskName}
          files={groupedFile?.files}
          taskName={hasMultipleFileGroups && groupedFile?.taskName}
        />
      ))}
    </>
  );
};

const FilesTableTabSkeleton = () => (
  <>
    <Skeleton />
    <TableSkeleton numCols={1} numRows={5} />
  </>
);
const StyledSearchInput = styled(SearchInput)`
  margin-bottom: ${size.m};
  width: 400px;
`;
export default FilesTableTab;
