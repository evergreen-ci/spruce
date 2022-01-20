import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import CommitChartLabel from "components/CommitChartLabel";
import { navBarHeight } from "components/Header/Navbar";
import StickyContainer from "components/StickyContainer";
import { MainlineCommitsQuery } from "gql/generated/types";
import { ChartTypes } from "types/commits";
import { shortenGithash } from "utils/string";
import { BuildVariantCard } from "./BuildVariantCard";
import { CommitChart } from "./CommitChart";
import { ColorCount } from "./utils";

const { white } = uiColors;
interface Props {
  version: MainlineCommitsQuery["mainlineCommits"]["versions"][0]["version"];
  groupedTaskStats: ColorCount[];
  max: number;
  total: number;
  chartType: ChartTypes;
  hasTaskFilter: boolean;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export const ActiveCommit: React.FC<Props> = ({
  version,
  groupedTaskStats,
  max,
  total,
  chartType,
  hasTaskFilter,
  containerRef,
}) => (
  <Container>
    <ColumnContainer>
      <CommitChart
        groupedTaskStats={groupedTaskStats}
        total={total}
        max={max}
        chartType={chartType}
      />
      <StickyContainer
        offset={navBarHeight}
        styles={stickyStyles}
        containerRef={containerRef}
      >
        <CommitChartLabel
          versionId={version.id}
          githash={shortenGithash(version.revision)}
          createTime={version.createTime}
          author={version.author}
          message={version.message}
        />
      </StickyContainer>
    </ColumnContainer>
    <ColumnContainer>
      {version.buildVariants.map(({ variant, displayName, tasks }) => (
        <BuildVariantCard
          versionId={version.id}
          buildVariantDisplayName={displayName}
          variant={variant}
          tasks={tasks}
          key={`${version.id}_${variant}`}
          shouldGroupTasks={!hasTaskFilter}
          projectIdentifier={version.projectIdentifier}
        />
      ))}
    </ColumnContainer>
  </Container>
);

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const stickyStyles = css`
  background-color: ${white};
  z-index: 1;
  width: 203.5px;
`;
