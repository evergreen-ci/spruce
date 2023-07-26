import { useState } from "react";
import { useMutation } from "@apollo/client";
import Button, { Variant } from "@leafygreen-ui/button";
import { usePreferencesAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import { useToastContext } from "context/toast";
import {
  ClearMySubscriptionsMutation,
  ClearMySubscriptionsMutationVariables,
} from "gql/generated/types";
import { CLEAR_MY_SUBSCRIPTIONS } from "gql/mutations";

export const ClearSubscriptions: React.VFC = () => {
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
    refetchQueries: ["UserSubscriptions"],
  });

  return (
    <>
      <Button
        data-cy="clear-subscriptions-button"
        variant={Variant.Danger}
        onClick={() => setShowModal(true)}
      >
        Clear all previous subscriptions
      </Button>
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
        individual version, task, and project pages?
      </ConfirmationModal>
    </>
  );
};
