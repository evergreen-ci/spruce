import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import IconButton from "@leafygreen-ui/icon-button";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { Popconfirm, Input } from "antd";
import Cookies from "js-cookie";
import { Banners, styles } from "components/Banners";
import { PageWrapper } from "components/styles";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
  GetUserSettingsQuery,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { GET_USER_SETTINGS } from "gql/queries";
import { withBannersContext } from "hoc/withBannersContext";

const { Banner } = styles;

const { blue } = uiColors;

const slackNotificationBannerCookieKey = "slack-notification-banner";
const doNotShowslackNotificationBannerCookie = false;

export const SlackNotificationBannerCore = () => {
  const dispatchBanner = useBannerDispatchContext();
  const bannersState = useBannerStateContext();

  const [slackUsername, setSlackUsername] = useState("");

  const [cookie, setCookie] = useState(
    Cookies.get(slackNotificationBannerCookieKey)
  );

  const hideBanner = () => {
    Cookies.set(
      slackNotificationBannerCookieKey,
      doNotShowslackNotificationBannerCookie,
      { expires: 60 }
    );

    setCookie(doNotShowslackNotificationBannerCookie);
  };

  // USER SETTINGS QUERY
  const { data: userSettingsData } = useQuery<GetUserSettingsQuery>(
    GET_USER_SETTINGS
  );

  const settingsSlackNotificationPatchFinish =
    userSettingsData?.userSettings?.notifications?.patchFinish;
  const settingsSlackNotificationPatchFail =
    userSettingsData?.userSettings?.notifications?.patchFirstFailure;
  const slackUsernameFromSettings =
    userSettingsData?.userSettings?.slackUsername ?? null;

  useEffect(() => {
    if (slackUsernameFromSettings) {
      setSlackUsername(slackUsernameFromSettings);
    }
  }, [slackUsernameFromSettings, setSlackUsername]);

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
      dispatchBanner.successBanner(
        "You will now receive Slack notifications when your patches fail or succeed"
      );
    },
    onError: (err) => {
      dispatchBanner.errorBanner(
        `Error while saving settings: '${err.message}'`
      );
    },
    refetchQueries: ["GetUserSettings"],
  });

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

  const cookieExists = cookie === doNotShowslackNotificationBannerCookie;

  const showSlackBanner =
    !cookieExists &&
    settingsSlackNotificationPatchFail === "" &&
    settingsSlackNotificationPatchFinish === "";

  return (
    <StyledPageWrapper>
      <Banners
        banners={bannersState}
        removeBanner={dispatchBanner.removeBanner}
      />
      {showSlackBanner && (
        <StyledBanner
          bannerTheme="information"
          data-cy="slack-notification-banner"
        >
          <Wrapper>
            <StyledIcon glyph="InfoWithCircle" fill={blue.base} />
            <StyledBody>
              You can receive a Slack notification when your patch is ready.
            </StyledBody>
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
              onCancel={() => setSlackUsername("")}
              okText="Save"
              cancelText="Cancel"
              okButtonProps={{
                loading: loadingUpdateUserSettings,
                disabled: !slackUsername,
              }}
              cancelButtonProps={{ disabled: loadingUpdateUserSettings }}
              icon={null}
            >
              <div data-cy="subscribe-to-notifications">
                <SubscribeButton>Subscribe</SubscribeButton>
              </div>
            </Popconfirm>
          </Wrapper>
          <IconButton
            data-cy="dismiss-slack-notification-banner"
            aria-label="Close Slack Notfication Banner"
            onClick={hideBanner}
          >
            <Icon glyph="X" fill={blue.base} />{" "}
          </IconButton>
        </StyledBanner>
      )}
    </StyledPageWrapper>
  );
};

const StyledBanner = styled(Banner)`
  background-color: ${blue.light3};
  border: 1px solid;
  border-radius: 4px;
  border-color: ${blue.light2};
  border-left: 4px solid;
  border-left-color: ${blue.base};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
`;

const StyledIcon = styled(Icon)`
  margin-right: 16px;
`;

const SubscribeButton = styled(Body)`
  text-decoration: underline;
  text-decoration-color: ${blue.dark2};
  cursor: pointer;
  color: ${blue.dark2};
  font-size: 14px;
`;

const StyledPageWrapper = styled(PageWrapper)`
  margin-bottom: 0;
  padding-bottom: 0;
`;

const StyledBody = styled(Body)`
  font-size: 14px;
  color: ${blue.dark2};
  &:first-of-type {
    margin-right: 4px;
  }
`;

const SlackUsername = styled(Body)`
  font-size: 14px;
`;

export const SlackNotificationBanner = withBannersContext(
  SlackNotificationBannerCore
);
