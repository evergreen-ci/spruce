import React from "react";
import styled from "@emotion/styled";
import { environmentalVariables } from "utils";

const { getSignalProcessingUrl } = environmentalVariables;

interface Props {
  taskId: string;
}

const TrendChartsPlugin: React.FC<Props> = ({ taskId }) => (
    <StyledIframe src={`${getSignalProcessingUrl()}/task/${taskId}/performanceData`} title="Task Performance Data"/>
);

const StyledIframe = styled.iframe`
width: 100%;
height: 1000px;
`;

export default TrendChartsPlugin;
