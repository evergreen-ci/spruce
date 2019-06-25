import * as enzyme from "enzyme";
import { DropzoneArea } from 'material-ui-dropzone';
import * as React from "react";
import { ClientConfig } from '../../models/client_config';
import { ConfigDrop } from "./ConfigDrop";

describe("ConfigDrop", () => {
    const verifyConfig = (configObj: ClientConfig) => {
      if (configObj !== undefined) {
        expect(configObj.user).toBe("domino.weir");
        expect(configObj.api_key).toBe("e664f2097f08fbe40e3c16e77d0b5832");
        expect(configObj.api_url).toBe("https://evergreen.mongodb.com/api");
        expect(configObj.ui_url).toBe("https://evergreen.mongodb.com");
      }
     }
    const wrapper = enzyme.mount(<ConfigDrop updateClientConfig={verifyConfig}/>);

    it("matches snapshot", () => { 
      // note: using enzyme.mount here (instead of enzyme.shallow) causes the test suite to hang, so this test needs its own shallow wrapper
      const shallowWrapper = enzyme.shallow(<ConfigDrop updateClientConfig={verifyConfig}/>);
      expect(shallowWrapper).toMatchSnapshot();
    })

    it("check config state object is not updated with an empty file", () => {
      // check that the config object in state is null initially
      expect(wrapper.state("newConfig")).toBeNull();
      // instantiate a new file object
      const emptyFile = new File (["{}"], "config.json");
      // find the dropzone and simulate dropping our new file in to that drop zone
      const drop = wrapper.find(DropzoneArea);
      drop.simulate("change", {target: {files: [emptyFile]}});
      // we expect this to be null because an invalid config file should not cause the state to be updated
      expect(wrapper.state("newConfig")).toBeNull();
    })

    it("check config state object is updated with a valid file", () => {
      // check that the config object in state is null initially
      expect(wrapper.state("newConfig")).toBeNull();
      // instantiate a new file object using a valid piece of json containing all required keys
      const validJSON = {
        "user": "domino.weir",
        "api_key": "e664f2097f08fbe40e3c16e77d0b5832",
        "api_url": "https://evergreen.mongodb.com/api", 
        "ui_url": "https://evergreen.mongodb.com"
      };
      const jsonString = JSON.stringify(validJSON);
      const validFile = new File ([jsonString], "config.json");
      // find the dropzone and simulate dropping our new file in to that drop zone
      const drop = wrapper.find(DropzoneArea);
      // we will verify that the config object contains what we expect in the verifyConfig function passed in to the wrapper
      drop.simulate("change", {target: {files: [validFile]}});
    })
})