import * as enzyme from 'enzyme';
import * as React from 'react';
import * as rest from "../../rest/interface";
import { Login } from './Login';

describe("Login", () => {
    const wrapper = enzyme.shallow(<Login client={rest.EvergreenClient("admin", "e4f2c40463dcade5248d36434cb93bac", "http://localhost:8080/api")} />);

    it("matches snapshot", () => {
        expect(wrapper).toMatchSnapshot();
    })
})