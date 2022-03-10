import { cloneElement } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { uiColors } from "@leafygreen-ui/palette";
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

const { gray } = uiColors;

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
  {
    topAlignDelete: boolean;
    useExpandableCard: boolean;
    border: boolean;
  } & Unpacked<ArrayFieldTemplateProps["items"]>
> = ({
  border,
  children,
  disabled,
  hasMoveDown,
  hasMoveUp,
  hasRemove,
  index,
  onDropIndexClick,
  onReorderClick,
  readonly,
  topAlignDelete,
  useExpandableCard,
}) => (
  <ArrayItemRow key={index} border={border} index={index}>
    {(hasMoveUp || hasMoveDown) && !readonly && (
      <OrderControls topAlignDelete={topAlignDelete}>
        {hasMoveUp && (
          <Button
            data-cy="array-up-button"
            onClick={onReorderClick(index, index - 1)}
            leftGlyph={<Icon glyph="ArrowUp" />}
          />
        )}
        {hasMoveDown && (
          <Button
            data-cy="array-down-button"
            onClick={onReorderClick(index, index + 1)}
            leftGlyph={<Icon glyph="ArrowDown" />}
          />
        )}
      </OrderControls>
    )}
    {cloneElement(children, {
      uiSchema: {
        ...children.props.uiSchema,
        "ui:index": index,
        "ui:onDropIndexClick": onDropIndexClick,
      },
    })}
    {hasRemove && !useExpandableCard && !readonly && (
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

const OrderControls = styled.div<{ topAlignDelete: boolean }>`
  display: flex;
  flex-direction: column;
  margin-right: ${size.s};
  margin-top: ${({ topAlignDelete }) => (topAlignDelete ? "0px" : "20px")};

  > :not(:last-of-type) {
    margin-bottom: ${size.xs};
  }
`;

const ArrayItemRow = styled.div<{ border: boolean; index: number }>`
  display: flex;
  margin-bottom: ${size.m};
  ${({ border, index }) =>
    border && index === 0 && `border-top: 1px solid ${gray.light1}`};
  ${({ border }) => border && `border-bottom: 1px solid ${gray.light1}`};
  margin: 0 -${size.m};
  padding: ${size.m};

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
  const border = uiSchema["ui:border"] ?? false;
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
            border={border}
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
  margin-top: ${({ topAlignDelete }: { topAlignDelete: boolean }) =>
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
