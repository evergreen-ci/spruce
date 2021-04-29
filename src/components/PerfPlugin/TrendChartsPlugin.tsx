import React from "react";
import { environmentalVariables } from "utils";

const { getSignalProcessingUrl } = environmentalVariables;

interface Props {
  taskId: string;
}

const TrendChartsPlugin: React.FC<Props> = ({ taskId }) => (
    <iframe style={{width:"100%", minHeight: "1000px"}} src={`${getSignalProcessingUrl()}/task/${taskId}/performanceData`} title="Task Performance Data"/>
);

export default TrendChartsPlugin;
