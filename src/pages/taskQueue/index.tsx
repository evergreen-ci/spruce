import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { css } from "@leafygreen-ui/emotion";
import { H2, H2Props, H3, H3Props } from "@leafygreen-ui/typography";
import { useParams, useNavigate } from "react-router-dom";
import { useTaskQueueAnalytics } from "analytics";
import SearchableDropdown from "components/SearchableDropdown";
import {
  TableControlOuterRow,
  PageWrapper,
  StyledRouterLink,
} from "components/styles";
import { getTaskQueueRoute, getAllHostsRoute } from "constants/routes";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  DistroTaskQueueQuery,
  DistroTaskQueueQueryVariables,
  TaskQueueDistro,
  TaskQueueDistrosQuery,
  TaskQueueDistrosQueryVariables,
} from "gql/generated/types";
import { DISTRO_TASK_QUEUE, TASK_QUEUE_DISTROS } from "gql/queries";
import { usePageTitle } from "hooks";
import { useQueryParam } from "hooks/useQueryParam";
import { QueryParams } from "types/task";
import { DistroOption } from "./DistroOption";
import TaskQueueTable from "./TaskQueueTable";

const TaskQueue = () => {
  const taskQueueAnalytics = useTaskQueueAnalytics();

  const { distro } = useParams<{ distro: string }>();
  const [taskId] = useQueryParam<string | undefined>(
    QueryParams.TaskId,
    undefined,
  );
  const navigate = useNavigate();
  const [selectedDistro, setSelectedDistro] = useState<TaskQueueDistro | null>(
    null,
  );
  const dispatchToast = useToastContext();
  usePageTitle(`Task Queue - ${distro}`);
  const { data: distrosData, loading: loadingDistrosData } = useQuery<
    TaskQueueDistrosQuery,
    TaskQueueDistrosQueryVariables
  >(TASK_QUEUE_DISTROS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      const { taskQueueDistros } = data;
      const firstDistroInList = taskQueueDistros[0]?.id;
      const defaultDistro = distro ?? firstDistroInList;
      setSelectedDistro(taskQueueDistros.find((d) => d.id === defaultDistro));
      navigate(getTaskQueueRoute(defaultDistro));
    },
    onError: (err) => {
      dispatchToast.error(`There was an error loading distros: ${err.message}`);
    },
  });

  const { data: taskQueueItemsData, loading } = useQuery<
    DistroTaskQueueQuery,
    DistroTaskQueueQueryVariables
  >(DISTRO_TASK_QUEUE, {
    fetchPolicy: "cache-and-network",
    variables: { distroId: distro },
    skip: !distro,
    onError: (err) => {
      dispatchToast.error(
        `There was an error loading task queue: ${err.message}`,
      );
    },
  });

  const onChangeDistroSelection = (val: TaskQueueDistro) => {
    taskQueueAnalytics.sendEvent({ name: "Select Distro", distro: val.id });
    navigate(getTaskQueueRoute(val.id));
    setSelectedDistro(val);
  };

  const handleSearch = (options: TaskQueueDistro[], match: string) =>
    options.filter((d) => d.id.toLowerCase().includes(match.toLowerCase()));

  return (
    <PageWrapper
      className={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <StyledH2>Task Queue</StyledH2>
      <>
        <TableControlOuterRow>
          <SearchableDropdownWrapper>
            <SearchableDropdown
              data-cy="distro-dropdown"
              label="Distro"
              disabled={loadingDistrosData}
              options={distrosData?.taskQueueDistros}
              searchFunc={handleSearch}
              optionRenderer={(option, onClick) => (
                <DistroOption
                  option={option}
                  key={`distro-select-search-option-${option.id}`}
                  onClick={onClick}
                />
              )}
              onChange={onChangeDistroSelection}
              value={selectedDistro}
              buttonRenderer={(option: TaskQueueDistro) => (
                <DistroLabel>
                  <StyledBadge>{`${option?.taskCount || 0} ${
                    option?.taskCount === 1 ? "TASK" : "TASKS"
                  }`}</StyledBadge>
                  <StyledBadge>{`${option?.hostCount || 0} ${
                    option?.hostCount === 1 ? "HOST" : "HOSTS"
                  }`}</StyledBadge>
                  <DistroName> {option?.id} </DistroName>
                </DistroLabel>
              )}
            />
          </SearchableDropdownWrapper>
        </TableControlOuterRow>

        {
          /* Only show name & link if distro exists. */
          distro && (
            <TableHeader>
              <StyledH3> {distro} </StyledH3>
              <StyledRouterLink to={getAllHostsRoute({ distroId: distro })}>
                View hosts
              </StyledRouterLink>
            </TableHeader>
          )
        }

        {!loading && (
          <TaskQueueTable
            taskQueue={taskQueueItemsData?.distroTaskQueue}
            loading={loading}
            taskId={taskId}
          />
        )}
      </>
    </PageWrapper>
  );
};

const SearchableDropdownWrapper = styled.div`
  width: 400px;
`;
const DistroLabel = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
`;
const StyledBadge = styled(Badge)`
  margin-right: ${size.xs};
`;
const DistroName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`;
const TableHeader = styled.div`
  display: flex;
  align-items: center;
  margin: ${size.m} 0 ${size.s} 0;
`;
const StyledH2 = styled(H2)<H2Props>`
  margin-bottom: ${size.xs};
`;
const StyledH3 = styled(H3)<H3Props>`
  margin-right: ${size.s};
`;

export default TaskQueue;
