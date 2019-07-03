import { Grid, InputBase, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { ConvertToPatches, UIVersion } from 'evergreen.js/lib/models';
import * as moment from 'moment';
import * as React from 'react';
import * as InfiniteScroll from 'react-infinite-scroller';
import * as rest from "../../rest/interface";
import '../../styles.css';
import Patch from './Patch';

interface State {
  pageNum: number
  versions: UIVersion[]
  visible: UIVersion[]
}

class Props {
  public client: rest.Evergreen;
}

export class PatchContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pageNum: 1,
      versions: [],
      visible: []
    };
  }

  public componentDidMount() {
    this.loadPatches();
  }

  public render() {

    const Patches = () => (
      <Grid className="patch-container" container={true} spacing={24}>
        {Object.keys(this.state.visible).map(versionId => (
          <Grid item={true} xs={12} key={versionId}>
            <Patch Patch={this.state.versions[versionId]} />
          </Grid>
        ))}
      </Grid>
    );

    return (
      <InfiniteScroll loadMore={this.loadPatches} threshold={500}>
        <div className="search-container">
          <Paper className="search-input" >
            <InputBase startAdornment={<SearchIcon />}
              fullWidth={true}
              placeholder="Search Patch Descriptions"
              onChange={this.search}
            />
          </Paper>
        </div>
        <Patches />
      </InfiniteScroll>
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
        pageNum: this.state.pageNum + 1,
        versions: sortedVersions,
        visible: sortedVersions,
      });
    }, this.props.client.username, this.state.pageNum);
  }

  private compareByDate(a: UIVersion, b: UIVersion) {
    const dateA = moment(String(a.Version.create_time));
    const dateB = moment(String(b.Version.create_time));
    return dateB.isAfter(dateA) ? 1 : -1;
  }

  private search = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.currentTarget.value;
    const filteredPatches = this.filterItems(query);
    this.setState({
      visible: filteredPatches,
    });
  }

  private filterItems(query: string) {
    const filtered:UIVersion[] = [];
    if (query === "") {
      return this.state.versions;
    }
    Object.keys(this.state.versions).map(versionId => {
      const patch = this.state.versions[versionId];
      const description = patch.Version.message;
      if (description.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
        filtered.push(patch);
      }
    });
    filtered.sort(this.compareByDate);
    return filtered;
  }
}

export default PatchContainer;