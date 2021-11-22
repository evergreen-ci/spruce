import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { H2, Subtitle } from "@leafygreen-ui/typography";
import { useParams, useHistory } from "react-router-dom";
import { useTaskQueueAnalytics } from "analytics";
import SelectSearch from "components/SelectSearch";
import {
  TableContainer,
  TableControlOuterRow,
  PageWrapper,
} from "components/styles";
import { getTaskQueueRoute } from "constants/routes";
import {
  TaskQueueDistrosQuery,
  TaskQueueDistrosQueryVariables,
  TaskQueueDistro,
} from "gql/generated/types";
import { TASK_QUEUE_DISTROS } from "gql/queries";
import { DistroOption } from "pages/taskQueue/DistroOption";
import { TaskQueueTable } from "pages/taskQueue/TaskQueueTable";

export const TaskQueue = () => {
  const taskQueueAnalytics = useTaskQueueAnalytics();

  const { distro, taskId } = useParams<{ distro: string; taskId?: string }>();
  const { replace } = useHistory();

  const [selectedDistro, setSelectedDistro] = useState(null);

  const { data: distrosData, loading } = useQuery<
    TaskQueueDistrosQuery,
    TaskQueueDistrosQueryVariables
  >(TASK_QUEUE_DISTROS);

  const distros = distrosData?.taskQueueDistros ?? [];
  const firstDistroInList = distros[0]?.id;

  // SET DEFAULT DISTRO
  useEffect(() => {
    const defaultDistro = distro ?? firstDistroInList;

    setSelectedDistro(distros.find((d) => d.id === defaultDistro));

    if (defaultDistro) {
      replace(getTaskQueueRoute(defaultDistro, taskId));
    }
  }, [firstDistroInList, distro, replace, taskId]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChangeDistroSelection = (val: any) => {
    taskQueueAnalytics.sendEvent({ name: "Select Distro", distro: val });
    replace(getTaskQueueRoute(val));
  };

  const handleSearch = (options: TaskQueueDistro[], match: string) =>
    options.filter((d) => d.id.toLowerCase().includes(match.toLowerCase()));

  return (
    <PageWrapper>
      <H2>Task Queue</H2>
      <TableControlOuterRow>
        <SelectSearch
          onChange={onChangeDistroSelection}
          searchFunc={handleSearch}
          searchPlaceholder="Search for Distro"
          options={distros}
          optionRenderer={(option: TaskQueueDistro, onClick) => (
            <DistroOption
              taskCount={option.taskCount}
              hostCount={option.hostCount}
              id={option.id}
              key={`distro-select-search-option-${option.id}`}
              onClick={onClick}
            />
          )}
        />
      </TableControlOuterRow>
      {!loading && (
        <DistroLabel>
          <Subtitle> {selectedDistro?.id} </Subtitle>
          <StyledBadge>{`${selectedDistro?.taskCount} ${
            selectedDistro?.taskCount === 1 ? "TASK" : "TASKS"
          }`}</StyledBadge>
          <StyledBadge>{`${selectedDistro?.hostCount} ${
            selectedDistro?.hostCount === 1 ? "HOST" : "HOSTS"
          }`}</StyledBadge>
        </DistroLabel>
      )}
      <TableContainer hide={false}>
        <TaskQueueTable />
      </TableContainer>
    </PageWrapper>
  );
};

const DistroLabel = styled.div`
  padding-top: 16px;
  padding-bottom: 24px;
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

const StyledBadge = styled(Badge)`
  display: inline-flex;
  justify-content: center;
  width: 60px;
  text-align: center;
  margin-left: 24px;
`;
