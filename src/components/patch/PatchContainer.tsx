import { Grid } from '@material-ui/core';
import { ConvertToPatches, UIVersion } from 'evergreen.js/lib/models';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';
import Patch from './Patch';

interface State {
  versions: Record<string, UIVersion>
}

class Props {
  public client: rest.Evergreen;
}

export class PatchContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      versions: {}
    };
  }

  public componentDidMount() {
    this.loadPatches();
  }

  public render() {

    const Patches = () => (
      <Grid className="patch-container" container={true} spacing={24}>
        {Object.keys(this.state.versions).map(versionId => (
          <Grid item={true} xs={12} key={versionId}>
            <Patch Patch={this.state.versions[versionId]} />
          </Grid>
        ))}
      </Grid>
    );

    return (
      <div>
        <div className="patch-search-bar">Insert patch search bar here</div>
        <Patches />
      </div>
    );
  }

  private loadPatches() {
    const pageNum = 2;
    this.props.client.getPatches((err, resp, body) => {
      const versions = ConvertToPatches(resp.body).VersionsMap;
      this.setState({
        versions: versions,
      });
    }, this.props.client.username, pageNum);
  }
}

export default PatchContainer;