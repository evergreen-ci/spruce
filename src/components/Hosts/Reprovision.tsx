import { useMutation } from "@apollo/client";
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
  canReprovision,
  hostUrl,
  isSingleHost,
  reprovisionTooltipMessage,
  selectedHostIds,
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
        ? `Marked host to reprovision`
        : `Marked hosts to reprovision for ${numberOfHostsUpdated} host${
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
        <Tooltip
          align="top"
          justify="middle"
          triggerEvent="hover"
          trigger={children}
        >
          {reprovisionTooltipMessage}
        </Tooltip>
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
