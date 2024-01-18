import { useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { GuideCue } from "@leafygreen-ui/guide-cue";
import { useLeafyGreenTable, LGColumnDef } from "@leafygreen-ui/table";
import Tooltip from "@leafygreen-ui/tooltip";
import { Subtitle } from "@leafygreen-ui/typography";
import Cookies from "js-cookie";
import { useTaskAnalytics } from "analytics";
import { StyledLink } from "components/styles";
import { BaseTable } from "components/Table/BaseTable";
import { SEEN_PARSLEY_FILES_GUIDE_CUE } from "constants/cookies";
import { size } from "constants/tokens";
import { Unpacked } from "types/utils";
import { GroupedFiles } from "../types";

type GroupedFilesFile = Unpacked<GroupedFiles["files"]>;

const columns = (
  taskAnalytics: ReturnType<typeof useTaskAnalytics>,
  options: {
    gudeCueTriggerRef: React.RefObject<HTMLAnchorElement>;
    firstParsleyFileIndex: number;
  },
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
                ref={
                  options && options.firstParsleyFileIndex === value.row.index
                    ? options.gudeCueTriggerRef
                    : null
                }
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
  const [openGuideCue, setOpenGuideCue] = useState(
    Cookies.get(SEEN_PARSLEY_FILES_GUIDE_CUE) !== "true",
  );
  const firstParsleyFileIndex = useMemo(
    () => files.findIndex((file) => file.urlParsley !== null),
    [files],
  );
  const parsleyLinkRef = useRef<HTMLAnchorElement>(null);
  const memoizedColumns = useMemo(
    () =>
      columns(
        taskAnalytics,
        firstParsleyFileIndex !== -1
          ? {
              gudeCueTriggerRef: parsleyLinkRef,
              firstParsleyFileIndex,
            }
          : {
              gudeCueTriggerRef: null,
              firstParsleyFileIndex: -1,
            },
      ),
    [taskAnalytics, firstParsleyFileIndex],
  );
  useEffect(() => {
    // Scroll to the first file that can be opened in parsley on initial render.
    // Since the button may not always be in view, we need to scroll to it.
    if (firstParsleyFileIndex !== -1 && openGuideCue) {
      parsleyLinkRef.current?.scrollIntoView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const table = useLeafyGreenTable<GroupedFilesFile>({
    containerRef: tableContainerRef,
    data: files,
    columns: memoizedColumns,
  });

  return (
    <Container>
      {taskName && <Subtitle>{taskName}</Subtitle>}
      {parsleyLinkRef.current !== null && (
        <GuideCue
          data-cy="migrate-cue"
          open={openGuideCue}
          setOpen={setOpenGuideCue}
          title="New Feature!"
          refEl={parsleyLinkRef}
          numberOfSteps={1}
          currentStep={1}
          onPrimaryButtonClick={() => {
            Cookies.set(SEEN_PARSLEY_FILES_GUIDE_CUE, "true", {
              expires: 365,
            });
            setOpenGuideCue(false);
          }}
        >
          Open your file in Parsley to view it with Parsley&apos;s rich text
          formatting capabilities.
        </GuideCue>
      )}
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
