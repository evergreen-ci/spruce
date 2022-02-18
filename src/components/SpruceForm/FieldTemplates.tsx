import { cloneElement } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import {
  ArrayFieldTemplateProps,
  FieldTemplateProps,
  ObjectFieldTemplateProps,
} from "@rjsf/core";
import Icon from "components/Icon";
import { size } from "constants/tokens";
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
  { topAlignDelete: boolean; useExpandableCard: boolean } & Unpacked<
    ArrayFieldTemplateProps["items"]
  >
> = ({
  children,
  disabled,
  hasRemove,
  index,
  onDropIndexClick,
  readonly,
  topAlignDelete,
  useExpandableCard,
}) => (
  <ArrayItemRow key={index}>
    {cloneElement(children, {
      uiSchema: {
        ...children.props.uiSchema,
        "ui:index": index,
        "ui:onDropIndexClick": onDropIndexClick,
      },
    })}
    {hasRemove && !useExpandableCard && (
      <DeleteButtonWrapper topAlignDelete={topAlignDelete}>
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
  const useExpandableCard = uiSchema["ui:useExpandableCard"] ?? false;
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
          <ArrayItem
            key={p.key}
            topAlignDelete={topAlignDelete}
            useExpandableCard={useExpandableCard}
            {...p}
          />
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
  ${({ hasChildren }) => hasChildren && `margin-bottom: ${size.m};`}
  min-width: min-content;
  width: ${({ fullWidth }: ArrayContainerProps): string =>
    fullWidth ? "100%" : "60%"};
`;

const DeleteButtonWrapper = styled(ElementWrapper)`
  margin-left: ${size.s};
  // Align button with top of input unless it should specifically align to the top of the ArrayItemRow
  align-items: ${({ topAlignDelete }: { topAlignDelete: boolean }) =>
    topAlignDelete ? "0px" : "20px"};
`;

export const CardFieldTemplate: React.FC<ObjectFieldTemplateProps> = ({
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
