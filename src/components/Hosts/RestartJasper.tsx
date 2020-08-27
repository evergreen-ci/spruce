import React from "react";
import {
  RestartJasperMutation,
  RestartJasperMutationVariables,
} from "gql/generated/types";
import { Popconfirm } from "antd";
import { useMutation } from "@apollo/client";
import { RESTART_JASPER } from "gql/mutations";
import { useBannerDispatchContext } from "context/banners";
import { Button } from "components/Button";

import { useHostsTableAnalytics } from "analytics";

interface Props {
  selectedHostIds: string[];
  hostUrl?: string;
  isSingleHost?: boolean;
}

export const RestartJasper: React.FC<Props> = ({
  selectedHostIds,
  hostUrl,
  isSingleHost,
}) => {
  const hostsTableAnalytics = useHostsTableAnalytics(isSingleHost);
  const dispatchBanner = useBannerDispatchContext();

  // RESTART JASPER MUTATION
  const [restartJasper, { loading: loadingRestartJasper }] = useMutation<
    RestartJasperMutation,
    RestartJasperMutationVariables
  >(RESTART_JASPER, {
    onCompleted({ restartJasper: numberOfHostsUpdated }) {
      const successMessage = isSingleHost
        ? `Jasper was restarted`
        : `Jasper was restarted for ${numberOfHostsUpdated} host${
            numberOfHostsUpdated === 1 ? "" : "s"
          }`;
      dispatchBanner.successBanner(successMessage);
    },
    onError({ message }) {
      dispatchBanner.errorBanner(message);
    },
  });

  const onClickRestartJasperConfirm = () => {
    hostsTableAnalytics.sendEvent({ name: "Restart Jasper" });
    restartJasper({ variables: { hostIds: selectedHostIds } });
  };

  const titleText = isSingleHost
    ? `Restart Jasper for host ${hostUrl}?`
    : `Restart Jasper for ${selectedHostIds.length} host${
        selectedHostIds.length > 1 ? "s" : ""
      }?`;

  return (
    <Popconfirm
      title={titleText}
      onConfirm={onClickRestartJasperConfirm}
      icon={null}
      placement="bottom"
      okText="Yes"
      okButtonProps={{ loading: loadingRestartJasper }}
      cancelText="No"
      cancelButtonProps={{ disabled: loadingRestartJasper }}
    >
      <Button
        dataCy="restart-jasper-button"
        disabled={selectedHostIds.length === 0}
      >
        Restart Jasper
      </Button>
    </Popconfirm>
  );
};
