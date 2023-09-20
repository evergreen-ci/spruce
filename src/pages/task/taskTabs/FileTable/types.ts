import { TaskFilesQuery } from "gql/generated/types";
import { Unpacked } from "types/utils";

export type GroupedFiles = Unpacked<
  TaskFilesQuery["task"]["files"]["groupedFiles"]
>;
