import { loadable } from "components/SpruceLoader";
import useBuildBaronVariables from "./useBuildBaronVariables";

export const BuildBaron = loadable(() => import("./BuildBaron"));

export { useBuildBaronVariables };
