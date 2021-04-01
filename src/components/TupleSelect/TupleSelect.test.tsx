import {
  customRenderWithRouterMatch as render,
  fireEvent,
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
    value: ProjectFilterOptions.Test,
    displayName: "Test",
    placeHolderText: "Search Test names",
  },
  {
    value: ProjectFilterOptions.Task,
    displayName: "Task",
    placeHolderText: "Search Task names",
  },
];
const Content = () => <TupleSelect options={options} />;

test("Renders normally and doesn't affect the url", () => {
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

test("Should clear input when a value is submitted", () => {
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

test("Should add input query params to the url", () => {
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

test("Should add multiple input filters to the same key as query params", () => {
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

test("Should not allow duplicate input filters for the same key as query params", () => {
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

// test("Should allow multiple input filters for different keys as query params", () => {
//   const { queryByDataCy, history, getByLabelText, debug } = render(Content, {
//     route: `/commits/evergreen`,
//     path: "/commits/:projectId",
//   });
//   const input = queryByDataCy("tuple-select-input");
//   const dropdown = queryByDataCy("tuple-select-dropdown");

//   expect(input).toHaveValue("");
//   fireEvent.change(input, {
//     target: { value: "some-filter" },
//   });
//   expect(input).toHaveValue("some-filter");
//   fireEvent.keyDown(input, {
//     key: "Enter",
//     keyCode: 13,
//   });

//   fireEvent.mouseDown(dropdown);
//   debug();
//   fireEvent.click(getByLabelText(ProjectFilterOptions.Test));
//   expect(dropdown).toHaveValue(ProjectFilterOptions.Test);
//   fireEvent.change(input, {
//     target: { value: "some-filter" },
//   });
//   expect(input).toHaveValue("some-filter");
//   fireEvent.keyDown(input, {
//     key: "Enter",
//     keyCode: 13,
//   });
//   const { location } = history;
//   expect(location.search).toBe(
//     `?${ProjectFilterOptions.BuildVariant}=some-filter`
//   );
// });
