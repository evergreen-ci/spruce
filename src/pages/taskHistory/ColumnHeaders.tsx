import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { Skeleton } from "antd";
import { context, Cell } from "components/HistoryTable";
import { StyledRouterLink } from "components/styles";
import { getVariantHistoryRoute } from "constants/routes";
import { array, string } from "utils";

const { convertArrayToObject } = array;
const { trimMiddleText } = string;
const { useHistoryTable } = context;
const { HeaderCell } = Cell;

const maxLength = 50;
const trailingLength = 15;

interface ColumnHeadersProps {
  projectId: string;
  columns: {
    displayName: string;
    buildVariant: string;
  }[];
  loading: boolean;
}
const ColumnHeaders: React.FC<ColumnHeadersProps> = ({
  projectId,
  columns,
  loading,
}) => {
  const { visibleColumns, columnLimit } = useHistoryTable();
  const columnMap = convertArrayToObject(columns, "buildVariant");
  return (
    <RowContainer>
      <LabelCellContainer />
      {visibleColumns.map((vc) => {
        const cell = columnMap[vc];
        if (!cell) {
          return null;
        }
        return (
          <HeaderCell
            data-cy="header-cell"
            key={`header_cell_${cell.buildVariant}`}
          >
            {cell.displayName.length < maxLength ? (
              <StyledRouterLink
                to={getVariantHistoryRoute(projectId, cell.buildVariant)}
              >
                {cell.displayName}
              </StyledRouterLink>
            ) : (
              <Tooltip
                align="top"
                justify="middle"
                trigger={
                  <StyledRouterLink
                    to={getVariantHistoryRoute(projectId, cell.buildVariant)}
                  >
                    {trimMiddleText(
                      cell.displayName,
                      maxLength,
                      trailingLength
                    )}
                  </StyledRouterLink>
                }
                triggerEvent="hover"
              >
                {cell.displayName}
              </Tooltip>
            )}
          </HeaderCell>
        );
      })}
      {loading &&
        Array.from(Array(columnLimit)).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <HeaderCell data-cy="loading-header-cell" key={`loading_cell_${i}`}>
            <Skeleton active title paragraph={false} />
          </HeaderCell>
        ))}
    </RowContainer>
  );
};

// LabelCellContainer is used to provide padding for the first column in the table since we do not have a header for it
const LabelCellContainer = styled.div`
  width: 200px;
  padding-right: 40px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export default ColumnHeaders;
