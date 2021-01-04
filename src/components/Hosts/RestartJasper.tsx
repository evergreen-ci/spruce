import React from "react";
import { useMutation } from "@apollo/client";
import { Popconfirm } from "antd";
import { useHostsTableAnalytics } from "analytics";
import { Button } from "components/Button";
import { useBannerDispatchContext } from "context/banners";
import {
  RestartJasperMutation,
  RestartJasperMutationVariables,
} from "gql/generated/types";
import { RESTART_JASPER } from "gql/mutations";

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
        data-cy="restart-jasper-button"
        disabled={selectedHostIds.length === 0}
      >
        Restart Jasper
      </Button>
    </Popconfirm>
  );
};
