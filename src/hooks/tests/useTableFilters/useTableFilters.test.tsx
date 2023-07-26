import { useLocation } from "react-router-dom";
import { CheckboxFilter, InputFilter } from "components/Table/Filters";
import { useTableInputFilter, useTableCheckboxFilter } from "hooks";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import { queryString } from "utils";

describe("useTableInputFilter", () => {
  it("accepts an input value", async () => {
    render(<InputFilterTestComponent />, {
      path: "/hosts",
      route: "/hosts?hostId=123",
    });

    const input = screen.getByPlaceholderText("Search ID") as HTMLInputElement;

    // starts with initial url params as value
    expect(input.value).toBe("123");

    userEvent.clear(input);
    userEvent.type(input, "abc");
    expect(input).toHaveValue("abc");
    userEvent.type(input, "{enter}");

    // returns updates value when component changes
    expect(input.value).toBe("abc");

    // updates url query params when update fn is called
    screen.getByText("host id from url: abc");

    userEvent.clear(input);
    expect(input).toHaveValue("");
    userEvent.type(input, "{enter}");

    // resets url query params when reset fn is called
    expect(input.value).toBe("");
    expect(screen.getByText("host id from url: N/A")).toBeInTheDocument();
  });

  it("useTableInputFilter - trims whitespace from input value", () => {
    render(<InputFilterTestComponent />, {
      path: "/hosts",
      route: "/hosts?hostId=123",
    });

    const input = screen.getByPlaceholderText("Search ID") as HTMLInputElement;
    userEvent.clear(input);
    userEvent.type(input, "     abc  ");
    userEvent.type(input, "{enter}");
    expect(screen.getByText("host id from url: abc")).toBeInTheDocument();
  });
});

describe("useTableCheckboxFilter", () => {
  it("useTableCheckboxFilter", async () => {
    render(<CheckboxFilterTestComponent />, {
      path: "/hosts",
      route: "/hosts?statuses=running,terminated",
    });

    const runningCheckbox = screen.getByLabelText(
      "Running"
    ) as HTMLInputElement;
    const terminatedCheckbox = screen.getByLabelText(
      "Terminated"
    ) as HTMLInputElement;

    // starts with initial url params as value
    expect(runningCheckbox.checked).toBe(true);
    expect(terminatedCheckbox.checked).toBe(true);

    // returns updates value when component changes
    userEvent.click(runningCheckbox);

    // updates url query params when update fn is called
    expect(runningCheckbox.checked).toBe(false);
    expect(terminatedCheckbox.checked).toBe(true);

    expect(
      screen.getByText("statuses from url: terminated")
    ).toBeInTheDocument();

    // resets url query params when reset fn is called
    userEvent.click(terminatedCheckbox);

    expect(runningCheckbox.checked).toBe(false);
    expect(terminatedCheckbox.checked).toBe(false);

    expect(screen.getByText("statuses from url: none")).toBeInTheDocument();
  });
});

const { parseQueryString } = queryString;
const hostIdUrlParam = "hostId";

const InputFilterTestComponent = () => {
  const [value, onChange, onFilter] = useTableInputFilter({
    sendAnalyticsEvent: () => undefined,
    urlSearchParam: hostIdUrlParam,
  });

  const { search } = useLocation();
  const queryParams = parseQueryString(search);
  return (
    <>
      <div>host id from url: {queryParams[hostIdUrlParam] ?? "N/A"}</div>
      <InputFilter
        {...{
          onChange,
          onFilter,
          placeholder: "Search ID",
          value,
        }}
      />
    </>
  );
};

const statusesUrlParam = "statuses";

const CheckboxFilterTestComponent = () => {
  const [value, onChange] = useTableCheckboxFilter({
    sendAnalyticsEvent: () => undefined,
    urlSearchParam: statusesUrlParam,
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
          onChange,
          statuses,
          value,
        }}
      />
    </>
  );
};

const statuses = [
  {
    key: "running",
    title: "Running",
    value: "running",
  },
  {
    key: "terminated",
    title: "Terminated",
    value: "terminated",
  },
];
