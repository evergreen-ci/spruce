import { debug } from "console";
import React from "react";
import {
  customRenderWithRouterMatch as render,
  fireEvent,
  waitFor,
} from "test_utils/test-utils";
import { PopconfirmWithCheckbox } from ".";
const noop = () => {};
const btn = <button>btn</button>;
const checkboxLabel = "a cool checkbox label";
const title = "cool title";

it("Passing in the checkboxLabel prop should display a confirmation checkbox with the label.", async () => {
  const { queryByText, queryByDataCy } = render(() => (
    <PopconfirmWithCheckbox
      title={title}
      checkboxLabel={checkboxLabel}
      onClick={noop}
    >
      {btn}
    </PopconfirmWithCheckbox>
  ));
  expect(queryByText(checkboxLabel)).not.toBeInTheDocument();
  await fireEvent.click(queryByText("btn"));
  expect(queryByText(checkboxLabel)).toBeInTheDocument();
  expect(queryByDataCy("popconfirm-checkbox"));
});

// it("Passing in an empty checkboxLabel prop should not confirmation checkbox with the label.", () => {
//   const { queryByText } = render(() => (
//     <PopconfirmWithCheckbox
//       title={title}
//       checkboxLabel={checkboxLabel}
//       onClick={noop}
//     >
//       {btn}
//     </PopconfirmWithCheckbox>
//   ));
//   fireEvent.click(queryByText("btn"));
//   waitFor(() => expect(queryByText(checkboxLabel)).toBeVisible());
// });
