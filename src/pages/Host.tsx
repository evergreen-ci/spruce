import React from "react";
import { useParams } from "react-router-dom";
import { GET_HOST } from "gql/queries/get-host";
import { useQuery } from "@apollo/react-hooks";
import { HostQuery, HostQueryVariables } from "gql/generated/types";
import { usePageTitle } from "hooks/usePageTitle";
import { PageWrapper, PageSider, PageLayout } from "components/styles";
import { HostStatusBadge } from "components/HostStatusBadge";
import { PageTitle } from "components/PageTitle";
import { HostStatus } from "types/host";
import { Metadata } from "pages/host/Metadata";

export const Host: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // Query host data
  const { data, loading, error } = useQuery<HostQuery, HostQueryVariables>(
    GET_HOST,
    {
      variables: { id },
    }
  );

  const host = data?.host;
  const hostUrl = host?.hostUrl;
  const status = host?.status as HostStatus;

  usePageTitle(`Host${hostUrl ? ` - ${hostUrl}` : ""}`);

  return (
    <PageWrapper>
      <PageTitle
        title={`Host: ${hostUrl}`}
        badge={<HostStatusBadge status={status} />}
        loading={loading}
        hasData
        size="large"
      />
      <PageLayout>
        <PageSider width={350}>
          <Metadata loading={loading} data={data} error={error} />
        </PageSider>
      </PageLayout>
    </PageWrapper>
  );
};
