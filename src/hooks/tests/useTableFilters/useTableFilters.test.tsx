import { useLocation } from "react-router-dom";
import { CheckboxFilter, InputFilter } from "components/Table/Filters";
import { useTableInputFilter, useTableCheckboxFilter } from "hooks";
import { renderWithRouterMatch as render, fireEvent } from "test_utils";
import { queryString } from "utils";

describe("useTableInputFilter", () => {
  it("accepts an input value", async () => {
    const { getByText, getByPlaceholderText } = render(
      <InputFilterTestComponent />,
      {
        route: "/hosts?hostId=123",
        path: "/hosts",
      }
    );

    const input = getByPlaceholderText("Search ID") as HTMLInputElement;

    // starts with initial url params as value
    expect(input.value).toBe("123");

    fireEvent.change(input, { target: { value: "" } });
    fireEvent.change(input, { target: { value: "abc" } });
    expect(input).toHaveValue("abc");
    fireEvent.focus(input);
    fireEvent.keyPress(input, {
      key: "Enter",
      keyCode: 13,
    });

    // returns updates value when component changes
    expect(input.value).toBe("abc");

    // updates url query params when update fn is called
    getByText("host id from url: abc");

    fireEvent.change(input, { target: { value: "" } });
    expect(input).toHaveValue("");
    fireEvent.focus(input);
    fireEvent.keyPress(input, {
      key: "Enter",
      keyCode: 13,
    });

    // resets url query params when reset fn is called
    expect(input.value).toBe("");
    getByText("host id from url: N/A");
  });

  it("useTableInputFilter - trims whitespace from input value", () => {
    const { getByText, getByPlaceholderText } = render(
      <InputFilterTestComponent />,
      {
        route: "/hosts?hostId=123",
        path: "/hosts",
      }
    );

    const input = getByPlaceholderText("Search ID") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "     abc  " } });
    fireEvent.focus(input);
    fireEvent.keyPress(input, {
      key: "Enter",
      keyCode: 13,
    });

    expect(getByText("host id from url: abc")).toBeInTheDocument();
  });
});

describe("useTableCheckboxFilter", () => {
  it("useTableCheckboxFilter", async () => {
    const { getByText, getByLabelText } = render(
      <CheckboxFilterTestComponent />,
      {
        route: "/hosts?statuses=running,terminated",
        path: "/hosts",
      }
    );

    const runningCheckbox = getByLabelText("Running") as HTMLInputElement;
    const terminatedCheckbox = getByLabelText("Terminated") as HTMLInputElement;

    // starts with initial url params as value
    expect(runningCheckbox.checked).toBe(true);
    expect(terminatedCheckbox.checked).toBe(true);

    // returns updates value when component changes
    fireEvent.click(runningCheckbox);

    // updates url query params when update fn is called
    expect(runningCheckbox.checked).toBe(false);
    expect(terminatedCheckbox.checked).toBe(true);

    getByText("statuses from url: terminated");

    // resets url query params when reset fn is called
    fireEvent.click(terminatedCheckbox);

    expect(runningCheckbox.checked).toBe(false);
    expect(terminatedCheckbox.checked).toBe(false);

    getByText("statuses from url: none");
  });
});

const { parseQueryString } = queryString;
const hostIdUrlParam = "hostId";

const InputFilterTestComponent = () => {
  const [value, onChange, onFilter] = useTableInputFilter({
    urlSearchParam: hostIdUrlParam,
    sendAnalyticsEvent: () => undefined,
  });

  const { search } = useLocation();
  const queryParams = parseQueryString(search);
  return (
    <>
      <div>host id from url: {queryParams[hostIdUrlParam] ?? "N/A"}</div>
      <InputFilter
        {...{
          placeholder: "Search ID",
          value,
          onChange,
          onFilter,
        }}
      />
    </>
  );
};

const statusesUrlParam = "statuses";

const CheckboxFilterTestComponent = () => {
  const [value, onChange] = useTableCheckboxFilter({
    urlSearchParam: statusesUrlParam,
    sendAnalyticsEvent: () => undefined,
  });

  const { search } = useLocation();
  const queryParams = parseQueryString(search);
  const statusesFromUrl = queryParams[statusesUrlParam];

  const urlValue = Array.isArray(statusesFromUrl)
    ? statusesFromUrl.join()
    : statusesFromUrl ?? "none";

  return (
    <>
      <div>statuses from url: {urlValue}</div>
      <CheckboxFilter
        {...{
          statuses,
          value,
          onChange,
        }}
      />
    </>
  );
};

const statuses = [
  {
    title: "Running",
    value: "running",
    key: "running",
  },
  {
    title: "Terminated",
    value: "terminated",
    key: "terminated",
  },
];
