import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import {
  ArrayFieldTemplateProps,
  FieldTemplateProps,
  ObjectFieldTemplateProps,
} from "@rjsf/core";
import Icon from "components/Icon";
import { SpruceFormContainer } from "./Container";
import ElementWrapper from "./ElementWrapper";

// Custom field template that does not render fields' titles, as this is handled by LeafyGreen widgets
export const DefaultFieldTemplate: React.FC<FieldTemplateProps> = ({
  classNames,
  children,
}) => <div className={classNames}>{children}</div>;

export const ArrayFieldTemplate: React.FC<ArrayFieldTemplateProps> = ({
  canAdd,
  DescriptionField,
  idSchema,
  items,
  onAddClick,
  required,
  schema,
  title,
  TitleField,
  uiSchema,
}) => {
  const id = idSchema.$id;
  const description = uiSchema["ui:description"] || schema.description;
  const buttonText = uiSchema["ui:buttonText"] || "Add";
  const fullWidth = !!uiSchema["ui:fullWidth"];
  const showLabel = uiSchema["ui:showLabel"] !== false;
  return (
    <>
      {showLabel && (
        <TitleField id={`${id}__title`} required={required} title={title} />
      )}
      {description && (
        <DescriptionField id={`${id}__description`} description={description} />
      )}
      {canAdd && (
        <ElementWrapper>
          <Button
            data-cy="add-button"
            leftGlyph={<Icon glyph="Plus" />}
            onClick={onAddClick}
            size="small"
          >
            {buttonText}
          </Button>
        </ElementWrapper>
      )}
      <ArrayContainer fullWidth={fullWidth}>
        {items.map(
          ({
            children,
            disabled,
            hasRemove,
            index,
            onDropIndexClick,
            readonly,
          }) => (
            <ArrayItemRow key={index}>
              {children}
              {hasRemove && (
                <DeleteButtonWrapper>
                  <Button
                    onClick={onDropIndexClick(index)}
                    disabled={disabled || readonly}
                    leftGlyph={<Icon glyph="Trash" />}
                  />
                </DeleteButtonWrapper>
              )}
            </ArrayItemRow>
          )
        )}
      </ArrayContainer>
    </>
  );
};

const ArrayContainer = styled.div`
  margin-bottom: 24px;
  min-width: min-content;
  width: ${(props: { fullWidth?: boolean }): string =>
    props.fullWidth ? "100%" : "60%"};
`;

const ArrayItemRow = styled.div`
  align-items: flex-start;
  display: flex;

  .field-object {
    flex-grow: 1;
  }
`;

const DeleteButtonWrapper = styled(ElementWrapper)`
  margin-left: 16px;
  margin-top: 20px;
`;

export const CardFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
  idSchema,
  properties,
  title,
  uiSchema,
}) => (
  <SpruceFormContainer
    title={uiSchema["ui:title"] || title}
    id={`${idSchema.$id}__title`}
  >
    {properties.map((prop) => prop.content)}
  </SpruceFormContainer>
);
