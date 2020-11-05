import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import Card from "@leafygreen-ui/card";
import { Body } from "@leafygreen-ui/typography";
import { usePreferencesAnalytics } from "analytics";
import { useBannerDispatchContext } from "context/banners";
import {
  ClearMySubscriptionsMutation,
  ClearMySubscriptionsMutationVariables,
} from "gql/generated/types";
import { CLEAR_MY_SUBSCRIPTIONS } from "gql/mutations";
import { PreferencesModal } from "pages/preferences/preferencesTabs/PreferencesModal";

export const ClearSubscriptionsCard: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { sendEvent } = usePreferencesAnalytics();
  const dispatchBanner = useBannerDispatchContext();

  const [clearMySubscriptions, { loading }] = useMutation<
    ClearMySubscriptionsMutation,
    ClearMySubscriptionsMutationVariables
  >(CLEAR_MY_SUBSCRIPTIONS, {
    onCompleted: (result) => {
      setShowModal(false);
      dispatchBanner.successBanner(
        `Successfully cleared ${
          result.clearMySubscriptions
        } subscription${result.clearMySubscriptions !== 1 && "s"}!`
      );
    },
    onError: (err) => {
      setShowModal(false);
      dispatchBanner.errorBanner(
        `Error while clearing subscriptions: '${err.message}'`
      );
    },
  });

  return (
    <>
      <PreferencesCard>
        <ContentWrapper>
          <Body>
            To clear all subscriptions you have made on individual Version and
            Task pages.
          </Body>
          <StyledClearSubscriptionButton
            data-cy="clear-subscriptions-button"
            variant={Variant.Danger}
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

const StyledClearSubscriptionButton = styled(Button)`
  margin-top: 36px;
`;

const ContentWrapper = styled.div`
  width: 50%;
`;
const PreferencesCard = styled(Card)`
  padding-left: 25px;
  padding-top: 25px;
  padding-bottom: 40px;
  margin-bottom: 30px;
  width: 100%;
`;
