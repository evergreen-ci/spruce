import { useMemo, useEffect } from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Skeleton } from "antd";
import { size } from "constants/tokens";
import { Commits } from "types/commits";
import {
  hoverTaskIcons,
  constructBuildVariantDict,
} from "./ActiveCommits/utils";
import { CommitsChart } from "./CommitsChart";
import {
  getCommitKey,
  getCommitWidth,
  RenderCommitsLabel,
  RenderCommitsBuildVariants,
} from "./RenderCommit";
import { FlexRowContainer, CommitWrapper } from "./styles";

const { white } = uiColors;

interface Props {
  versions: Commits;
  error?: ApolloError;
  isLoading: boolean;
  hasTaskFilter: boolean;
  hasFilters: boolean;
  isOpenChartToggle: boolean;
  onToggleChartViewOptionsAccordion: (nextState: {
    isVisible: boolean;
  }) => void;
}

export const CommitsWrapper: React.VFC<Props> = ({
  versions,
  isLoading,
  error,
  hasTaskFilter,
  hasFilters,
  isOpenChartToggle,
  onToggleChartViewOptionsAccordion,
}) => {
  useEffect(() => {
    if (!isLoading) {
      hoverTaskIcons();
    }
  }, [isLoading, versions]);

  const buildVariantDict = useMemo(() => {
    if (versions) {
      return constructBuildVariantDict(versions);
    }
  }, [versions]);

  if (error) {
    return (
      <CommitsChart
        isOpenChartToggle={isOpenChartToggle}
        onToggleChartViewOptionsAccordion={onToggleChartViewOptionsAccordion}
        hasError
      />
    );
  }
  if (isLoading) {
    return <StyledSkeleton active title={false} paragraph={{ rows: 6 }} />;
  }
  if (versions) {
    return (
      <ChartContainer>
        <CommitsChart
          isOpenChartToggle={isOpenChartToggle}
          onToggleChartViewOptionsAccordion={onToggleChartViewOptionsAccordion}
          versions={versions}
          hasTaskFilter={hasTaskFilter}
        />
        <StickyContainer>
          <FlexRowContainer>
            {versions.map((commit) => (
              <CommitWrapper
                key={getCommitKey(commit)}
                width={getCommitWidth(commit)}
              >
                <RenderCommitsLabel commit={commit} hasFilters={hasFilters} />
              </CommitWrapper>
            ))}
          </FlexRowContainer>
        </StickyContainer>
        <FlexRowContainer>
          {versions.map((commit) => (
            <CommitWrapper
              key={getCommitKey(commit)}
              width={getCommitWidth(commit)}
            >
              <RenderCommitsBuildVariants
                commit={commit}
                buildVariantDict={buildVariantDict}
              />
            </CommitWrapper>
          ))}
        </FlexRowContainer>
      </ChartContainer>
    );
  }
  return <NoResults data-cy="no-commits-found">No commits found</NoResults>;
};

const ChartContainer = styled.div`
  padding-left: ${size.m};
`;

const StickyContainer = styled.div`
  position: sticky;
  top: -${size.m}; // This is to offset the padding of PageWrapper
  z-index: 1;
  background-color: ${white};
  margin-top: ${size.xxs};
  margin-bottom: ${size.xs};
`;

const StyledSkeleton = styled(Skeleton)`
  margin-top: 12px;
`;

const NoResults = styled.div`
  margin-top: 12px;
`;
