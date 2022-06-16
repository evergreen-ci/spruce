import { useMemo } from "react";
import styled from "@emotion/styled";
import Banner from "@leafygreen-ui/banner";
import Button from "@leafygreen-ui/button";
import ExpandableCard from "@leafygreen-ui/expandable-card";
import { uiColors } from "@leafygreen-ui/palette";
import { Body, Subtitle } from "@leafygreen-ui/typography";
import {
  ArrayFieldTemplateProps,
  FieldTemplateProps,
  ObjectFieldTemplateProps,
} from "@rjsf/core";
import { Accordion } from "components/Accordion";
import Icon from "components/Icon";
import { fontSize, size } from "constants/tokens";
import { Unpacked } from "types/utils";
import { SpruceFormContainer } from "./Container";
import { TitleField as CustomTitleField } from "./CustomFields";
import ElementWrapper from "./ElementWrapper";

const { gray } = uiColors;

// Extract index of the current field via its ID
const getIndex = (id: string): number => {
  if (!id) return null;

  const stringIndex = id.substring(id.lastIndexOf("_") + 1);
  const index = Number(stringIndex);
  return Number.isInteger(index) ? index : null;
};

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
    <fieldset id={idSchema.$id}>
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

const StyledBanner = styled(Banner)`
  margin-bottom: ${size.s};
`;

// Custom field template that does not render fields' titles, as this is handled by LeafyGreen widgets
export const DefaultFieldTemplate: React.VFC<FieldTemplateProps> = ({
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
  const sectionId = uiSchema["ui:sectionId"] ?? "";
  const border = uiSchema["ui:border"];
  const showLabel = uiSchema["ui:showLabel"] ?? true;
  return (
    !hidden && (
      <>
        {isNullType && showLabel && (
          <CustomTitleField id={id} title={label} uiSchema={uiSchema} />
        )}
        {isNullType && <>{description}</>}
        <DefaultFieldContainer
          id={`${sectionId} ${id}`}
          className={classNames}
          border={border}
        >
          {children}
        </DefaultFieldContainer>
      </>
    )
  );
};

const DefaultFieldContainer = styled.div<{ border?: "top" | "bottom" }>`
  ${({ border }) =>
    border &&
    `border-${border}: 1px solid ${gray.light1}; padding-${border}: ${size.s};`}
`;

const ArrayItem: React.VFC<
  {
    border: boolean;
    title: string;
    topAlignDelete: boolean;
    useExpandableCard: boolean;
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
  title,
  topAlignDelete,
  useExpandableCard,
}) => {
  const isDisabled = disabled || readonly;
  const deleteButton = (
    <Button
      onClick={onDropIndexClick(index)}
      disabled={isDisabled}
      leftGlyph={<Icon glyph="Trash" />}
      data-cy="delete-item-button"
    />
  );
  return useExpandableCard ? (
    <StyledExpandableCard
      defaultOpen={!isDisabled}
      contentClassName="patch-alias-card-content"
      title={
        <>
          <TitleWrapper data-cy="expandable-card-title">{title}</TitleWrapper>
          {hasRemove && !readonly && deleteButton}
        </>
      }
    >
      {children}
    </StyledExpandableCard>
  ) : (
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
      {children}
      {hasRemove && !useExpandableCard && !readonly && (
        <DeleteButtonWrapper topAlignDelete={topAlignDelete}>
          {deleteButton}
        </DeleteButtonWrapper>
      )}
    </ArrayItemRow>
  );
};

const TitleWrapper = styled.span`
  margin-right: ${size.s};
`;

const StyledExpandableCard = styled(ExpandableCard)`
  margin-bottom: ${size.l};
`;

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
  ${({ border, index }) =>
    border && index === 0 && `border-top: 1px solid ${gray.light1}`};
  ${({ border }) =>
    border &&
    `border-bottom: 1px solid ${gray.light1};
  margin: 0 -${size.m};
  padding: ${size.m};
    `};

  .field-object {
    flex-grow: 1;
  }
`;

export const ArrayFieldTemplate: React.VFC<ArrayFieldTemplateProps> = ({
  canAdd,
  DescriptionField,
  disabled,
  formData,
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
  const border = uiSchema["ui:border"] ?? false;
  const descriptionNode = uiSchema["ui:descriptionNode"];
  const fullWidth = !!uiSchema["ui:fullWidth"];
  const placeholder = uiSchema["ui:placeholder"];
  const showLabel = uiSchema["ui:showLabel"] ?? true;
  const topAlignDelete = uiSchema["ui:topAlignDelete"] ?? false;
  const useExpandableCard = uiSchema["ui:useExpandableCard"] ?? false;
  const isDisabled = disabled || readonly;

  const addButtonSize = uiSchema["ui:addButtonSize"] || "small";
  const addButtonText = uiSchema["ui:addButtonText"] || "Add";
  // Override RJSF's default array behavior; add new elements to beginning of array unless otherwise specified.
  const addToEnd = uiSchema["ui:addToEnd"] ?? false;
  const handleAddClick =
    items.length && !addToEnd ? items[0].onAddIndexClick(0) : onAddClick;

  const addButton = useMemo(
    () => (
      <AddButtonContainer>
        <Button
          data-cy="add-button"
          disabled={isDisabled}
          leftGlyph={<Icon glyph="Plus" />}
          onClick={handleAddClick}
          size={addButtonSize}
        >
          {addButtonText}
        </Button>
      </AddButtonContainer>
    ),
    [addButtonSize, addButtonText, handleAddClick, isDisabled]
  );

  const hasAddButton = !readonly && canAdd;
  const buttonAtBeginning = !addToEnd && hasAddButton;
  const buttonAtEnd = addToEnd && hasAddButton;

  return (
    <>
      {showLabel && (
        <TitleField id={`${id}__title`} required={required} title={title} />
      )}
      {descriptionNode || (
        <DescriptionField id={`${id}__description`} description={description} />
      )}
      {buttonAtBeginning && addButton}
      <ArrayContainer
        fullWidth={fullWidth || useExpandableCard}
        hasChildren={!!items?.length}
      >
        {items.length === 0 ? (
          <Body>{placeholder}</Body>
        ) : (
          items.map((p, i) => (
            <ArrayItem
              {...p}
              key={p.key}
              border={border}
              title={
                formData?.[i]?.displayTitle ??
                uiSchema?.items?.["ui:displayTitle"]
              }
              topAlignDelete={topAlignDelete}
              useExpandableCard={useExpandableCard}
            />
          ))
        )}
        {buttonAtEnd && addButton}
      </ArrayContainer>
    </>
  );
};

const AddButtonContainer = styled(ElementWrapper)`
  margin-top: ${size.s};
`;

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

/* @ts-expect-error  */
const AccordionTitle = styled(Subtitle)`
  font-size: ${fontSize.l};
  margin: ${size.xs} 0;
`;
