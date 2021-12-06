import React from "react";
import { render, act } from "test_utils/test-utils";
import App from "./App";

describe("app", () => {
  it("renders without crashing", async () => {
    expect.hasAssertions();
    const { getByText } = render(<App />);
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(getByText("LOADING...")).toBeInTheDocument();
  });
});
