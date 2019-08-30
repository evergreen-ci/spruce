import * as enzyme from "enzyme";
import { DropzoneArea } from 'material-ui-dropzone';
import * as React from "react";
import { ClientConfig } from '../../models/client_config';
import { ConfigDrop } from "./ConfigDrop";

describe("ConfigDrop", () => {

  const verifyValidConfig = jest.fn((configObj: ClientConfig) => {
    expect(configObj).not.toBe(undefined);
    if (configObj !== undefined) {
      expect(configObj.user).toBe("some.user");
      expect(configObj.api_key).toBe("aczq3eG0gAgEV9uGZN5gCos1utnZPXIg");
      expect(configObj.api_url).toBe("https://evergreen.mongodb.com/api");
      expect(configObj.ui_url).toBe("https://evergreen.mongodb.com");
    }
    expect(validWrapper.state("snackbarOpen")).toBe(true);
    expect(validWrapper.state("snackbarMessage")).toBe("Config file saved.");
  });

  const onInvalidLoadFinished = jest.fn(() => {
    expect(invalidWrapper.state("newConfig")).toBeNull();
    expect(invalidWrapper.state("snackbarOpen")).toBe(true);
    expect(invalidWrapper.state("snackbarMessage")).toBe("Config file does not contain all required properties.");
  });
  
  const onValidLoadFinished = jest.fn(() => {
    expect(verifyValidConfig).toHaveBeenCalled();
    expect(validWrapper.state("snackbarOpen")).toBe(false);
    expect(validWrapper.state("snackbarMessage")).toBe("");
  });

  const validWrapper = enzyme.shallow(<ConfigDrop updateClientConfig={verifyValidConfig} onLoadFinished={onValidLoadFinished} />);
  const invalidWrapper = enzyme.shallow(<ConfigDrop updateClientConfig={jest.fn()} onLoadFinished={onInvalidLoadFinished} />);

  it("check config state object is not updated with an empty file", () => {
    expect(invalidWrapper.state("newConfig")).toBeNull();
    const emptyFile = new File(["{}"], "config.json");
    const drop = invalidWrapper.find(DropzoneArea);
    drop.prop("onChange")([emptyFile]);
  })

  it("check config state object is not updated with an invalid file", () => {
    expect(invalidWrapper.state("newConfig")).toBeNull();
    const invalidJSON = {
      "user": "some.user",
      "api_url": "https://evergreen.mongodb.com/api",
    };
    const invalidFile = new File([JSON.stringify(invalidJSON)], "config.json");
    const drop = invalidWrapper.find(DropzoneArea);
    drop.prop("onChange")([invalidFile]);
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
    drop.prop("onChange")([validFile]);
  })
})