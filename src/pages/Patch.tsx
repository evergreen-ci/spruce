import React from "react";
import { useParams } from "react-router-dom";
import { BreadCrumb } from "components/Breadcrumb";
import { H1, H3, P2 } from "components/Typography";
import {
  PageWrapper,
  SiderCard,
  PageHeader,
  StyledLink,
  PageContent,
  PageLayout,
  PageSider
} from "components/styles";
import { Divider } from "components/styles/Divider";
import { useQuery } from "@apollo/react-hooks";
import { GET_PATCH, PatchQuery } from "gql/queries/patch";
import { getUiUrl } from "utils/getEnvironmentVariables";
import { PatchTabs } from "pages/patch/PatchTabs";

export const Patch = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<PatchQuery>(GET_PATCH, {
    variables: { id: id }
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    // TODO: replace with proper error page
    return <div id="patch-error">{error.message}</div>;
  }

  const {
    patch: {
      description,
      author,
      githash,
      version,
      time: { submittedAt, started, finished },
      duration: { makespan, timeTaken }
    }
  } = data;

  return (
    <PageWrapper>
      <BreadCrumb displayName="Specific Patch" />
      <PageHeader>
        <H1 id="patch-name">{description ? description : `Patch: ${id}`}</H1>
      </PageHeader>
      <PageLayout>
        <PageSider>
          <SiderCard>
            <H3>Patch Metadata</H3>
            <Divider />
            <P2>Makespan: {makespan && makespan}</P2>
            <P2>Time taken: {timeTaken && timeTaken}</P2>
            <P2>Submitted at: {submittedAt}</P2>
            <P2>Started: {started && started}</P2>
            <P2>Finished: {finished && finished}</P2>
            <P2>{`Submitted by: ${author}`}</P2>
            <P2>
              <StyledLink
                id="patch-base-commit"
                href={`${getUiUrl()}/version/${version}`}
              >
                Base commit: {githash.slice(0, 10)}
              </StyledLink>
            </P2>
          </SiderCard>
          <SiderCard>
            <div>Build Variants</div>
            <Divider />
          </SiderCard>
        </PageSider>
        <PageLayout>
          <PageContent>
            <PatchTabs />
          </PageContent>
        </PageLayout>
      </PageLayout>
    </PageWrapper>
  );
};
