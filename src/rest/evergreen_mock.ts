import * as request from "request";

 export class client {
    public username: string;
    public key: string;
    public serverURL: string;

     constructor(username: string, key: string, serverURL: string) {
        this.username = username;
        this.key = key;
        this.serverURL = serverURL;
    }

     public getDistros(callback: request.RequestCallback) {
        callback(null, this.dummySuccessResp(), {});
    }

     public getRecentTasks(callback: request.RequestCallback, verbose?: boolean, lookbackMins?: number, status?: string)  {
        callback(null, this.dummySuccessResp(), {});
    }

    public getRecentPatches(callback: request.RequestCallback, verbose?: boolean, lookbackMins?: number)  {
        callback(null, this.dummySuccessResp(), {});
    }

    public getToken(callback: request.RequestCallback, username?: string, password?: string) {
        callback(null, this.dummySuccessResp(), {});
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
}

 class mockResponse {
    public statusCode: number;
    public statusMessage: string;
    public body: any;
}