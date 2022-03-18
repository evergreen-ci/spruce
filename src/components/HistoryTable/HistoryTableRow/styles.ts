import styled from "@emotion/styled";

export const LabelCellContainer = styled.div`
  width: 200px;
  padding-right: 40px;
`;

export const RowContainer = styled.div<{ selected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => (props.selected ? "#e6f7ff" : "white")};
`;
