import React from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Body, H2 } from "@leafygreen-ui/typography";
import { Table } from "antd";
import Badge from "components/Badge";
import Icon from "components/icons/Icon";

export { DetailsCard } from "./DetailsCard";

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
        rowKey: (record) => record.displayName || record.id,
        pagination: false,
        expandRowByClick: true,
        expandIcon: ({ expanded }) => (
          <Icon glyph={expanded ? "CaretDown" : "CaretRight"} />
        ),
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
  margin-top: 15px;
`;

export const SectionLabel = styled(Body)`
  padding-right: 15px;
  margin-top: 22px;
  min-width: 175px;
`;
