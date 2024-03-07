import { useMemo, useRef } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import Tooltip from "@leafygreen-ui/tooltip";
import { Subtitle } from "@leafygreen-ui/typography";
import { useTaskAnalytics } from "analytics";
import { StyledLink } from "components/styles";
import { BaseTable } from "components/Table/BaseTable";
import { size } from "constants/tokens";
import { Unpacked } from "types/utils";
import { GroupedFiles } from "../types";

type GroupedFilesFile = Unpacked<GroupedFiles["files"]>;

const columns = (
  taskAnalytics: ReturnType<typeof useTaskAnalytics>,
): LGColumnDef<GroupedFilesFile>[] => [
  {
    accessorKey: "name",
    header: "Name",
    size: 100,
    enableSorting: true,
    cell: (value) => {
      const fileName = value.getValue() as GroupedFilesFile["name"];
      return (
        <CellContainer>
          <StyledLink
            href={value.row.original.link}
            data-cy="file-link"
            target="_blank"
            onClick={() => {
              taskAnalytics.sendEvent({
                name: "Click Task File Link",
                parsleyAvailable: value.row.original.urlParsley !== null,
                fileName,
              });
            }}
          >
            {fileName}
          </StyledLink>
          <Tooltip
            trigger={
              <Button
                href={value.row.original.urlParsley}
                data-cy="parsley-link"
                target="_blank"
                disabled={value.row.original.urlParsley === null}
                size="small"
                onClick={() => {
                  taskAnalytics.sendEvent({
                    name: "Click Task File Parsley Link",
                    fileName,
                  });
                }}
              >
                Parsley
              </Button>
            }
            enabled={value.row.original.urlParsley === null}
            align="top"
            justify="middle"
          >
            Only plain text files can be opened in Parsley.
          </Tooltip>
        </CellContainer>
      );
    },
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
    [taskAnalytics],
  );

  const table = useLeafyGreenTable<GroupedFilesFile>({
    containerRef: tableContainerRef,
    data: files,
    columns: memoizedColumns,
    defaultColumn: {
      enableColumnFilter: false,
    },
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

const CellContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
export default GroupedFileTable;
