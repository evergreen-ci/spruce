import { GetFormSchema } from "components/SpruceForm";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import { Provider } from "gql/generated/types";
import { staticProviderSettings, uiSchema } from "./schemaFields";

export const getFormSchema = (): ReturnType<GetFormSchema> => ({
  fields: {},
  schema: {
    type: "object" as "object",
    properties: {
      provider: {
        type: "object" as "object",
        title: "",
        properties: {
          providerName: {
            type: "string" as "string",
            title: "Provider",
            oneOf: [
              {
                type: "string" as "string",
                title: "Static IP/VM",
                enum: [Provider.Static],
              },
              {
                type: "string" as "string",
                title: "Docker",
                enum: [Provider.Docker],
              },
              {
                type: "string" as "string",
                title: "EC2 Fleet",
                enum: [Provider.Ec2Fleet],
              },
              {
                type: "string" as "string",
                title: "EC2 On Demand",
                enum: [Provider.Ec2OnDemand],
              },
            ],
          },
        },
      },
    },
    dependencies: {
      provider: {
        oneOf: [
          {
            properties: {
              provider: {
                properties: {
                  providerName: {
                    enum: [Provider.Static],
                  },
                },
              },
              providerSettings: {
                type: "object" as "object",
                title: "",
                properties: staticProviderSettings,
              },
            },
          },
        ],
      },
    },
  },
  uiSchema: {
    provider: {
      "ui:ObjectFieldTemplate": CardFieldTemplate,
    },
    ...uiSchema,
  },
});
