import React from "react";
import { useParams } from "react-router-dom";
import { GET_HOST } from "gql/queries/get-host";
import get from "lodash/get";
import { useQuery } from "@apollo/react-hooks";
import { HostQuery, HostQueryVariables } from "gql/generated/types";
import { usePageTitle } from "hooks/usePageTitle";
import { PageWrapper } from "components/styles";
import { HostStatusBadge } from "components/HostStatusBadge";
import { PageTitleJumbo } from "components/PageTitleJumbo";

export const Host: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // Query host data
  const { data, loading } = useQuery<HostQuery, HostQueryVariables>(GET_HOST, {
    variables: { id },
  });
  const host = get(data, "host");
  const hostUrl = get(host, "hostUrl");
  const status = get(host, "status");
  usePageTitle(`Host${hostUrl ? ` - ${hostUrl}` : ""}`);
  console.log(data);

  return (
    <PageWrapper>
      <PageTitleJumbo
        title={`Host: ${hostUrl}`}
        badge={<HostStatusBadge status={status} />}
        loading={loading}
        hasData
      />
    </PageWrapper>
  );
};
