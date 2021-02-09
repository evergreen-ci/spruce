import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Code from "@leafygreen-ui/code";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "components/Button";
import { UpdateStatusModal } from "components/Hosts";
import { RestartJasper } from "components/Hosts/RestartJasper";
import { HostStatusBadge } from "components/HostStatusBadge";
import { PageTitle } from "components/PageTitle";
import {
  PageWrapper,
  PageSider,
  PageLayout,
  PageContent,
} from "components/styles";
import { useToastContext } from "context/toast";
import {
  HostQuery,
  HostQueryVariables,
  HostEventsQuery,
  HostEventsQueryVariables,
} from "gql/generated/types";
import { GET_HOST } from "gql/queries/get-host";
import { GET_HOST_EVENTS } from "gql/queries/get-host-events";
import { usePageTitle } from "hooks/usePageTitle";
import { HostTable } from "pages/host/HostTable";
import { Metadata } from "pages/host/Metadata";
import { HostStatus } from "types/host";
import { useUserTimeZone } from "utils/string";
import { getPageFromSearch, getLimitFromSearch } from "utils/url";

export const Host: React.FC = () => {
  const dispatchToast = useToastContext();
  const { id } = useParams<{ id: string }>();
  // Query host data
  const { data: hostData, loading: hostMetaDataLoading, error } = useQuery<
    HostQuery,
    HostQueryVariables
  >(GET_HOST, {
    variables: { id },
    onError: (err) => {
      dispatchToast.error(
        `There was an error loading the host: ${err.message}`
      );
    },
  });

  const host = hostData?.host;
  const { distro, id: hostId, hostUrl, user } = host || {};
  const bootstrapMethod = distro?.bootstrapMethod;
  const status = host?.status as HostStatus;
  const sshCommand = `ssh ${user}@${hostUrl}`;
  const tag = host?.tag ?? "";
  const timeZone = useUserTimeZone();

  const { search } = useLocation();

  const page = getPageFromSearch(search);
  const limit = getLimitFromSearch(search);
  // Query hostEvent data
  const { data: hostEventData, loading: hostEventLoading } = useQuery<
    HostEventsQuery,
    HostEventsQueryVariables
  >(GET_HOST_EVENTS, {
    variables: { id, tag, page, limit },
  });

  const hostEvents = hostEventData?.hostEvents;
  const eventsCount = hostEvents?.count;
  // UPDATE STATUS MODAL VISIBILITY STATE
  const [
    isUpdateStatusModalVisible,
    setIsUpdateStatusModalVisible,
  ] = useState<boolean>(false);

  usePageTitle(`Host${hostId ? ` - ${hostId}` : ""}`);

  const canRestartJasper =
    host?.status === "running" &&
    (bootstrapMethod === "ssh" || bootstrapMethod === "user-data");
  return (
    <PageWrapper data-cy="host-page">
      {host && (
        <>
          <PageTitle
            title={`Host: ${hostId}`}
            badge={<HostStatusBadge status={status} />}
            loading={hostMetaDataLoading}
            hasData
            size="large"
            buttons={
              <div>
                <ButtonsWrapper>
                  <ButtonSpacer>
                    <Button
                      data-cy="update-status-button"
                      onClick={() => setIsUpdateStatusModalVisible(true)}
                    >
                      Update Status
                    </Button>
                  </ButtonSpacer>
                  <RestartJasper
                    selectedHostIds={[id]}
                    hostUrl={hostUrl}
                    isSingleHost
                    canRestartJasper={canRestartJasper}
                    jasperTooltipMessage="Jasper cannot be restarted for this host"
                  />
                </ButtonsWrapper>
              </div>
            }
          />

          <PageLayout>
            <PageSider width={350}>
              <Metadata
                loading={hostMetaDataLoading}
                data={hostData}
                error={error}
              />
              {hostUrl && (
                <Code language="shell" data-cy="ssh-command">
                  {sshCommand}
                </Code>
              )}
            </PageSider>
            <PageLayout>
              <PageContent>
                <HostTable
                  loading={hostEventLoading}
                  eventData={hostEventData}
                  error={error}
                  timeZone={timeZone}
                  page={page}
                  limit={limit}
                  eventsCount={eventsCount}
                />
              </PageContent>
            </PageLayout>
          </PageLayout>
        </>
      )}
      <UpdateStatusModal
        data-cy="update-host-status-modal"
        hostIds={[id]}
        visible={isUpdateStatusModalVisible}
        closeModal={() => setIsUpdateStatusModalVisible(false)}
        isSingleHost
      />
    </PageWrapper>
  );
};
const ButtonSpacer = styled.span`
  margin-right: 32px;
`;

const ButtonsWrapper = styled.div`
  white-space: nowrap;
`;
