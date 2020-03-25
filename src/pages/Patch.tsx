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
import Badge, { Variant } from "@leafygreen-ui/badge";
import { PatchStatus } from "gql/queries/get-patch-tasks";

export const Patch = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<PatchQuery>(GET_PATCH, {
    variables: { id: id }
  });
  const patch = get(data, "patch");
  const status = get(patch, "status");
  return (
    <PageWrapper>
      {patch && <BreadCrumb patchNumber={patch.patchNumber} />}
      <PageHeader>
        {loading ? (
          <Skeleton active={true} paragraph={{ rows: 0 }} />
        ) : patch ? (
          <>
            <H1 id="patch-name">
              {patch.description
                ? patch.description
                : `Patch ${patch.patchNumber}`}{" "}
            </H1>
            <Badge variant={mapPatchStatusToBadgeVariant[status]}>
              {status}
            </Badge>
          </>
        ) : null}
      </PageHeader>
      <PageLayout>
        <PageSider>
          <Metadata loading={loading} patch={patch} error={error} />
          <BuildVariants />
        </PageSider>
        <PageLayout>
          <PageContent>
            <PatchTabs taskCount={patch ? patch.taskCount : null} />
          </PageContent>
        </PageLayout>
      </PageLayout>
    </PageWrapper>
  );
};

// const StyledBadge = styled(Badge)``;

const mapPatchStatusToBadgeVariant = {
  [PatchStatus.Created]: Variant.LightGray,
  [PatchStatus.Failed]: Variant.Red,
  [PatchStatus.Started]: Variant.Yellow,
  [PatchStatus.Success]: Variant.Green
};
