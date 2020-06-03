import React from "react";
import styled from "@emotion/styled";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import { BuildStatusIcon } from "pages/user-patches/patch-card/BuildStatusIcon";
import { uiColors } from "@leafygreen-ui/palette";
import { format } from "date-fns";
import { StyledLink } from "components/styles";
import { paths } from "constants/routes";
import { Maybe } from "gql/generated/types";
import { DropdownMenu } from "pages/user-patches/patch-card/DropdownMenu";

interface Build {
  id: string;
  buildVariant: string;
  status: string;
}
interface Props {
  id: string;
  projectID: string;
  description: string;
  status: string;
  createTime?: Maybe<Date>;
  builds: Build[];
}
export const PatchCard: React.FC<Props> = ({
  id,
  description,
  createTime,
  projectID,
  status,
  builds,
}) => {
  const createDate = new Date(createTime);
  return (
    <CardWrapper data-cy="patch-card">
      <Left>
        <DescriptionLink href={`${paths.patch}/${id}`}>
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
          {builds.map((b) => (
            <div key={b.id}>
              <BuildStatusIcon
                status={b.status}
                buildVariant={b.buildVariant}
              />
            </div>
          ))}
        </IconsContainer>
      </Center>
      <Right>
        <DropdownMenu patchId={id} />
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
  padding-right: 24px;
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DescriptionLink = styled(StyledLink)`
  font-size: 18px;
  font-weight: 500;
  padding-bottom: 8px;
`;

const BadgeContainer = styled.div`
  margin-right: 24px;
  min-width: 90px;
`;

const TimeAndProject = styled.div`
  color: ${uiColors.gray.base};
`;
