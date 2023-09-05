import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import MatchMediaMock from "jest-matchmedia-mock";
import { useLocation } from "react-router-dom";
import { useUpdateUrlSortParamOnTableChange } from "hooks";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import { queryString } from "utils";

describe("useUpdateUrlSortParamOnTableChange", () => {
  let matchMedia;
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
  });

  afterEach(() => {
    matchMedia.clear();
  });

  it("toggles table headers when clicked", async () => {
    const user = userEvent.setup();
    render(<TestComponent />, {
      route: "/hosts",
      path: "/hosts",
    });

    const idHeader = screen.getByText("ID");
    const statusHeader = screen.getByText("Status");

    await user.click(idHeader);

    expect(screen.getByText("sortBy: ID")).toBeInTheDocument();
    expect(screen.getByText("sortDir: ASC")).toBeInTheDocument();

    await user.click(statusHeader);

    expect(screen.getByText("sortBy: STATUS")).toBeInTheDocument();
    expect(screen.getByText("sortDir: ASC")).toBeInTheDocument();

    await user.click(statusHeader);

    expect(screen.getByText("sortBy: STATUS")).toBeInTheDocument();
    expect(screen.getByText("sortDir: DESC")).toBeInTheDocument();

    await user.click(statusHeader);

    expect(screen.getByText("sortBy: none")).toBeInTheDocument();
    expect(screen.getByText("sortDir: none")).toBeInTheDocument();
  });
});

const { parseQueryString } = queryString;
const TestComponent = () => {
  const tableChangeHandler = useUpdateUrlSortParamOnTableChange();

  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  return (
    <>
      <div>{`sortBy: ${queryParams.sortBy ?? "none"}`}</div>
      <div>{`sortDir: ${queryParams.sortDir ?? "none"}`}</div>
      <Table
        data-cy="hosts-table"
        rowKey={({ id }: { id: string }): string => id}
        pagination={false}
        columns={columnsTemplate}
        dataSource={data}
        onChange={tableChangeHandler}
      />
    </>
  );
};

interface Data {
  id: string;
  status: string;
  distro: string;
}

const data = [
  {
    id: "1",
    status: "passed",
    distro: "osx",
  },
  {
    id: "2",
    status: "failed",
    distro: "osx",
  },
  {
    id: "3",
    status: "passed",
    distro: "windows",
  },
];

const columnsTemplate: Array<ColumnProps<Data>> = [
  {
    title: "ID",
    dataIndex: "id",
    key: "ID",
    sorter: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "STATUS",
    sorter: true,
  },
  {
    title: "Distro",
    dataIndex: "distro",
    key: "DISTRO",
    sorter: true,
  },
];
