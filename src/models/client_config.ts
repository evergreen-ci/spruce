import { plainToClass } from "class-transformer";

export function ConvertToClientConfig(raw: string): ClientConfig {
  return plainToClass(ClientConfig, JSON.parse(raw) as object);
}

/* tslint:disable:variable-name */
export class ClientConfig {
  public user?: string;
  public api_key?: string;
  public api_url?: string;
  public ui_url?: string;
}