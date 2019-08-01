import { Checkbox, FormControl, Grid, Input, InputBase, InputLabel, ListItemText, MenuItem, Paper, Select } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { ConvertToPatches, UIPatch, UIVersion } from 'evergreen.js/lib/models';
import * as React from 'react';
import * as InfiniteScroll from 'react-infinite-scroller';
import * as rest from "../../rest/interface";
import '../../styles.css';
import Banner from '../banner/Banner';
import Patch from './Patch';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface State {
  pageNum: number
  hasMore: boolean
  allPatches: UIPatch[]
  visiblePatches: UIPatch[]
  expandedPatches: object
  isSearching: boolean
  versionsMap: Record<string, UIVersion>
  allStatuses: string[]
  selectedStatuses: string[]
  allProjects: string[]
  selectedProjects: string[]
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
      versionsMap: {},
      allStatuses: [],
      selectedStatuses: [],
      allProjects: [],
      selectedProjects: []
    };
  }

  public render() {

    const Patches = () => (
      <Grid className="patch-container" container={true} spacing={3}>
        {this.state.visiblePatches.map(patchObj => (
          <Grid item={true} xs={12} key={patchObj.Patch.Id}>
            <Patch patch={patchObj} builds={this.state.versionsMap[patchObj.Patch.Id].Builds}
              client={this.props.client} updateOpenPatches={this.updateOpenPatches} expanded={this.isExpanded(patchObj)} />
          </Grid>
        ))}
      </Grid>
    );

    return (
      <div>
        <Banner client={this.props.client} message={"Welcome to the new patches page!"} showOptOut={true}
          onFinishStateUpdate={null} storageKey={"shouldHideBanner"} />
        <div className="search-container">
          <Paper className="search-input">
            <InputBase startAdornment={<SearchIcon className="search-icon" />}
              fullWidth={true}
              placeholder="Search Patch Descriptions"
              onChange={this.search}
            />
            {/* <Button>
                Advanced
                <ExpandMoreIcon />
              </Button> */}
            <div className="advanced-search">
              <FormControl>
                <InputLabel>Status</InputLabel>
                <Select
                  multiple={true}
                  value={this.state.selectedStatuses}
                  onChange={this.onStatusSelectChange}
                  input={<Input className="advanced-input" />}
                  MenuProps={MenuProps}
                  className="advanced-select"
                >
                  {this.state.allStatuses.map(status => (
                    <MenuItem key={status} value={status}>
                      <Checkbox checked={this.state.selectedStatuses.indexOf(status) > -1} />
                      <ListItemText primary={status} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel>Project</InputLabel>
                <Select
                  multiple={true}
                  value={this.state.selectedProjects}
                  onChange={this.onProjectSelectChange}
                  input={<Input className="advanced-input" />}
                  MenuProps={MenuProps}
                  className="advanced-select"
                >
                  {this.state.allProjects.map(project => (
                    <MenuItem key={project} value={project}>
                      <Checkbox checked={this.state.selectedProjects.indexOf(project) > -1} />
                      <ListItemText primary={project} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
    console.log("load patches");
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
        console.log("get patches");
        const patches = ConvertToPatches(resp.body);
        const newVersions = patches.VersionsMap;
        const newPatches = patches.UIPatches;
        const newStatuses: string[] = [];
        const newProjects: string[] = [];
        if (newPatches.length === 0) {
          this.setState({
            hasMore: false
          });
          return;
        } else {
          newPatches.map(patch => {
            const status = patch.Patch.Status;
            const project = patch.Patch.Project;
            if (!this.state.allStatuses.includes(status) && !newStatuses.includes(status)) {
              newStatuses.push(status);
            }
            if (!this.state.allProjects.includes(project) && !newProjects.includes(project)) {
              newProjects.push(project);
            }
          });
        }
        this.setState((prevState, props) => ({
          pageNum: prevState.pageNum + 1,
          allPatches: [... this.state.allPatches, ...newPatches],
          visiblePatches: [... this.state.allPatches, ...newPatches],
          versionsMap: { ... this.state.versionsMap, ...newVersions },
          allStatuses: [...this.state.allStatuses, ...newStatuses],
          allProjects: [...this.state.allProjects, ...newProjects]
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
    const filtered: UIPatch[] = [];
    if (query === "") {
      this.setState({
        isSearching: false
      });
      return this.state.allPatches;
    }
    Object.keys(this.state.allPatches).map(versionId => {
      const patch = this.state.allPatches[versionId] as UIPatch;
      const description = patch.Patch.Description;
      const status = patch.Patch.Status;
      const project = patch.Patch.Project;
      if ((this.state.selectedProjects.length === 0 || this.state.selectedProjects.indexOf(project) > -1) &&
        (this.state.selectedStatuses.length === 0 || this.state.selectedStatuses.indexOf(status) > -1) &&
        (description.toLowerCase().indexOf(query.toLowerCase()) !== -1)) {
        filtered.push(patch);
      }
    });
    return filtered;
  }

  private updateOpenPatches = (patchObj: UIPatch) => {
    const newExpanded = this.state.expandedPatches;
    if (patchObj.Patch.Id in this.state.expandedPatches) {
      delete newExpanded[patchObj.Patch.Id];
    } else {
      newExpanded[patchObj.Patch.Id] = 1;
    }
    this.setState({
      expandedPatches: newExpanded
    }, this.props.onFinishStateUpdate);
  }

  private isExpanded = (patchObj: UIPatch) => {
    return patchObj.Patch.Id in this.state.expandedPatches;
  }

  private onStatusSelectChange = (event: React.ChangeEvent<{ name?: string; value: string }>) => {
    const selectedValues = event.target.value as unknown as string[];
    this.setState({
      selectedStatuses: selectedValues
    });
  }

  private onProjectSelectChange = (event: React.ChangeEvent<{ name?: string; value: string }>) => {
    const selectedValues = event.target.value as unknown as string[];
    this.setState({
      selectedProjects: selectedValues
    });
  }
}

export default PatchContainer;