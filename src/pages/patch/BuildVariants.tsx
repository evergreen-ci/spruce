import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/Divider";
import { Skeleton } from "antd";

interface BuildVariantTask {
  id: string;
  name: string;
  status: string;
}
interface PatchBuildVariantTask {
  variant: string;
  tasks: [BuildVariantTask];
}
interface BuildVariantsQuery {
  data: {
    patchBuildVariants: [PatchBuildVariantTask];
  };
}

export const GET_PATCH_BUILD_VARIANTS = gql`
  query PatchBuildVariants($patchId: String!) {
    patchBuildVariants(patchId: $patchId) {
      variant
      tasks {
        id
        name
        status
      }
    }
  }
`;

export const BuildVariants: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<BuildVariantsQuery>(
    GET_PATCH_BUILD_VARIANTS,
    {
      variables: { patchId: id }
    }
  );
  return (
    <SiderCard>
      <div>Build Variants</div>
      <Divider />
      {error ? (
        <div>{error.message}</div>
      ) : loading ? (
        <Skeleton active={true} title={false} paragraph={{ rows: 4 }} />
      ) : (
        <div></div>
      )}
    </SiderCard>
  );
};
