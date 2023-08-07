import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { H2 } from "@leafygreen-ui/typography";
import { Table } from "antd";
import Icon from "components/Icon";
import { size } from "constants/tokens";

export const Title = H2;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const BadgeWrapper = styled.div`
  display: flex;
  margin-left: ${size.xs};
  gap: ${size.xs};
`;

const TableContainer = styled.div`
  overflow-x: scroll;
  width: 100%;
`;

export const SpawnTable: React.FC<React.ComponentProps<typeof Table>> = (
  props
) => (
  <TableContainer>
    <Table
      {...{
        ...props,
        rowKey: (record) => record.id,
        pagination: false,
        expandRowByClick: true,
        expandIcon: ({ expanded, onExpand, record }) => {
          const onClick = (e) => {
            onExpand(record, e);
          };
          return (
            <span
              tabIndex={0}
              role="button"
              onClick={onClick}
              onKeyDown={onClick}
            >
              <Icon
                data-cy={`table-caret-icon-${record.id}`}
                glyph={expanded ? "CaretDown" : "CaretRight"}
              />
            </span>
          );
        },
      }}
    />
  </TableContainer>
);

export const DoesNotExpire = "Does not expire";

export const WideButton = styled(Button)`
  justify-content: center;
  width: 140px;
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Section = styled(ModalContent)`
  margin-top: 20px;
`;

export const SectionContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: ${size.s};
`;
