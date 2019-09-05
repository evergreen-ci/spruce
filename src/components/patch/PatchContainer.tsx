import { Button, Checkbox, FormControl, FormLabel, Grid, Input, InputBase, InputLabel, ListItemText, MenuItem, Paper, Select, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { ConvertToPatches, UIPatch, UIVersion } from 'evergreen.js/lib/models';
import * as React from 'react';
import * as InfiniteScroll from 'react-infinite-scroller';
import * as request from 'request';
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
  searchText?: string
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
      selectedProjects: [],
    };
  }

  public render() {
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
          </Paper>
        </div>
        <Grid container={true} className="filter-container">
          <Grid item={true} xs={9}>
            <div className="dropdown-container">
              <FormLabel className="filter-label">Filter Patches</FormLabel>
              <FormControl className="advanced-select" key="status">
                <InputLabel>Status</InputLabel>
                <Select
                  multiple={true}
                  value={this.state.selectedStatuses as string[]}
                  onChange={this.onStatusSelectChange}
                  renderValue={this.renderSelection}
                  input={<Input className="advanced-input" />}
                  MenuProps={MenuProps}
                >
                  {this.state.allStatuses.map(status => (
                    <MenuItem key={status} value={status}>
                      <Checkbox checked={this.state.selectedStatuses.indexOf(status) > -1} />
                      <ListItemText primary={status} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className="advanced-select" key="project">
                <InputLabel>Project</InputLabel>
                <Select
                  multiple={true}
                  value={this.state.selectedProjects}
                  onChange={this.onProjectSelectChange}
                  renderValue={this.renderSelection}
                  input={<Input className="advanced-input" />}
                  MenuProps={MenuProps}
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
          </Grid>
          <Grid item={true} xs={3}>
            <div className="expand-container">
              <Button className="expand-button" variant="outlined" onClick={this.onExpandAllClick}>Expand All</Button>
              <Button className="expand-button" variant="outlined" onClick={this.onCollapseAllClick}>Collapse All</Button>
            </div>
          </Grid>
        </Grid>
        <InfiniteScroll hasMore={this.state.hasMore} loadMore={this.loadPatches} initialLoad={true}>
          <Grid className="patch-container" container={true} spacing={3}>
          {this.state.visiblePatches.map(patchObj => (
            <Grid item={true} xs={12} key={patchObj.Patch.Id}>
              <Patch patch={patchObj} builds={this.state.versionsMap[patchObj.Patch.Id] === undefined ? [] : this.state.versionsMap[patchObj.Patch.Id].Builds}
                client={this.props.client} updateOpenPatches={this.updateOpenPatches} expanded={this.isExpanded(patchObj)} />
            </Grid>
          ))}
          </Grid>
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
      const getPatchesCallback = (err: any, resp: request.Response, body:any) => {
        if (resp === undefined) {
          return;
        }
        const patches = ConvertToPatches(resp.body);
        const newVersions = patches.VersionsMap;
        const newPatches = patches.UIPatches;
        const newVisiblePatches: UIPatch[] = [];
        const newStatuses: string[] = [];
        const newProjects: string[] = [];
        const newExpanded = {};
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
            if ((this.state.selectedProjects.length === 0 || this.state.selectedProjects.indexOf(project) > -1) &&
              (this.state.selectedStatuses.length === 0 || this.state.selectedStatuses.indexOf(status) > -1)) {
              newVisiblePatches.push(patch);
            }
            if (this.state.pageNum === 0) {
              newExpanded[patch.Patch.Id] = 1;
            }
          });
        }
        this.setState((prevState, props) => ({
          pageNum: prevState.pageNum + 1,
          allPatches: [... this.state.allPatches, ...newPatches],
          visiblePatches: [... this.state.visiblePatches, ...newVisiblePatches],
          versionsMap: { ... this.state.versionsMap, ...newVersions },
          allStatuses: [...this.state.allStatuses, ...newStatuses],
          allProjects: [...this.state.allProjects, ...newProjects],
          expandedPatches: prevState.pageNum === 0 ? newExpanded : prevState.expandedPatches
        }), () => {this.applyFilters(this.state.searchText, this.state.selectedStatuses, this.state.selectedProjects)});
      }
      this.props.client.getPatches(getPatchesCallback, username, this.state.pageNum);
    }
  }

  private search = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      isSearching: true
    });
    const query = event.currentTarget.value;
    this.setState({
      searchText: query
    }, () => {this.applyFilters(query, this.state.selectedStatuses, this.state.selectedProjects)});
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
    const selectedStatuses = event.target.value as unknown as string[];
    this.setState({
      selectedStatuses: selectedStatuses
    }, () => {this.applyFilters(this.state.searchText, selectedStatuses, this.state.selectedProjects)});
  }

  private onProjectSelectChange = (event: React.ChangeEvent<{ name?: string; value: string }>) => {
    const selectedProjects = event.target.value as unknown as string[];
    this.setState({
      selectedProjects: selectedProjects
    }, () => {this.applyFilters(this.state.searchText, this.state.selectedStatuses, selectedProjects)});
  }

  private applyFilters(description: string | undefined, statuses: string[] | undefined, projects: string[] | undefined) {
    const filtered: UIPatch[] = [];
    this.state.allPatches.map( patch => {
      if (description && patch.Patch.Description.toLowerCase().indexOf(description.toLowerCase()) === -1) {
        return;
      }
      if (statuses && statuses.length > 0 && statuses.indexOf(patch.Patch.Status.toLowerCase()) === -1) {
        return;
      }
      if (projects && projects.length > 0 && projects.indexOf(patch.Patch.Project.toLowerCase()) === -1) {
        return;
      }
      filtered.push(patch);
    })
    this.setState({
      visiblePatches: filtered,
    }, this.props.onFinishStateUpdate);
  }

  private onExpandAllClick = () => {
    const newExpanded = {}
    this.state.allPatches.map((patchObj) => {
      newExpanded[patchObj.Patch.Id] = 1;
    })
    this.setState({
      expandedPatches: newExpanded
    });
  }

  private onCollapseAllClick = () => {
    this.setState({
      expandedPatches: {}
    });
  }

  private renderSelection = (value: string[]) => {
    return (<Typography>{value.join(", ")}</Typography>)
  }
}

export default PatchContainer;