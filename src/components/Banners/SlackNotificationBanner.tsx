import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import IconButton from "@leafygreen-ui/icon-button";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { Popconfirm, Input } from "antd";
import Cookies from "js-cookie";
import { Banners } from "components/Banners";
import { Banner } from "components/Banners/styles";
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

const slackNotificationBannerCookieKey = "slack-notification-banner";
const doNotShowslackNotificationBannerCookie = "false";

export const SlackNotificationBannerCore = () => {
  const dispatchBanner = useBannerDispatchContext();
  const bannersState = useBannerStateContext();

  const [slackUsername, setSlackUsername] = useState("");

  const hideBanner = () => {
    Cookies.set(
      slackNotificationBannerCookieKey,
      doNotShowslackNotificationBannerCookie,
      { expires: 60 }
    );
  };

  // USER SETTINGS QUERY
  const { data: userSettingsData } = useQuery<GetUserSettingsQuery>(
    GET_USER_SETTINGS
  );

  const settingsSlackNotificationPatchFinish =
    userSettingsData?.userSettings?.notifications?.patchFinish ?? null;
  const settingsSlackNotificationPatchFail =
    userSettingsData?.userSettings?.notifications?.patchFirstFailure ?? null;

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
        `You will now receive Slack notifications when your patches fail or succeed`
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
    if (!slackUsername) {
      return;
    }
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

  const cookieExists =
    Cookies.get(slackNotificationBannerCookieKey) ===
    doNotShowslackNotificationBannerCookie;

  const doNotShowSlackBanner =
    cookieExists ||
    settingsSlackNotificationPatchFail ||
    settingsSlackNotificationPatchFinish;

  return (
    <StyledPageWrapper>
      <Banners
        banners={bannersState}
        removeBanner={dispatchBanner.removeBanner}
      />
      {!doNotShowSlackBanner && (
        <StyledBanner bannerTheme="information" data-cy="sitewide-banner">
          <Wrapper>
            <StyledIcon glyph="InfoWithCircle" fill={uiColors.blue.base} />
            <StyledBody>
              You can receive a Slack notification when your patch is ready.
            </StyledBody>
            <Popconfirm
              title={
                <>
                  <SlackUsername weight="medium">Slack Username</SlackUsername>
                  <Input
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
              okButtonProps={{ loading: loadingUpdateUserSettings }}
              cancelButtonProps={{ disabled: loadingUpdateUserSettings }}
              icon={null}
            >
              <div>
                <SubscribeButton>Subscribe</SubscribeButton>
              </div>
            </Popconfirm>
          </Wrapper>
          <IconButton
            data-cy="dismiss-slack-notification-banner"
            aria-label="Close Slack Notfication Banner"
            onClick={hideBanner}
          >
            <Icon glyph="X" fill={uiColors.blue.base} />{" "}
          </IconButton>
        </StyledBanner>
      )}
    </StyledPageWrapper>
  );
};

const StyledBanner = styled(Banner)`
  background-color: ${uiColors.blue.light3};
  border: 1px solid;
  border-radius: 4px;
  border-color: ${uiColors.blue.light2};
  border-left: 4px solid;
  border-left-color: ${uiColors.blue.base};
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
  text-decoration-color: ${uiColors.blue.dark2};
  cursor: pointer;
  color: ${uiColors.blue.dark2};
  font-size: 14px;
`;

const StyledPageWrapper = styled(PageWrapper)`
  margin-bottom: 15px;
`;

const StyledBody = styled(Body)`
  font-size: 14px;
  color: ${uiColors.blue.dark2};
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
