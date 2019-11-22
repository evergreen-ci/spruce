import { AxiosPromise, AxiosResponse } from "axios";
import * as models from "evergreen.js/lib/models";
import * as MockBuild from "./mock_build";
import * as MockLog from "./mock_log";
import * as MockPatches from "./mock_patches";
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

  public getDistros(): AxiosPromise<any> {
    return this.wrapResponse(this.dummySuccessResp());
  }

  public getRecentTasks(
    verbose?: boolean,
    lookbackMins?: number,
    status?: string
  ): AxiosPromise<any> {
    return this.wrapResponse(this.dummySuccessResp());
  }

  public getToken(username?: string, password?: string): AxiosPromise<any> {
    return this.wrapResponse(this.dummySuccessResp());
  }

  public getPatches(username?: string): AxiosPromise<models.Patches> {
    return this.wrapResponse(MockPatches.getMockPatches());
  }

  public getLogs(
    taskId: string,
    type: string,
    executionNumber: number
  ): AxiosPromise<string> {
    return this.wrapResponse(MockLog.getMockLog());
  }

  public getBuild(id: string): AxiosPromise<models.Build> {
    return this.wrapResponse(MockBuild.getMockBuild() as models.Build);
  }

  public getTasksForBuild(taskId: string): AxiosPromise<models.APITask[]> {
    return this.wrapResponse(MockTasks.getMockTasks() as models.APITask[]);
  }

  public getTestsForTask(testId: string): AxiosPromise<models.APITest[]> {
    return this.wrapResponse(MockTests.getMockTests() as models.APITest[]);
  }

  public getAdminConfig(): AxiosPromise<models.AdminSettings> {
    return this.wrapResponse(this.dummySuccessResp() as models.AdminSettings);
  }

  public setAdminConfig(
    settings: models.AdminSettings
  ): AxiosPromise<models.AdminSettings> {
    return this.wrapResponse(this.dummySuccessResp() as models.AdminSettings);
  }

  public getBanner(): AxiosPromise<any> {
    return this.wrapResponse(this.dummySuccessResp());
  }

  private wrapResponse<T = object | string>(resp: T): Promise<AxiosResponse<T>> {
    return Promise.resolve({
      config: null,
      data: resp,
      headers: null,
      request: null,
      status: 200,
      statusText: "OK"
    });
  }

  private dummySuccessResp(): object {
    return {};
  }
}
