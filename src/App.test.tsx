import * as React from "react";
import * as ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import App from "App";
import wait from "waait";

it("renders without crashing", async () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  await act(async () => {
    await wait(0);
  });
  ReactDOM.unmountComponentAtNode(div);
});
