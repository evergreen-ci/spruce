import React from "react";
import styled from "@emotion/styled";
import { Disclaimer } from "@leafygreen-ui/typography";
import Badge, { Variant } from "components/Badge";
import { StyledRouterLink } from "components/styles";
import { TaskStatusIcon } from "components/TaskStatusIcon";
import { getTaskRoute } from "constants/routes";
import { MetStatus, RequiredStatus } from "gql/generated/types";
import { TaskStatus } from "types/task";

interface Props {
  buildVariant: string;
  metStatus: MetStatus;
  requiredStatus: RequiredStatus;
  name: string;
  taskId: string;
}
export const DependsOn: React.FC<Props> = ({
  buildVariant,
  metStatus,
  name,
  requiredStatus,
  taskId,
}) => (
  <DependsOnWrapper>
    <LeftContainer>{metStatusToIcon[metStatus]}</LeftContainer>
    <RightContainer>
      <StyledRouterLink data-cy="depends-on-link" to={getTaskRoute(taskId)}>
        {name}
      </StyledRouterLink>
      <Subtitle>in {buildVariant}</Subtitle>
      {requiredStatusToBadge[requiredStatus]}
    </RightContainer>
  </DependsOnWrapper>
);

const DependsOnWrapper = styled.div`
  display: flex;
  padding-bottom: 8px;
`;

const LeftContainer = styled.div`
  width: 25px;
  padding-top: 10px;
  padding-right: 9px;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Subtitle = styled(Disclaimer)`
  padding-bottom: 3px;
`;

const metStatusToIcon = {
  [MetStatus.Met]: <TaskStatusIcon status={TaskStatus.Succeeded} />,
  [MetStatus.Unmet]: <TaskStatusIcon status={TaskStatus.Failed} />,
  [MetStatus.Pending]: <></>,
};

const requiredStatusToBadge = {
  [RequiredStatus.MustFail]: <Badge variant={Variant.Red}>Must fail</Badge>,
  [RequiredStatus.MustFinish]: (
    <Badge variant={Variant.Blue}>Must finish</Badge>
  ),
  [RequiredStatus.MustSucceed]: (
    <Badge variant={Variant.Green}>Must succeed</Badge>
  ),
};
