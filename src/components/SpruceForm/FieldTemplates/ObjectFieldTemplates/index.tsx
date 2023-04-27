import styled from "@emotion/styled";
import Banner from "@leafygreen-ui/banner";
import { Subtitle } from "@leafygreen-ui/typography";
import { ObjectFieldTemplateProps } from "@rjsf/core";
import { Accordion } from "components/Accordion";
import { getFields } from "components/SpruceForm/utils";
import { fontSize, size } from "constants/tokens";
import { SpruceFormContainer } from "../../Container";

export const ObjectFieldTemplate = ({
  DescriptionField,
  description,
  TitleField,
  title,
  properties,
  required,
  uiSchema,
  idSchema,
}: ObjectFieldTemplateProps) => {
  const errors = uiSchema["ui:errors"] ?? [];
  const warnings = uiSchema["ui:warnings"] ?? [];
  return (
    <fieldset css={uiSchema["ui:fieldSetCSS"]} id={idSchema.$id}>
      {(uiSchema["ui:title"] || title) && (
        <TitleField
          id={`${idSchema.$id}__title`}
          title={title || uiSchema["ui:title"]}
          required={required}
        />
      )}
      {description && (
        <DescriptionField
          id={`${idSchema.$id}__description`}
          description={description}
        />
      )}
      {!!errors.length && (
        <StyledBanner variant="danger" data-cy="error-banner">
          {errors.join(", ")}
        </StyledBanner>
      )}
      {!!warnings.length && (
        <StyledBanner variant="warning" data-cy="warning-banner">
          {warnings.join(", ")}
        </StyledBanner>
      )}
      {properties.map((prop) => prop.content)}
    </fieldset>
  );
};

/**
 * `CardFieldTemplate` is a custom ObjectFieldTemplate that renders a card with a title and a list of properties.
 */
export const CardFieldTemplate: React.VFC<ObjectFieldTemplateProps> = ({
  idSchema,
  properties,
  title,
  uiSchema: { "ui:title": uiTitle, "ui:data-cy": dataCy },
}) => (
  <SpruceFormContainer
    title={uiTitle || title}
    id={`${idSchema.$id}__title`}
    data-cy={dataCy}
  >
    {properties.map((prop) => prop.content)}
  </SpruceFormContainer>
);

/**
 * `AccordionFieldTemplate` is a custom ObjectFieldTemplate that renders an accordion with a title and a list of properties.
 */
export const AccordionFieldTemplate: React.VFC<ObjectFieldTemplateProps> = ({
  disabled,
  idSchema,
  properties,
  readonly,
  title,
  uiSchema,
}) => {
  const isDisabled = disabled || readonly;
  const defaultOpen = uiSchema["ui:defaultOpen"] ?? !isDisabled;
  const displayTitle = uiSchema["ui:displayTitle"];
  const numberedTitle = uiSchema["ui:numberedTitle"];
  const index = getIndex(idSchema.$id);

  return (
    <Accordion
      defaultOpen={defaultOpen}
      title={
        numberedTitle ? `${numberedTitle} ${index + 1}` : displayTitle || title
      }
      titleTag={AccordionTitle}
    >
      {properties.map(({ content }) => content)}
    </Accordion>
  );
};

/**
 * `FieldRow` is a custom ObjectFieldTemplate that renders the fields in a row.
 */
export const FieldRow: React.VFC<
  Pick<ObjectFieldTemplateProps, "formData" | "properties" | "uiSchema">
> = ({ properties, uiSchema }) => {
  const dataCy = uiSchema?.["ui:data-cy"];
  const fields = getFields(properties, false);

  return <RowContainer data-cy={dataCy}>{fields}</RowContainer>;
};

const RowContainer = styled.div`
  display: flex;
  margin-bottom: ${size.s};
  justify-content: space-between;
  gap: ${size.s};
`;

/* @ts-expect-error  */
const AccordionTitle = styled(Subtitle)`
  font-size: ${fontSize.l};
  margin: ${size.xs} 0;
`;

const StyledBanner = styled(Banner)`
  margin-bottom: ${size.s};
`;

// Extract index of the current field via its ID
const getIndex = (id: string): number => {
  if (!id) return null;

  const stringIndex = id.substring(id.lastIndexOf("_") + 1);
  const index = Number(stringIndex);
  return Number.isInteger(index) ? index : null;
};
