import React from "react";
import styled from "@emotion/styled";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import { Patch } from "gql/queries/my-patches";
import { BuildStatusIcon } from "pages/my-patches/patch-card/BuildStatusIcon";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import Button from "@leafygreen-ui/button";
import { format } from "date-fns";

export const PatchCard: React.FC<Patch> = ({
  description,
  status,
  createTime,
  projectID,
  builds,
}) => {
  const createDate = new Date(createTime);
  return (
    <CardWrapper>
      <Left>
        <Description>{description}</Description>
        <TimeAndProject>
          {format(createDate, "M/d/yy")} at {format(createDate, "h:mm:ss aaaa")}{" "}
          on <b>{projectID}</b>
        </TimeAndProject>
      </Left>
      <Center>
        <BadgeContainer>
          <PatchStatusBadge status={status} />
        </BadgeContainer>
        <IconsContainer>
          {builds.map((b, i) => (
            <div key={i}>
              <BuildStatusIcon status={b.status} />
            </div>
          ))}
        </IconsContainer>
      </Center>
      <Right>
        <Button size="xsmall">...</Button>
      </Right>
    </CardWrapper>
  );
};

const IconsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  > div {
    margin-right: 14px;
  }
  flex-wrap: wrap;
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Center = styled.div`
  display: flex;
  flex: 1 1 0;
`;

const Left = styled(Center)`
  flex-direction: column;
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const Description = styled(Body)`
  color: ${uiColors.blue.base};
  font-size: 18px;
  padding-bottom: 8px;
`;

const BadgeContainer = styled.div`
  margin-right: 27px;
`;

const TimeAndProject = styled.div`
  color: ${uiColors.gray.base};
`;
