import { Table, TableHeader, Row, Cell } from "@leafygreen-ui/table";
import { Link } from "@leafygreen-ui/typography";
import { useJobLogsAnalytics } from "analytics/joblogs/useJobLogsAnalytics";
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
}) => {
  const { sendEvent } = useJobLogsAnalytics();
  return (
    <>
      <Table
        data={tests}
        columns={[<TableHeader key="test-name" label="Test Name" />]}
      >
        {({ datum }) => (
          <Row key={datum.id} data-cy="job-logs-table-row">
            <Cell>
              <Link
                href={getParsleyTestLogURL(buildId, datum.id)}
                onClick={() => {
                  sendEvent({
                    buildId,
                    name: "Clicked Parsley test log link",
                  });
                }}
                hideExternalIcon
              >
                {datum.name}
              </Link>
            </Cell>
          </Row>
        )}
      </Table>
      {tests.length === 0 && (
        <TablePlaceholder message="No test results found." />
      )}
    </>
  );
};
