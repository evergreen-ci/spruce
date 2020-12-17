import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import fetch from "unfetch";
import App from "App";
// @ts-ignore
window.fetch = fetch;

it("renders without crashing", async () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  act(() => {
    ReactDOM.unmountComponentAtNode(div);
  });
});
