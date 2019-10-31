import { Button, Grid, Typography } from "@material-ui/core";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import { APITask, APITest, Build } from "evergreen.js/lib/models";
import * as moment from "moment";
import * as React from "react";
import { Redirect } from "react-router-dom";
import * as rest from "../../rest/interface";
import "../../styles.css";
import { TaskPanel } from "../task/TaskPanel";

interface State {
  displayName: string;
  displayHash: string;
  order: string;
  isShowingBuildView: boolean;
}

class Props {
  public client: rest.Evergreen;
  public build: Build;
  public tasks: APITask[];
  public onSwitchTask: (task: APITask) => void;
  public onSwitchTest: (test: APITest) => void;
  public currentTask: APITask;
  public onFinishStateUpdate: () => void;
}

export class BuildSidebar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayName: "",
      displayHash: "",
      order: "",
      isShowingBuildView: true
    };
  }

  public render() {
    if (!this.state.isShowingBuildView) {
      return <Redirect to={"/patches"} />;
    }

    const tasks = this.props.tasks.map(taskObj => (
      <Grid item={true} xs={12} key={taskObj.task_id}>
        <TaskPanel
          client={this.props.client}
          task={taskObj}
          status={taskObj.status}
          onSwitchTask={this.props.onSwitchTask}
          onSwitchTest={this.props.onSwitchTest}
          isCurrentTask={this.props.currentTask.task_id === taskObj.task_id}
          onFinishStateUpdate={this.props.onFinishStateUpdate}
        />
      </Grid>
    ));

    return (
      <Grid container={true} spacing={2} className="sidebar">
        <Grid item={true} xs={12} />
        <Grid item={true} xs={12}>
          <Button onClick={this.setRedirect}>
            <ArrowLeftIcon />
            My Patches
          </Button>
        </Grid>
        <Grid item={true} xs={12}>
          <Typography>
            Patch {this.props.build.order} on base commit{" "}
            {this.props.build.git_hash === undefined
              ? ""
              : this.props.build.git_hash.substr(0, 8)}
          </Typography>
          <Typography>{this.props.build.display_name}</Typography>
          <Typography>
            Created on {moment(this.props.build.create_time).format("LLLL")}
          </Typography>
        </Grid>
        {tasks}
      </Grid>
    );
  }

  private setRedirect = () => {
    this.setState({
      isShowingBuildView: false
    });
  };
}

export default BuildSidebar;
