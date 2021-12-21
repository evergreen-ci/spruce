import { render, fireEvent, waitFor } from "test_utils";
import { PopconfirmWithCheckbox } from ".";

const noop = () => {};
const btn = <button type="button">btn</button>;
const checkboxLabel = "a cool checkbox label";
const title = "cool title";

describe("popconfirmWithCheckbox", () => {
  it("passing in the checkboxLabel prop should display a confirmation checkbox and checkbox label.", () => {
    const { queryByText, queryByDataCy } = render(
      <PopconfirmWithCheckbox
        title={title}
        checkboxLabel={checkboxLabel}
        onConfirm={noop}
      >
        {btn}
      </PopconfirmWithCheckbox>
    );
    expect(queryByText(checkboxLabel)).not.toBeInTheDocument();
    fireEvent.click(queryByText("btn"));
    expect(queryByText(checkboxLabel)).toBeInTheDocument();
    expect(queryByDataCy("popconfirm-checkbox")).toBeInTheDocument();
  });

  it("passing in an empty checkboxLabel prop should not render confirmation checkbox and checkbox label.", () => {
    const { queryByText, queryByDataCy } = render(
      <PopconfirmWithCheckbox title={title} checkboxLabel="" onConfirm={noop}>
        {btn}
      </PopconfirmWithCheckbox>
    );
    fireEvent.click(queryByText("btn"));
    waitFor(() => expect(queryByText(checkboxLabel)).not.toBeVisible());
    expect(queryByDataCy("popconfirm-checkbox")).not.toBeInTheDocument();
  });

  it("not providing a checkboxLabel prop should not render confirmation checkbox and checkbox label.", () => {
    const { queryByText, queryByDataCy } = render(
      <PopconfirmWithCheckbox title={title} onConfirm={noop}>
        {btn}
      </PopconfirmWithCheckbox>
    );
    fireEvent.click(queryByText("btn"));
    waitFor(() => expect(queryByText(checkboxLabel)).not.toBeVisible());
    expect(queryByDataCy("popconfirm-checkbox")).not.toBeInTheDocument();
  });

  it("ok button is enabled on initial render when no checkbox label is provided.", async () => {
    const mockCb = jest.fn();
    const { queryByText } = render(
      <PopconfirmWithCheckbox title={title} onConfirm={mockCb}>
        {btn}
      </PopconfirmWithCheckbox>
    );
    fireEvent.click(queryByText("btn"));
    await waitFor(() => expect(queryByText("Yes")).toBeInTheDocument());
    fireEvent.click(queryByText("Yes"));
    expect(mockCb).toHaveBeenCalledTimes(1);
  });

  it("ok button is disabled on initial render when a checkbox label is provided.", async () => {
    const mockCb = jest.fn();
    const { queryByText } = render(
      <PopconfirmWithCheckbox
        checkboxLabel={checkboxLabel}
        title={title}
        onConfirm={mockCb}
      >
        {btn}
      </PopconfirmWithCheckbox>
    );
    fireEvent.click(queryByText("btn"));
    await waitFor(() => expect(queryByText("Yes")).toBeInTheDocument());
    fireEvent.click(queryByText("Yes"));
    expect(mockCb).toHaveBeenCalledTimes(0);
  });

  it("ok button is enabled after checking the checkbox.", async () => {
    const mockCb = jest.fn();
    const { queryByText, queryByDataCy } = render(
      <PopconfirmWithCheckbox
        checkboxLabel={checkboxLabel}
        title={title}
        onConfirm={mockCb}
      >
        {btn}
      </PopconfirmWithCheckbox>
    );
    fireEvent.click(queryByText("btn"));
    await waitFor(() => expect(queryByText("Yes")).toBeInTheDocument());

    // attempt before checking
    fireEvent.click(queryByText("Yes"));
    expect(mockCb).toHaveBeenCalledTimes(0);

    fireEvent.click(queryByDataCy("popconfirm-checkbox"));
    // attempt after checking
    fireEvent.click(queryByText("Yes"));
    expect(mockCb).toHaveBeenCalledTimes(1);
  });
});
