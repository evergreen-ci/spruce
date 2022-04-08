import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import Card from "@leafygreen-ui/card";
import { Body } from "@leafygreen-ui/typography";
import { usePreferencesAnalytics } from "analytics";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  ClearMySubscriptionsMutation,
  ClearMySubscriptionsMutationVariables,
} from "gql/generated/types";
import { CLEAR_MY_SUBSCRIPTIONS } from "gql/mutations";
import { PreferencesModal } from "pages/preferences/preferencesTabs/PreferencesModal";

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
      {/* @ts-expect-error */}
      <PreferencesCard>
        <ContentWrapper>
          <Body>
            To clear all subscriptions you have made on individual Version and
            Task pages.
          </Body>
          <StyledClearSubscriptionButton
            data-cy="clear-subscriptions-button"
            variant={Variant.Danger} // @ts-expect-error
            onClick={() => setShowModal(true)}
          >
            Clear all previous subscriptions
          </StyledClearSubscriptionButton>
        </ContentWrapper>
      </PreferencesCard>
      <PreferencesModal
        visible={showModal}
        title="Are you sure you want to clear all subscriptions you have made on individual Version and Task pages?"
        onSubmit={() => {
          clearMySubscriptions();
          sendEvent({
            name: "Clear Subscriptions",
          });
        }}
        onCancel={() => setShowModal(false)}
        action="Clear All"
        disabled={loading}
      />
    </>
  );
};

// @ts-expect-error
const StyledClearSubscriptionButton = styled(Button)`
  margin-top: ${size.m};
`;

const ContentWrapper = styled.div`
  width: 50%;
`;

// @ts-expect-error
const PreferencesCard = styled(Card)`
  padding: ${size.m};
  margin-bottom: ${size.m};
  width: 100%;
`;
