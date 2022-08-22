import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import Card from "@leafygreen-ui/card";
import { Skeleton } from "antd";
import { usePreferencesAnalytics } from "analytics";
import { SpruceForm } from "components/SpruceForm";
import { timeZones } from "constants/fieldMaps";
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

export const ProfileTab: React.VFC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const dispatchToast = useToastContext();

  const { userSettings, loading } = useUserSettings();
  const { githubUser, timezone, region } = userSettings ?? {};
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
  });

  const [hasErrors, setHasErrors] = useState(false);
  const [formState, setFormState] = useState({
    timezone,
    region,
    githubUser: { lastKnownAs },
  });
  const handleSubmit = () => {
    updateUserSettings({
      variables: {
        userSettings: {
          ...formState,
        },
      },
    });
    sendEvent({
      name: "Save Profile Info",
      params: {
        userSettings: {
          timezone: formState.timezone,
          region: formState.region,
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
            schema={{
              properties: {
                githubUser: {
                  title: null,
                  properties: {
                    lastKnownAs: {
                      type: "string",
                      title: "Github Username",
                      description: "Your Github username",
                    },
                  },
                },
                timezone: {
                  type: "string",
                  title: "Timezone",
                  description: "Your timezone",
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
                  description: "Your AWS region",
                  enum: awsRegions,
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
