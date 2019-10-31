import * as enzyme from "enzyme";
import * as React from "react";
import { BannerCard } from "./Banner";

describe("BannerCard", () => {
  const onChange = jest.fn((value: string) => expect(value).toBe("new banner"));
  const wrapper = enzyme.shallow(
    <BannerCard banner="hello world" onBannerTextChange={onChange} />
  );

  it("renders", () => {
    expect(wrapper.html()).toContain("hello world");
    expect(wrapper.html()).toContain("Banner Message");
  });

  it("typing in field calls onChange", () => {
    wrapper
      .find("#bannerText")
      .simulate("change", { currentTarget: { value: "new banner" } });
    expect(onChange).toHaveBeenCalled();
  });
});
