import { filterGroupedFiles } from "./utils";

describe("filterGroupedFiles", () => {
  it("should return an empty array if groupedFiles is empty", () => {
    const groupedFiles = [];
    const result = filterGroupedFiles(groupedFiles, "");
    expect(result).toStrictEqual([]);
  });
  it("should return the original array if search term is empty", () => {
    const groupedFiles = [
      {
        taskName: "some_task_name",
        files: [
          {
            name: "some_file_name",
            link: "some_url",
          },
        ],
      },
    ];
    const result = filterGroupedFiles(groupedFiles, "");
    expect(result).toStrictEqual(groupedFiles);
  });
  it("should filter the array if search term is not empty", () => {
    const groupedFiles = [
      {
        taskName: "some_task_name",
        files: [
          {
            name: "some_file_name",
            link: "some_url",
          },
          {
            name: "some_other_file_name",
            link: "some_url",
          },
        ],
      },
    ];
    const search = "some_file_name";
    const result = filterGroupedFiles(groupedFiles, search);
    expect(result).toStrictEqual([
      {
        taskName: "some_task_name",
        files: [
          {
            name: "some_file_name",
            link: "some_url",
          },
        ],
      },
    ]);
  });
  it("should filter across multiple groups", () => {
    const groupedFiles = [
      {
        taskName: "some_task_name",
        files: [
          {
            name: "some_file_name",
            link: "some_url",
          },
          {
            name: "some_other_file_name",
            link: "some_url",
          },
        ],
      },
      {
        taskName: "some_other_task_name",
        files: [
          {
            name: "some_file_name",
            link: "some_url",
          },
          {
            name: "some_other_file_name",
            link: "some_url",
          },
        ],
      },
    ];
    const search = "some_file_name";
    const result = filterGroupedFiles(groupedFiles, search);
    expect(result).toStrictEqual([
      {
        taskName: "some_task_name",
        files: [
          {
            name: "some_file_name",
            link: "some_url",
          },
        ],
      },
      {
        taskName: "some_other_task_name",
        files: [
          {
            name: "some_file_name",
            link: "some_url",
          },
        ],
      },
    ]);
  });
  it("should not return groups that have no matching files", () => {
    const groupedFiles = [
      {
        taskName: "some_task_name",
        files: [
          {
            name: "some_matching_file_name",
            link: "some_url",
          },
          {
            name: "some_other_file_name",
            link: "some_url",
          },
        ],
      },
      {
        taskName: "some_other_task_name",
        files: [
          {
            name: "some_file_name",
            link: "some_url",
          },
          {
            name: "some_other_file_name",
            link: "some_url",
          },
        ],
      },
    ];
    const search = "some_matching_file_name";
    const result = filterGroupedFiles(groupedFiles, search);
    expect(result).toStrictEqual([
      {
        taskName: "some_task_name",
        files: [
          {
            name: "some_matching_file_name",
            link: "some_url",
          },
        ],
      },
    ]);
  });
});
