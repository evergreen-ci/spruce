import React from "react";
import { Tab, TaskURLParams } from "pages/types/task";
import { TestsTable } from "pages/task/TestsTable/TestsTable";
import { FilesTables } from "pages/task/FilesTables/FilesTables";
import { useParams } from "react-router-dom";

export const TaskPageBody: React.FC = () => {
  const { tab } = useParams<TaskURLParams>();
  switch (tab) {
    case Tab.Tests:
      return <TestsTable />;
    case Tab.Files:
      return <FilesTables />;
    default:
      return <></>;
  }
};
