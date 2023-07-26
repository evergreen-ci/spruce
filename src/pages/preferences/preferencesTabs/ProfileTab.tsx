import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { Skeleton } from "antd";
import { usePreferencesAnalytics } from "analytics";
import { SettingsCard } from "components/SettingsCard";
import { SpruceForm } from "components/SpruceForm";
import { timeZones, dateFormats } from "constants/fieldMaps";
import { useToastContext } from "context/toast";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
  AwsRegionsQuery,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { GET_AWS_REGIONS } from "gql/queries";
import { useUserSettings } from "hooks";
import { omitTypename } from "utils/string";

export const ProfileTab: React.VFC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const dispatchToast = useToastContext();

  const { loading, userSettings } = useUserSettings();
  const { dateFormat, githubUser, region, timezone } = userSettings ?? {};
  const lastKnownAs = githubUser?.lastKnownAs || "";

  const { data: awsRegionData, loading: awsRegionLoading } =
    useQuery<AwsRegionsQuery>(GET_AWS_REGIONS);
  const awsRegions = awsRegionData?.awsRegions || [];

  const [updateUserSettings, { loading: updateLoading }] = useMutation<
    UpdateUserSettingsMutation,
    UpdateUserSettingsMutationVariables
  >(UPDATE_USER_SETTINGS, {
    onCompleted: () => {
      dispatchToast.success(`Your changes have successfully been saved.`);
    },
    onError: (err) => {
      dispatchToast.error(`Error while saving settings: '${err.message}'`);
    },
    refetchQueries: ["UserSettings"],
  });

  const [hasErrors, setHasErrors] = useState(false);
  const [formState, setFormState] = useState<{
    timezone: string;
    region: string;
    githubUser: { lastKnownAs?: string };
    dateFormat: string;
  }>({
    dateFormat,
    githubUser: { lastKnownAs },
    region,
    timezone,
  });

  useEffect(() => {
    setFormState({
      dateFormat,
      githubUser: omitTypename(githubUser || {}),
      region,
      timezone,
    });
  }, [dateFormat, githubUser, region, timezone]);

  const handleSubmit = () => {
    updateUserSettings({
      variables: {
        userSettings: formState,
      },
    });
    sendEvent({
      name: "Save Profile Info",
      params: {
        userSettings: {
          dateFormat: formState.dateFormat,
          region: formState.region,
          timezone: formState.timezone,
        },
      },
    });
  };

  if (loading || awsRegionLoading) {
    return <Skeleton active />;
  }

  return (
    <SettingsCard>
      <ContentWrapper>
        <SpruceForm
          onChange={({ errors, formData }) => {
            setHasErrors(errors.length > 0);
            setFormState(formData);
          }}
          formData={formState}
          uiSchema={{
            dateFormat: {
              "ui:placeholder": "Select a date format",
            },
            githubUser: {
              lastKnownAs: {
                "ui:placeholder": "Enter your GitHub username",
              },
            },
            region: {
              "ui:placeholder": "Select an AWS region",
            },
            timezone: {
              "ui:placeholder": "Select a timezone",
            },
          }}
          schema={{
            properties: {
              dateFormat: {
                oneOf: [
                  ...dateFormats.map(({ str, value }) => ({
                    enum: [value],
                    title: str,
                    type: "string" as "string",
                  })),
                ],
                title: "Date Format",
                type: "string",
              },
              githubUser: {
                properties: {
                  lastKnownAs: {
                    title: "GitHub Username",
                    type: "string",
                  },
                },
                title: null,
              },
              region: {
                enum: awsRegions,
                title: "AWS Region",
                type: "string",
              },
              timezone: {
                oneOf: [
                  ...timeZones.map(({ str, value }) => ({
                    enum: [value],
                    title: str,
                    type: "string" as "string",
                  })),
                ],
                title: "Timezone",
                type: "string",
              },
            },
          }}
        />
        <Button
          data-cy="save-profile-changes-button"
          variant={Variant.Primary}
          disabled={!hasErrors || updateLoading}
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </ContentWrapper>
    </SettingsCard>
  );
};

const ContentWrapper = styled.div`
  width: 50%;
`;
