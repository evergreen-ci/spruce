import { Grid, InputBase, MenuItem, Paper, Select } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { ConvertToPatches, UIVersion } from 'evergreen.js/lib/models';
import * as React from 'react';
import * as InfiniteScroll from 'react-infinite-scroller';
import * as rest from "../../rest/interface";
import '../../styles.css';
import Patch from './Patch';

enum SearchType {
  description = "Description",
  project = "Project",
  status = "Status",
};

interface State {
  pageNum: number
  hasMore: boolean
  allPatches: UIVersion[]
  visiblePatches: UIVersion[]
  expandedPatches: object
  isSearching: boolean
  searchType: SearchType
}

class Props {
  public client: rest.Evergreen;
  public username: string;
  public onFinishStateUpdate: () => void;
}

export class PatchContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasMore: true,
      pageNum: 0,
      allPatches: [],
      visiblePatches: [],
      expandedPatches: {},
      isSearching: false,
      searchType: SearchType.description
    };
  }

  public render() {

    const Patches = () => (
      <Grid className="patch-container" container={true} spacing={3}>
        {this.state.visiblePatches.map(patchObj => (
          <Grid item={true} xs={12} key={patchObj.Version.id}>
            <Patch Patch={patchObj} client={this.props.client} updateOpenPatches={this.updateOpenPatches} expanded={this.isExpanded(patchObj)} />
          </Grid>
        ))}
      </Grid>
    );

    return (
      <div>
        <div className="search-container">
          <Paper className="search-input">
            <InputBase startAdornment={<SearchIcon />}
              fullWidth={true}
              placeholder="Search Patches"
              onChange={this.search}
            />
            <div className="search-type">
              <Select value={this.state.searchType} onChange={this.handleSearchTypeChange} variant={"outlined"}>
                <MenuItem value={SearchType.description}>{SearchType.description}</MenuItem>
                <MenuItem value={SearchType.project}>{SearchType.project}</MenuItem>
                <MenuItem value={SearchType.status}>{SearchType.status}</MenuItem>
              </Select>
            </div>
          </Paper>
        </div>
        <InfiniteScroll hasMore={this.state.hasMore} loadMore={this.loadPatches} initialLoad={true}>
          <Patches />
        </InfiniteScroll>
      </div>
    );
  }

  private loadPatches = () => {
    if (this.state.hasMore && !this.state.isSearching) {
      let username = this.props.username;
      const search = window.location.hash.split("?")[1];
      if (search !== undefined) {
        const urlParams = new URLSearchParams(search);
        if (urlParams.has("user")) {
          username = urlParams.get("user");
        }
      }
      this.props.client.getPatches((err, resp, body) => {
        const newPatches = Object.values(ConvertToPatches(resp.body).VersionsMap);
        if (newPatches.length === 0) {
          this.setState({
            hasMore: false
          });
          return;
        }
        // reorder the patches so that the newest element is at the front of the array
        newPatches.reverse();
        this.setState((prevState, props) => ({
          pageNum: prevState.pageNum + 1,
          allPatches: [... this.state.allPatches, ...newPatches],
          visiblePatches: [... this.state.allPatches, ...newPatches],
        }));
      }, username, this.state.pageNum);
    }
  }

  private search = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      isSearching: true
    });
    const query = event.currentTarget.value;
    const filteredPatches = this.filterItems(query);
    this.setState({
      visiblePatches: filteredPatches,
    });
  }

  private filterItems(query: string) {
    const filtered: UIVersion[] = [];
    if (query === "") {
      this.setState({
        isSearching: false
      });
      return this.state.allPatches;
    }
    Object.keys(this.state.allPatches).map(versionId => {
      const patch = this.state.allPatches[versionId];
      let queryField = "";
      switch (this.state.searchType) {
        case SearchType.description: 
          queryField = patch.Version.message;
          break;
        case SearchType.project:
          queryField = patch.Version.project;
          break;
        default: 
          queryField = patch.Version.status
          break;
      }
      if (queryField.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
        filtered.push(patch);
      }
    });
    return filtered;
  }

  private updateOpenPatches = (patchObj: UIVersion) => {
    const newExpanded = this.state.expandedPatches;
    if (patchObj.Version.id in this.state.expandedPatches) {
      delete newExpanded[patchObj.Version.id];
    } else {
      newExpanded[patchObj.Version.id] = 1;
    }
    this.setState({
      expandedPatches: newExpanded
    }, this.props.onFinishStateUpdate);
  }

  private isExpanded = (patchObj: UIVersion) => {
    return patchObj.Version.id in this.state.expandedPatches;
  }

  private handleSearchTypeChange = (event: React.ChangeEvent<{ name?: string; value: string }>) => {
    this.setState({
      searchType: event.target.value as SearchType
    });
  }
}

export default PatchContainer;