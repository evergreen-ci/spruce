import { SpruceFormProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";

export interface TabProps {
  tab: ProjectSettingsTabRoutes;
}

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

export const placeholderIf = (element: string | number) =>
  element !== null &&
  element !== undefined && {
    "ui:placeholder": `${element} (Default from repo)`,
  };
