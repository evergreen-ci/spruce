import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { CommitGraphWrapper } from "components/CommitsPage/CommitGraphWrapper";
import { FilterBadges } from "components/FilterBadges";
import { PageWrapper } from "components/styles";
import { TupleSelect } from "components/TupleSelect";
import { pollInterval } from "constants/index";
import { useToastContext } from "context/toast";
import {
  MainlineCommitsQuery,
  MainlineCommitsQueryVariables,
} from "gql/generated/types";
import { GET_MAINLINE_COMMITS } from "gql/queries";
import { usePageTitle, useNetworkStatus } from "hooks";
import { PageDoesNotExist } from "pages/404";
import { ProjectFilterOptions } from "types/commits";
import { ProjectSelect } from "./commits/ProjectSelect";

export const Commits = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const options = { projectID: projectId };
  const dispatchToast = useToastContext();

  usePageTitle(`Project Health | ${projectId}`);
  const { data, loading, error, startPolling, stopPolling } = useQuery<
    MainlineCommitsQuery,
    MainlineCommitsQueryVariables
  >(GET_MAINLINE_COMMITS, {
    variables: { options },
    pollInterval,
    onError: (e) =>
      dispatchToast.error(`There was an error loading the page: ${e.message}`),
  });

  useNetworkStatus(startPolling, stopPolling);
  const { mainlineCommits } = data || {};
  const { versions, nextPageOrderNumber } = mainlineCommits || {};
  console.log(nextPageOrderNumber);

  if (error) {
    return <PageDoesNotExist />;
  }

  return (
    <PageWrapper>
      <HeaderWrapper>
        <TupleSelectWrapper>
          <TupleSelect options={tupleSelectOptions} />
        </TupleSelectWrapper>
        <ProjectSelectWrapper>
          <ProjectSelect selectedProject={projectId} />
        </ProjectSelectWrapper>
      </HeaderWrapper>
      <BadgeWrapper>
        <FilterBadges />
      </BadgeWrapper>
      <CommitGraphWrapper
        versions={versions}
        error={error}
        graphType="absolute"
        isLoading={loading}
      />
    </PageWrapper>
  );
};

const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const BadgeWrapper = styled.div`
  padding-top: 32px;
  padding-bottom: 32px;
  height: 32px;
`;
const TupleSelectWrapper = styled.div`
  width: 40%;
`;
const ProjectSelectWrapper = styled.div`
  width: 30%;
`;
const tupleSelectOptions = [
  {
    value: ProjectFilterOptions.BuildVariant,
    displayName: "Build Variant",
    placeHolderText: "Search Build Variant names",
  },
  {
    value: ProjectFilterOptions.Test,
    displayName: "Test",
    placeHolderText: "Search Test names",
  },
  {
    value: ProjectFilterOptions.Task,
    displayName: "Task",
    placeHolderText: "Search Task names",
  },
];
