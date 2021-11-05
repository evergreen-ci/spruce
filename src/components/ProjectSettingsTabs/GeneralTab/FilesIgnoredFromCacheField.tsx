import { useState } from "react";
import styled from "@emotion/styled";
import { RadioBox, RadioBoxGroup } from "@leafygreen-ui/radio-box-group";
import { SpruceForm, SpruceFormProps } from "components/SpruceForm";

export const FilesIgnoredFromCacheField: React.FC<SpruceFormProps> = ({
  formData,
  onChange,
  schema,
  uiSchema,
}) => {
  const {
    options: { useRepoSettings },
  } = uiSchema;

  const [defaultToRepo, setDefaultToRepo] = useState(!formData);

  const showArray = !useRepoSettings || (useRepoSettings && !defaultToRepo);

  return (
    <>
      {useRepoSettings && (
        <RadioBoxGroup
          value={defaultToRepo ? 1 : 0}
          onChange={(e) => setDefaultToRepo(!!parseInt(e.target.value, 10))}
        >
          <StyledRadioBox value={0}>Override Repo File Pattern</StyledRadioBox>
          <StyledRadioBox value={1}>
            Default to Repo File Pattern
          </StyledRadioBox>
        </RadioBoxGroup>
      )}
      {showArray && (
        <SpruceForm
          formData={formData}
          onChange={({ formData: formUpdate }) => onChange(formUpdate)}
          schema={schema}
          tagName="fieldset"
          uiSchema={uiSchema}
        />
      )}
    </>
  );
};

const StyledRadioBox = styled(RadioBox)`
  line-height: 1.25;
`;
