import * as evergreen from "evergreen.js";
import * as request from "request";
import * as mock from "./evergreen_mock"

export interface Evergreen {
  apiURL: string;
  uiURL: string;
  username?: string;
  key?: string;

  getDistros: (callback: request.RequestCallback) => void;
  getRecentTasks: (callback: request.RequestCallback, verbose?: boolean, lookbackMins?: number, status?: string) => void;
  getToken: (callback: request.RequestCallback, username?: string, password?: string) => void;
  getPatches: (callback: request.RequestCallback, username?: string, page?: number) => void;
  getAdminConfig: (callback: request.RequestCallback) => void;
  setAdminConfig: (callback: request.RequestCallback, settings: any) => void;
  getBanner: (callback: request.RequestCallback) => void;
}

export function EvergreenClient(apiURL: string, uiURL: string, username?: string, key?: string, isMock: boolean = false): Evergreen {
  if (isMock) {
    return new mock.client(apiURL, uiURL, username, key);
  }
  return new evergreen.client(apiURL, uiURL, username, key);
}