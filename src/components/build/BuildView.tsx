import { Drawer } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { APITask, Build, ConvertToAPITasks, ConvertToBuild } from 'evergreen.js/lib/models';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';
import BuildSidebar from './BuildSidebar';
import LogContainer from './LogContainer';

const StyledDrawer = withStyles({
  paper: {
    top: "65px",
  }
})(Drawer);

interface State {
  buildId: string
  build: Build
  apiTasks: APITask[]
  currentTask: APITask
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
      idString = queryString.split("=")[1]
    }
    this.state = {
      buildId: idString,
      build: new Build,
      apiTasks: [],
      currentTask: new APITask
    };
  }

  public componentDidMount() {
    this.props.client.getTasksForBuild((err, resp, body) => {
      const tasks = ConvertToAPITasks(body) as unknown as APITask[];
      this.setState({
        apiTasks: tasks,
        currentTask: tasks.length === 0 ? new APITask : tasks[0],
      });
    }, this.state.buildId);
    this.props.client.getBuild((err, resp, body) => {
      this.setState({
        build: ConvertToBuild(body)
      });
    }, this.state.buildId);
  }

  public render() {

    return (
      <div>
        <StyledDrawer variant="permanent" className="sidebar-container" PaperProps={{ square: true, elevation: 0 }}>
          <BuildSidebar build={this.state.build} tasks={this.state.apiTasks} />
        </StyledDrawer>
        <main>
          <LogContainer client={this.props.client} task={this.state.currentTask} onFinishStateUpdate={null}/>
        </main>
      </div>
    );
  }
}

export default BuildView;