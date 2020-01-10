import { Link } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import * as enzyme from "enzyme";
import * as React from "react";
import * as rest from "../../rest/interface";
import Banner from "./Banner";

describe("Banner", () => {
  const linkWrapper = enzyme.mount(
    <Banner
      client={rest.EvergreenClient()}
      message={""}
      showOptOut={true}
      onFinishStateUpdate={null}
      storageKey={"shouldHideBanner"}
    />
  );
  const noLinkWrapper = enzyme.mount(
    <Banner
      client={rest.EvergreenClient()}
      message={""}
      showOptOut={false}
      onFinishStateUpdate={null}
      storageKey={"shouldHideBanner"}
    />
  );

  const checkState = jest.fn(() => {
    expect(linkWrapper.state("bannerIsHidden")).toBe(true);
    expect(localStorage.getItem("shouldHideBanner")).toBeDefined();
    expect(localStorage.getItem("shouldHideBanner")).toBe("true");
  });

  it("check that clicking close hides banner", () => {
    expect(linkWrapper).toHaveLength(1);
    linkWrapper.setProps({ onFinishStateUpdate: checkState });
    linkWrapper.setState({ bannerIsHidden: false });
    expect(localStorage.getItem("shouldHideBanner")).toBe(null);
    expect(linkWrapper.state("bannerIsHidden")).toBe(false);
    const closeButton = linkWrapper.find(CloseIcon);
    expect(closeButton).toHaveLength(1);
    closeButton.prop("onClick")(
      {} as React.MouseEvent<SVGSVGElement, MouseEvent>
    );
  });

  it("check that local storage persists on refresh", () => {
    expect(linkWrapper).toHaveLength(1);
    linkWrapper.update();
    expect(linkWrapper.state("bannerIsHidden")).toBe(true);
    expect(localStorage.getItem("shouldHideBanner")).toBeDefined();
    expect(localStorage.getItem("shouldHideBanner")).toBe("true");
  });

  it("check that link does not render if showOptOut is false", () => {
    expect(noLinkWrapper).toHaveLength(1);
    expect(noLinkWrapper.prop("showOptOut")).toBe(false);
    const link = noLinkWrapper.find(Link);
    expect(link).toHaveLength(0);
  });
});
