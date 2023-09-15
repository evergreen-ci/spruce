import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { FieldTemplateProps } from "@rjsf/core";
import { size } from "constants/tokens";
import { TitleField as CustomTitleField } from "../CustomFields";

export * from "./ArrayFieldTemplates";
export * from "./ObjectFieldTemplates";

const { gray } = palette;

// Custom field template that does not render fields' titles, as this is handled by LeafyGreen widgets
export const DefaultFieldTemplate: React.FC<FieldTemplateProps> = ({
  children,
  classNames,
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
  const fieldDataCy = uiSchema["ui:field-data-cy"];
  return (
    !hidden && (
      <>
        {isNullType && showLabel && (
          <CustomTitleField id={id} title={label} uiSchema={uiSchema} />
        )}
        {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
        {isNullType && <>{description}</>}
        <DefaultFieldContainer
          id={`${sectionId} ${id}`}
          className={classNames}
          border={border}
          data-cy={fieldDataCy}
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
  width: 100%;
`;
