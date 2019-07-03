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
  hasMore: boolean
  allPatches: UIVersion[]
  visiblePatches: UIVersion[]
}

class Props {
  public client: rest.Evergreen;
}

export class PatchContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasMore: true,
      pageNum: 0,
      allPatches: [],
      visiblePatches: []
    };
  }

  public componentDidMount() {
    this.loadPatches();
  }

  public render() {

    const Patches = () => (
      <Grid className="patch-container" container={true} spacing={24}>
        {this.state.visiblePatches.map(patchObj => (
          <Grid item={true} xs={12} key={patchObj.Version.id}>
            <Patch Patch={patchObj} />
          </Grid>
        ))}
      </Grid>
    );

    return (
      <div>
        <div className="search-container">
          <Paper className="search-input" >
            <InputBase startAdornment={<SearchIcon />}
              fullWidth={true}
              placeholder="Search Patch Descriptions"
              onChange={this.search}
            />
          </Paper>
        </div>
        <InfiniteScroll hasMore={this.state.hasMore} loadMore={this.loadPatches} initialLoad={false}>
          <Patches />
        </InfiniteScroll>
      </div>
    );
  }

  private loadPatches = () => {
    if (this.state.hasMore) {
      this.props.client.getPatches((err, resp, body) => {
        const newPatches = ConvertToPatches(resp.body).VersionsMap;
        if (Object.keys(newPatches).length === 0) {
          this.setState({ 
            hasMore: false 
          });
          return;
        }
        const sortedPatches = this.state.allPatches;
        Object.keys(newPatches).map(versionId => {
          sortedPatches.push(newPatches[versionId]);
        });
        sortedPatches.sort(this.compareByDate);
        this.setState((prevState, props) => ({
          pageNum: prevState.pageNum + 1,
          allPatches: sortedPatches,
          visiblePatches: sortedPatches,
      })); 
      }, this.props.client.username, this.state.pageNum);
    }
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
      visiblePatches: filteredPatches,
    });
  }

  private filterItems(query: string) {
    const filtered: UIVersion[] = [];
    if (query === "") {
      return this.state.allPatches;
    }
    Object.keys(this.state.allPatches).map(versionId => {
      const patch = this.state.allPatches[versionId];
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