import { SpruceFormProps } from "components/SpruceForm/types";

export const insertIf = (condition, ...elements) => (condition ? elements : []);

const radioBoxOption = (title: string, value: boolean) => ({
  enum: [value],
  title,
  type: ["boolean", "null"],
});

/**
 * Generate the options for a radio box group that conditionally includes a third option to "Default to repo".
 * @param options - array of strings representing the primary two radio box labels.
 * @param field - The field value for which the option should be shown.
 * @param invert - Whether or not the field represents an "inverted" value; i.e. the field indicates a feature is disabled rather than enabled. invert ensures that the form represents values consistently regardless of whether a boolean field represents enabled or disabled.
 * @returns - An array of schema objects representing the radio box options.
 */
export const radioBoxOptions = (
  options: [string, string],
  field: boolean = undefined,
  invert: boolean = false
): Array<SpruceFormProps["schema"]> => [
  radioBoxOption(options[0], !invert),
  radioBoxOption(options[1], invert),
  ...insertIf(
    field !== undefined,
    radioBoxOption(
      `Default to repo (${(field
        ? options[+invert]
        : options[+!invert]
      ).toLowerCase()})`,
      null
    )
  ),
];

export const overrideRadioBox = (
  propertyName: string,
  buttonText: [string, string],
  overrideSchema: SpruceFormProps["schema"]
): SpruceFormProps["schema"] => {
  const propertyNameOverride = `${propertyName}Override`;
  return {
    dependencies: {
      [propertyNameOverride]: {
        oneOf: [
          {
            properties: {
              [propertyNameOverride]: {
                enum: [false],
              },
              repoData: {
                properties: {
                  [propertyName]: overrideSchema,
                },
                title: "",
                type: "object" as "object",
              },
            },
          },
          {
            properties: {
              [propertyName]: overrideSchema,
              [propertyNameOverride]: {
                enum: [true],
              },
            },
          },
        ],
      },
    },
    properties: {
      [propertyNameOverride]: {
        oneOf: [
          {
            enum: [true],
            title: buttonText[0],
            type: "boolean" as "boolean",
          },
          {
            enum: [false],
            title: buttonText[1],
            type: "boolean" as "boolean",
          },
        ],
        type: "boolean" as "boolean",
      },
    },
  };
};

export const placeholderIf = (element: string | number) =>
  element && {
    "ui:placeholder": `${element} (Default from repo)`,
  };
