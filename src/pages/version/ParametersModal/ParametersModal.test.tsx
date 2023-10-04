import { render, screen, userEvent } from "test_utils";
import { ParametersModal } from ".";

const parameters = [
  { key: "Key 1", value: "Value 1" },
  { key: "Key 2", value: "Value 2" },
];

describe("parameters modal", () => {
  it("modal is closed by default", () => {
    render(<ParametersModal parameters={parameters} />);
    expect(screen.queryByDataCy("parameters-modal")).toBeNull();
  });

  it("link does not render if there are no parameters", () => {
    render(<ParametersModal parameters={[]} />);
    expect(screen.queryByDataCy("parameters-link")).toBeNull();
  });

  it("can click the link to open the modal and view parameters", async () => {
    const user = userEvent.setup();
    render(<ParametersModal parameters={parameters} />);
    await user.click(screen.getByDataCy("parameters-link"));
    await screen.findByDataCy("parameters-modal");
    expect(screen.getByText(parameters[0].key)).toBeInTheDocument();
    expect(screen.getByText(parameters[0].value)).toBeInTheDocument();
    expect(screen.getByText(parameters[1].key)).toBeInTheDocument();
    expect(screen.getByText(parameters[1].value)).toBeInTheDocument();
  });
});
