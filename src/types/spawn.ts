import { MyHostsQuery } from "gql/generated/types";

export type MyHost = MyHostsQuery["myHosts"][0];
