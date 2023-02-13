import { Table, TableHeader, Row, Cell } from "@leafygreen-ui/table";
import { Link } from "@leafygreen-ui/typography";
import { getParsleyTestLogURL } from "constants/externalResources";
import { LogkeeperTest } from "gql/generated/types";

interface JobLogsTableProps {
  buildId: string;
  tests: Pick<LogkeeperTest, "id" | "name">[];
}

export const JobLogsTable: React.VFC<JobLogsTableProps> = ({
  buildId,
  tests,
}) => (
  <Table
    data={tests}
    columns={[<TableHeader key="test-name" label="Test Name" />]}
  >
    {({ datum }) => (
      <Row key={datum.id} data-cy="job-logs-table-row">
        <Cell>
          <Link href={getParsleyTestLogURL(buildId, datum.id)} hideExternalIcon>
            {datum.name}
          </Link>
        </Cell>
      </Row>
    )}
  </Table>
);
