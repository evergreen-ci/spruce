import { useCallback, useMemo } from "react";
import { SpruceForm, SpruceFormContainer } from "components/SpruceForm";
import widgets from "components/SpruceForm/Widgets";
import { ProjectSettingsTabRoutes } from "constants/routes";
import {
  usePopulateForm,
  useProjectSettingsContext,
} from "context/project-settings";
import { MoveRepoField } from "./GeneralTab/MoveRepoField";
import { GeneralTabProps } from "./types";

const tab = ProjectSettingsTabRoutes.General;

export const GeneralTab: React.FC<GeneralTabProps> = ({
  data,
  useRepoSettings,
}) => {
  const { getTabFormState, updateForm } = useProjectSettingsContext();
  const currentFormState = getTabFormState(tab);

  const initialFormState = useMemo(() => gqlToSchema(data), [data]);
  usePopulateForm(initialFormState, tab);

  const onChange = useCallback(({ formData }) => updateForm(tab, formData), [
    updateForm,
  ]);

  return (
    <>
      <SpruceFormContainer title="General Configuration">
        <SpruceForm
          schema={generalConfiguration.schema}
          fields={{ moveRepo: MoveRepoField }}
          formData={currentFormState}
          onChange={onChange}
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

const gqlToSchema = ({
  enabled = false,
  owner,
  repo,
  branch,
  displayName,
  batchTime = 0,
  remotePath,
  spawnHostScriptPath,
}) => ({
  enabled: enabled ? "enabled" : "disabled",
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
});

const generalConfiguration = {
  schema: {
    type: "object" as "object",
    properties: {
      enabled: {
        type: "string" as "string",
        enum: ["enabled", "disabled"],
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
