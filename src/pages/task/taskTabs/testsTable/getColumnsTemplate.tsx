import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { ColumnProps } from "antd/es/table";
import { Analytics } from "analytics/addPageAction";
import Badge, { Variant } from "components/Badge";
import { TreeSelect, TreeSelectProps } from "components/TreeSelect";
import { WordBreak } from "components/Typography";
import {
  getLobsterTestLogUrl,
  getUpdatedLobsterUrl,
  isLogkeeperLink,
} from "constants/externalResources";
import { statusToBadgeColor, statusCopy } from "constants/test";
import { TestSortCategory, TestResult } from "gql/generated/types";
import { string } from "utils";

const { msToDuration } = string;

interface GetColumnsTemplateParams {
  taskAnalytics: Analytics<
    | { name: "Click Logs Lobster Button" }
    | { name: "Click Logs HTML Button" }
    | { name: "Click Logs Raw Button" }
  >;
  statusSelectorProps: TreeSelectProps;
}

export const getColumnsTemplate = ({
  taskAnalytics,
  statusSelectorProps,
}: GetColumnsTemplateParams): ColumnProps<TestResult>[] => [
  {
    title: <span data-cy="name-column">Name</span>,
    dataIndex: "testFile",
    key: TestSortCategory.TestName,
    width: "40%",
    render: (name, { displayTestName }) => (
      <WordBreak>{displayTestName || name}</WordBreak>
    ),
    sorter: true,
  },
  {
    title: <span data-cy="status-column">Status</span>,
    dataIndex: "status",
    key: TestSortCategory.Status,
    sorter: true,
    render: (status: string): JSX.Element => (
      <span>
        <Badge
          variant={statusToBadgeColor[status] || Variant.LightGray}
          key={status}
        >
          {statusCopy[status] || ""}
        </Badge>
      </span>
    ),
    filterDropdown: <TreeSelect {...statusSelectorProps} />,
  },
  {
    title: <span data-cy="base-status-column">Base Status</span>,
    dataIndex: "baseStatus",
    key: TestSortCategory.BaseStatus,
    sorter: true,
    render: (status: string): JSX.Element => (
      <span>
        <Badge
          variant={statusToBadgeColor[status] || Variant.LightGray}
          key={status}
        >
          {statusCopy[status] || ""}
        </Badge>
      </span>
    ),
  },
  {
    title: <span data-cy="time-column">Time</span>,
    dataIndex: "duration",
    key: TestSortCategory.Duration,
    sorter: true,
    render: (text: number): string => {
      const ms = text * 1000;
      return msToDuration(Math.trunc(ms));
    },
  },
  {
    title: <span data-cy="logs-column">Logs</span>,
    width: 230,
    dataIndex: "logs",
    key: "logs",
    sorter: false,
    render: (a, b): JSX.Element => {
      const { execution, lineNum, taskId, id } = b || {};
      const { htmlDisplayURL, rawDisplayURL } = b?.logs ?? {};
      const hasLobsterLink = isLogkeeperLink(htmlDisplayURL);
      const lobsterLink = hasLobsterLink
        ? getUpdatedLobsterUrl(htmlDisplayURL)
        : getLobsterTestLogUrl({ taskId, execution, testId: id, lineNum });

      return (
        <>
          {lobsterLink && (
            <ButtonWrapper>
              <Button
                data-cy="test-table-lobster-btn"
                size="small"
                target="_blank"
                variant="default"
                href={lobsterLink}
                onClick={() =>
                  taskAnalytics.sendEvent({
                    name: "Click Logs Lobster Button",
                  })
                }
              >
                Lobster
              </Button>
            </ButtonWrapper>
          )}
          {!hasLobsterLink && (
            <ButtonWrapper>
              <Button
                data-cy="test-table-html-btn"
                size="small"
                target="_blank"
                variant="default"
                href={htmlDisplayURL}
                onClick={() =>
                  taskAnalytics.sendEvent({
                    name: "Click Logs HTML Button",
                  })
                }
              >
                HTML
              </Button>
            </ButtonWrapper>
          )}
          {rawDisplayURL && (
            <Button
              data-cy="test-table-raw-btn"
              size="small"
              target="_blank"
              variant="default"
              href={rawDisplayURL}
              onClick={() =>
                taskAnalytics.sendEvent({ name: "Click Logs Raw Button" })
              }
            >
              Raw
            </Button>
          )}
        </>
      );
    },
  },
];

const ButtonWrapper = styled("span")`
  margin-right: 8px;
`;
