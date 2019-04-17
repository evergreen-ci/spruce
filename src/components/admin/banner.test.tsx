import * as React from 'react';
import * as enzyme from 'enzyme';
import { BannerCard } from './banner';

test("BannerCard renders", () => {
    const onChange = (s:string) => console.log("onChange called");
    const wrapper = enzyme.render(<BannerCard banner="hello world" onBannerTextChange={onChange} />);
    expect(wrapper.html()).toContain("hello world");
    expect(wrapper.html()).toContain("Banner Message");
})