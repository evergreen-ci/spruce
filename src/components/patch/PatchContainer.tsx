import { Grid } from '@material-ui/core';
import { ConvertToPatches, UIVersion } from 'evergreen.js/lib/models';
import * as moment from 'moment';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';
import Patch from './Patch';

interface State {
  pageNum: number
  versions: UIVersion[]
}

class Props {
  public client: rest.Evergreen;
}

export class PatchContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pageNum: 1,
      versions: []
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
    this.props.client.getPatches((err, resp, body) => {
      const versions = ConvertToPatches(resp.body).VersionsMap;
      const sortedVersions = this.state.versions;
      Object.keys(versions).map(versionId => {
        sortedVersions.push(versions[versionId]);
      });
      sortedVersions.sort(this.compareByDate);
      this.setState({
        versions: sortedVersions
      });
    }, this.props.client.username, this.state.pageNum);
  }

  private compareByDate(a: UIVersion, b: UIVersion) {
    const dateA = moment(String(a.Version.create_time));
    const dateB = moment(String(b.Version.create_time));
    return dateB.isAfter(dateA) ? 1 : -1;
  }
}

export default PatchContainer;