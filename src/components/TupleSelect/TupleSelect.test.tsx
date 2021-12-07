import {
  renderWithRouterMatch as render,
  fireEvent,
  act,
} from "test_utils/test-utils";
import { ProjectFilterOptions } from "types/commits";
import { TupleSelect } from ".";

const options = [
  {
    value: ProjectFilterOptions.BuildVariant,
    displayName: "Build Variant",
    placeHolderText: "Search Build Variant names",
  },
  {
    value: ProjectFilterOptions.Task,
    displayName: "Task",
    placeHolderText: "Search Task names",
  },
];
const Content = () => <TupleSelect options={options} />;
describe("tupleSelect", () => {
  it("renders normally and doesn't affect the url", () => {
    const { queryByDataCy } = render(Content, {
      route: `/commits/evergreen`,
      path: "/commits/:projectId",
    });
    const input = queryByDataCy("tuple-select-input");
    const dropdown = queryByDataCy("tuple-select-dropdown");
    expect(dropdown).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(dropdown).toHaveTextContent("Build Variant");
    expect(input).toHaveValue("");
  });

  it("should clear input when a value is submitted", () => {
    const { queryByDataCy } = render(Content, {
      route: `/commits/evergreen`,
      path: "/commits/:projectId",
    });
    const input = queryByDataCy("tuple-select-input");

    expect(input).toHaveValue("");
    fireEvent.change(input, {
      target: { value: "some-filter" },
    });
    expect(input).toHaveValue("some-filter");
    fireEvent.focus(input);
    fireEvent.keyDown(input, {
      key: "Enter",
      keyCode: 13,
    });
    expect(input).toHaveValue("");
  });

  it("should add input query params to the url", () => {
    const { queryByDataCy, history } = render(Content, {
      route: `/commits/evergreen`,
      path: "/commits/:projectId",
    });
    const input = queryByDataCy("tuple-select-input");

    expect(input).toHaveValue("");
    fireEvent.change(input, {
      target: { value: "some-filter" },
    });
    expect(input).toHaveValue("some-filter");
    fireEvent.focus(input);
    fireEvent.keyDown(input, {
      key: "Enter",
      keyCode: 13,
    });
    const { location } = history;

    expect(location.search).toBe(
      `?${ProjectFilterOptions.BuildVariant}=some-filter`
    );
  });

  it("should add multiple input filters to the same key as query params", () => {
    const { queryByDataCy, history } = render(Content, {
      route: `/commits/evergreen`,
      path: "/commits/:projectId",
    });
    const input = queryByDataCy("tuple-select-input");
    expect(input).toHaveValue("");
    fireEvent.change(input, {
      target: { value: "some-filter" },
    });
    expect(input).toHaveValue("some-filter");
    fireEvent.keyDown(input, {
      key: "Enter",
      keyCode: 13,
    });
    fireEvent.change(input, {
      target: { value: "some-other-filter" },
    });
    expect(input).toHaveValue("some-other-filter");
    fireEvent.keyDown(input, {
      key: "Enter",
      keyCode: 13,
    });
    const { location } = history;
    expect(location.search).toBe(
      `?${ProjectFilterOptions.BuildVariant}=some-filter,some-other-filter`
    );
  });

  it("should not allow duplicate input filters for the same key as query params", () => {
    const { queryByDataCy, history } = render(Content, {
      route: `/commits/evergreen`,
      path: "/commits/:projectId",
    });
    const input = queryByDataCy("tuple-select-input");
    expect(input).toHaveValue("");
    fireEvent.change(input, {
      target: { value: "some-filter" },
    });
    expect(input).toHaveValue("some-filter");
    fireEvent.keyDown(input, {
      key: "Enter",
      keyCode: 13,
    });
    fireEvent.change(input, {
      target: { value: "some-filter" },
    });
    expect(input).toHaveValue("some-filter");
    fireEvent.keyDown(input, {
      key: "Enter",
      keyCode: 13,
    });
    const { location } = history;
    expect(location.search).toBe(
      `?${ProjectFilterOptions.BuildVariant}=some-filter`
    );
  });

  it("should allow multiple input filters for different keys as query params", async () => {
    const { queryByDataCy } = render(Content, {
      route: `/commits/evergreen`,
      path: "/commits/:projectId",
    });
    const input = queryByDataCy("tuple-select-input");
    const dropdown = queryByDataCy("tuple-select-dropdown");

    expect(input).toHaveValue("");
    fireEvent.change(input, {
      target: { value: "some-filter" },
    });
    expect(input).toHaveValue("some-filter");
    fireEvent.keyDown(input, {
      key: "Enter",
      keyCode: 13,
    });

    // Because of some changes in antd v4 we cannot directly click on the antd select component
    // So we need to add some special handling to click the dropdown and select entries
    // https://github.com/ant-design/ant-design/issues/22074
    fireEvent.mouseDown(dropdown.firstChild);
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    fireEvent.change(input, {
      target: { value: "some-other-filter" },
    });
    expect(input).toHaveValue("some-other-filter");
    fireEvent.keyDown(input, {
      key: "Enter",
      keyCode: 13,
    });
  });
});
