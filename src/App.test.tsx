import App from "App";
import { render, screen, waitFor } from "test_utils";

describe("app", () => {
  it("renders without crashing", async () => {
    expect.hasAssertions();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("LOADING...")).toBeInTheDocument();
    });
  });
});
