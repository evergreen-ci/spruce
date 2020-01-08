import { Drawer } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { AxiosResponse } from "axios";
import {
  APITask,
  APITest,
  Build,
  ConvertToAPITasks,
  ConvertToBuild
} from "evergreen.js/lib/models";
import * as React from "react";
import * as rest from "../../rest/interface";
import "../../styles.css";
import LogContainer from "../log/LogContainer";
import BuildSidebar from "./BuildSidebar";

const StyledDrawer = withStyles({
  paper: {
    top: "65px"
  }
})(Drawer);

interface State {
  buildId: string;
  build: Build;
  apiTasks: APITask[];
  currentTask: APITask;
  currentTest: APITest;
  shouldShowTestLogs: boolean;
}

class Props {
  public client: rest.Evergreen;
  public buildId?: string;
}

export class BuildView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let idString = "";
    if (this.props.buildId !== undefined) {
      idString = this.props.buildId;
    } else {
      const queryString = window.location.href.split("?")[1];
      idString = queryString.split("=")[1];
    }
    this.state = {
      buildId: idString,
      build: new Build(),
      apiTasks: [],
      currentTask: new APITask(),
      currentTest: new APITest(),
      shouldShowTestLogs: false
    };
  }

  public componentDidMount() {
    this.props.client
      .getTasksForBuild(this.state.buildId)
      .then((resp: AxiosResponse<any>) => {
        const tasks = (ConvertToAPITasks(resp.data) as unknown) as APITask[];
        this.setState({
          apiTasks: tasks,
          currentTask: tasks.length === 0 ? new APITask() : tasks[0]
        });
      });
    this.props.client
      .getBuild(this.state.buildId)
      .then((resp: AxiosResponse<any>) => {
        this.setState({
          build: ConvertToBuild(resp.data)
        });
      });
  }

  public render() {
    return (
      <div>
        <StyledDrawer
          variant="permanent"
          className="sidebar-container"
          PaperProps={{ square: true, elevation: 0 }}
        >
          <BuildSidebar
            client={this.props.client}
            build={this.state.build}
            tasks={this.state.apiTasks}
            onSwitchTask={this.switchCurentTask}
            onSwitchTest={this.switchCurrentTest}
            currentTask={this.state.currentTask}
            onFinishStateUpdate={null}
          />
        </StyledDrawer>
        <main>
          <LogContainer
            client={this.props.client}
            task={this.state.currentTask}
            test={this.state.currentTest}
            shouldShowTestLogs={this.state.shouldShowTestLogs}
            onFinishStateUpdate={null}
          />
        </main>
      </div>
    );
  }

  private switchCurentTask = (newTask: APITask) => {
    this.setState({
      currentTask: newTask,
      shouldShowTestLogs: false
    });
  };

  private switchCurrentTest = (newTest: APITest) => {
    this.setState({
      currentTest: newTest,
      shouldShowTestLogs: true
    });
  };
}

export default BuildView;
