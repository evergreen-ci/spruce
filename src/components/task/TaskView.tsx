import { Drawer } from '@material-ui/core';
import { ConvertToPatches, UIVersion } from 'evergreen.js/lib/models';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';
import LogContainer from './LogContainer';
import TaskSidebar from './TaskSidebar';

interface State {
  version: UIVersion;
}

class Props {
  public client: rest.Evergreen;
}

export class TaskView extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      version: {},
    };
  }

  public componentWillMount() {
    this.props.client.getPatches((err, resp, body) => {
      const newPatches = Object.values(ConvertToPatches(resp.body).VersionsMap);
      this.setState({
        version: newPatches[2]
      });
    }, this.props.client.username, 0);
  }

  public render() {
    return (
      <div>
        <Drawer variant="permanent" className="sidebar-container" PaperProps={{square: true, elevation: 0}}>
          <TaskSidebar patch={this.state.version} />
        </Drawer>
        <main>
          <LogContainer client={this.props.client} version={this.state.version}/>
        </main>
      </div>
    );
  }
}

export default TaskView;