import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Banner from "@leafygreen-ui/banner";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { Popconfirm, Input } from "antd";
import Cookies from "js-cookie";
import { useToastContext } from "context/toast";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
  GetUserSettingsQuery,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { GET_USER_SETTINGS } from "gql/queries";

const { blue } = uiColors;

const slackNotificationBannerCookieKey = "has-closed-slack-banner";

export const SlackNotificationBanner = () => {
  const dispatchToast = useToastContext();

  // UPDATE USER SETTINGS MUTATION
  const [
    updateUserSettings,
    { loading: loadingUpdateUserSettings },
  ] = useMutation<
    UpdateUserSettingsMutation,
    UpdateUserSettingsMutationVariables
  >(UPDATE_USER_SETTINGS, {
    onCompleted: () => {
      hideBanner();
      dispatchToast.success(
        "You will now receive Slack notifications when your patches fail or succeed"
      );
    },
    onError: (err) => {
      dispatchToast.error(`Error while saving settings: '${err.message}'`);
    },
    refetchQueries: ["GetUserSettings"],
  });

  // USER SETTINGS QUERY
  const { data: userSettingsData } = useQuery<GetUserSettingsQuery>(
    GET_USER_SETTINGS
  );
  const { userSettings } = userSettingsData || {};
  const { slackUsername: defaultSlackUsername, notifications } =
    userSettings || {};
  const { patchFinish, patchFirstFailure } = notifications || {};

  const [slackUsername, setSlackUsername] = useState(
    () => defaultSlackUsername
  );

  const hasClosedSlackBanner = () =>
    Boolean(Cookies.get(slackNotificationBannerCookieKey));

  const [hasClosedBanner, setHasClosedBanner] = useState(hasClosedSlackBanner);

  const hideBanner = () => {
    Cookies.set(slackNotificationBannerCookieKey, "true", { expires: 60 });
    setHasClosedBanner(true);
  };

  const saveNotificationSettings = () => {
    updateUserSettings({
      variables: {
        userSettings: {
          slackUsername,
          notifications: {
            patchFinish: "slack",
            patchFirstFailure: "slack",
          },
        },
      },
    });
  };

  const hasSetNotifications =
    isNotificationSet(patchFirstFailure) && isNotificationSet(patchFinish);
  const showSlackBanner = !hasClosedBanner && !hasSetNotifications;

  return (
    showSlackBanner && (
      <Banner
        variant="info"
        data-cy="slack-notification-banner"
        dismissible
        onClose={hideBanner}
      >
        You can receive a Slack notification when your patch is ready.
        <Popconfirm
          title={
            <>
              <SlackUsername weight="medium">Slack Username</SlackUsername>
              <Input
                data-cy="slack-username-input"
                value={slackUsername}
                onChange={(e) => setSlackUsername(e.target.value)}
                onPressEnter={() => saveNotificationSettings()}
              />
            </>
          }
          onConfirm={() => saveNotificationSettings()}
          okText="Save"
          cancelText="Cancel"
          okButtonProps={{
            loading: loadingUpdateUserSettings,
            disabled: !slackUsername,
          }}
          cancelButtonProps={{ disabled: loadingUpdateUserSettings }}
          icon={null}
        >
          {" "}
          <SubscribeButton data-cy="subscribe-to-notifications">
            Subscribe
          </SubscribeButton>
        </Popconfirm>
      </Banner>
    )
  );
};

const isNotificationSet = (field: string) =>
  field !== "" && field !== undefined;

const SubscribeButton = styled.span`
  text-decoration: underline;
  text-decoration-color: ${blue.dark2};
  cursor: pointer;
  color: ${blue.dark2};
  font-size: 14px;
`;

const SlackUsername = styled(Body)`
  font-size: 14px;
`;
