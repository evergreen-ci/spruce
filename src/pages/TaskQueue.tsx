import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { H2 } from "@leafygreen-ui/typography";
import { useParams, useHistory } from "react-router-dom";
import { useTaskQueueAnalytics } from "analytics";
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
import SelectSearch from "pages/taskQueue/SelectSearch";
import { TaskQueueTable } from "pages/taskQueue/TaskQueueTable";

export const TaskQueue = () => {
  const taskQueueAnalytics = useTaskQueueAnalytics();

  const { distro, taskId } = useParams<{ distro: string; taskId?: string }>();
  const { replace } = useHistory();

  const [selectedDistro, setSelectedDistro] = useState("");

  const { data: distrosData } = useQuery<
    TaskQueueDistrosQuery,
    TaskQueueDistrosQueryVariables
  >(TASK_QUEUE_DISTROS);

  const distros = distrosData?.taskQueueDistros ?? [];
  const firstDistroInList = distros[0]?.id;

  // SET DEFAULT DISTRO
  useEffect(() => {
    const defaultDistro = distro ?? firstDistroInList;
    setSelectedDistro(defaultDistro);

    if (defaultDistro) {
      replace(getTaskQueueRoute(defaultDistro, taskId));
    }
  }, [firstDistroInList, distro, replace, taskId]);

  const onChangeDistroSelection = (val: any) => {
    taskQueueAnalytics.sendEvent({ name: "Select Distro", distro: val });
    replace(getTaskQueueRoute(val));
  };

  const handleSearch = (options: TaskQueueDistro[], value: string) =>
    options.filter((d) => d.id.toLowerCase().includes(value.toLowerCase()));

  return (
    <PageWrapper>
      <H2>Task Queue</H2>
      <TableControlOuterRow>
        <SelectSearch
          onChange={onChangeDistroSelection}
          searchFunc={handleSearch}
          searchPlaceholder={selectedDistro}
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
      <TableContainer hide={false}>
        <TaskQueueTable />
      </TableContainer>
    </PageWrapper>
  );
};
