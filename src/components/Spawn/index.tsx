import React from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { H2 } from "@leafygreen-ui/typography";
import { Table } from "antd";
import Badge from "components/Badge";
import Icon from "components/icons/Icon";

export const Container = styled.div`
  margin-left: 60px;
  width: 100%;
`;

export const Title = styled(H2)``;

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

export const PlusButton = ({
  children,
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button {...{ ...props, glyph: <Icon glyph="Plus" /> }}>{children}</Button>
);

const TableContainer = styled.div`
  width: 100%;
  padding-right: 1%;
`;

export const SpawnTable = (props: React.ComponentProps<typeof Table>) => (
  <TableContainer>
    <Table
      {...{
        ...props,
        rowKey: (record) => record.id,
        pagination: false,
        expandRowByClick: true,
        expandIcon: ({ expanded }) => (
          <Icon glyph={expanded ? "CaretDown" : "CaretRight"} />
        ),
      }}
    />
  </TableContainer>
);
