import React from "react";
import { useParams } from "react-router-dom";
import { GET_HOST } from "gql/queries/get-host";
import { GET_HOST_EVENTS } from "gql/queries/get-host-events";
import { useQuery } from "@apollo/react-hooks";
import {
  HostQuery,
  HostQueryVariables,
  HostEventsQuery,
  HostEventsQueryVariables,
} from "gql/generated/types";
import { usePageTitle } from "hooks/usePageTitle";
import { PageWrapper, PageSider, PageLayout } from "components/styles";
import { HostStatusBadge } from "components/HostStatusBadge";
import { PageTitle } from "components/PageTitle";
import { HostStatus } from "types/host";
import { Metadata } from "pages/host/Metadata";
import Code from "@leafygreen-ui/code";

export const Host: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // Query host data
  const { data: hostData, loading, error } = useQuery<
    HostQuery,
    HostQueryVariables
  >(GET_HOST, {
    variables: { id },
  });

  const host = hostData?.host;
  const hostUrl = host?.hostUrl;
  const user = host?.user;
  const status = host?.status as HostStatus;
  const sshCommand = `ssh ${user}@${hostUrl}`;
  const tag = host?.tag ?? "";

  // Query hostEvent data
  const { data: hostEventData, loading: hostEventLoading } = useQuery<
    HostEventsQuery,
    HostEventsQueryVariables
  >(GET_HOST_EVENTS, {
    variables: { id, tag },
  });

  console.log(hostEventData, hostEventLoading);

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
          <Metadata loading={loading} data={hostData} error={error} />
          <Code language="shell">{sshCommand}</Code>
        </PageSider>
      </PageLayout>
    </PageWrapper>
  );
};
