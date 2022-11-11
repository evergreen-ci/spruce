import { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { Body } from "@leafygreen-ui/typography";
import { usePreferencesAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  ClearMySubscriptionsMutation,
  ClearMySubscriptionsMutationVariables,
} from "gql/generated/types";
import { CLEAR_MY_SUBSCRIPTIONS } from "gql/mutations";
import { PreferencesCard } from "pages/preferences/Card";

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
      <PreferencesCard>
        <Body>
          Clear all subscriptions you have made on individual Version and Task
          pages:
        </Body>
        <StyledClearSubscriptionButton
          data-cy="clear-subscriptions-button"
          variant={Variant.Danger} // @ts-expect-error
          onClick={() => setShowModal(true)}
        >
          Clear all previous subscriptions
        </StyledClearSubscriptionButton>
      </PreferencesCard>
      <ConfirmationModal
        buttonText="Clear all"
        open={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={() => {
          clearMySubscriptions();
          sendEvent({
            name: "Clear Subscriptions",
          });
        }}
        title="Delete Subscriptions"
        submitDisabled={loading}
        variant="danger"
      >
        Are you sure you would like to clear all subscriptions you have made on
        individual Version and Task pages?
      </ConfirmationModal>
    </>
  );
};

// @ts-expect-error
const StyledClearSubscriptionButton = styled(Button)`
  margin-top: ${size.m};
`;
