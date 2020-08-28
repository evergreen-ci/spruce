import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Select } from "antd";
import Badge from "@leafygreen-ui/badge";
import {
  TaskQueueDistrosQuery,
  TaskQueueDistrosQueryVariables,
} from "gql/generated/types";
import { TASK_QUEUE_DISTROS } from "gql/queries";
import {
  TableContainer,
  TableControlOuterRow,
  PageWrapper,
} from "components/styles";
import { TaskQueueTable } from "pages/taskQueue/TaskQueueTable";
import { H2, Disclaimer } from "@leafygreen-ui/typography";
import styled from "@emotion/styled";
import { useParams, useHistory } from "react-router-dom";
import { getTaskQueueRoute } from "constants/routes";

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

// mongodb_cpp_driver_dev_osx_108_compile_and_test_671bda78e9947426e78bdae3ea13be1ce64ffe18_16_07_26_21_12_52
