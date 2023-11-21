import {
  V10Table as Table,
  V10TableHeader as TableHeader,
  V10HeaderRow as HeaderRow,
  V10Row as Row,
  V10Cell as Cell,
  V11Adapter,
} from "@leafygreen-ui/table";
import { Link } from "@leafygreen-ui/typography";
import { useJobLogsAnalytics } from "analytics/joblogs/useJobLogsAnalytics";
import { TablePlaceholder } from "components/Table/TablePlaceholder";
import { getParsleyTestLogURL } from "constants/externalResources";
import { LogkeeperBuildMetadataQuery } from "gql/generated/types";

interface JobLogsTableProps {
  buildId: string;
  tests: LogkeeperBuildMetadataQuery["logkeeperBuildMetadata"]["tests"];
}

export const JobLogsTable: React.FC<JobLogsTableProps> = ({
  buildId,
  tests,
}) => {
  const { sendEvent } = useJobLogsAnalytics();
  return (
    <>
      <V11Adapter shouldAlternateRowColor>
        <Table
          data={tests}
          columns={
            <HeaderRow>
              <TableHeader key="test-name" label="Test Name" />
            </HeaderRow>
          }
        >
          {({ datum }) => (
            <Row key={datum.id} data-cy="job-logs-table-row">
              <Cell>
                <Link
                  href={getParsleyTestLogURL(buildId, datum.id)}
                  onClick={() => {
                    sendEvent({
                      name: "Clicked Parsley test log link",
                      buildId,
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
      </V11Adapter>
      {tests.length === 0 && (
        <TablePlaceholder message="No test results found." />
      )}
    </>
  );
};
