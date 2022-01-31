import React from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Body, H2 } from "@leafygreen-ui/typography";
import { Table } from "antd";
import Badge from "components/Badge";
import Icon from "components/Icon";
import { size } from "constants/tokens";

export const Title = H2;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const BadgeWrapper = styled.div`
  display: flex;
`;

export const StyledBadge = styled(Badge)`
  margin-right: 10px;
  margin-left: 10px;
`;

export const PlusButton = ({ children, ...props }) => (
  <Button {...{ ...props, glyph: <Icon glyph="Plus" /> }} as="button">
    {children}
  </Button>
);

const TableContainer = styled.div`
  overflow-x: scroll;
  width: 100%;
`;

export const SpawnTable = (props: React.ComponentProps<typeof Table>) => (
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

// @ts-expect-error
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
  margin-top: ${size.s}px;
`;

export const SectionLabel = styled(Body)`
  flex-grow: 1;
  padding-right: ${size.s}px;
  margin-top: ${size.m}px;
`;

// @ts-expect-error
export const PaddedButton = styled(Button)`
  margin-left: ${size.xxs}px;
  margin-right: ${size.xxs}px;
  flex-grow: 0;
`;
