import { useMutation } from "@apollo/client";
import Tooltip from "@leafygreen-ui/tooltip";
import { useHostsTableAnalytics } from "analytics";
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
  canRestartJasper,
  hostUrl,
  isSingleHost,
  jasperTooltipMessage,
  selectedHostIds,
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
        <Tooltip
          align="top"
          justify="middle"
          triggerEvent="hover"
          trigger={children}
        >
          {jasperTooltipMessage}
        </Tooltip>
      )}
    >
      {/* This div is necessary, or else the tooltip will not show. */}
      <div>
        <HostPopover
          buttonText="Restart Jasper"
          data-cy="restart-jasper-button"
          disabled={selectedHostIds.length === 0 || !canRestartJasper}
          titleText={titleText}
          loading={loadingRestartJasper}
          onClick={onClickRestartJasperConfirm}
        />
      </div>
    </ConditionalWrapper>
  );
};
