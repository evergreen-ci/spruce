import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_PATCH_CONFIGURE } from "gql/queries/patch";
import {
  ConfigurePatchQuery,
  ConfigurePatchQueryVariables,
} from "gql/generated/types";
import { ConfigurePatchCore } from "pages/configurePatch/ConfigurePatchCore";
import { PatchAndTaskFullPageLoad } from "components/Loading/PatchAndTaskFullPageLoad";
import { PageWrapper } from "components/PageWrapper";

export const ConfigurePatch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<
    ConfigurePatchQuery,
    ConfigurePatchQueryVariables
  >(GET_PATCH_CONFIGURE, {
    variables: { id },
  });
  return (
    <PageWrapper>
      {loading ? (
        <PatchAndTaskFullPageLoad />
      ) : error ? (
        <div>{error.message}</div>
      ) : (
        <ConfigurePatchCore patch={data.patch} />
      )}
    </PageWrapper>
  );
};
