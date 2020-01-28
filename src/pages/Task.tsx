import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useParams, useHistory } from "react-router-dom";
import { TestTable } from "pages/task/TestTable";

type Tab = "logs" | "tests" | "files" | "build-baron";
const DEFAULT_TAB = "logs";

export const Task: React.FC<RouteComponentProps> = () => {
  const { tab, taskID } = useParams<{ tab?: Tab; taskID: string }>();
  const history = useHistory();
  useEffect(() => {
    if (!tab) {
      history.replace(`/task/${taskID}/${DEFAULT_TAB}`);
    }
  }, [tab, taskID, history]);

  if (tab === "tests") {
    return <TestTable />;
  }

  return <div>Task Page!!!!!!!!</div>;
};
