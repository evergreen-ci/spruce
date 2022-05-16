import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { H2, H3 } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useTaskQueueAnalytics } from "analytics";
import SearchableDropdown from "components/SearchableDropdown";
import {
  TableContainer,
  TableControlOuterRow,
  PageWrapper,
  StyledRouterLink,
} from "components/styles";
import { getTaskQueueRoute, getAllHostsRoute } from "constants/routes";
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
  const navigate = useNavigate();

  const [selectedDistro, setSelectedDistro] = useState(null);

  const { data: distrosData } = useQuery<
    TaskQueueDistrosQuery,
    TaskQueueDistrosQueryVariables
  >(TASK_QUEUE_DISTROS);

  const distros = useMemo(() => distrosData?.taskQueueDistros ?? [], [
    distrosData,
  ]);
  const firstDistroInList = distros[0]?.id;

  // SET DEFAULT DISTRO AFTER DISTROS HAVE BEEN OBTAINED
  useEffect(() => {
    if (distros.length) {
      const defaultDistro = distro ?? firstDistroInList;
      setSelectedDistro(distros.find((d) => d.id === defaultDistro));
      navigate(getTaskQueueRoute(defaultDistro, taskId), { replace: true });
    }
  }, [firstDistroInList, distro, navigate, taskId, distros]);

  const onChangeDistroSelection = (val: { id: string }) => {
    taskQueueAnalytics.sendEvent({ name: "Select Distro", distro: val.id });
    navigate(getTaskQueueRoute(val.id), { replace: true });
  };

  const handleSearch = (options: { id: string }[], match: string) =>
    options.filter((d) => d.id.toLowerCase().includes(match.toLowerCase()));

  return (
    <PageWrapper>
      {/* @ts-expect-error  */}
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
                {/* @ts-expect-error  */}
                <StyledH3> {selectedDistro.id} </StyledH3>
                <StyledRouterLink
                  to={getAllHostsRoute({ distroId: selectedDistro.id })}
                >
                  View hosts
                </StyledRouterLink>
              </TableHeader>
            )
          }

          <TableContainer hide={false}>
            <TaskQueueTable />
          </TableContainer>
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
  align-items: flex-end;
  margin: ${size.m} 0 ${size.s} 0;
`;
/* @ts-expect-error  */
const StyledH2 = styled(H2)`
  margin-bottom: ${size.xs};
`;
/* @ts-expect-error  */
const StyledH3 = styled(H3)`
  margin-right: ${size.s};
`;
