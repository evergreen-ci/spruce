import React from "react";
import { Build } from "gql/queries/my-patches";
import { BuildStatus } from "types/build";
import styled from "@emotion/styled";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import Icon from "@leafygreen-ui/icon";
import { uiColors } from "@leafygreen-ui/palette";
import { ProgressCircle } from "pages/my-patches/patch-card/ProgressCircle";

interface Props {
  description: string;
  status: string;
  dateStr: string;
  branch: string;
  buildStatuses: Build[];
}

export const PatchCard: React.FC<Props> = ({
  description,
  status,
  dateStr,
  branch,
  buildStatuses,
}) => {
  return (
    <Container>
      <div>
        <div>{description}</div>
        <div>
          {dateStr} on {branch}
        </div>
      </div>
      <div>
        <PatchStatusBadge status={status} />
      </div>
      <div>
        {buildStatuses.map((b, i) => {
          const Comp: (props: Build) => JSX.Element =
            buildStatusToIcon[b.status];
          return Comp ? <Comp key={i} {...b} /> : null;
        })}
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
`;

const GrayCircle = styled.div`
  border-radius: 50%;
  color: ${uiColors.gray.light1}
  width: 10px;
  height: 10px
`;

const buildStatusToIcon = {
  [BuildStatus.Created]: (props: Build) => <GrayCircle />,
  [BuildStatus.Failed]: (props: Build) => (
    <Icon color={uiColors.red.base} glyph="Warning" />
  ),
  [BuildStatus.Started]: (props: Build) => {
    const percentFill = props.predictedMakespan
      ? (props.actualMakespan / props.predictedMakespan) * 100
      : 75;
    return <ProgressCircle diameter={22} percentFill={percentFill} />;
  },
  [BuildStatus.Succeeded]: (props: Build) => (
    <Icon color={uiColors.green.base} glyph="Checkmark" />
  ),
};
