import { render, screen } from "test_utils";
import VisibilityContainer from ".";

describe("visibilityContainer", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should not render children when not visible in viewport", () => {
    const mockIntersectionObserver = jest.fn((callback) => {
      callback([
        {
          isIntersecting: false,
        },
      ]);
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
      };
    });

    // @ts-expect-error
    window.IntersectionObserver = mockIntersectionObserver;
    render(
      <VisibilityContainer>
        <div>Visible content</div>
      </VisibilityContainer>,
    );

    expect(screen.queryByText("Visible content")).toBeNull();
  });

  it("should render children when visible in viewport", () => {
    const mockIntersectionObserver = jest.fn((callback) => {
      callback([
        {
          isIntersecting: true,
        },
      ]);
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
      };
    });

    // @ts-expect-error
    window.IntersectionObserver = mockIntersectionObserver;
    render(
      <VisibilityContainer>
        <div>Visible content</div>
      </VisibilityContainer>,
    );
    expect(screen.getByText("Visible content")).toBeInTheDocument();
  });
});
