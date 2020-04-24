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
    <Container>
      <div>
        <Description>{description}</Description>
        <TimeAndProject>
          {format(createDate, "M/d/yy")} at {format(createDate, "h:mm:ss aaaa")}{" "}
          on <b>{projectID}</b>
        </TimeAndProject>
      </div>
      <BadgeAndStatusIconWrapper>
        <BadgeContainer>
          <PatchStatusBadge status={status} />
        </BadgeContainer>
        <IconContainer>
          {builds.map((b, i) => {
            return (
              <div key={i}>
                <BuildStatusIcon status={b.status} />
              </div>
            );
          })}
        </IconContainer>
      </BadgeAndStatusIconWrapper>
      <Button size="xsmall">...</Button>
    </Container>
  );
};

const IconContainer = styled.div`
  display: flex;
  > div {
    margin-right: 5px;
  }
  flex-wrap: wrap;
`;
const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BadgeAndStatusIconWrapper = styled.div`
  display: flex;
`;

const Description = styled(Body)`
  color: ${uiColors.blue.base};
  font-size: 18px;
`;

const BadgeContainer = styled.div`
  margin-right: 27px;
`;

const TimeAndProject = styled.div`
  color: ${uiColors.gray.base};
`;
