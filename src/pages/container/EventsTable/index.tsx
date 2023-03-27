import styled from "@emotion/styled";
import { Subtitle } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { SiderCard } from "components/styles";
import { size } from "constants/tokens";

const EventsTable: React.VFC<{}> = () => (
  <SiderCard>
    <TableTitle>
      {/* @ts-expect-error */}
      <StyledSubtitle>Recent Events</StyledSubtitle>
    </TableTitle>
    <Skeleton active />
  </SiderCard>
);

// @ts-expect-error
const StyledSubtitle = styled(Subtitle)`
  margin: ${size.s} 0;
`;

const TableTitle = styled.div`
  flex-wrap: nowrap;
  display: flex;
  justify-content: space-between;
`;

export default EventsTable;
