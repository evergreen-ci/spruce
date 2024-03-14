import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { SearchInput } from "@leafygreen-ui/search-input";
import { Skeleton, TableSkeleton } from "@leafygreen-ui/skeleton-loader";
import { Body } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import { TaskFilesQuery, TaskFilesQueryVariables } from "gql/generated/types";
import { TASK_FILES } from "gql/queries";
import GroupedFileTable from "./GroupedFileTable";
import { filterGroupedFiles } from "./utils";

interface FileTableProps {
  taskId: string;
  execution: number;
}
const FileTable: React.FC<FileTableProps> = ({ execution, taskId }) => {
  const [search, setSearch] = useState("");
  const dispatchToast = useToastContext();
  const { data, loading } = useQuery<TaskFilesQuery, TaskFilesQueryVariables>(
    TASK_FILES,
    {
      variables: {
        taskId,
        execution,
      },
      onError: (err) => {
        dispatchToast.error(`Unable to load task files: ${err}`);
      },
    },
  );
  const { files } = data?.task ?? {};
  const { groupedFiles = [] } = files ?? {};
  const filteredGroupedFiles = filterGroupedFiles(groupedFiles, search);

  // We only want to show the file group name if there are multiple file groups.
  const hasMultipleFileGroups = groupedFiles.length > 1;

  return loading ? (
    <FilesTableSkeleton />
  ) : (
    <>
      <StyledSearchInput
        aria-label="Search file names"
        placeholder="Search file names"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        data-cy="file-search-input"
      />
      {filteredGroupedFiles.length === 0 && <Body>No files found</Body>}
      {filteredGroupedFiles.map((groupedFile) => (
        <GroupedFileTable
          key={groupedFile?.taskName}
          files={groupedFile?.files}
          taskName={hasMultipleFileGroups && groupedFile?.taskName}
        />
      ))}
    </>
  );
};

const FilesTableSkeleton = () => (
  <>
    <Skeleton />
    <TableSkeleton numCols={1} numRows={5} />
  </>
);
const StyledSearchInput = styled(SearchInput)`
  margin-left: ${size.xxs};
  margin-bottom: ${size.m};
  width: 400px;
`;
export default FileTable;
