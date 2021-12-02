import React from "react";
import App from "App";
import { render, act } from "test_utils/test-utils";

describe("app", () => {
  it("renders without crashing", async () => {
    expect.hasAssertions();
    const { getByText } = render(<App />);
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(getByText("LOADING...")).toBeInTheDocument();
  });
});
