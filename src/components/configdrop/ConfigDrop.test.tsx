import * as enzyme from "enzyme";
import * as React from "react";
import { ClientConfig } from '../../models/client_config';
import { ConfigDrop } from "./ConfigDrop";

describe("ConfigDrop", () => {
    const verifyConfig = (configObj: ClientConfig) => {
      console.log("lol idk");
    }
    // const wrapper = enzyme.mount(<ConfigDrop updateClientConfig={verifyConfig}/>);

    it("matches snapshot", () => { 
      // note: using enzyme.mount here (instead of enzyme.shallow) causes the test suite to hang, so this test needs its own shallow wrapper
      const shallowWrapper = enzyme.shallow(<ConfigDrop updateClientConfig={verifyConfig}/>);
      expect(shallowWrapper).toMatchSnapshot();
    })
})