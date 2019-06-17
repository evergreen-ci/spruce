import * as enzyme from 'enzyme';
import * as React from 'react';
import * as rest from "../../rest/interface";
import { Login } from './Login';

describe("Login", () => {
    const wrapper = enzyme.shallow(<Login client={rest.EvergreenClient("", "", "")} />);

    it("matches snapshot", () => {
        expect(wrapper).toMatchSnapshot();
    })
})