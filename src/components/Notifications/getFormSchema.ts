import { SpruceFormProps } from "components/SpruceForm";
import {
  failureTypeSubscriberOptions,
  requesterSubscriberOptions,
} from "constants/triggers";
import { SubscriptionMethods, Trigger } from "types/triggers";
import { RegexSelectorRow } from "./RegexSelectorRow";

// const hiddenIf = (element: boolean) =>
//   element === true && {
//     "ui:widget": "hidden",
//   };

// const constructExtraFields = (extraFields) => {
//   // const extraFieldsSchema = {
//   //   type: "object" as "object",
//   //   items: {
//   //     ""
//   //   }
//   // };
//   if (!extraFields) {
//     return {};
//   }

//   // regexSelector: {
//   //   type: "array" as "array",
//   //   minItems: 1,
//   //   maxItems: 2,
//   //   items: {
//   //     type: "object" as "object",
//   //     properties: {
//   //       regexSelect: {
//   //         type: "string" as "string",
//   //         title: "Field name",
//   //         oneOf: [
//   //           ...(selectedEvent?.regexSelectors ?? []).map((r) => ({
//   //             type: "string" as "string",
//   //             title: r.typeLabel,
//   //             enum: [r.type],
//   //           })),
//   //         ],
//   //       },
//   //       regexInput: {
//   //         type: "string" as "string",
//   //         title: "Regex",
//   //         format: "validRegex",
//   //         minLength: 1,
//   //       },
//   //     },
//   //   },
//   // },
//   const extraFieldsSchema = {};
//   extraFields.forEach((e) => {
//     if (e.type === "select") {
//       extraFieldsSchema[e] = {
//         type: "string" as "string",
//         title: e.text,
//         oneOf: [
//           ...Object.keys(e.options).map((o) => ({
//             type: "string" as "string",
//             title: o,
//             enum: [o],
//           })),
//         ],
//       };
//     } else {
//       extraFieldsSchema[e] = {
//         type: "string" as "string",
//         title: e.text,
//         format: e.format,
//         default: e.default,
//         minLength: 1,
//       };
//     }
//   });
//   return extraFieldsSchema;
// };

