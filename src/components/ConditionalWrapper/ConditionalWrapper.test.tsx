import { render, screen } from "test_utils";
import { ConditionalWrapper } from "./index";

const Wrapper1 = ({ children }) => <div data-cy="wrapper-1">{children}</div>;
const Wrapper2 = ({ children }) => <div data-cy="wrapper-2">{children}</div>;

describe("conditionalWrapper", () => {
  it("should render the element surrounded by a wrapper when the conditional is true", () => {
    render(
      <ConditionalWrapper
        condition
        wrapper={(children) => <Wrapper1>{children}</Wrapper1>}
      >
        <span>Some Element</span>
      </ConditionalWrapper>,
    );
    expect(screen.queryByDataCy("wrapper-1")).toBeVisible();
    expect(screen.queryByDataCy("wrapper-1")).toHaveTextContent("Some Element");
  });

  it("should render the element surrounded by no wrapper when the conditional is false and no secondary wrapper is supplied", () => {
    render(
      <ConditionalWrapper
        condition={false}
        wrapper={(children) => <Wrapper1>{children}</Wrapper1>}
      >
        <span>Some Element</span>
      </ConditionalWrapper>,
    );
    expect(screen.queryByDataCy("wrapper-1")).toBeNull();
    expect(screen.queryByText("Some Element")).toBeVisible();
  });

  it("should render the element surrounded by the secondary wrapper when the conditional is false and a secondary wrapper is supplied", () => {
    render(
      <ConditionalWrapper
        condition={false}
        wrapper={(children) => <Wrapper1>{children}</Wrapper1>}
        altWrapper={(children) => <Wrapper2>{children}</Wrapper2>}
      >
        <span>Some Element</span>
      </ConditionalWrapper>,
    );
    expect(screen.queryByDataCy("wrapper-1")).toBeNull();
    expect(screen.queryByDataCy("wrapper-2")).toBeVisible();
    expect(screen.queryByText("Some Element")).toBeVisible();
  });
});
