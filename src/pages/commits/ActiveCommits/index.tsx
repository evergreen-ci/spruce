import React from "react";
import styled from "@emotion/styled";
import { ChartTypes } from "types/commits";
import { ColumnContainer } from "../CommitsWrapper";
import { CommitChart } from "./CommitChart";
import { CommitChartLabel } from "./CommitChartLabel";
import { BuildVariantAccordionContainer } from "./BuildVariantAccordionContainer";
import { ColorCount } from "./utils";

interface Props {
  version: {
    id: string;
    author: string;
    createTime: Date;
    message: string;
    revision: string;
    taskStatusCounts?: {
      status: string;
      count: number;
    }[];
    buildVariants?: {
      displayName: string;
    }[];
  };
  groupedTaskStats: ColorCount[];
  max: number;
  total: number;
  chartType: ChartTypes;
}

export const ActiveCommit: React.FC<Props> = ({
  version,
  groupedTaskStats,
  max,
  total,
  chartType,
}) => (
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
    <BuildVariantAccordionContainer buildVariants={version.buildVariants} />
  </ColumnContainer>
);
