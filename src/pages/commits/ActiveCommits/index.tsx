import React from "react";
import styled from "@emotion/styled";
import CommitChartLabel from "components/CommitChartLabel";
import { MainlineCommitsQuery } from "gql/generated/types";
import { ChartTypes } from "types/commits";
import { BuildVariantCard } from "./BuildVariantCard";
import { CommitChart } from "./CommitChart";
import { ColorCount } from "./utils";

interface Props {
  version: MainlineCommitsQuery["mainlineCommits"]["versions"][0]["version"];
  groupedTaskStats: ColorCount[];
  max: number;
  total: number;
  chartType: ChartTypes;
  hasTaskFilter: boolean;
}

export const ActiveCommit: React.FC<Props> = ({
  version,
  groupedTaskStats,
  max,
  total,
  chartType,
  hasTaskFilter,
}) => (
  <Container>
    <ColumnContainer key={version.id}>
      <CommitChart
        groupedTaskStats={groupedTaskStats}
        total={total}
        max={max}
        chartType={chartType}
      />
      <CommitChartLabel
        githash={version.revision.substring(0, 5)}
        createTime={version.createTime}
        author={version.author}
        message={version.message}
      />
    </ColumnContainer>
    <ColumnContainer>
      {version.buildVariants.map(({ variant, displayName, tasks }) => (
        <BuildVariantCard
          versionId={version.id}
          buildVariantDisplayName={displayName}
          buildVariantId={variant}
          tasks={tasks}
          key={`${version.id}_${variant}`}
          shouldGroupTasks={!hasTaskFilter}
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
  margin-bottom: 15px;
`;

const Container = styled.div`
  margin-bottom: 50px;
`;
