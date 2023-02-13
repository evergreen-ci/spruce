import { useRef } from "react";
import { render, userEvent, screen, waitFor } from "test_utils";
import FirstTimeGuideCue, { FirstTimeGuideCueProps } from ".";

const Component: React.FC<Partial<FirstTimeGuideCueProps>> = ({
  title = "First Time Guide Cue",
  description = "This is a description",
  cookieName = "cookie-name",
  numberOfSteps = 1,
  currentStep = 1,
  buttonText = "Close",
  ...rest
}) => {
  const ref = useRef(null);
  return (
    <>
      <FirstTimeGuideCue
        data-cy="first-time-guide-cue"
        title={title}
        description={description}
        cookieName={cookieName}
        numberOfSteps={numberOfSteps}
        currentStep={currentStep}
        refEl={ref}
        buttonText={buttonText}
        {...rest}
      />
      <button type="button" ref={ref}>
        Click me
      </button>
    </>
  );
};
describe("firstTimeGuideCue", () => {
  afterEach(() => {
    document.cookie = "";
  });
  it("renders normally", () => {
    render(<Component />);
    expect(screen.getByDataCy("first-time-guide-cue")).toBeInTheDocument();
  });
  it("if the cookie is set, the guide cue is not open", () => {
    document.cookie = "cookie-name=true";
    render(<Component />);
    expect(screen.queryByDataCy("first-time-guide-cue")).toBeNull();
  });
  it("if the cookie is not set, the guide cue will be open by default", () => {
    document.cookie = "cookie-name=";
    render(<Component />);
    expect(screen.getByDataCy("first-time-guide-cue")).toBeInTheDocument();
  });
  it("if isOpen is true and the cookie is not set, the guide cue will be open by default", () => {
    document.cookie = "cookie-name=";
    render(<Component isOpen />);
    expect(screen.getByDataCy("first-time-guide-cue")).toBeInTheDocument();
  });
  it("if isOpen is false and the cookie is not set, the guide cue will not be open by default", () => {
    document.cookie = "cookie-name=";
    render(<Component isOpen={false} />);
    expect(screen.queryByDataCy("first-time-guide-cue")).toBeNull();
  });
  it("closing the guide cue sets a cookie", async () => {
    document.cookie = "";
    render(<Component />);
    expect(screen.getByDataCy("first-time-guide-cue")).toBeInTheDocument();
    const closeButton = screen.queryByText("Close");
    expect(closeButton).toBeInTheDocument();
    userEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByDataCy("first-time-guide-cue")).toBeNull();
    });
    expect(document.cookie).toBe("; cookie-name=true");
  });
});
