import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import {
  ArrayFieldTemplateProps,
  FieldTemplateProps,
  ObjectFieldTemplateProps,
} from "@rjsf/core";
import Icon from "components/Icon";
import { Unpacked } from "types/utils";
import { SpruceFormContainer } from "./Container";
import { TitleField as CustomTitleField } from "./CustomFields";
import ElementWrapper from "./ElementWrapper";

// Custom field template that does not render fields' titles, as this is handled by LeafyGreen widgets
export const DefaultFieldTemplate: React.FC<FieldTemplateProps> = ({
  classNames,
  children,
  description,
  hidden,
  id,
  label,
  schema,
  uiSchema,
}) => {
  const isNullType = schema.type === "null";
  return (
    !hidden && (
      <>
        {isNullType && (
          <CustomTitleField id={id} title={label} uiSchema={uiSchema} />
        )}
        {isNullType && <>{description}</>}
        <div className={classNames}>{children}</div>
      </>
    )
  );
};

const ArrayItem: React.FC<
  { topAlignDelete: boolean } & Unpacked<ArrayFieldTemplateProps["items"]>
> = ({
  children,
  disabled,
  hasRemove,
  index,
  onDropIndexClick,
  readonly,
  topAlignDelete,
}) => (
  <ArrayItemRow key={index} topAlignDelete={topAlignDelete}>
    {children}
    {hasRemove && (
      <DeleteButtonWrapper>
        <Button
          onClick={onDropIndexClick(index)}
          disabled={disabled || readonly}
          leftGlyph={<Icon glyph="Trash" />}
          data-cy="delete-item-button"
        />
      </DeleteButtonWrapper>
    )}
  </ArrayItemRow>
);

const ArrayItemRow = styled.div`
  align-items: ${({ topAlignDelete }: { topAlignDelete: boolean }) =>
    topAlignDelete ? "flex-start" : "flex-end"};
  display: flex;

  .field-object {
    flex-grow: 1;
  }
`;

export const ArrayFieldTemplate: React.FC<ArrayFieldTemplateProps> = ({
  canAdd,
  DescriptionField,
  disabled,
  idSchema,
  items,
  onAddClick,
  readonly,
  required,
  schema,
  title,
  TitleField,
  uiSchema,
}) => {
  const id = idSchema.$id;
  const description = uiSchema["ui:description"] || schema.description;
  const addButtonSize = uiSchema["ui:addButtonSize"] || "small";
  const addButtonText = uiSchema["ui:addButtonText"] || "Add";
  const fullWidth = !!uiSchema["ui:fullWidth"];
  const showLabel = uiSchema["ui:showLabel"] !== false;
  const topAlignDelete = uiSchema["ui:topAlignDelete"] ?? false;
  const isDisabled = disabled || readonly;
  return (
    <>
      {showLabel && (
        <TitleField id={`${id}__title`} required={required} title={title} />
      )}
      {description && (
        <DescriptionField id={`${id}__description`} description={description} />
      )}
      {!readonly && canAdd && (
        <ElementWrapper>
          <Button
            data-cy="add-button"
            disabled={isDisabled}
            leftGlyph={<Icon glyph="Plus" />}
            onClick={onAddClick}
            size={addButtonSize}
          >
            {addButtonText}
          </Button>
        </ElementWrapper>
      )}
      <ArrayContainer fullWidth={fullWidth} hasChildren={!!items?.length}>
        {items.map((p) => (
          <ArrayItem key={p.key} topAlignDelete={topAlignDelete} {...p} />
        ))}
      </ArrayContainer>
    </>
  );
};

type ArrayContainerProps = {
  hasChildren: boolean;
  fullWidth?: boolean;
};

const ArrayContainer = styled.div`
  ${({ hasChildren }) => hasChildren && "margin-buttom: 24px;"}
  min-width: min-content;
  width: ${({ fullWidth }: ArrayContainerProps): string =>
    fullWidth ? "100%" : "60%"};
`;

const DeleteButtonWrapper = styled(ElementWrapper)`
  margin-left: 16px;
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
