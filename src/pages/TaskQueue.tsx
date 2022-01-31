import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { H2 } from "@leafygreen-ui/typography";
import { useParams, useHistory } from "react-router-dom";
import { useTaskQueueAnalytics } from "analytics";
import SearchableDropdown from "components/SearchableDropdown";
import {
  TableContainer,
  TableControlOuterRow,
  PageWrapper,
} from "components/styles";
import { getTaskQueueRoute } from "constants/routes";
import { size } from "constants/tokens";
import {
  TaskQueueDistro,
  TaskQueueDistrosQuery,
  TaskQueueDistrosQueryVariables,
} from "gql/generated/types";
import { TASK_QUEUE_DISTROS } from "gql/queries";
import { DistroOption } from "pages/taskQueue/DistroOption";
import { TaskQueueTable } from "pages/taskQueue/TaskQueueTable";

export const TaskQueue = () => {
  const taskQueueAnalytics = useTaskQueueAnalytics();

  const { distro, taskId } = useParams<{ distro: string; taskId?: string }>();
  const { replace } = useHistory();

  const [selectedDistro, setSelectedDistro] = useState(null);

  const { data: distrosData } = useQuery<
    TaskQueueDistrosQuery,
    TaskQueueDistrosQueryVariables
  >(TASK_QUEUE_DISTROS);

  const distros = useMemo(() => distrosData?.taskQueueDistros ?? [], [
    distrosData,
  ]);
  const firstDistroInList = distros[0]?.id;

  // SET DEFAULT DISTRO
  useEffect(() => {
    const defaultDistro = distro ?? firstDistroInList;
    setSelectedDistro(distros.find((d) => d.id === defaultDistro));

    if (defaultDistro) {
      replace(getTaskQueueRoute(defaultDistro, taskId));
    }
  }, [firstDistroInList, distro, replace, taskId, distros]);
  const onChangeDistroSelection = (val: { id: string }) => {
    taskQueueAnalytics.sendEvent({ name: "Select Distro", distro: val.id });
    replace(getTaskQueueRoute(val.id));
  };

  const handleSearch = (options: { id: string }[], match: string) =>
    options.filter((d) => d.id.toLowerCase().includes(match.toLowerCase()));

  return (
    <PageWrapper>
      <H2>Task Queue</H2>
      <TableControlOuterRow>
        <SearchableDropdownWrapper>
          <SearchableDropdown
            data-cy="distro-dropdown"
            label="Distro"
            options={distros}
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
                <StyledBadge>{`${option?.taskCount} ${
                  option?.taskCount === 1 ? "TASK" : "TASKS"
                }`}</StyledBadge>
                <StyledBadge>{`${option?.hostCount} ${
                  option?.hostCount === 1 ? "HOST" : "HOSTS"
                }`}</StyledBadge>
                <DistroName> {option?.id} </DistroName>
              </DistroLabel>
            )}
          />
        </SearchableDropdownWrapper>
      </TableControlOuterRow>

      <TableContainer hide={false}>
        <TaskQueueTable />
      </TableContainer>
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
  margin-right: ${size.xs}px;
`;
const DistroName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`;
