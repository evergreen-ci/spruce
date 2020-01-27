import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useParams, useHistory } from "react-router-dom";

const DEFAULT_TAB = "logs";

const Task: React.FC<RouteComponentProps> = () => {
  const params = useParams<{ tab?: string; taskID: string }>();
  const history = useHistory();
  useEffect(() => {
    if (!params.tab) {
      history.replace(`/task/${params.taskID}/${DEFAULT_TAB}`);
    }
  }, [params.tab, params.taskID, history]);

  return <div>Task Page!!!!!!!!</div>;
};

export default Task;
