import CloseIcon from '@material-ui/icons/Close';
import * as enzyme from "enzyme";
import * as React from "react";
import Banner from './Banner'

describe("Banner", () => {

  const wrapper = enzyme.mount(<Banner message={""} onFinishStateUpdate={null} storageKey={"shouldHideBanner"}/>);

  const checkState = jest.fn(() => {
    expect(wrapper.state("bannerIsHidden")).toBe(true);
    expect(localStorage.getItem("shouldHideBanner")).toBeDefined();
    expect(localStorage.getItem("shouldHideBanner")).toBe("true");
  });

  it("check that clicking close hides banner", () => {
    expect(wrapper).toHaveLength(1);
    wrapper.setProps({ onFinishStateUpdate: checkState });
    wrapper.setState({ bannerIsHidden: false });
    expect(localStorage.getItem("shouldHideBanner")).toBe(null);
    expect(wrapper.state("bannerIsHidden")).toBe(false);
    const closeButton = wrapper.find(CloseIcon);
    expect(closeButton).toHaveLength(1);
    closeButton.prop("onClick")({} as React.MouseEvent<SVGSVGElement, MouseEvent>);
  });

  it("check that local storage persists on refresh", () => {
    expect(wrapper).toHaveLength(1);
    wrapper.update();
    expect(wrapper.state("bannerIsHidden")).toBe(true);
    expect(localStorage.getItem("shouldHideBanner")).toBeDefined();
    expect(localStorage.getItem("shouldHideBanner")).toBe("true");
  })
})