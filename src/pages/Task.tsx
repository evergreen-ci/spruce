import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useParams, useHistory } from "react-router-dom";
import { TestsTable } from "pages/task/TestsTable";

enum Tab {
  Logs = "logs",
  Tests = "tests",
  Files = "files",
  BuildBaron = "build-baron"
}
const DEFAULT_TAB = Tab.Logs;

export const Task: React.FC<RouteComponentProps> = () => {
  const { tab, taskID } = useParams<{ tab?: Tab; taskID: string }>();
  const history = useHistory();
  useEffect(() => {
    if (!tab) {
      history.replace(`/task/${taskID}/${DEFAULT_TAB}`);
    }
  }, [tab, taskID, history]);

  if (tab === Tab.Tests) {
    return <TestsTable limit={10} />;
  }

  return <div>Task Page!!!!!!!!</div>;
};
