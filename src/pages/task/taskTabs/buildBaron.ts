import { loadable } from "components/SpruceLoader";

export const BuildBaron = loadable(
  () => import("./buildBaronAndAnnotations/BuildBaron")
);
