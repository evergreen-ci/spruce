import { AxiosPromise } from "axios";
import * as evergreen from "evergreen.js";
import * as models from "evergreen.js/lib/models";
import * as mock from "./evergreen_mock";
import { isDevelopment, getApiUrl, getUiUrl, isTest } from "../utils";

export interface Evergreen {
  apiURL: string;
  uiURL: string;
  username?: string;
  key?: string;

  getDistros: () => AxiosPromise<any>;
  getRecentTasks: (
    verbose?: boolean,
    lookbackMins?: number,
    status?: string
  ) => AxiosPromise<any>;
  getToken: (username?: string, password?: string) => AxiosPromise<any>;
  getPatches: (
    username?: string,
    page?: number
  ) => AxiosPromise<models.Patches>;
  getProjectPatches: (
    projectName?: string,
    page?: number
  ) => AxiosPromise<models.Patches>;
  getLogs: (
    taskId: string,
    type: string,
    executionNumber: number
  ) => AxiosPromise<string>;
  getBuild: (id: string) => AxiosPromise<models.Build>;
  getTasksForBuild: (buildId: string) => AxiosPromise<models.APITask[]>;
  getTestsForTask: (taskId: string) => AxiosPromise<models.APITest[]>;
  getAdminConfig: () => AxiosPromise<models.AdminSettings>;
  setAdminConfig: (
    settings: models.AdminSettings
  ) => AxiosPromise<models.AdminSettings>;
  getBanner: () => AxiosPromise<any>;
}

interface EvergreenClientProps {
  username?: string;
  key?: string;
}

export function EvergreenClient({
  username = "",
  key = ""
}: EvergreenClientProps = {}): Evergreen {
  const apiURL = getApiUrl();
  const uiURL = getUiUrl();

  if (isDevelopment() || isTest()) {
    return new mock.client(apiURL, uiURL, username, key);
  }
  return new evergreen.client(apiURL, uiURL, username, key);
}
