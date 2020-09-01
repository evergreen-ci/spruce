import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { H2, Disclaimer } from "@leafygreen-ui/typography";
import { Select } from "antd";
import { useParams, useHistory } from "react-router-dom";
import {
  TableContainer,
  TableControlOuterRow,
  PageWrapper,
} from "components/styles";
import { getTaskQueueRoute } from "constants/routes";
import {
  TaskQueueDistrosQuery,
  TaskQueueDistrosQueryVariables,
} from "gql/generated/types";
import { TASK_QUEUE_DISTROS } from "gql/queries";
import { TaskQueueTable } from "pages/taskQueue/TaskQueueTable";

const { Option } = Select;

export const TaskQueue = () => {
  const { distro, taskId } = useParams<{ distro: string; taskId?: string }>();
  const { replace } = useHistory();

  const [selectedDistro, setSelectedDistro] = useState(null);

  const { data: distrosData, loading: loadingDistros } = useQuery<
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

  const onChangeDistroSelection = (val: string) => {
    setSelectedDistro(val);

    replace(getTaskQueueRoute(val));
  };

  return (
    <PageWrapper>
      <H2>Task Queue</H2>
      <TableControlOuterRow>
        <StyledSelect
          data-cy="select-distro"
          showSearch
          value={selectedDistro}
          style={{ width: 400 }}
          onChange={onChangeDistroSelection}
          loading={loadingDistros}
          filterOption={(input, { key }) => key.toString().includes(input)}
        >
          {distros.map(({ id, queueCount }) => (
            <Option data-cy={`${id}-distro-option`} key={id} value={id}>
              <StyledBadge>{queueCount}</StyledBadge>
              <DistroName>{id}</DistroName>
            </Option>
          ))}
        </StyledSelect>
      </TableControlOuterRow>
      <TableContainer hide={false}>
        <TaskQueueTable />
      </TableContainer>
    </PageWrapper>
  );
};

const StyledSelect = styled(Select)`
  margin: 44px 0;
`;
const StyledBadge = styled(Badge)`
  display: inline-flex;
  justify-content: center;
  width: 60px;
  text-align: center;
`;
const DistroName = styled(Disclaimer)`
  margin-left: 16px;
`;
