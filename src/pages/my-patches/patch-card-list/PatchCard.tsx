import React from "react";
import styled from "@emotion/styled";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import { Patch } from "gql/queries/my-patches";
import { BuildStatusIcon } from "pages/my-patches/patch-card-list/patch-card/BuildStatusIcon";
import { uiColors } from "@leafygreen-ui/palette";
import Button from "@leafygreen-ui/button";
import { format } from "date-fns";
import { StyledLink } from "components/styles";
import { paths } from "constants/routes";

interface Props extends Patch {
  style: any;
}

export const PatchCard: React.FC<Props> = ({
  id,
  description,
  status,
  createTime,
  projectID,
  builds,
  style,
}) => {
  const createDate = new Date(createTime);
  return (
    <CardWrapper style={style}>
      <Left>
        <DescriptionLink title={description} href={`${paths.patch}/${id}`}>
          {description || "no description"}
        </DescriptionLink>
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
              <BuildStatusIcon {...b} />
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
  padding: 12px 5px 12px;
  border-bottom: 1px solid ${uiColors.gray.light2};
`;

const Center = styled.div`
  display: flex;
  flex: 1 1 0;
`;

const Left = styled(Center)`
  flex-direction: column;
  &,
  & > * {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DescriptionLink = styled(StyledLink)`
  font-size: 18px;
  padding-bottom: 8px;
`;

const BadgeContainer = styled.div`
  margin-right: 27px;
`;

const TimeAndProject = styled.div`
  color: ${uiColors.gray.base};
`;
