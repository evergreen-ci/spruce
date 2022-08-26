import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import Card from "@leafygreen-ui/card";
import { Skeleton } from "antd";
import { usePreferencesAnalytics } from "analytics";
import { SpruceForm } from "components/SpruceForm";
import { timeZones, dateFormats } from "constants/fieldMaps";
import { size } from "constants/tokens";
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

  const { userSettings, loading } = useUserSettings();
  const { githubUser, timezone, region, dateFormat } = userSettings ?? {};
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
    refetchQueries: ["GetUserSettings"],
  });

  const [hasErrors, setHasErrors] = useState(false);
  const [formState, setFormState] = useState<{
    timezone: string;
    region: string;
    githubUser: { lastKnownAs?: string };
    dateFormat: string;
  }>({
    timezone,
    region,
    githubUser: { lastKnownAs },
    dateFormat,
  });

  useEffect(() => {
    setFormState({
      githubUser: omitTypename(githubUser || {}),
      timezone,
      region,
      dateFormat,
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
          timezone: formState.timezone,
          region: formState.region,
          dateFormat: formState.dateFormat,
        },
      },
    });
  };

  if (loading || awsRegionLoading) {
    return <Skeleton active />;
  }

  return (
    <div>
      {/* @ts-expect-error */}
      <PreferencesCard>
        <ContentWrapper>
          <SpruceForm
            onChange={({ formData, errors }) => {
              setHasErrors(errors.length > 0);
              setFormState(formData);
            }}
            formData={formState}
            uiSchema={{
              timezone: {
                "ui:placeholder": "Select a timezone",
              },
              region: {
                "ui:placeholder": "Select an AWS region",
              },
              githubUser: {
                lastKnownAs: {
                  "ui:placeholder": "Enter your GitHub username",
                },
              },
              dateFormat: {
                "ui:placeholder": "Select a date format",
              },
            }}
            schema={{
              properties: {
                githubUser: {
                  title: null,
                  properties: {
                    lastKnownAs: {
                      type: "string",
                      title: "GitHub Username",
                    },
                  },
                },
                timezone: {
                  type: "string",
                  title: "Timezone",
                  oneOf: [
                    ...timeZones.map(({ str, value }) => ({
                      type: "string" as "string",
                      title: str,
                      enum: [value],
                    })),
                  ],
                },
                region: {
                  type: "string",
                  title: "AWS Region",
                  enum: awsRegions,
                },
                dateFormat: {
                  type: "string",
                  title: "Date Format",
                  oneOf: [
                    ...dateFormats.map(({ str, value }) => ({
                      type: "string" as "string",
                      title: str,
                      enum: [value],
                    })),
                  ],
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
      </PreferencesCard>
    </div>
  );
};

const ContentWrapper = styled.div`
  width: 50%;
`;

// @ts-expect-error
const PreferencesCard = styled(Card)`
  padding-left: ${size.m};
  padding-top: ${size.m};
  padding-bottom: 40px;
  margin-bottom: 30px;
  width: 100%;
`;
