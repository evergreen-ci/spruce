import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { PageWrapper } from "components/styles";
import { MainlineCommitsQuery } from "gql/generated/types";
import { ChartTypes } from "types/commits";
import { ChartToggle } from "./ActiveCommits/ChartToggle";
import { CommitChart } from "./ActiveCommits/CommitChart";
import { CommitChartLabel } from "./ActiveCommits/CommitChartLabel";
import { Grid } from "./ActiveCommits/Grid";
import {
  getAllTaskStatsGroupedByColor,
  findMaxGroupedTaskStats,
} from "./ActiveCommits/utils";
import { InactiveCommits, InactiveCommitLine } from "./InactiveCommits/index";

interface Props {
  versions: MainlineCommitsQuery["mainlineCommits"]["versions"];
  error?: ApolloError;
  isLoading: boolean;
  chartType?: ChartTypes;
}

export const CommitsWrapper: React.FC<Props> = ({
  versions,
  isLoading,
  error,
  chartType,
}) => {
  if (error) {
    return <PageWrapper>ERROR</PageWrapper>;
  }
  if (isLoading) {
    return <StyledSkeleton active title={false} paragraph={{ rows: 6 }} />;
  }
  if (!isLoading && versions?.length !== 0) {
    const idToTaskStatsGroupedByColor = getAllTaskStatsGroupedByColor(versions);
    const { max } = findMaxGroupedTaskStats(idToTaskStatsGroupedByColor);

    return (
      <ProjectHealthWrapper>
        <FlexRowContainer>
          {versions.map(({ version, rolledUpVersions }) =>
            version ? (
              <ColumnContainer key={version.id}>
                <CommitChart
                  groupedTaskStats={
                    idToTaskStatsGroupedByColor[version.id].stats
                  }
                  total={idToTaskStatsGroupedByColor[version.id].total}
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
            ) : (
              <ColumnContainer key={rolledUpVersions[0].id}>
                <InactiveCommitLine />
                <InactiveCommits rolledUpVersions={rolledUpVersions} />
              </ColumnContainer>
            )
          )}
        </FlexRowContainer>
        <Grid numDashedLine={5} />
        <ChartToggle currentChartType={chartType} />
      </ProjectHealthWrapper>
    );
  }
  return <NoResults data-cy="no-commits-found">No commits found</NoResults>;
};

const StyledSkeleton = styled(Skeleton)`
  margin-top: 12px;
`;

export const FlexRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-top: 65px;
  padding-left: 9px;
  z-index: 1;
  position: absolute;
`;

export const ProjectHealthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  position: relative;
`;

export const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const NoResults = styled.div`
  margin-top: 12px;
`;
