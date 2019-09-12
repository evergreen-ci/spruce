import { Button, Checkbox, FormControl, FormLabel, Grid, Input, InputBase, InputLabel, ListItemText, MenuItem, Paper, Select, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { BuildInfo, ConvertToPatches, PatchInfo } from 'evergreen.js/lib/models';
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
  allPatches: PatchInfo[]
  visiblePatches: PatchInfo[]
  expandedPatches: object
  isSearching: boolean
  searchText?: string
  buildsMap: Record<string, BuildInfo[]>
  allStatuses: string[]
  selectedStatuses: string[]
  allProjects: string[]
  selectedProjects: string[]
  allPatchTypes: string[]
  selectedPatchTypes: string[]
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
      buildsMap: {},
      allStatuses: [],
      selectedStatuses: [],
      allProjects: [],
      selectedProjects: [],
      allPatchTypes: [],
      selectedPatchTypes: [],
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
              <FormControl className="advanced-select" key="patchtype">
                <InputLabel>Patch Type</InputLabel>
                <Select
                  multiple={true}
                  value={this.state.selectedPatchTypes}
                  onChange={this.onPatchTypeSelectChange}
                  renderValue={this.renderSelection}
                  input={<Input className="advanced-input" />}
                  MenuProps={MenuProps}
                >
                  {this.state.allPatchTypes.map(patchType => (
                    <MenuItem key={patchType} value={patchType}>
                      <Checkbox checked={this.state.selectedPatchTypes.indexOf(patchType) > -1} />
                      <ListItemText primary={patchType} />
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
            <Grid item={true} xs={12} key={patchObj.id}>
              <Patch patch={patchObj} builds={this.state.buildsMap[patchObj.id] === undefined ? [] : this.state.buildsMap[patchObj.id]}
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
        const newBuilds = patches.BuildsMap;
        const newPatches = patches.UIPatches;
        const newVisiblePatches: PatchInfo[] = [];
        const newStatuses: string[] = [];
        const newProjects: string[] = [];
        const newPatchTypes: string[] = [];
        const newExpanded = {};
        if (newPatches.length === 0) {
          this.setState({
            hasMore: false
          });
          return;
        } else {
          newPatches.map(patch => {
            const status = patch.status;
            const project = patch.project;
            const patchAlias = patch.alias;
            if (!this.state.allStatuses.includes(status) && !newStatuses.includes(status)) {
              newStatuses.push(status);
            }
            if (!this.state.allProjects.includes(project) && !newProjects.includes(project)) {
              newProjects.push(project);
            }
            const patchType = this.getPatchType(patchAlias)
            if (!this.state.allPatchTypes.includes(patchType) && !newPatchTypes.includes(patchType)) {
              newPatchTypes.push(patchType);
            }
            if ((this.state.selectedProjects.length === 0 || this.state.selectedProjects.indexOf(project) > -1) &&
              (this.state.selectedStatuses.length === 0 || this.state.selectedStatuses.indexOf(status) > -1) && 
              (this.state.selectedPatchTypes.length === 0 || this.state.selectedPatchTypes.indexOf(patchType) > -1)) {
              newVisiblePatches.push(patch);
            }
            if (this.state.pageNum === 0) {
              newExpanded[patch.id] = 1;
            }
          })
        }
        this.setState((prevState, props) => ({
          pageNum: prevState.pageNum + 1,
          allPatches: [... this.state.allPatches, ...newPatches],
          visiblePatches: [... this.state.visiblePatches, ...newVisiblePatches],
          buildsMap: { ... this.state.buildsMap, ...newBuilds },
          allStatuses: [...this.state.allStatuses, ...newStatuses],
          allProjects: [...this.state.allProjects, ...newProjects],
          allPatchTypes: [...this.state.allPatchTypes, ...newPatchTypes],
          expandedPatches: prevState.pageNum === 0 ? newExpanded : prevState.expandedPatches
        }), () => {this.applyFilters(this.state.searchText, this.state.selectedStatuses, this.state.selectedProjects, this.state.selectedPatchTypes)});
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
    }, () => {this.applyFilters(query, this.state.selectedStatuses, this.state.selectedProjects, this.state.selectedPatchTypes)});
  }

  private updateOpenPatches = (patchObj: PatchInfo) => {
    const newExpanded = this.state.expandedPatches;
    if (patchObj.id in this.state.expandedPatches) {
      delete newExpanded[patchObj.id];
    } else {
      newExpanded[patchObj.id] = 1;
    }
    this.setState({
      expandedPatches: newExpanded
    }, this.props.onFinishStateUpdate);
  }

  private isExpanded = (patchObj: PatchInfo) => {
    return patchObj.id in this.state.expandedPatches;
  }

  private onStatusSelectChange = (event: React.ChangeEvent<{ name?: string; value: string }>) => {
    const selectedStatuses = event.target.value as unknown as string[];
    this.setState({
      selectedStatuses: selectedStatuses
    }, () => {this.applyFilters(this.state.searchText, selectedStatuses, this.state.selectedProjects, this.state.selectedPatchTypes)});
  }

  private onProjectSelectChange = (event: React.ChangeEvent<{ name?: string; value: string }>) => {
    const selectedProjects = event.target.value as unknown as string[];
    this.setState({
      selectedProjects: selectedProjects
    }, () => {this.applyFilters(this.state.searchText, this.state.selectedStatuses, selectedProjects, this.state.selectedPatchTypes)});
  }

  private onPatchTypeSelectChange = (event: React.ChangeEvent<{ name?: string; value: string }>) => {
    const selectedPatchTypes = event.target.value as unknown as string[];
    this.setState({
      selectedPatchTypes: selectedPatchTypes
    }, () => {this.applyFilters(this.state.searchText, this.state.selectedStatuses, this.state.selectedProjects, selectedPatchTypes)});
  }

  private applyFilters(description: string | undefined, statuses: string[] | undefined, projects: string[] | undefined, patchTypes: string[] | undefined) {
    const filtered: PatchInfo[] = [];
    this.state.allPatches.map( patch => {
      if (description && patch.description.toLowerCase().indexOf(description.toLowerCase()) === -1) {
        return;
      }
      if (statuses && statuses.length > 0 && statuses.indexOf(patch.status.toLowerCase()) === -1) {
        return;
      }
      if (projects && projects.length > 0 && projects.indexOf(patch.project.toLowerCase()) === -1) {
        return;
      }
      if (patchTypes && patchTypes.length > 0 && patchTypes.indexOf(this.getPatchType(patch.alias)) === -1) {
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
      newExpanded[patchObj.id] = 1;
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

  private getPatchType(patchAlias: string): string {
    let patchType = "User Patch"
    if(patchAlias === "__github") {
      patchType = "GitHub PR"
    }
    if(patchAlias === "__commit_queue") {
      patchType = "Commit Queue Test"
    }

    return patchType
  }
}

export default PatchContainer;