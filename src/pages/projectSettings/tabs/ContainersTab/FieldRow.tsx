import styled from "@emotion/styled";
import { ObjectFieldTemplateProps } from "@rjsf/core";
import { size } from "constants/tokens";
import { form } from "../utils";

const { getFields } = form;

export const FieldRow: React.VFC<
  Pick<ObjectFieldTemplateProps, "formData" | "properties" | "uiSchema">
> = ({ properties, uiSchema }) => {
  const dataCy = uiSchema?.["ui:data-cy"] satisfies string;
  const fields = getFields(properties, false);

  return <RowContainer data-cy={dataCy}>{fields}</RowContainer>;
};

const RowContainer = styled.div`
  display: flex;
  margin-bottom: ${size.s};
  justify-content: space-between;
  gap: ${size.s};
`;
