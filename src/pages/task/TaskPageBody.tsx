import React from "react";
import { Tab, TaskURLParams } from "pages/types/task";
import { TestsTable } from "pages/task/TestsTable/TestsTable";
import { FilesTables } from "pages/task/FilesTables/FilesTables";
import { useParams } from "react-router-dom";

export const TaskPageBody: React.FC = () => {
  const { tab } = useParams<TaskURLParams>();
  let BodyComp: React.ReactElement;
  switch (tab) {
    case Tab.Tests:
      BodyComp = <TestsTable />;
      break;
    case Tab.Files:
      BodyComp = <FilesTables />;
      break;
    default:
      BodyComp = <></>;
  }
  return BodyComp;
};
