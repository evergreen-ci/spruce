import { useState } from "react";
import styled from "@emotion/styled";
import { RadioBox, RadioBoxGroup } from "@leafygreen-ui/radio-box-group";
import { Field } from "@rjsf/core";
import { SpruceForm } from "components/SpruceForm";

export const DefaultSubscriptionsField: Field = ({
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
          data-cy="file-patterns-radio"
          /* Use parseInt since radio inputs cannot natively handle numbers */
          onChange={(e) => setDefaultToRepo(!!parseInt(e.target.value, 10))}
          value={defaultToRepo ? 1 : 0}
        >
          <StyledRadioBox value={0}>Override Repo Subscriptions</StyledRadioBox>
          <StyledRadioBox value={1}>
            Default to Repo Subscriptions
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
