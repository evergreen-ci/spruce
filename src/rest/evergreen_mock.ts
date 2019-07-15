import * as request from "request";
import * as MockBuild from "./mock_build"
import * as MockData from "./mock_data";
import * as MockLog from "./mock_log";
import * as MockTasks from "./mock_tasks";
import * as MockTests from "./mock_tests";

export class client {
  public username: string;
  public key: string;
  public apiURL: string;
  public uiURL: string;

  constructor(apiURL: string, uiURL: string, username?: string, key?: string) {
    this.username = username;
    this.key = key;
    this.apiURL = apiURL;
    this.uiURL = uiURL;
  }

  public getDistros(callback: request.RequestCallback) {
    callback(null, this.dummySuccessResp(), {});
  }

  public getRecentTasks(callback: request.RequestCallback, verbose?: boolean, lookbackMins?: number, status?: string) {
    callback(null, this.dummySuccessResp(), {});
  }

  public getToken(callback: request.RequestCallback, username?: string, password?: string) {
    callback(null, this.dummySuccessResp(), {});
  }

  public getPatches(callback: request.RequestCallback, username?: string) {
    callback(null, this.dummyPatchesResp(), {});
  }

  public getLogs(callback: request.RequestCallback, id?: string, type?: string, executionNumber?: number) {
    callback(null, this.dummyLogResp(), {});
  }

  public getBuild(callback: request.RequestCallback, id: string) {
    callback(null, this.dummyBuildResp(), {});
  }

  public getTasks(callback: request.RequestCallback, id: string) {
    callback(null, this.dummyTasksResp(), {});
  }

  public getTests(callback: request.RequestCallback, id: string) {
    callback(null, this.dummyTestsResp(), {});
  }

  public getAdminConfig(callback: request.RequestCallback) {
    callback(null, this.dummySuccessResp(), {});
  }

  public setAdminConfig(callback: request.RequestCallback, settings: any) {
    callback(null, this.dummySuccessResp(), {});
  }

  public getBanner(callback: request.RequestCallback) {
    callback(null, this.dummySuccessResp(), {});
  }

  private dummySuccessResp(): request.Response {
    const mockResp: mockResponse = {
      statusCode: 200,
      statusMessage: "",
      body: {},
    };

    return mockResp as request.Response;
  }

  private dummyPatchesResp(): request.Response {
    const bodyAsString = JSON.stringify(MockData.getMockData());
    const mockResp: mockResponse = {
      statusCode: 200,
      statusMessage: "",
      body: bodyAsString,
    };
    return mockResp as request.Response;
  }

  private dummyLogResp(): request.Response {
    const bodyAsString = MockLog.getMockLog();
    const mockResp: mockResponse = {
      statusCode: 200,
      statusMessage: "",
      body: bodyAsString,
    };
    return mockResp as request.Response;
  }

  private dummyBuildResp(): request.Response {
    const bodyAsString = MockBuild.getMockBuild();
    const mockResp: mockResponse = {
      statusCode: 200,
      statusMessage: "",
      body: bodyAsString,
    };
    return mockResp as request.Response;
  }

  private dummyTasksResp(): request.Response {
    const bodyAsString = MockTasks.getMockTasks();
    const mockResp: mockResponse = {
      statusCode: 200,
      statusMessage: "",
      body: bodyAsString,
    };
    return mockResp as request.Response;
  }

  private dummyTestsResp(): request.Response {
    const bodyAsString = MockTests.getMockTests();
    const mockResp: mockResponse = {
      statusCode: 200,
      statusMessage: "",
      body: bodyAsString,
    };
    return mockResp as request.Response;
  }
}

class mockResponse {
  public statusCode: number;
  public statusMessage: string;
  public body: any;
}