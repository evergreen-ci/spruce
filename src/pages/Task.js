import React, { useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
const DEFAULT_TAB = "logs";
const Task = () => {
  const params = useParams();
  const history = useHistory();
  useEffect(() => {
    if (!params.tab) {
      history.replace(`/task/${params.taskID}/logs`);
    }
  }, [params.tab]);

  return <div>Task Page</div>;
};

export default Task;
