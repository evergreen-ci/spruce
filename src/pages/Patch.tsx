import React from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "antd";
import { BreadCrumb } from "components/Breadcrumb";
import { H1 } from "components/Typography";
import {
  PageWrapper,
  PageHeader,
  PageContent,
  PageLayout,
  PageSider
} from "components/styles";
import { useQuery } from "@apollo/react-hooks";
import { GET_PATCH, PatchQuery } from "gql/queries/patch";
import { PatchTabs } from "pages/patch/PatchTabs";
import { BuildVariants } from "pages/patch/BuildVariants";
import get from "lodash/get";
import { Metadata } from "pages/patch/Metadata";

export const Patch = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<PatchQuery>(GET_PATCH, {
    variables: { id: id }
  });
  const patch = get(data, "patch");
  return (
    <PageWrapper>
      {patch && <BreadCrumb patchNumber={patch.patchNumber} />}
      <PageHeader>
        {loading ? (
          <Skeleton active={true} paragraph={{ rows: 0 }} />
        ) : patch ? (
          <H1 id="patch-name">
            {patch.description
              ? patch.description
              : `Patch ${patch.patchNumber}`}
          </H1>
        ) : null}
      </PageHeader>
      <PageLayout>
        <PageSider>
          <Metadata loading={loading} patch={patch} error={error} />
          <BuildVariants />
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
