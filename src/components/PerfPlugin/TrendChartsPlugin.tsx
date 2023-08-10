import styled from "@emotion/styled";
import { environmentVariables } from "utils";

const { getSignalProcessingUrl } = environmentVariables;

interface Props {
  taskId: string;
}

const TrendChartsPlugin: React.FC<Props> = ({ taskId }) => (
  <StyledIframe
    src={`${getSignalProcessingUrl()}/task/${taskId}/performanceData`}
    title="Task Performance Data"
    allow="clipboard-read; clipboard-write"
  />
);

const StyledIframe = styled.iframe`
  width: 100%;
  height: 1000px;
`;

export default TrendChartsPlugin;
