import * as evergreen from "evergreen.js";
import * as request from "request";
import * as mock from "./evergreen_mock"

<<<<<<< HEAD
export interface Evergreen {
  username: string;
  key: string;
  apiURL: string;
  uiURL: string;

  getDistros: (callback: request.RequestCallback) => void;
  getRecentTasks: (callback: request.RequestCallback, verbose?: boolean, lookbackMins?: number, status?: string) => void;
  getToken: (callback: request.RequestCallback, username?: string, password?: string) => void;
  getPatches: (callback: request.RequestCallback, username?: string) => void;
  getAdminConfig: (callback: request.RequestCallback) => void;
  setAdminConfig: (callback: request.RequestCallback, settings: any) => void;
  getBanner: (callback: request.RequestCallback) => void;
}

export function EvergreenClient(username: string, key: string, apiURL: string, uiURL: string, isMock: boolean = false): Evergreen {
  if (isMock) {
    return new mock.client(username, key, apiURL, uiURL);
  }
  return new evergreen.client(username, key, apiURL, uiURL);
=======
 export interface Evergreen {
    username: string;
    key: string;
    apiURL: string;
    uiURL: string;

    getDistros: (callback: request.RequestCallback) => void;
    getRecentTasks: (callback: request.RequestCallback, verbose?: boolean, lookbackMins?: number, status?: string) => void;
    getToken: (callback: request.RequestCallback, username?: string, password?: string) => void;
    getAdminConfig: (callback: request.RequestCallback) => void;
    setAdminConfig: (callback: request.RequestCallback, settings: any) => void;
    getBanner: (callback: request.RequestCallback) => void;
    getPatches: (callback: request.RequestCallback, username?: string) => void;
}

 export function EvergreenClient(username: string, key: string, apiURL: string, uiURL: string, isMock: boolean = false): Evergreen {
    if (isMock) {
        return new mock.client(username, key, apiURL, uiURL);
    }
    return new evergreen.client(username, key, apiURL, uiURL);
>>>>>>> master
}