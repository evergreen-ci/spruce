import React from "react";
import { useMutation } from "@apollo/client";
import { Popconfirm, Tooltip } from "antd";
import { useHostsTableAnalytics } from "analytics";
import { Button } from "components/Button";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { useToastContext } from "context/toast";
import {
  ReprovisionToNewMutation,
  ReprovisionToNewMutationVariables,
} from "gql/generated/types";
import { REPROVISION_TO_NEW } from "gql/mutations";

interface Props {
  selectedHostIds: string[];
  hostUrl?: string;
  isSingleHost?: boolean;
  canReprovision: boolean;
  reprovisionTooltipMessage: string;
}

export const Reprovision: React.FC<Props> = ({
  selectedHostIds,
  hostUrl,
  isSingleHost,
  canReprovision,
  reprovisionTooltipMessage,
}) => {
  const hostsTableAnalytics = useHostsTableAnalytics(isSingleHost);
  const dispatchToast = useToastContext();

  // REPROVISION MUTATION
  const [reprovisionToNew, { loading: loadingReprovision }] = useMutation<
    ReprovisionToNewMutation,
    ReprovisionToNewMutationVariables
  >(REPROVISION_TO_NEW, {
    onCompleted({ reprovisionToNew: numberOfHostsUpdated }) {
      const successMessage = isSingleHost
        ? `Marked host for reprovision`
        : `Marked hosts for reprovision for ${numberOfHostsUpdated} host${
            numberOfHostsUpdated === 1 ? "" : "s"
          }`;
      dispatchToast.success(successMessage);
    },
    onError({ message }) {
      dispatchToast.error(message);
    },
  });

  const onClickReprovisionConfirm = () => {
    hostsTableAnalytics.sendEvent({ name: "Reprovision" });
    reprovisionToNew({ variables: { hostIds: selectedHostIds } });
  };

  const titleText = isSingleHost
    ? `Reprovision host ${hostUrl}?`
    : `Reprovision ${selectedHostIds.length} host${
        selectedHostIds.length > 1 ? "s" : ""
      }?`;

  return (
    <ConditionalWrapper
      condition={!canReprovision}
      wrapper={(children) => (
        <Tooltip title={reprovisionTooltipMessage}>
          <span>{children}</span>
        </Tooltip>
      )}
    >
      <Popconfirm
        title={titleText}
        onConfirm={onClickReprovisionConfirm}
        icon={null}
        placement="bottom"
        okText="Yes"
        okButtonProps={{ loading: loadingReprovision }}
        cancelText="No"
        cancelButtonProps={{ disabled: loadingReprovision }}
      >
        <Button
          data-cy="reprovision-button"
          disabled={selectedHostIds.length === 0 || !canReprovision}
        >
          Reprovision
        </Button>
      </Popconfirm>
    </ConditionalWrapper>
  );
};
