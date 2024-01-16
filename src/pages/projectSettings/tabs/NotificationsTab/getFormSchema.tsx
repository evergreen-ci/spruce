import { InlineCode, Description } from "@leafygreen-ui/typography";
import {
  getEventSchema,
  getNotificationSchema,
} from "components/Notifications/form";
import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { projectTriggers } from "constants/triggers";
import { BannerTheme } from "gql/generated/types";
import { useSpruceConfig } from "hooks";
import { projectSubscriptionMethods as subscriptionMethods } from "types/subscription";
import { ProjectType, form } from "../utils";
import { NotificationsFormState } from "./types";

const { radioBoxOptions } = form;
export const getFormSchema = (
  repoData: NotificationsFormState | null,
  projectType: ProjectType,
): ReturnType<GetFormSchema> => {
  const { schema: eventSchema, uiSchema: eventUiSchema } = getEventSchema(
    [],
    projectTriggers,
  );
  const { schema: notificationSchema, uiSchema: notificationUiSchema } =
    getNotificationSchema(subscriptionMethods);

  return {
    fields: {},
    schema: {
      type: "object" as "object",
      properties: {
        buildBreakSettings: {
          type: "object" as "object",
          title: "Performance Plugins",
          properties: {
            notifyOnBuildFailure: {
              type: ["boolean", "null"],
              title: "Build Break Notifications",
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.buildBreakSettings?.notifyOnBuildFailure,
              ),
            },
          },
        },
        ...(projectType !== ProjectType.Repo && {
          banner: {
            type: "object" as "object",
            title: "Project Banner",
            properties: {
              bannerData: {
                type: "object" as "object",
                title: "",
                description:
                  "Add a banner to pages that represent data from this project. JIRA tickets will be linked automatically.",
                properties: {
                  theme: {
                    type: "string" as "string",
                    title: "Theme",
                    default: BannerTheme.Announcement,
                    oneOf: [
                      {
                        type: "string" as "string",
                        title: "Announcement",
                        enum: [BannerTheme.Announcement],
                      },
                      {
                        type: "string" as "string",
                        title: "Information",
                        enum: [BannerTheme.Information],
                      },
                      {
                        type: "string" as "string",
                        title: "Warning",
                        enum: [BannerTheme.Warning],
                      },
                      {
                        type: "string" as "string",
                        title: "Important",
                        enum: [BannerTheme.Important],
                      },
                    ],
                  },
                  text: {
                    type: "string" as "string",
                    title: "Banner Text",
                  },
                },
              },
            },
          },
        }),
        subscriptions: {
          type: "array" as "array",
          title: "Subscriptions",
          items: {
            type: "object" as "object",
            properties: {
              subscriptionData: {
                type: "object" as "object",
                title: "",
                properties: {
                  event: eventSchema,
                  notification: notificationSchema,
                },
              },
            },
          },
        },
      },
    },
    uiSchema: {
      buildBreakSettings: {
        "ui:rootFieldId": "plugins",
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        notifyOnBuildFailure: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description":
            "Send notification of build breaks to admins of a project if the commit author is not signed up to receive notifications.",
        },
      },
      ...(projectType !== ProjectType.Repo && {
        banner: {
          "ui:rootFieldId": "banner",
          "ui:ObjectFieldTemplate": CardFieldTemplate,
          bannerData: {
            text: {
              "ui:placeholder": "Enter banner text",
              "ui:data-cy": "banner-text",
            },
            theme: {
              "ui:data-cy": "banner-theme",
            },
          },
        },
      }),
      subscriptions: {
        "ui:placeholder": "No subscriptions are defined.",
        "ui:descriptionNode": <HelpText />,
        "ui:addButtonText": "Add Subscription",
        "ui:orderable": false,
        "ui:useExpandableCard": true,
        items: {
          "ui:displayTitle": "New Subscription",
          "ui:label": false,
          subscriptionData: {
            event: eventUiSchema,
            notification: notificationUiSchema,
          },
        },
      },
    },
  };
};

const HelpText: React.FC = () => {
  const spruceConfig = useSpruceConfig();
  const slackName = spruceConfig?.slack?.name;

  return (
    <Description>
      Private slack channels may require further Slack configuration.
      {slackName && (
        <div>
          Invite evergreen to your private Slack channels by running{" "}
          <InlineCode>invite {slackName}</InlineCode> in the channel.
        </div>
      )}
    </Description>
  );
};
