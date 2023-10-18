import { useMemo, useRef } from "react";
import styled from "@emotion/styled";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table/new";
import { Subtitle } from "@leafygreen-ui/typography";
import { useTaskAnalytics } from "analytics";
import { StyledLink } from "components/styles";
import { BaseTable } from "components/Table/BaseTable";
import { size } from "constants/tokens";
import { Unpacked } from "types/utils";
import { GroupedFiles } from "../types";

type GroupedFilesFile = Unpacked<GroupedFiles["files"]>;

// taskAnalytics is the return value of useTaskAnalytics
const columns = (
  taskAnalytics: ReturnType<typeof useTaskAnalytics>
): LGColumnDef<GroupedFilesFile>[] => [
  {
    accessorKey: "name",
    header: "Name",
    size: 60,
    enableSorting: true,
    cell: (value) => (
      <StyledLink
        href={value.row.original.link}
        data-cy="file-link"
        target="_blank"
        onClick={() => {
          taskAnalytics.sendEvent({
            name: "Click Task File Link",
            parsleyAvailable: false,
            fileName: value.getValue() as GroupedFilesFile["name"],
          });
        }}
      >
        {value.getValue()}
      </StyledLink>
    ),
  },
];

interface GroupedFileTableProps {
  files: GroupedFilesFile[];
  taskName?: string;
}
const GroupedFileTable: React.FC<GroupedFileTableProps> = ({
  files,
  taskName,
}) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const taskAnalytics = useTaskAnalytics();

  const memoizedColumns = useMemo(
    () => columns(taskAnalytics),
    [taskAnalytics]
  );
  const table = useLeafyGreenTable<GroupedFilesFile>({
    containerRef: tableContainerRef,
    data: files,
    columns: memoizedColumns,
  });

  return (
    <Container>
      {taskName && <Subtitle>{taskName}</Subtitle>}
      <BaseTable table={table} shouldAlternateRowColor />
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: ${size.m};
`;
export default GroupedFileTable;
