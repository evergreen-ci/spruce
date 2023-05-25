import styled from "@emotion/styled";
import { size } from "constants/tokens";

interface TableWrapperProps {
  children: React.ReactNode;
  controls?: React.ReactNode;
  shouldShowBottomTableControl?: boolean;
}
const TableWrapper: React.FC<TableWrapperProps> = ({
  children,
  controls,
  shouldShowBottomTableControl,
}) => (
  <>
    {controls}
    {children}
    {shouldShowBottomTableControl && (
      <TableControlWrapper>{controls}</TableControlWrapper>
    )}
  </>
);

const TableControlWrapper = styled.div`
  padding-top: ${size.xs};
  margin-bottom: ${size.l};
`;

export default TableWrapper;
