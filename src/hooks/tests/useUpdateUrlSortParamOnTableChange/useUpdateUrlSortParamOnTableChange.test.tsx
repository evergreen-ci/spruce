import MatchMediaMock from "jest-matchmedia-mock";
import {
  renderWithRouterMatch as render,
  fireEvent,
} from "test_utils/test-utils";
import { TestComponent } from "./TestComponent";

describe("useUpdateUrlSortParamOnTableChange", () => {
  let matchMedia;
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
  });

  afterEach(() => {
    matchMedia.clear();
  });
  it("toggles table headers when clicked", () => {
    const { getByText } = render(() => <TestComponent />, {
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
