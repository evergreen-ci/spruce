import { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { Body } from "@leafygreen-ui/typography";
import { usePreferencesAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import { SettingsCard } from "components/SettingsCard";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  ClearMySubscriptionsMutation,
  ClearMySubscriptionsMutationVariables,
} from "gql/generated/types";
import { CLEAR_MY_SUBSCRIPTIONS } from "gql/mutations";

export const ClearSubscriptionsCard: React.VFC = () => {
  const [showModal, setShowModal] = useState(false);
  const { sendEvent } = usePreferencesAnalytics();
  const dispatchToast = useToastContext();

  const [clearMySubscriptions, { loading }] = useMutation<
    ClearMySubscriptionsMutation,
    ClearMySubscriptionsMutationVariables
  >(CLEAR_MY_SUBSCRIPTIONS, {
    onCompleted: (result) => {
      setShowModal(false);
      dispatchToast.success(
        `Successfully cleared ${result.clearMySubscriptions} subscription${
          result.clearMySubscriptions !== 1 && "s"
        }!`
      );
    },
    onError: (err) => {
      setShowModal(false);
      dispatchToast.error(
        `Error while clearing subscriptions: '${err.message}'`
      );
    },
  });

  return (
    <>
      <SettingsCard>
        <Body>
          Clear all subscriptions you have made on individual Version and Task
          pages:
        </Body>
        <StyledClearSubscriptionButton
          data-cy="clear-subscriptions-button"
          variant={Variant.Danger}
          onClick={() => setShowModal(true)}
        >
          Clear all previous subscriptions
        </StyledClearSubscriptionButton>
      </SettingsCard>
      <ConfirmationModal
        open={showModal}
        title="Clear All Subscriptions"
        onConfirm={() => {
          clearMySubscriptions();
          sendEvent({
            name: "Clear Subscriptions",
          });
        }}
        onCancel={() => setShowModal(false)}
        variant="danger"
        buttonText="Clear All"
        submitDisabled={loading}
      >
        Are you sure you want to clear all subscriptions you have made on
        individual Version and Task pages?
      </ConfirmationModal>
    </>
  );
};

const StyledClearSubscriptionButton = styled(Button)`
  margin-top: ${size.m};
`;
