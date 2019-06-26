import { Button } from '@material-ui/core';
import * as enzyme from "enzyme";
import { DropzoneArea } from 'material-ui-dropzone';
import * as React from "react";
import { ClientConfig } from '../../models/client_config';
import { ConfigDrop } from "./ConfigDrop";

describe("ConfigDrop", () => {

  const verifyValidConfig = jest.fn((configObj: ClientConfig) => {
    if (configObj !== undefined) {
      expect(configObj.user).toBe("some.user");
      expect(configObj.api_key).toBe("aczq3eG0gAgEV9uGZN5gCos1utnZPXIg");
      expect(configObj.api_url).toBe("https://evergreen.mongodb.com/api");
      expect(configObj.ui_url).toBe("https://evergreen.mongodb.com");
    }
  });

  const validWrapper = enzyme.mount(<ConfigDrop updateClientConfig={verifyValidConfig} />);
  const invalidWrapper = enzyme.mount(<ConfigDrop updateClientConfig={jest.fn()} />);

  it("matches snapshot", () => {
    // note: using enzyme.mount (instead of enzyme.shallow) causes the test suite to hang, so this test needs its own shallow wrapper
    const shallowWrapper = enzyme.shallow(<ConfigDrop updateClientConfig={jest.fn()} />);
    expect(shallowWrapper).toMatchSnapshot();
  })

  it("check config state object is not updated with an empty file", async () => {
    expect(invalidWrapper.state("newConfig")).toBeNull();
    const emptyFile = new File(["{}"], "config.json");
    const drop = invalidWrapper.find(DropzoneArea);
    // const save = invalidWrapper.find(Button);
    drop.simulate("change", { target: { files: [emptyFile] } });
    // save.simulate("click");
    expect(invalidWrapper.state("newConfig")).toBeNull();
    expect(invalidWrapper.state("snackbarOpen")).toBe(true);
    expect(invalidWrapper.state("snackbarMessage")).toBe("Config file does not contain all required properties.");
  })

  it("check config state object is not updated with an invalid file", () => {
    expect(invalidWrapper.state("newConfig")).toBeNull();
    const invalidJSON = {
      "user": "some.user",
      "api_url": "https://evergreen.mongodb.com/api",
    };
    const invalidFile = new File([JSON.stringify(invalidJSON)], "config.json");
    const drop = invalidWrapper.find(DropzoneArea);
    //const save = invalidWrapper.find(Button);
    drop.simulate("change", { target: { files: [invalidFile] } });
    //save.simulate("click");
    expect(invalidWrapper.state("newConfig")).toBeNull();
    expect(invalidWrapper.state("snackbarOpen")).toBe(true);
    expect(invalidWrapper.state("snackbarMessage")).toBe("Config file does not contain all required properties.");
  })

  it("check config state object is updated with a valid file", () => {
    expect(validWrapper.state("newConfig")).toBeNull();
    const validJSON = {
      "user": "some.user",
      "api_key": "aczq3eG0gAgEV9uGZN5gCos1utnZPXIg",
      "api_url": "https://evergreen.mongodb.com/api",
      "ui_url": "https://evergreen.mongodb.com"
    };
    const validFile = new File([JSON.stringify(validJSON)], "config.json");
    const drop = validWrapper.find(DropzoneArea);
    const save = validWrapper.find(Button);
    drop.simulate("change", { target: { files: [validFile] } });
    save.simulate("click");
    expect(verifyValidConfig).toHaveBeenCalled();
    expect(validWrapper.state("snackbarOpen")).toBe(true);
    expect(validWrapper.state("snackbarMessage")).toBe("Config file saved.");
  })
})