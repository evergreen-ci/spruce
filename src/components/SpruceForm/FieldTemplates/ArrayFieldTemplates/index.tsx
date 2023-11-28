/* eslint-disable jsdoc/valid-types */
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import ExpandableCard from "@leafygreen-ui/expandable-card";
import { palette } from "@leafygreen-ui/palette";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { ArrayFieldTemplateProps } from "@rjsf/core";
import { PlusButton } from "components/Buttons";
import Icon from "components/Icon";
import { formComponentSpacingCSS } from "components/SettingsCard";
import { size } from "constants/tokens";
import { Unpacked } from "types/utils";
import ElementWrapper from "../../ElementWrapper";
import { STANDARD_FIELD_WIDTH } from "../../utils";

const { gray } = palette;
// Total pixel count above a text field with a label. Used to align buttons to the
// top of the text box itself.
const labelOffset = size.m;

const ArrayItem: React.FC<
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
      size="small"
    />
  );
  return useExpandableCard ? (
    <StyledExpandableCard
      defaultOpen={!isDisabled}
      data-cy="expandable-card"
      // Override LeafyGreen's string typing for title so we can include buttons. (LG-2193)
      /* @ts-expect-error */
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

/**
 * `ArrayFieldTemplate` is a custom field template for arrays that renders an array of fields.
 * @param props ArrayFieldTemplateProps
 * @param props.canAdd - Whether or not the user can add new items to the array.
 * @param props.DescriptionField - A custom field for rendering the array's description.
 * @param props.disabled - Whether or not the field is disabled.
 * @param props.formData - The form's data.
 * @param props.idSchema - The field's ID schema.
 * @param props.items - An array of items to render.
 * @param props.onAddClick - A callback function for when the user clicks the add button.
 * @param props.readonly - Whether or not the field is readonly. // jsdoc/valid-types is disabled for this file due to // https://github.com/jsdoc-type-pratt-parser/jsdoc-type-pratt-parser/issues/104
 * @param props.required - Whether or not the field is required.
 * @param props.schema - The field's schema.
 * @param props.title - The field's title.
 * @param props.TitleField - A custom field for rendering the array's title.
 * @param props.uiSchema - The field's UI schema.
 * @returns JSX.Element
 */
export const ArrayFieldTemplate: React.FC<ArrayFieldTemplateProps> = ({
  DescriptionField,
  TitleField,
  canAdd,
  disabled,
  formData,
  idSchema,
  items,
  onAddClick,
  readonly,
  required,
  schema,
  title,
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
  const secondaryButton = uiSchema["ui:secondaryButton"];
  const arrayDataCy = uiSchema["ui:data-cy"];

  // Override RJSF's default array behavior; add new elements to beginning of array unless otherwise specified.
  const addToEnd = uiSchema["ui:addToEnd"] ?? false;
  const handleAddClick =
    items.length && !addToEnd ? items[0].onAddIndexClick(0) : onAddClick;

  const addButton = (
    <PlusButton
      data-cy="add-button"
      disabled={isDisabled}
      onClick={handleAddClick}
      size={addButtonSize}
    >
      {addButtonText}
    </PlusButton>
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
      {buttonAtBeginning && (
        <AddButtonContainer>
          {addButton}
          {secondaryButton}
        </AddButtonContainer>
      )}
      <ArrayContainer
        fullWidth={fullWidth || useExpandableCard}
        hasChildren={!!items?.length}
        data-cy={arrayDataCy}
      >
        {items.length === 0 && placeholder && (
          <Placeholder>{placeholder}</Placeholder>
        )}
        {items.map((p, i) => (
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
        ))}
        {buttonAtEnd && (
          <AddButtonContainer>
            {addButton}
            {secondaryButton}
          </AddButtonContainer>
        )}
      </ArrayContainer>
    </>
  );
};

const AddButtonContainer = styled(ElementWrapper)`
  margin-top: ${size.s};
  display: flex;

  > :not(:last-of-type) {
    margin-right: ${size.xs};
  }
`;

type ArrayContainerProps = {
  hasChildren: boolean;
  fullWidth?: boolean;
};

const ArrayContainer = styled.div<ArrayContainerProps>`
  ${({ hasChildren }) => hasChildren && `margin-bottom: ${size.m};`}
  min-width: min-content;
  ${({ fullWidth }) =>
    fullWidth ? "" : `max-width: ${STANDARD_FIELD_WIDTH}px;`}
`;

const DeleteButtonWrapper = styled(ElementWrapper)`
  margin-left: ${size.s};
  // Align button with top of input unless it should specifically align to the top of the ArrayItemRow
  margin-top: ${({ topAlignDelete }: { topAlignDelete: boolean }) =>
    topAlignDelete ? "0px" : labelOffset};
`;

const StyledExpandableCard = styled(ExpandableCard)`
  margin-bottom: ${size.l};
`;

const OrderControls = styled.div<{ topAlignDelete: boolean }>`
  display: flex;
  flex-direction: column;
  margin-right: ${size.s};
  margin-top: ${({ topAlignDelete }) => (topAlignDelete ? "0px" : labelOffset)};

  > :not(:last-of-type) {
    margin-bottom: ${size.xs};
  }
`;

const TitleWrapper = styled.span`
  margin-right: ${size.s};
`;

const Placeholder = styled(Body)<BodyProps>`
  ${formComponentSpacingCSS}
`;
