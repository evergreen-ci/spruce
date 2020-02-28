import React from "react";
import { Tab, TaskURLParams } from "pages/types/task";
import { TestsTable } from "pages/task/TestsTable";
import { FilesTables } from "pages/task/FilesTables";
import { useParams } from "react-router-dom";

export const TaskPageBody: React.FC = () => {
  const { tab } = useParams<TaskURLParams>();
  let BodyComp = <></>;
  switch (tab) {
    case Tab.Tests:
      BodyComp = <TestsTable />;
      break;
    case Tab.Files:
      BodyComp = <FilesTables />;
      break;
  }
  return BodyComp;
};