// Reminder; give a type to form state
export const getFormSchema = (
  formState,
  triggers: Trigger,
  subscriptionMethods: SubscriptionMethods
): {
  schema: SpruceFormProps["schema"];
  uiSchema: SpruceFormProps["uiSchema"];
} => {
  const selectedMethod =
    subscriptionMethods[formState.notification.notificationSelect];
  const selectedEvent = triggers[formState.event.eventSelect];

  // which CAN contain extraFields and regexSelectors
  // extrafields stuff
  // const extraFields = selectedEvent?.extraFields;

  // I think it might make more sense to build this as a field and just do the logic manually
  // regex selector stuff which already looks awful
  // const hasRegexSelector = !!selectedEvent?.regexSelectors;
  const usingID = !!formState?.event?.extraFields?.regexSelector?.find(
    (r) => r.regexSelect === "build-variant"
  );
  const usingName = !!formState?.event?.extraFields?.regexSelector?.find(
    (r) => r.regexSelect === "display-name"
  );
  console.log(formState.event);
  const regexEnumsToDisable = [
    ...(usingID ? ["build-variant"] : []),
    ...(usingName ? ["display-name"] : []),
  ];

  const regexSelector = {
    schema: {
      type: "array" as "array",
      minItems: 1,
      maxItems: 2,
      required: ["regexSelect", "regexInput"],
      items: {
        type: "object" as "object",
        properties: {
          regexSelect: {
            type: "string" as "string",
            title: "Field name",
            default: usingID ? "display-name" : "build-variant",
            oneOf: [
              ...(selectedEvent?.regexSelectors ?? []).map((r) => ({
                type: "string" as "string",
                title: r.typeLabel,
                enum: [r.type],
              })),
            ],
          },
          regexInput: {
            type: "string" as "string",
            title: "Regex",
            format: "validRegex",
            default: "",
            minLength: 1,
          },
        },
      },
    },
    uiSchema: {
      "ui:showLabel": false,
      "ui:addToEnd": true,
      "ui:orderable": false,
      "ui:addButtonText": "Add Additional Criteria",
      items: {
        "ui:ObjectFieldTemplate": RegexSelectorRow,
        regexSelect: {
          "ui:allowDeselect": false,
          "ui:usePortal": false,
          "ui:data-cy": "regex-select",
          "ui:disabledEnums": regexEnumsToDisable,
        },
        regexInput: {
          "ui:data-cy": "regex-input",
        },
      },
    },
  };

  // oof I need to read the state management used for handling regex stuff.
  // console.log("selectedEvent: ", selectedEvent);

  return {
    schema: {
      type: "object" as "object",
      properties: {
        event: {
          type: "object" as "object",
          title: "Choose an Event",
          properties: {
            eventSelect: {
              type: "string" as "string",
              title: "Event",
              oneOf: [
                ...Object.keys(triggers).map((t) => ({
                  type: "string" as "string",
                  title: triggers[t].label,
                  enum: [t],
                })),
              ],
            },
          },
          dependencies: {
            eventSelect: {
              oneOf: [
                // map triggers into eventSelect: enum [key name], extraFields:  ... hmmidk
                {
                  // None
                  properties: {
                    eventSelect: {
                      enum: [
                        "task-starts",
                        "task-finishes",
                        "task-fails",
                        "task-fails-or-blocked",
                        "task-succeeds",
                        "version-finishes",
                        "version-fails",
                        "version-succeeds",
                      ],
                    },
                    extraFields: {},
                  },
                },
                {
                  // Percent change input
                  properties: {
                    eventSelect: {
                      enum: [
                        "task-runtime-change",
                        "version-runtime-change",
                        "runtime-version-change",
                      ],
                    },
                    extraFields: {
                      type: "object" as "object",
                      title: "",
                      properties: {
                        percentChange: {
                          type: "string" as "string",
                          title: "Percent Change",
                          format: "validPercentage",
                          default: "10",
                        },
                      },
                    },
                  },
                },
                {
                  // Duration change input
                  properties: {
                    eventSelect: {
                      enum: [
                        "task-exceeds-duration",
                        "version-exceeds-duration",
                        "runtime-version-exceeds-duration",
                      ],
                    },
                    extraFields: {
                      type: "object" as "object",
                      title: "",
                      properties: {
                        duration: {
                          type: "string" as "string",
                          title: "Duration (seconds)",
                          format: "validDuration",
                          default: "10",
                        },
                      },
                    },
                  },
                },
                {
                  // Regex selector
                  properties: {
                    eventSelect: {
                      enum: [
                        "build-variant-finishes",
                        "build-variant-fails",
                        "build-variant-succeeds",
                      ],
                    },
                    extraFields: {
                      type: "object" as "object",
                      title: "",
                      properties: {
                        regexSelector: regexSelector.schema,
                      },
                    },
                  },
                },
                {
                  // requester subscriber
                  properties: {
                    eventSelect: {
                      enum: ["any-version-finishes", "any-version-fails"],
                    },
                    extraFields: {
                      type: "object" as "object",
                      title: "",
                      properties: {
                        buildSelect: {
                          type: "string" as "string",
                          title: "Build Initiator",
                          default: "gitter_request",
                          oneOf: [
                            ...Object.keys(requesterSubscriberOptions).map(
                              (r) => ({
                                type: "string" as "string",
                                title: requesterSubscriberOptions[r],
                                enum: [r],
                              })
                            ),
                          ],
                        },
                      },
                    },
                  },
                },
                {
                  // requester subscriber + task or build regex
                  properties: {
                    eventSelect: {
                      enum: [
                        "any-build-finishes",
                        "any-build-fails",
                        "any-task-finishes",
                        "first-failure-version",
                        "first-failure-build",
                        "first-failure-version-task",
                      ],
                    },
                    extraFields: {
                      type: "object" as "object",
                      title: "",
                      properties: {
                        buildSelect: {
                          type: "string" as "string",
                          title: "Build Initiator",
                          default: "gitter_request",
                          oneOf: [
                            ...Object.keys(requesterSubscriberOptions).map(
                              (r) => ({
                                type: "string" as "string",
                                title: requesterSubscriberOptions[r],
                                enum: [r],
                              })
                            ),
                          ],
                        },
                        regexSelector: regexSelector.schema,
                      },
                    },
                  },
                },
                {
                  // failure subscriber + requester subscriber
                  properties: {
                    eventSelect: {
                      enum: ["any-task-fails"],
                    },
                    extraFields: {
                      type: "object" as "object",
                      title: "",
                      properties: {
                        failureSelect: {
                          type: "string" as "string",
                          title: "Failure Type",
                          default: "Any",
                          oneOf: [
                            ...failureTypeSubscriberOptions.map((f) => ({
                              type: "string" as "string",
                              title: f,
                              enum: [f],
                            })),
                          ],
                        },
                        buildSelect: {
                          type: "string" as "string",
                          title: "Build Initiator",
                          default: "gitter_request",
                          oneOf: [
                            ...Object.keys(requesterSubscriberOptions).map(
                              (r) => ({
                                type: "string" as "string",
                                title: requesterSubscriberOptions[r],
                                enum: [r],
                              })
                            ),
                          ],
                        },
                      },
                    },
                  },
                },
                {
                  // renotify input + task or build regex + failuretype
                  properties: {
                    eventSelect: {
                      enum: ["previous-passing-task-fails"],
                    },
                    extraFields: {
                      type: "object" as "object",
                      title: "",
                      properties: {
                        renotifyInput: {
                          type: "string" as "string",
                          title: "Re-Notify After How Many Hours",
                          format: "validDuration",
                          default: "48",
                        },
                        failureSelect: {
                          type: "string" as "string",
                          title: "Failure Type",
                          default: "Any",
                          oneOf: [
                            ...failureTypeSubscriberOptions.map((f) => ({
                              type: "string" as "string",
                              title: f,
                              enum: [f],
                            })),
                          ],
                        },
                        regexSelector: regexSelector.schema,
                      },
                    },
                  },
                },
                {
                  // testname regex + renotify input + task or build regex + failuretype
                  properties: {
                    eventSelect: {
                      enum: ["previous-passing-test-fails"],
                    },
                    extraFields: {
                      type: "object" as "object",
                      title: "",
                      properties: {
                        testNameRegex: {
                          type: "string" as "string",
                          title: "Test Names Matching Regex",
                          format: "validRegex",
                          default: "",
                        },
                        renotifyInput: {
                          type: "string" as "string",
                          title: "Re-Notify After How Many Hours",
                          format: "validDuration",
                          default: "48",
                        },
                        failureSelect: {
                          type: "string" as "string",
                          title: "Failure Type",
                          default: "Any",
                          oneOf: [
                            ...failureTypeSubscriberOptions.map((f) => ({
                              type: "string" as "string",
                              title: f,
                              enum: [f],
                            })),
                          ],
                        },
                        regexSelector: regexSelector.schema,
                      },
                    },
                  },
                },
                {
                  // duration + task or build regex
                  properties: {
                    eventSelect: {
                      enum: ["task-runtime-exceeds-duration"],
                    },
                    extraFields: {
                      type: "object" as "object",
                      title: "",
                      properties: {
                        duration: {
                          type: "string" as "string",
                          title: "Duration (seconds)",
                          format: "validDuration",
                          default: "10",
                        },
                        regexSelector: regexSelector.schema,
                      },
                    },
                  },
                },
                {
                  // percentchange + task or build regex
                  // required: ["percentChange"], oh sheesh I think I can do this
                  properties: {
                    eventSelect: {
                      enum: ["runtime-successful-task-changes"],
                    },
                    extraFields: {
                      type: "object" as "object",
                      title: "",
                      properties: {
                        percentChange: {
                          type: "string" as "string",
                          title: "Percent Change",
                          format: "validPercentage",
                          default: "10",
                        },
                        regexSelector: regexSelector.schema,
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        // ------------ DONE ------- //
        notification: {
          type: "object" as "object",
          title: "Choose How to be Notified",
          required: ["notificationSelect", "notificationInput"],
          properties: {
            notificationSelect: {
              type: "string" as "string",
              title: "Notification Method",
              oneOf: [
                ...Object.keys(subscriptionMethods).map((method) => ({
                  type: "string" as "string",
                  title: subscriptionMethods[method].dropdown,
                  enum: [method],
                })),
              ],
            },
          },
          dependencies: {
            notificationSelect: {
              oneOf: [
                {
                  properties: {
                    notificationSelect: {
                      enum: ["jira-comment"],
                    },
                    notificationInput: {
                      type: "string" as "string",
                      title: "Comment on a JIRA Issue",
                      format: "validJiraTicket",
                      minLength: 1,
                    },
                  },
                },
                {
                  properties: {
                    notificationSelect: {
                      enum: ["slack"],
                    },
                    notificationInput: {
                      type: "string" as "string",
                      title: "Slack message",
                      format: "validSlack",
                      minLength: 1,
                    },
                  },
                },
                {
                  properties: {
                    notificationSelect: {
                      enum: ["email"],
                    },
                    notificationInput: {
                      type: "string" as "string",
                      title: "Email",
                      format: "validEmail",
                      minLength: 1,
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
    uiSchema: {
      event: {
        eventSelect: {
          "ui:allowDeselect": false,
          "ui:usePortal": false,
          "ui:data-cy": "event-trigger-select",
        },
        extraFields: {
          "ui:showLabel": false,
          regexSelector: regexSelector.uiSchema,
          failureSelect: {
            "ui:allowDeselect": false,
            "ui:usePortal": false,
            "ui:data-cy": "failure-type-select",
          },
          buildSelect: {
            "ui:allowDeselect": false,
            "ui:usePortal": false,
            "ui:data-cy": "build-initiator-select",
          },
        },
      },
      notification: {
        notificationSelect: {
          "ui:allowDeselect": false,
          "ui:usePortal": false,
          "ui:data-cy": "notification-method-select",
        },
        notificationInput: {
          "ui:placeholder": selectedMethod.placeholder,
          "ui:data-cy": selectedMethod.targetPath,
        },
      },
    },
  };
};
