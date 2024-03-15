import { useReducer } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { InlineCode } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import { Accordion } from "components/Accordion";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import { getVersionRoute } from "constants/routes";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  Parameter,
  SortDirection,
  SortOrder,
  TaskSortCategory,
  VersionTasksQuery,
  VersionTasksQueryVariables,
} from "gql/generated/types";
import { VERSION_TASKS } from "gql/queries";
import { usePolling } from "hooks";
import { PatchStatus } from "types/patch";
import { string } from "utils";
import { ParametersModal } from "../ParametersModal";
import { DownstreamProjectTable } from "./DownstreamProjectTable";
import { reducer } from "./reducer";

const { shortenGithash } = string;

interface DownstreamProjectAccordionProps {
  baseVersionID: string;
  githash: string;
  projectName: string;
  status: string;
  taskCount: number;
  childPatchId: string;
  parameters: Parameter[];
}

export const DownstreamProjectAccordion: React.FC<
  DownstreamProjectAccordionProps
> = ({
  baseVersionID,
  childPatchId,
  githash,
  parameters,
  projectName,
  status,
  taskCount,
}) => {
  const dispatchToast = useToastContext();

  const defaultSorts: SortOrder[] = [
    {
      Key: TaskSortCategory.Status,
      Direction: SortDirection.Asc,
    },
    {
      Key: TaskSortCategory.BaseStatus,
      Direction: SortDirection.Desc,
    },
  ];

  const [state, dispatch] = useReducer(reducer, {
    baseStatuses: [],
    limit: 10,
    page: 0,
    statuses: [],
    taskName: "",
    variant: "",
    sorts: defaultSorts,
  });

  const { baseStatuses, limit, page, sorts, statuses, taskName, variant } =
    state;

  const { data, refetch, startPolling, stopPolling } = useQuery<
    VersionTasksQuery,
    VersionTasksQueryVariables
  >(VERSION_TASKS, {
    variables: {
      versionId: childPatchId,
      taskFilterOptions: {
        limit,
        page,
        statuses,
        taskName,
        variant,
        sorts,
        baseStatuses,
      },
    },
    fetchPolicy: "cache-and-network",
    onError: (err) => {
      dispatchToast.error(`Error fetching downstream tasks ${err}`);
    },
  });
  usePolling({ startPolling, stopPolling, refetch });

  const showSkeleton = !data;
  const { version } = data || {};
  const { isPatch, tasks } = version || {};
  const { count = 0, data: tasksData = [] } = tasks || {};

  return (
    <Wrapper data-cy="project-accordion">
      <Accordion
        defaultOpen={status === PatchStatus.Failed}
        title={
          <>
            <ProjectTitleWrapper>
              <span data-cy="project-title">{projectName}</span>
            </ProjectTitleWrapper>
            <PatchStatusBadge status={status} />
          </>
        }
        titleTag={FlexContainer}
        subtitle={
          <DownstreamMetadata
            baseVersionID={baseVersionID}
            githash={githash}
            parameters={parameters}
          />
        }
      >
        <AccordionContents>
          <DownstreamProjectTable
            childPatchId={childPatchId}
            count={count}
            dispatch={dispatch}
            isPatch={isPatch}
            limit={limit}
            loading={showSkeleton}
            page={page}
            taskCount={taskCount}
            tasks={tasksData}
          />
        </AccordionContents>
      </Accordion>
    </Wrapper>
  );
};

interface DownstreamMetadataProps {
  baseVersionID: string;
  githash: string;
  parameters: Parameter[];
}
const DownstreamMetadata: React.FC<DownstreamMetadataProps> = ({
  baseVersionID,
  githash,
  parameters,
}) => (
  <FlexRow>
    <PaddedText>
      Base commit:{" "}
      <InlineCode
        as={Link}
        data-cy="downstream-base-commit"
        to={getVersionRoute(baseVersionID)}
      >
        {shortenGithash(githash)}
      </InlineCode>
    </PaddedText>
    <ParametersModal parameters={parameters} />
  </FlexRow>
);

const PaddedText = styled.p`
  margin-right: ${size.xs};
`;
const ProjectTitleWrapper = styled.div`
  margin-right: ${size.xs};
  font-weight: bold;
`;

const AccordionContents = styled.div`
  margin: ${size.s} 0;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Wrapper = styled.div`
  margin: ${size.xs} 0;
`;
