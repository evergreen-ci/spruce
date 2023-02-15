import { Table, TableHeader, Row, Cell } from "@leafygreen-ui/table";
import { Link } from "@leafygreen-ui/typography";
import { TablePlaceholder } from "components/Table/TablePlaceholder";
import { getParsleyTestLogURL } from "constants/externalResources";
import { LogkeeperBuildMetadataQuery } from "gql/generated/types";

interface JobLogsTableProps {
  buildId: string;
  tests: LogkeeperBuildMetadataQuery["logkeeperBuildMetadata"]["tests"];
}

export const JobLogsTable: React.VFC<JobLogsTableProps> = ({
  buildId,
  tests,
}) =>
  tests.length ? (
    <Table
      data={tests}
      columns={[<TableHeader key="test-name" label="Test Name" />]}
    >
      {({ datum }) => (
        <Row key={datum.id} data-cy="job-logs-table-row">
          <Cell>
            <Link
              href={getParsleyTestLogURL(buildId, datum.id)}
              hideExternalIcon
            >
              {datum.name}
            </Link>
          </Cell>
        </Row>
      )}
    </Table>
  ) : (
    <TablePlaceholder message="No test results found." />
  );
