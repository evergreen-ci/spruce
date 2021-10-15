import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { SpruceForm, SpruceFormContainer } from "components/SpruceForm";
import widgets from "components/SpruceForm/Widgets";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "context/project-settings";
import {
  ProjectSettingsGeneralQuery,
  ProjectSettingsGeneralQueryVariables,
} from "gql/generated/types";
import { GET_PROJECT_SETTINGS_GENERAL } from "gql/queries";
import { MoveRepoField } from "./GeneralTab/MoveRepoField";
import { TabProps } from "./utils";

export const GeneralTab: React.FC<TabProps> = ({ tab, useRepoSettings }) => {
  const { identifier } = useParams<{ identifier: string }>();
  const { getTabFormState, updateForm } = useProjectSettingsContext();
  const currentFormState = getTabFormState(tab);

  const { data } = useQuery<
    ProjectSettingsGeneralQuery,
    ProjectSettingsGeneralQueryVariables
  >(GET_PROJECT_SETTINGS_GENERAL, {
    variables: { identifier },
  });

  const initialFormState = useMemo(() => {
    const projectRef = data?.projectSettings.projectRef || {};
    return gqlToSchema(projectRef);
  }, [data]);
  usePopulateForm(initialFormState, tab);

  return (
    <>
      <SpruceFormContainer title="General Configuration">
        <SpruceForm
          schema={generalConfiguration.schema}
          fields={{ moveRepo: MoveRepoField }}
          formData={currentFormState}
          onChange={({ formData }) => updateForm(tab, formData)}
          uiSchema={{
            ...generalConfiguration.uiSchema,
            repositoryInfo: {
              ...generalConfiguration.uiSchema.repositoryInfo,
              options: { useRepoSettings },
            },
          }}
        />
      </SpruceFormContainer>
    </>
  );
};

const gqlToSchema = (gqlData) => {
  if (!Object.keys(gqlData).length) {
    return {};
  }
  const {
    enabled,
    owner,
    repo,
    branch,
    displayName,
    batchTime,
    remotePath,
    spawnHostScriptPath,
  } = gqlData;
  return {
    enabled,
    repositoryInfo: {
      owner,
      repo,
    },
    branch,
    other: {
      displayName,
      batchTime,
      remotePath,
      spawnHostScriptPath,
    },
  };
};

const generalConfiguration = {
  schema: {
    type: "object" as "object",
    properties: {
      enabled: {
        type: "boolean" as "boolean",
        enumNames: ["Enabled", "Disabled"],
      },
      repositoryInfo: {
        type: "object" as "object",
        title: "Repository Info",
        properties: {
          owner: {
            type: "string" as "string",
            title: "Owner",
          },
          repo: {
            type: "string" as "string",
            title: "Repository",
          },
        },
      },
      branch: {
        type: "string" as "string",
        title: "Branch Name",
      },
      other: {
        type: "object" as "object",
        title: "Other",
        properties: {
          displayName: {
            type: "string" as "string",
            title: "Display Name",
          },
          batchTime: {
            type: "number" as "number",
            title: "Batch Time",
          },
          remotePath: {
            type: "string" as "string",
            title: "Config File",
          },
          spawnHostScriptPath: {
            type: "string" as "string",
            title: "Spawn Host Script Path",
          },
        },
      },
    },
  },
  uiSchema: {
    enabled: {
      "ui:widget": widgets.RadioBoxWidget,
    },
    repositoryInfo: {
      "ui:field": "moveRepo",
      "ui:disabled": true,
    },
    other: {
      batchTime: {
        "ui:description":
          "The interval of time (in minutes) that Evergreen should wait in between activating the latest version.",
        "ui:emptyValue": 9,
      },
      spawnHostScriptPath: {
        "ui:description":
          "This is the bash setup script to optionally run on spawn hosts created from tasks.",
      },
    },
  },
};
