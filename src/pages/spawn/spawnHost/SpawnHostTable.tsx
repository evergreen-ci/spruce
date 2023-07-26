import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useLocation } from "react-router-dom";
import { useSpawnAnalytics } from "analytics";
import HostStatusBadge from "components/HostStatusBadge";
import { DoesNotExpire, SpawnTable } from "components/Spawn";
import { StyledRouterLink, WordBreak } from "components/styles";
import { getHostRoute } from "constants/routes";
import { size } from "constants/tokens";
import { MyHost } from "types/spawn";
import { queryString, string } from "utils";
import { SpawnHostCard } from "./SpawnHostCard";
import { SpawnHostTableActions } from "./SpawnHostTableActions";

const { parseQueryString } = queryString;
const { sortFunctionDate, sortFunctionString } = string;

interface SpawnHostTableProps {
  hosts: MyHost[];
}
export const SpawnHostTable: React.VFC<SpawnHostTableProps> = ({ hosts }) => {
  const { search } = useLocation();
  const host = parseQueryString(search)?.host;
  const spawnAnalytics = useSpawnAnalytics();
  return (
    <SpawnTable
      columns={columns}
      dataSource={hosts}
      expandable={{
        expandedRowRender: (record: MyHost) => <SpawnHostCard host={record} />,
        onExpand: (expanded) => {
          spawnAnalytics.sendEvent({
            expanded,
            name: "Toggle Spawn Host Details",
          });
        },
      }}
      defaultExpandedRowKeys={[host as string]}
    />
  );
};

const columns = [
  {
    dataIndex: "id",
    key: "host",
    render: (_, host: MyHost) => (
      <HostNameWrapper>
        {host?.distro?.isVirtualWorkStation ? (
          <FlexContainer>
            <NoWrap>{host.displayName || host.id}</NoWrap>
            <WorkstationBadge>WORKSTATION</WorkstationBadge>
          </FlexContainer>
        ) : (
          <WordBreak>{host.displayName || host.id}</WordBreak>
        )}
        <StyledRouterLink to={getHostRoute(host.id)} css={linkStyle}>
          Event Log
        </StyledRouterLink>
      </HostNameWrapper>
    ),
    sorter: (a: MyHost, b: MyHost) => sortFunctionString(a, b, "id"),
    title: "Host",
  },
  {
    dataIndex: "distro",
    key: "distro",
    render: (distro) => <WordBreak>{distro.id}</WordBreak>,
    sorter: (a: MyHost, b: MyHost) => sortFunctionString(a, b, "distro.id"),
    title: "Distro",
  },
  {
    dataIndex: "status",
    key: "status",
    render: (status) => <HostStatusBadge status={status} />,
    sorter: (a: MyHost, b: MyHost) => sortFunctionString(a, b, "status"),
    title: "Status",
  },
  {
    dataIndex: "expiration",
    key: "expiration",
    render: (expiration, host: MyHost) =>
      host?.noExpiration
        ? DoesNotExpire
        : formatDistanceToNow(new Date(expiration)),
    sorter: (a: MyHost, b: MyHost) => sortFunctionDate(a, b, "expiration"),
    title: "Expires In",
  },
  {
    dataIndex: "uptime",
    key: "uptime",
    title: "Uptime",

    render: (uptime) => formatDistanceToNow(new Date(uptime)),
    sorter: (a: MyHost, b: MyHost) => sortFunctionDate(a, b, "uptime"),
  },
  {
    key: "action",
    render: (_, host: MyHost) => <SpawnHostTableActions host={host} />,
    title: "Action",
  },
];

const FlexContainer = styled.div`
  align-items: baseline;
  display: flex;
`;

const HostNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const linkStyle = css`
  width: fit-content;
`;

const WorkstationBadge = styled(Badge)`
  margin-left: ${size.xs};
`;

const NoWrap = styled.span`
  white-space: nowrap;
`;
