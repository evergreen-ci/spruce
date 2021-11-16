import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { useHostsTableAnalytics } from "analytics";
import { Button } from "components/Button";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { useToastContext } from "context/toast";
import {
  RestartJasperMutation,
  RestartJasperMutationVariables,
} from "gql/generated/types";
import { RESTART_JASPER } from "gql/mutations";
import { HostPopover } from "./HostPopover";

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
  const [active, setActive] = useState(false);
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
        <StyledTooltip
          align="top"
          justify="middle"
          triggerEvent="hover"
          trigger={children}
        >
          {jasperTooltipMessage}
        </StyledTooltip>
      )}
    >
      <div>
        <Button
          onClick={() => setActive((prevActive) => !prevActive)}
          data-cy="restart-jasper-button"
          disabled={selectedHostIds.length === 0 || !canRestartJasper}
        >
          Restart Jasper
          <HostPopover
            titleText={titleText}
            active={active}
            loading={loadingRestartJasper}
            onClick={onClickRestartJasperConfirm}
            setActive={setActive}
          />
        </Button>
      </div>
    </ConditionalWrapper>
  );
};

// @ts-expect-error
const StyledTooltip = styled(Tooltip)`
  width: 300px;
`;
