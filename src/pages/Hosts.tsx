import { loadable } from "components/SpruceLoader";

export const Hosts = loadable(
  () => import(/* webpackChunkName: 'hosts' */ "./hosts/index"),
);
