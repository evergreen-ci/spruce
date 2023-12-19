import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { H2, H2Props, H3, H3Props } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
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
import {
  DistroTaskQueueQuery,
  DistroTaskQueueQueryVariables,
  TaskQueueDistro,
  TaskQueueDistrosQuery,
  TaskQueueDistrosQueryVariables,
} from "gql/generated/types";
import { DISTRO_TASK_QUEUE, TASK_QUEUE_DISTROS } from "gql/queries";
import { usePageTitle } from "hooks";
import { DistroOption } from "./DistroOption";

const TaskQueue = () => {
  const taskQueueAnalytics = useTaskQueueAnalytics();

  const { distro, taskId } = useParams<{ distro: string; taskId?: string }>();
  const navigate = useNavigate();

  const [selectedDistro, setSelectedDistro] = useState(null);
  usePageTitle(`Task Queue - ${distro}`);
  const { data: distrosData } = useQuery<
    TaskQueueDistrosQuery,
    TaskQueueDistrosQueryVariables
  >(TASK_QUEUE_DISTROS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      const { taskQueueDistros } = data;
      const firstDistroInList = taskQueueDistros[0]?.id;
      const defaultDistro = distro ?? firstDistroInList;
      setSelectedDistro(taskQueueDistros.find((d) => d.id === defaultDistro));
      console.log("Redirecting");
      navigate(getTaskQueueRoute(defaultDistro, taskId), { replace: true });
    },
  });

  const { data: taskQueueItemsData, loading } = useQuery<
    DistroTaskQueueQuery,
    DistroTaskQueueQueryVariables
  >(DISTRO_TASK_QUEUE, {
    fetchPolicy: "cache-and-network",
    variables: { distroId: distro },
  });

  const onChangeDistroSelection = (val: { id: string }) => {
    taskQueueAnalytics.sendEvent({ name: "Select Distro", distro: val.id });
    setSelectedDistro(val);
  };

  const handleSearch = (options: { id: string }[], match: string) =>
    options.filter((d) => d.id.toLowerCase().includes(match.toLowerCase()));

  return (
    <PageWrapper>
      <StyledH2>Task Queue</StyledH2>
      {selectedDistro === null ? (
        <Skeleton active />
      ) : (
        <>
          <TableControlOuterRow>
            <SearchableDropdownWrapper>
              <SearchableDropdown
                data-cy="distro-dropdown"
                label="Distro"
                options={distrosData?.taskQueueDistros ?? []}
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
                buttonRenderer={(option: Partial<TaskQueueDistro>) => (
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
            selectedDistro && (
              <TableHeader>
                <StyledH3> {selectedDistro.id} </StyledH3>
                <StyledRouterLink
                  to={getAllHostsRoute({ distroId: selectedDistro.id })}
                >
                  View hosts
                </StyledRouterLink>
              </TableHeader>
            )
          }

          {/* <TaskQueue Table
            taskQueue={taskQueueItemsData?.distroTaskQueue}
            loading={loading}
          /> */}
        </>
      )}
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
