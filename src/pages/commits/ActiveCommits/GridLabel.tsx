import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { zIndex, size } from "constants/tokens";
import { gridHeight } from "pages/commits/constants";
import { ChartTypes } from "types/commits";
import { array } from "utils";
import { roundMax } from "./utils";

const { range } = array;
const { gray } = uiColors;

const percentages = [100, 80, 60, 40, 20, 0];

export const GridLabel: React.VFC<{
  chartType: string;
  max: number;
  numDashedLine: number;
}> = ({ chartType, max, numDashedLine }) => {
  const yAxisLabels =
    chartType === ChartTypes.Percentage
      ? percentages
      : calculateAxisLabels(max, numDashedLine);

  return (
    <GridLabelContainer>
      {yAxisLabels.map((yValue, index) => (
        // Y-axis labels do not need to represent a unique value
        // eslint-disable-next-line react/no-array-index-key
        <YAxisValue key={index}>
          {yValue}
          {chartType === ChartTypes.Percentage && <>%</>}
        </YAxisValue>
      ))}
    </GridLabelContainer>
  );
};

const calculateAxisLabels = (max: number, numLines: number): number[] => {
  const maxRounded = roundMax(max);
  const interval = maxRounded / numLines;
  return range(0, maxRounded, interval).reverse();
};

const GridLabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  position: absolute;
  top: 0;
  left: -40px;
  font-size: 12px;
  color: ${gray.dark1};
  width: ${size.l};
  height: ${gridHeight}px;
  z-index: ${zIndex.backdrop};
`;

const YAxisValue = styled.div`
  line-height: ${size.xxs};
`;
