import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Code from "@leafygreen-ui/code";
import { useParams, useLocation } from "react-router-dom";
import { Banners } from "components/Banners";
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
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import {
  HostQuery,
  HostQueryVariables,
  HostEventsQuery,
  HostEventsQueryVariables,
} from "gql/generated/types";
import { GET_HOST } from "gql/queries/get-host";
import { GET_HOST_EVENTS } from "gql/queries/get-host-events";
import { withBannersContext } from "hoc/withBannersContext";
import { usePageTitle } from "hooks/usePageTitle";
import { HostTable } from "pages/host/HostTable";
import { Metadata } from "pages/host/Metadata";
import { HostStatus } from "types/host";
import { useUserTimeZone } from "utils/string";
import { getPageFromSearch, getLimitFromSearch } from "utils/url";

export const HostCore: React.FC = () => {
  const dispatchBanner = useBannerDispatchContext();
  const bannersState = useBannerStateContext();
  const { id } = useParams<{ id: string }>();
  // Query host data
  const { data: hostData, loading: hostMetaDataLoading, error } = useQuery<
    HostQuery,
    HostQueryVariables
  >(GET_HOST, {
    variables: { id },
    onError: (err) => {
      dispatchBanner.errorBanner(
        `There was an error loading the host: ${err.message}`
      );
    },
  });

  const host = hostData?.host;
  const hostUrl = host?.hostUrl;
  const user = host?.user;
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
  const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] = useState<
    boolean
  >(false);

  usePageTitle(`Host${hostUrl ? ` - ${hostUrl}` : ""}`);

  return (
    <PageWrapper data-cy="host-page">
      <Banners
        banners={bannersState}
        removeBanner={dispatchBanner.removeBanner}
      />
      {host && (
        <>
          <PageTitle
            title={`Host: ${hostUrl}`}
            badge={<HostStatusBadge status={status} />}
            loading={hostMetaDataLoading}
            hasData
            size="large"
            buttons={
              <div>
                <ButtonsWrapper>
                  <ButtonSpacer>
                    <Button
                      dataCy="update-status-button"
                      onClick={() => setIsUpdateStatusModalVisible(true)}
                    >
                      Update Status
                    </Button>
                  </ButtonSpacer>
                  <RestartJasper
                    selectedHostIds={[id]}
                    hostUrl={hostUrl}
                    isSingleHost
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
              <Code language="shell" data-cy="ssh-command">
                {sshCommand}
              </Code>
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
        dataCy="update-host-status-modal"
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

export const Host = withBannersContext(HostCore);
