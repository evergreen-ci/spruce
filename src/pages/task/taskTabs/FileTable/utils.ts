import type { GroupedFiles } from "./types";

/**
 * `filterGroupedFiles` filters the groupedFiles array from the TaskFilesQuery
 * @param groupedFiles - the groupedFiles array from the TaskFilesQuery
 * @param search - the search string
 * @returns - a new array of groupedFiles that contain the search string
 */
const filterGroupedFiles = (groupedFiles: GroupedFiles[], search: string) =>
  groupedFiles.reduce((acc, groupedFile) => {
    const filteredFiles = groupedFile?.files?.filter((file) =>
      file.name.toLowerCase().includes(search.toLowerCase()),
    );
    if (filteredFiles?.length) {
      acc.push({
        ...groupedFile,
        files: filteredFiles,
      });
    }
    return acc;
  }, [] as GroupedFiles[]);

export { filterGroupedFiles };
