import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_PATCH_CONFIGURE, PatchQuery } from "gql/queries/patch";
import { ConfigurePatchCore } from "pages/configurePatch/ConfigurePatchCore";
import { PatchAndTaskFullPageLoad } from "components/Loading/PatchAndTaskFullPageLoad";

export const ConfigurePatch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<PatchQuery>(GET_PATCH_CONFIGURE, {
    variables: { id },
  });
  if (loading) {
    return <PatchAndTaskFullPageLoad />;
  }
  if (error) {
    // TODO: replace with full page error
    return <div>{error.message}</div>;
  }
  return <ConfigurePatchCore patch={data.patch} />;
};
