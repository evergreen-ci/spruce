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
  projectType: ProjectType
): ReturnType<GetFormSchema> => {
  const { schema: eventSchema, uiSchema: eventUiSchema } = getEventSchema(
    [],
    projectTriggers
  );
  const { schema: notificationSchema, uiSchema: notificationUiSchema } =
    getNotificationSchema(subscriptionMethods);

  return {
    fields: {},
    schema: {
      properties: {
        buildBreakSettings: {
          properties: {
            notifyOnBuildFailure: {
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.buildBreakSettings?.notifyOnBuildFailure
              ),
              title: "Build Break Notifications",
              type: ["boolean", "null"],
            },
          },
          title: "Performance Plugins",
          type: "object" as "object",
        },
        ...(projectType !== ProjectType.Repo && {
          banner: {
            properties: {
              bannerData: {
                description:
                  "Add a banner to pages that represent data from this project. JIRA tickets will be linked automatically.",
                properties: {
                  text: {
                    title: "Banner Text",
                    type: "string" as "string",
                  },
                  theme: {
                    default: BannerTheme.Announcement,
                    oneOf: [
                      {
                        enum: [BannerTheme.Announcement],
                        title: "Announcement",
                        type: "string" as "string",
                      },
                      {
                        enum: [BannerTheme.Information],
                        title: "Information",
                        type: "string" as "string",
                      },
                      {
                        enum: [BannerTheme.Warning],
                        title: "Warning",
                        type: "string" as "string",
                      },
                      {
                        enum: [BannerTheme.Important],
                        title: "Important",
                        type: "string" as "string",
                      },
                    ],
                    title: "Theme",
                    type: "string" as "string",
                  },
                },
                title: "",
                type: "object" as "object",
              },
            },
            title: "Project Banner",
            type: "object" as "object",
          },
        }),
        subscriptions: {
          items: {
            properties: {
              subscriptionData: {
                properties: {
                  event: eventSchema,
                  notification: notificationSchema,
                },
                title: "",
                type: "object" as "object",
              },
            },
            type: "object" as "object",
          },
          title: "Subscriptions",
          type: "array" as "array",
        },
      },
      type: "object" as "object",
    },
    uiSchema: {
      buildBreakSettings: {
        notifyOnBuildFailure: {
          "ui:description":
            "Send notification of build breaks to admins of a project if the commit author is not signed up to receive notifications.",
          "ui:widget": widgets.RadioBoxWidget,
        },
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        "ui:rootFieldId": "plugins",
      },
      ...(projectType !== ProjectType.Repo && {
        banner: {
          bannerData: {
            text: {
              "ui:data-cy": "banner-text",
              "ui:placeholder": "Enter banner text",
            },
            theme: {
              "ui:data-cy": "banner-theme",
            },
          },
          "ui:ObjectFieldTemplate": CardFieldTemplate,
          "ui:rootFieldId": "banner",
        },
      }),
      subscriptions: {
        items: {
          subscriptionData: {
            event: eventUiSchema,
            notification: notificationUiSchema,
          },
          "ui:displayTitle": "New Subscription",
        },
        "ui:addButtonText": "Add Subscription",
        "ui:descriptionNode": <HelpText />,
        "ui:orderable": false,
        "ui:placeholder": "No subscriptions are defined.",
        "ui:useExpandableCard": true,
      },
    },
  };
};

const HelpText: React.VFC = () => {
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
