import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { Table, TableHeader, Row, Cell } from "@leafygreen-ui/table";
import { fontFamilies } from "@leafygreen-ui/tokens";
import { getEventDiffLines } from "./EventLogDiffs";
import { Event, EventDiffLine, EventValue } from "./types";

type TableProps = {
  after: Event["after"];
  before: Event["before"];
};

export const EventDiffTable: React.VFC<TableProps> = ({ after, before }) => (
  <Table
    data={getEventDiffLines(before, after)}
    columns={[
      <TableHeader
        key="key"
        label="Property"
        sortBy={(datum: EventDiffLine) => datum.key}
      />,
      <TableHeader
        key="before"
        label="Before"
        sortBy={(datum: EventDiffLine) => JSON.stringify(datum.before)}
      />,
      <TableHeader
        key="after"
        label="After"
        sortBy={(datum: EventDiffLine) => JSON.stringify(datum.after)}
      />,
    ]}
  >
    {({ datum }) => (
      <Row key={datum.key} data-cy="event-log-table-row">
        <Cell>
          <CellText>{datum.key}</CellText>
        </Cell>
        <Cell>
          <CellText>{renderEventValue(datum.before)}</CellText>
        </Cell>
        <Cell>
          {renderEventValue(datum.after) === null ? (
            <Badge variant={Variant.Red}>Deleted</Badge>
          ) : (
            <CellText>{renderEventValue(datum.after)}</CellText>
          )}
        </Cell>
      </Row>
    )}
  </Table>
);

const CellText = styled.span`
  font-family: ${fontFamilies.code};
  font-size: 12px;
  line-height: 16px;
  word-break: break-all;
`;

const renderEventValue = (value: EventValue): string => {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "boolean") {
    return String(value);
  }

  if (typeof value === "string") {
    return `"${value}"`;
  }

  if (typeof value === "number") {
    return value;
  }

  if (Array.isArray(value)) {
    return JSON.stringify(value).replaceAll(",", ",\n");
  }

  return JSON.stringify(value);
};
