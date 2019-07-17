import { Drawer } from '@material-ui/core';
import { APITask, Build, ConvertToAPITasks, ConvertToBuild } from 'evergreen.js/lib/models';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';
import BuildSidebar from './BuildSidebar';
import LogContainer from './LogContainer';

interface State {
  build_id: string
  build: Build
  apiTasks: APITask[]
  currentTask: APITask
}

class Props {
  public client: rest.Evergreen;
}

export class BuildView extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    const queryString = window.location.href.split("?")[1];
    const idString = queryString.split("=")[1]
    this.state = {
      build_id: idString,
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
        currentTask: tasks[0],
      });
    }, this.state.build_id);
    this.props.client.getBuild((err, resp, body) => {
      this.setState({
        build: ConvertToBuild(body)
      });
    }, this.state.build_id);
  }

  public render() {

    return (
      <div>
        <Drawer variant="permanent" className="sidebar-container" PaperProps={{ square: true, elevation: 0 }}>
          <BuildSidebar build={this.state.build} tasks={this.state.apiTasks} />
        </Drawer>
        <main>
          <LogContainer client={this.props.client} task={this.state.currentTask} />
        </main>
      </div>
    );
  }
}

export default BuildView;