import React from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { useHostsTableAnalytics } from "analytics";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { useToastContext } from "context/toast";
import {
  ReprovisionToNewMutation,
  ReprovisionToNewMutationVariables,
} from "gql/generated/types";
import { REPROVISION_TO_NEW } from "gql/mutations";
import { HostPopover } from "./HostPopover";

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
    hostsTableAnalytics.sendEvent({ name: "Reprovision Host" });
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
        <StyledTooltip
          align="top"
          justify="middle"
          triggerEvent="hover"
          trigger={children}
        >
          {reprovisionTooltipMessage}
        </StyledTooltip>
      )}
    >
      {/* This div is necessary, or else the tooltip will not show. */}
      <div>
        <HostPopover
          buttonText="Reprovision"
          data-cy="reprovision-button"
          disabled={selectedHostIds.length === 0 || !canReprovision}
          titleText={titleText}
          loading={loadingReprovision}
          onClick={onClickReprovisionConfirm}
        />
      </div>
    </ConditionalWrapper>
  );
};

// @ts-expect-error
// For leafygreen Tooltip, there is a bug where you have to set the width to prevent misalignment when
// the trigger element is near the right side of a page. Ticket: https://jira.mongodb.org/browse/PD-1542
const StyledTooltip = styled(Tooltip)`
  width: 300px;
`;
