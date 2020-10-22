import React from "react";
import TrendCharts from "@mongodb-dev-prod/trend-charts-ui";

interface Props {
  taskId: string;
}

const TrendChartsPlugin: React.FC<Props> = ({ taskId }) => (
  <TrendCharts taskId={taskId} />
);

export default TrendChartsPlugin;
