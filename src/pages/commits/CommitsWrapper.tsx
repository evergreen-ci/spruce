import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Skeleton } from "antd";
import { size } from "constants/tokens";
import { Commits } from "types/commits";
import { CommitChartWrapper } from "./CommitChartWrapper";
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
}

export const CommitsWrapper: React.FC<Props> = ({
  versions,
  isLoading,
  error,
  hasTaskFilter,
  hasFilters,
}) => {
  if (error) {
    return <CommitChartWrapper hasError />;
  }
  if (isLoading) {
    return <StyledSkeleton active title={false} paragraph={{ rows: 6 }} />;
  }

  if (versions) {
    return (
      <ChartContainer>
        <CommitChartWrapper versions={versions} hasTaskFilter={hasTaskFilter} />
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
              <RenderCommitsBuildVariants commit={commit} />
            </CommitWrapper>
          ))}
        </FlexRowContainer>
      </ChartContainer>
    );
  }
  return <NoResults data-cy="no-commits-found">No commits found</NoResults>;
};

const ChartContainer = styled.div`
  padding: 0 ${size.m};
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
