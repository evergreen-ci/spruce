import React from "react";
import { useMutation } from "@apollo/client";
import { Popconfirm, Tooltip } from "antd";
import { useHostsTableAnalytics } from "analytics";
import { Button } from "components/Button";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { useToastContext } from "context/toast";
import {
  RestartJasperMutation,
  RestartJasperMutationVariables,
} from "gql/generated/types";
import { RESTART_JASPER } from "gql/mutations";

interface Props {
  selectedHostIds: string[];
  hostUrl?: string;
  isSingleHost?: boolean;
  canRestartJasper: boolean;
  jasperTooltipMessage: string;
}

export const RestartJasper: React.FC<Props> = ({
  selectedHostIds,
  hostUrl,
  isSingleHost,
  canRestartJasper,
  jasperTooltipMessage,
}) => {
  const hostsTableAnalytics = useHostsTableAnalytics(isSingleHost);
  const dispatchToast = useToastContext();

  // RESTART JASPER MUTATION
  const [restartJasper, { loading: loadingRestartJasper }] = useMutation<
    RestartJasperMutation,
    RestartJasperMutationVariables
  >(RESTART_JASPER, {
    onCompleted({ restartJasper: numberOfHostsUpdated }) {
      const successMessage = isSingleHost
        ? `Marked Jasper as restarting`
        : `Marked Jasper as restarting for ${numberOfHostsUpdated} host${
            numberOfHostsUpdated === 1 ? "" : "s"
          }`;
      dispatchToast.success(successMessage);
    },
    onError({ message }) {
      dispatchToast.error(message);
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
    <ConditionalWrapper
      condition={!canRestartJasper}
      wrapper={(children) => (
        <Tooltip title={jasperTooltipMessage}>
          <span>{children}</span>
        </Tooltip>
      )}
    >
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
          disabled={selectedHostIds.length === 0 || !canRestartJasper}
        >
          Restart Jasper
        </Button>
      </Popconfirm>
    </ConditionalWrapper>
  );
};
