import React from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { Analytics } from "analytics/addPageAction";
import { PageWrapper } from "components/styles";
import { PatchesPagePatchesFragment } from "gql/generated/types";
import { PatchCard } from "./PatchCard";

export const ListArea: React.FC<{
  analyticsObject?: Analytics<
    | { name: "Click Patch Link" }
    | {
        name: "Click Variant Icon";
        variantIconStatus: string;
      }
  >;
  patches?: PatchesPagePatchesFragment;
  error?: ApolloError;
  pageType: "project" | "user";
}> = ({ patches, error, analyticsObject, pageType }) => {
  if (error) {
    return <PageWrapper>ERROR</PageWrapper>;
  }
  if (!patches) {
    return <StyledSkeleton active title={false} paragraph={{ rows: 4 }} />;
  }
  if (patches?.patches.length !== 0) {
    return (
      <>
        {patches?.patches.map(({ commitQueuePosition, ...p }) => (
          <PatchCard
            analyticsObject={analyticsObject}
            key={p.id}
            pageType={pageType}
            {...p}
            isPatchOnCommitQueue={commitQueuePosition !== null}
          />
        ))}
      </>
    );
  }
  return <NoResults data-cy="no-patches-found">No patches found</NoResults>;
};

const StyledSkeleton = styled(Skeleton)`
  margin-top: 12px;
`;

const NoResults = styled.div`
  margin-top: 12px;
`;
