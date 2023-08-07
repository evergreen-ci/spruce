import { isDryRun } from "../../environment";
import * as realTagUtils from "./tag-utils";
import * as mockTagUtils from "./mock-tag-utils";

const tagUtils = isDryRun ? mockTagUtils : realTagUtils;

export { tagUtils };
