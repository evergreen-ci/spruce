import { Drawer } from '@material-ui/core';
import { ConvertToPatches, UIVersion } from 'evergreen.js/lib/models';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';
import BuildSidebar from './BuildSidebar';
import LogContainer from './LogContainer';

interface State {
  id: string
  patch: UIVersion
}

class Props {
  public client: rest.Evergreen;
}

export class BuildView extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      id: "",
      patch: {}
    };
  }

  public componentWillMount() {
    this.props.client.getPatches((err, resp, body) => {
      const newPatches = Object.values(ConvertToPatches(resp.body).VersionsMap);
      this.setState({
        patch: newPatches[2]
      });
    }, this.props.client.username, 0);
  }

  public render() {

    return (
      <div>
        <Drawer variant="permanent" className="sidebar-container" PaperProps={{square: true, elevation: 0}}>
          <BuildSidebar patch={this.state.patch} />
        </Drawer>
        <main>
          <LogContainer client={this.props.client} version={this.state.patch}/>
        </main>
      </div>
    );
  }
}

export default BuildView;