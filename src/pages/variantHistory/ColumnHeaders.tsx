import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { Skeleton } from "antd";
import { context, Cell } from "components/HistoryTable";
import { StyledRouterLink } from "components/styles";
import { getTaskHistoryRoute } from "constants/routes";
import { array, string } from "utils";

const { mapStringArrayToObject } = array;
const { trimMiddleText } = string;
const { useHistoryTable } = context;
const { HeaderCell } = Cell;

const maxLength = 50;
const trailingLength = 10;

interface ColumnHeadersProps {
  projectId: string;
  columns: string[];
  loading: boolean;
}

const ColumnHeaders: React.FC<ColumnHeadersProps> = ({
  projectId,
  columns,
  loading,
}) => {
  const { visibleColumns, columnLimit } = useHistoryTable();
  const columnMap = mapStringArrayToObject(columns, "name");

  return (
    <RowContainer>
      <LabelCellContainer />
      {visibleColumns.map((vc) => {
        const cell = columnMap[vc];
        if (!cell) {
          return null;
        }
        return (
          <HeaderCell data-cy="header-cell" key={`header_cell_${vc}`}>
            {vc.length < maxLength ? (
              <StyledRouterLink to={getTaskHistoryRoute(projectId, vc)}>
                {vc}
              </StyledRouterLink>
            ) : (
              <Tooltip
                align="top"
                justify="middle"
                trigger={
                  <StyledRouterLink to={getTaskHistoryRoute(projectId, vc)}>
                    {trimMiddleText(vc, maxLength, trailingLength)}
                  </StyledRouterLink>
                }
                triggerEvent="hover"
              >
                {vc}
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
