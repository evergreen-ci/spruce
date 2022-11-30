import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Banner from "@leafygreen-ui/banner";
import { palette } from "@leafygreen-ui/palette";
import TextInput from "@leafygreen-ui/text-input";
import { Popconfirm } from "antd";
import Cookies from "js-cookie";
import { SLACK_NOTIFICATION_BANNER } from "constants/cookies";
import { fontSize } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
  GetUserSettingsQuery,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { GET_USER_SETTINGS } from "gql/queries";

const { blue } = palette;

export const SlackNotificationBanner = () => {
  const dispatchToast = useToastContext();

  // UPDATE USER SETTINGS MUTATION
  const [updateUserSettings, { loading: loadingUpdateUserSettings }] =
    useMutation<
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
  const { data: userSettingsData } =
    useQuery<GetUserSettingsQuery>(GET_USER_SETTINGS);
  const { userSettings } = userSettingsData || {};
  const { slackUsername: defaultSlackUsername, notifications } =
    userSettings || {};
  const { patchFinish, patchFirstFailure } = notifications || {};

  const [slackUsername, setSlackUsername] = useState(
    () => defaultSlackUsername
  );

  const hasClosedSlackBanner = () =>
    Boolean(Cookies.get(SLACK_NOTIFICATION_BANNER));

  const [hasClosedBanner, setHasClosedBanner] = useState(hasClosedSlackBanner);

  const hideBanner = () => {
    Cookies.set(SLACK_NOTIFICATION_BANNER, "true", { expires: 60 });
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
    hideBanner();
  };

  // let's only show the banner if we have data for the user settings and the user has not closed the banner
  // this prevents a flicker of the banner on initial load
  const hasSetNotifications =
    !notifications &&
    (isNotificationSet(patchFirstFailure) || isNotificationSet(patchFinish));

  const showSlackBanner = !hasClosedBanner && !hasSetNotifications;

  return showSlackBanner ? (
    <Banner
      variant="info"
      data-cy="slack-notification-banner"
      dismissible
      onClose={hideBanner}
    >
      You can receive a Slack notification when your patch is ready.
      <Popconfirm
        title={
          <TextInput
            label="Slack Username"
            data-cy="slack-username-input"
            value={slackUsername}
            onChange={(e) => setSlackUsername(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && saveNotificationSettings()}
            autoFocus
          />
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
  ) : null;
};

const isNotificationSet = (field: string) =>
  field !== "" && field !== undefined;

const SubscribeButton = styled.span`
  text-decoration: underline;
  text-decoration-color: ${blue.dark2};
  cursor: pointer;
  color: ${blue.dark2};
  font-size: ${fontSize.m};
`;
