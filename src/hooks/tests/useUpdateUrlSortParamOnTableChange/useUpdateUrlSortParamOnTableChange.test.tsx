import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import MatchMediaMock from "jest-matchmedia-mock";
import { useLocation } from "react-router";
import { useUpdateUrlSortParamOnTableChange } from "hooks";
import { renderWithRouterMatch as render, fireEvent } from "test_utils";
import { queryString } from "utils";

describe("useUpdateUrlSortParamOnTableChange", () => {
  let matchMedia;
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
  });

  afterEach(() => {
    matchMedia.clear();
  });
  it("toggles table headers when clicked", () => {
    const { getByText } = render(<TestComponent />, {
      route: "/hosts",
      path: "/hosts",
    });

    const idHeader = getByText("ID");
    const statusHeader = getByText("Status");

    fireEvent.click(idHeader);

    expect(getByText("sortBy: ID")).toBeInTheDocument();
    expect(getByText("sortDir: ASC")).toBeInTheDocument();

    fireEvent.click(statusHeader);

    expect(getByText("sortBy: STATUS")).toBeInTheDocument();
    expect(getByText("sortDir: ASC")).toBeInTheDocument();

    fireEvent.click(statusHeader);

    expect(getByText("sortBy: STATUS")).toBeInTheDocument();
    expect(getByText("sortDir: DESC")).toBeInTheDocument();

    fireEvent.click(statusHeader);

    expect(getByText("sortBy: none")).toBeInTheDocument();
    expect(getByText("sortDir: none")).toBeInTheDocument();
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
