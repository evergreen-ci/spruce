import React from "react";
import styled from "@emotion/styled/macro";
import { useParams } from "react-router-dom";
import { BreadCrumb } from "components/Breadcrumb";
import { H1, H3, P2 } from "components/Typography";
import { PageWrapper } from "components/styles/PageWrapper";
import { SiderCard } from "components/styles/SiderCard";
import { PageHeader } from "components/styles/PageHeader";
import { PageContent, PageLayout, PageSider } from "components/styles/Layout";
import { Divider } from "components/styles/Divider";
import { useQuery } from "@apollo/react-hooks";
import { blueBase } from "contants/colors";
import { GET_PATCH, PatchQuery } from "gql/queries/patch";

export const Patch = () => {
  const { patchID } = useParams<{ patchID: string }>();
  const { data, loading, error } = useQuery<PatchQuery>(GET_PATCH, {
    variables: { id: patchID }
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
        <H1 id="patch-name">
          {description ? description : `Patch: ${patchID}`}
        </H1>
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
                href={`https://evergreen.mongodb.com/version/${version}`}
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
          <PageContent>I'm where the table will go</PageContent>
        </PageLayout>
      </PageLayout>
    </PageWrapper>
  );
};

const StyledLink = styled.a`
  text-decoration: none;
  margin: none;
  padding: none;
  cursor: pointer;
  color: ${blueBase};
  &:hover {
    text-decoration: underline;
  }
`;
