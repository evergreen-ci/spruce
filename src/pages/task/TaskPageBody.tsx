import React from "react";
import { Tab } from "pages/types/task";
import { TestsTable } from "pages/task/TestsTable";
import { FilesTables } from "pages/task/FilesTables";

export const TaskPageBody: React.FC<{ tab: Tab }> = ({ tab }: { tab: Tab }) => {
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
