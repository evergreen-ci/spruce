import { loadable } from "components/SpruceLoader";

export const ProjectSettings = loadable(
  () => import("./projectSettings/index"),
);
