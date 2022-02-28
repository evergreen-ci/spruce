import { useState } from "react";
import styled from "@emotion/styled";
import {
  SegmentedControl,
  SegmentedControlOption,
} from "@leafygreen-ui/segmented-control";
import { Subtitle } from "@leafygreen-ui/typography";
import { Accordion } from "components/Accordion";
import { SpruceFormProps } from "components/SpruceForm";
import { size, fontSize } from "constants/tokens";

const VariantInput: Record<string, string> = {
  Regex: "variant",
  Tags: "variantTags",
} as const;

const TaskInput: Record<string, string> = {
  Regex: "task",
  Tags: "taskTags",
} as const;

// Extract index of the current field via its ID
const getIndex = (id: string): number => {
  if (!id) return null;

  const stringIndex = id.substring(id.lastIndexOf("_") + 1);
  const index = Number(stringIndex);
  return Number.isInteger(index) ? index : null;
};

export const AliasRow: SpruceFormProps["ObjectFieldTemplate"] = ({
  disabled,
  formData,
  idSchema,
  properties,
  readonly,
  uiSchema,
}) => {
  const [alias, variant, variantTags, task, taskTags] = properties;
  const isDisabled = disabled || readonly;
  const displayTitle = uiSchema["ui:displayTitle"];
  const useAccordion = uiSchema["ui:useAccordion"] ?? true;
  const index = getIndex(idSchema.$id);

  const [variantInput, setVariantInput] = useState(
    formData?.variant ? VariantInput.Regex : VariantInput.Tags
  );
  const [taskInput, setTaskInput] = useState(
    formData?.task ? TaskInput.Regex : TaskInput.Tags
  );

  // Clear form when toggling between segmented control options
  const clearForm = (selectedSegment: string) => {
    switch (selectedSegment) {
      case VariantInput.Regex:
        variantTags.content.props.onChange([]);
        break;
      case VariantInput.Tags:
        variant.content.props.onChange("");
        break;
      case TaskInput.Regex:
        taskTags.content.props.onChange([]);
        break;
      case TaskInput.Tags:
        task.content.props.onChange("");
        break;
      default:
    }
  };

  const makeId = (fieldName: string): string =>
    `${idSchema.$id}-${fieldName}-field`;

  const contents = (
    <div data-cy="alias-row">
      {alias.content}
      <TaskRegexContainer>
        <StyledSegmentedControl
          label="Variant"
          id="variant-input-control"
          value={variantInput}
          onChange={(value) => {
            setVariantInput(value);
            clearForm(value);
          }}
        >
          <SegmentedControlOption
            value={VariantInput.Tags}
            disabled={isDisabled}
            aria-controls={makeId(VariantInput.Tags)}
          >
            Tags
          </SegmentedControlOption>
          <SegmentedControlOption
            value={VariantInput.Regex}
            disabled={isDisabled}
            aria-controls={makeId(VariantInput.Regex)}
          >
            Regex
          </SegmentedControlOption>
        </StyledSegmentedControl>
        {variantInput === VariantInput.Tags ? (
          <div data-cy="variant-tags-field" id={makeId(VariantInput.Tags)}>
            {variantTags.content}
          </div>
        ) : (
          <div data-cy="variant-field" id={makeId(VariantInput.Regex)}>
            {variant.content}
          </div>
        )}
      </TaskRegexContainer>
      <TaskRegexContainer>
        <StyledSegmentedControl
          label="Task"
          id="task-input-control"
          value={taskInput}
          onChange={(value) => {
            setTaskInput(value);
            clearForm(value);
          }}
        >
          <SegmentedControlOption
            value={TaskInput.Tags}
            disabled={isDisabled}
            aria-controls={makeId(TaskInput.Tags)}
          >
            Tags
          </SegmentedControlOption>
          <SegmentedControlOption
            value={TaskInput.Regex}
            disabled={isDisabled}
            aria-controls={makeId(TaskInput.Regex)}
          >
            Regex
          </SegmentedControlOption>
        </StyledSegmentedControl>
        {taskInput === TaskInput.Tags ? (
          <div data-cy="task-tags-field" id={makeId(TaskInput.Tags)}>
            {taskTags.content}
          </div>
        ) : (
          <div data-cy="task-field" id={makeId(TaskInput.Regex)}>
            {task.content}
          </div>
        )}
      </TaskRegexContainer>
    </div>
  );

  return useAccordion ? (
    <Accordion
      title={`${displayTitle} ${index !== null ? index + 1 : ""}`}
      defaultOpen={!isDisabled}
      titleTag={AccordionTitle}
      contents={contents}
    />
  ) : (
    contents
  );
};

/* @ts-expect-error  */
const AccordionTitle = styled(Subtitle)`
  font-size: ${fontSize.l};
  margin: 11px 0; // Align title precisely with delete button
`;

const TaskRegexContainer = styled.div`
  margin-bottom: ${size.l};
`;

const StyledSegmentedControl = styled(SegmentedControl)`
  margin-bottom: ${size.s};
`;
