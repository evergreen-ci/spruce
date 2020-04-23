import React from "react";
import { BuildStatus } from "types/build";
import { Build } from "gql/queries/my-patches";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Icon from "@leafygreen-ui/icon";
import { ProgressCircle } from "./BuildStatusIcon/ProgressCircle";

export const BuildStatusIcon = (props: Build) => {
  switch (props.status) {
    case BuildStatus.Created:
      return <Created />;
    case BuildStatus.Failed:
      return <Failed />;
    case BuildStatus.Started:
      return <Running {...props} />;
    case BuildStatus.Succeeded:
      return <Suceeded />;
    default:
      return <div />;
  }
};

const Created = styled.div`
  border-radius: 50%;
  color: ${uiColors.gray.light1}
  width: 10px;
  height: 10px
`;
const Suceeded = () => <Icon color={uiColors.green.base} glyph="Checkmark" />;
const Failed = () => <Icon color={uiColors.red.base} glyph="Warning" />;
const Running = (props: Build) => {
  const percentFill = props.predictedMakespan
    ? (props.actualMakespan / props.predictedMakespan) * 100
    : 75;
  return <ProgressCircle diameter={22} percentFill={percentFill} />;
};
