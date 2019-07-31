import { plainToClass } from "class-transformer";

export function ConvertToClientConfig(raw: string): ClientConfig {
  return plainToClass(ClientConfig, JSON.parse(raw) as object);
}

/* tslint:disable:variable-name */
export class ClientConfig {
  public api_url: string;
  public ui_url: string;

  public user?: string;
  public api_key?: string;
}

export function IsValidConfig(toCheck: object): boolean {
  const config = toCheck as ClientConfig;
  return config.api_url !== undefined && config.ui_url !== undefined;
}