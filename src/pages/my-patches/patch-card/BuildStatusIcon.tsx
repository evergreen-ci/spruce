import React from "react";
import { BuildStatus } from "types/build";
import { Build } from "gql/queries/my-patches";
import { RunningIcon } from "pages/my-patches/patch-card/BuildStatusIcon/RunningIcon";
import { SucceededIcon } from "pages/my-patches/patch-card/BuildStatusIcon/SucceededIcon";
import { FailedIcon } from "pages/my-patches/patch-card/BuildStatusIcon/FailedIcon";
import { uiColors } from "@leafygreen-ui/palette";
import styled from "@emotion/styled";

export const BuildStatusIcon = (props: Build) => {
  switch (props.status) {
    case BuildStatus.Created:
      return <Created />;
    case BuildStatus.Failed:
      return <FailedIcon />;
    case BuildStatus.Started:
      return <RunningIcon />;
    case BuildStatus.Succeeded:
      return <SucceededIcon />;
    default:
      return <div />;
  }
};

const Created = styled.div`
  border-radius: 50%;
  border: 2px solid ${uiColors.gray.light1};
  width: 22px;
  height: 22px;
`;
