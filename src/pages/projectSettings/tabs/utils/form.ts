import { ObjectFieldTemplateProps } from "@rjsf/core";
import { SpruceFormProps } from "components/SpruceForm";
import { Unpacked } from "types/utils";

export const insertIf = (condition, ...elements) => (condition ? elements : []);

const radioBoxOption = (title: string, value: boolean) => ({
  type: ["boolean", "null"],
  title,
  enum: [value],
});

/**
 * Generate the options for a radio box group that conditionally includes a third option to "Default to repo".
 *
 * @param {options} string array representing the primary two radio box labels.
 * @param {field} value upon which the default box should be conditionally shown.
 * @param {invert} specify whether or not the field represents an "inverted" value; i.e. the field indicates a feature is disabled rather than enabled. invert ensures that the form represents values consistently regardless of whether a boolean field represents enabled or disabled.
 */
export const radioBoxOptions = (
  options: [string, string],
  field: boolean,
  invert: boolean = false
): Array<SpruceFormProps<any>["schema"]> => [
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
  overrideSchema: SpruceFormProps<any>["schema"]
): SpruceFormProps<any>["schema"] => {
  const propertyNameOverride = `${propertyName}Override`;
  return {
    properties: {
      [propertyNameOverride]: {
        type: "boolean" as "boolean",
        oneOf: [
          {
            type: "boolean" as "boolean",
            title: buttonText[0],
            enum: [true],
          },
          {
            type: "boolean" as "boolean",
            title: buttonText[1],
            enum: [false],
          },
        ],
      },
    },
    dependencies: {
      [propertyNameOverride]: {
        oneOf: [
          {
            properties: {
              [propertyNameOverride]: {
                enum: [false],
              },
              repoData: {
                type: "object" as "object",
                title: "",
                properties: {
                  [propertyName]: overrideSchema,
                },
              },
            },
          },
          {
            properties: {
              [propertyNameOverride]: {
                enum: [true],
              },
              [propertyName]: overrideSchema,
            },
          },
        ],
      },
    },
  };
};

export const placeholderIf = (element: string | number) =>
  element && {
    "ui:placeholder": `${element} (Default from repo)`,
  };

export const hiddenIf = (element: boolean) =>
  element === true && {
    "ui:widget": "hidden",
  };

// Modify a field such that its internal disabled prop is true.
const disableField = (
  property: Unpacked<ObjectFieldTemplateProps["properties"]>
): Unpacked<ObjectFieldTemplateProps["properties"]>["content"] => ({
  ...property.content,
  props: {
    ...property.content.props,
    disabled: true,
  },
});

// Return child fields to be rendered
// Conditionally disable based on whether it has been flagged as such (i.e. is a private variable that has already been saved).
export const getFields = (
  properties: ObjectFieldTemplateProps["properties"],
  isDisabled: boolean
): Array<Unpacked<ObjectFieldTemplateProps["properties"]>["content"]> =>
  isDisabled
    ? properties.map(disableField)
    : properties.map(({ content }) => content);
