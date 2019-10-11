import * as enzyme from "enzyme";
import * as React from "react";
import * as rest from "../../rest/interface";
import { Login } from "./Login";

describe("Login", () => {
    const wrapper = enzyme.mount(<Login client={rest.EvergreenClient("", "", "", "", true)} updateUsername={jest.fn()}/>);

    it("clicking login button opens login modal", () => {
      // check that the modal exists, and that it is not currently open
      expect(wrapper.exists("#login-modal")).toBe(true);
      expect(wrapper.state("open")).toBe(false);
      // find the login button and click it
      const loginButton = wrapper.find("#login-button").hostNodes();
      loginButton.simulate("click");
      // check that the modal is now open
      expect(wrapper.state("open")).toBe(true);
    });
    
    it("clicking cancel button closes login modal", () => {
      // find the login button and click it
      const loginButton = wrapper.find("#login-button").hostNodes();
      loginButton.simulate("click");
      // check that the state was set correctly
      expect(wrapper.state("open")).toBe(true);
      // find the cancel button and click it
      const cancelButton = wrapper.find("#cancel-button").hostNodes();
      cancelButton.simulate("click");
      // check that the state was updated correctly
      expect(wrapper.state("open")).toBe(false);
    });
    
    it("clicking submit button closes login modal and saves token locally", (done) => {
      // find the login button and click it
      const loginButton = wrapper.find("#login-button").hostNodes();
      loginButton.simulate("click");
      // check that the state was set correctly
      expect(wrapper.state("open")).toBe(true);
      // fill in the username and password fields
      wrapper.setState({
        username: "domino.weir", 
        password: "password",
      });
      // find the submit button and click it
      const submitButton = wrapper.find("#submit-button").hostNodes();
      submitButton.simulate("click");
      // check that the state reflects the submit button click
      setImmediate(() => {
        expect(wrapper.state("submitted")).toBe(true);
        // check that the modal is now closed
        expect(wrapper.state("open")).toBe(false);
        // TODO: check that cookie was included in the response
        // should be mci-token, located in response.request.response.headers["set-cookie"]
        done();
      })
    });
})