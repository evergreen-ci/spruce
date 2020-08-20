import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Popconfirm } from "antd";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_HOST } from "gql/queries/get-host";
import { GET_HOST_EVENTS } from "gql/queries/get-host-events";
import { Banners } from "components/Banners";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import {
  HostQuery,
  HostQueryVariables,
  HostEventsQuery,
  HostEventsQueryVariables,
  RestartJasperMutation,
  RestartJasperMutationVariables,
} from "gql/generated/types";
import { usePageTitle } from "hooks/usePageTitle";
import {
  PageWrapper,
  PageSider,
  PageLayout,
  PageContent,
} from "components/styles";
import { HostStatusBadge } from "components/HostStatusBadge";
import { PageTitle } from "components/PageTitle";
import { HostStatus } from "types/host";
import { Metadata } from "pages/host/Metadata";
import { HostTable } from "pages/host/HostTable";
import Code from "@leafygreen-ui/code";
import { useUserTimeZone } from "utils/string";
import { withBannersContext } from "hoc/withBannersContext";
import { Button } from "components/Button";
import { RESTART_JASPER } from "gql/mutations";
import { UpdateStatusModal } from "components/Hosts";
import { ButtonWrapper } from "./Hosts";

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

  // Query hostEvent data
  const { data: hostEventData, loading: hostEventLoading } = useQuery<
    HostEventsQuery,
    HostEventsQueryVariables
  >(GET_HOST_EVENTS, {
    variables: { id, tag },
  });

  // RESTART JASPER MUTATION
  const [restartJasper, { loading: loadingRestartJasper }] = useMutation<
    RestartJasperMutation,
    RestartJasperMutationVariables
  >(RESTART_JASPER, {
    onCompleted() {
      dispatchBanner.successBanner(`Jasper was restarted`);
    },
    onError({ message }) {
      dispatchBanner.errorBanner(message);
    },
  });

  const onClickRestartJasperConfirm = () =>
    restartJasper({ variables: { hostIds: [id] } });

  // UPDATE STATUS MODAL VISIBILITY STATE
  const [isUpdateStatusModalVisible, setIsUpdateStatusModalVisible] = useState<
    boolean
  >(false);

  usePageTitle(`Host${hostUrl ? ` - ${hostUrl}` : ""}`);

  return (
    <PageWrapper>
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
              <>
                <ButtonWrapper>
                  <Button onClick={() => setIsUpdateStatusModalVisible(true)}>
                    Update Status
                  </Button>
                </ButtonWrapper>
                <ButtonWrapper>
                  <Popconfirm
                    title={`Restart Jasper for host ${hostUrl}?`}
                    onConfirm={onClickRestartJasperConfirm}
                    icon={null}
                    placement="bottom"
                    okText="Yes"
                    okButtonProps={{ loading: loadingRestartJasper }}
                    cancelText="No"
                    cancelButtonProps={{ disabled: loadingRestartJasper }}
                  >
                    <Button dataCy="restart-jasper-button">
                      Restart Jasper
                    </Button>
                  </Popconfirm>
                </ButtonWrapper>
              </>
            }
          />

          <PageLayout>
            <PageSider width={350}>
              <Metadata
                loading={hostMetaDataLoading}
                data={hostData}
                error={error}
                timeZone={timeZone}
              />
              <Code language="shell">{sshCommand}</Code>
            </PageSider>
            <PageLayout>
              <PageContent>
                <HostTable
                  loading={hostEventLoading}
                  eventData={hostEventData}
                  error={error}
                  timeZone={timeZone}
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

export const Host = withBannersContext(HostCore);
