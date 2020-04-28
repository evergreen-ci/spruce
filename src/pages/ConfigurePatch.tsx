import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { GET_PATCH_CONFIGURE, PatchQuery } from "gql/queries/patch";
import { ConfigurePatchCore } from "pages/configurePatch/ConfigurePatchCore";
import { PatchAndTaskFullPageLoad } from "components/Loading/PatchAndTaskFullPageLoad";
import { PageWrapper } from "components/styles";
import get from "lodash/get";
import { PageLayout } from "components/styles";

export const ConfigurePatch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<PatchQuery>(GET_PATCH_CONFIGURE, {
    variables: { id },
  });
  return (
    <PageWrapper>
      {(function() {
        if (loading) {
          return <PatchAndTaskFullPageLoad />;
        } else if (error) {
          return (
            <PageLayout>
              <div>{error.message}</div>
            </PageLayout>
          );
        }
        const variants = get(data, "patch.project.variants");
        const tasks = get(data, "patch.project.tasks");
        if (variants.length === 0 || tasks.length === 0) {
          return (
            // TODO: Full page error
            <PageLayout>
              <div data-cy="full-page-error">
                Something went wrong. This patch's project either has no
                variants or tasks associated with it.{" "}
              </div>
            </PageLayout>
          );
        }
        return <ConfigurePatchCore patch={data.patch} />;
      })()}
    </PageWrapper>
  );
};
