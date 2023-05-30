import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Table, TableHeader, Row, Cell } from "@leafygreen-ui/table";
import { Subtitle } from "@leafygreen-ui/typography";
import { useLocation, useParams } from "react-router-dom";
import PageSizeSelector, {
  usePageSizeSelector,
} from "components/PageSizeSelector";
import Pagination from "components/Pagination";
import { SiderCard, TableControlInnerRow } from "components/styles";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import { PodEventsQuery, PodEventsQueryVariables } from "gql/generated/types";
import { GET_POD_EVENTS } from "gql/queries";
import { useDateFormat } from "hooks";
import { url } from "utils";
import { getEventCopy } from "./util";

const { getPageFromSearch, getLimitFromSearch } = url;

const EventsTable: React.VFC<{}> = () => {
  const getDateCopy = useDateFormat();
  const { search } = useLocation();
  const setPageSize = usePageSizeSelector();
  const page = getPageFromSearch(search);
  const limit = getLimitFromSearch(search);
  const { id } = useParams<{ id: string }>();
  const dispatchToast = useToastContext();
  const { data: podEventsData } = useQuery<
    PodEventsQuery,
    PodEventsQueryVariables
  >(GET_POD_EVENTS, {
    variables: { id, page, limit },
    onError: (err) => {
      dispatchToast.error(
        `There was an error loading the pod events: ${err.message}`
      );
    },
  });
  const { count, eventLogEntries } = podEventsData?.pod.events ?? {};
  return (
    <SiderCard>
      <TableTitle>
        <StyledSubtitle>Recent Events</StyledSubtitle>
        <TableControlInnerRow>
          <Pagination
            currentPage={page}
            totalResults={count ?? 0}
            pageSize={limit}
          />
          <PageSizeSelector
            data-cy="pod-events-page-size-selector"
            value={limit}
            onChange={setPageSize}
          />
        </TableControlInnerRow>
      </TableTitle>

      <Table
        data-cy="container-events"
        data={eventLogEntries}
        columns={[
          <TableHeader key="date" dataType="date" label="Date" />,
          <TableHeader key="event" label="Event" />,
        ]}
      >
        {({ datum }) => (
          <Row data-cy={`event-type-${datum.eventType}`} key={datum.id}>
            <Cell data-cy={`${datum.eventType}-time`}>
              {getDateCopy(datum.timestamp)}
            </Cell>
            <Cell>{getEventCopy(datum)}</Cell>
          </Row>
        )}
      </Table>
    </SiderCard>
  );
};

const StyledSubtitle = styled(Subtitle)`
  margin: ${size.s} 0;
`;

const TableTitle = styled.div`
  flex-wrap: nowrap;
  display: flex;
  justify-content: space-between;
`;

export default EventsTable;
