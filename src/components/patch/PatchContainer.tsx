import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Grid,
  Input,
  InputBase,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Typography
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { AxiosResponse } from "axios";
import {
  BuildInfo,
  ConvertToPatches,
  PatchInfo
} from "evergreen.js/lib/models";
import { Patches } from "evergreen.js/src/models";
import * as React from "react";
import * as InfiniteScroll from "react-infinite-scroller";
import * as rest from "../../rest/interface";
import "../../styles.css";
import Banner from "../banner/Banner";
import Patch from "./Patch";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};
const PROJECT_PAGE = "project";
const USER_PAGE = "user";

interface State {
  pageNum: number;
  hasMore: boolean;
  allPatches: PatchInfo[];
  expandedPatches: object;
  isSearching: boolean;
  searchText?: string;
  buildsMap: Record<string, BuildInfo[]>;
  allStatuses: string[];
  selectedStatuses: string[];
  allProjects: string[];
  selectedProjects: string[];
  allPatchTypes: string[];
  selectedPatchTypes: string[];
}

interface RouterParamsShape {
  pageType: string;
  owner?: string;
}

class Props {
  public client: rest.Evergreen;
  public username: string;
  public params?: RouterParamsShape;
  public onFinishStateUpdate: () => void;
}

export class PatchContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasMore: true,
      pageNum: 0,
      allPatches: [],
      expandedPatches: {},
      isSearching: false,
      buildsMap: {},
      allStatuses: [],
      selectedStatuses: [],
      allProjects: [],
      selectedProjects: [],
      allPatchTypes: [],
      selectedPatchTypes: []
    };
  }

  public componentDidUpdate(prevProps: Props) {
    if (
      prevProps.params.pageType === USER_PAGE &&
      this.props.params.pageType === PROJECT_PAGE
    ) {
      this.setState({
        selectedProjects: []
      });
    }
  }

  public render() {
    const filteredPatches = this.filterPatches();

    return (
      <div>
        <Banner
          client={this.props.client}
          message={"Welcome to the new patches page!"}
          showOptOut={true}
          onFinishStateUpdate={null}
          storageKey={"shouldHideBanner"}
        />
        <div className="search-container">
          <Paper className="search-input">
            <InputBase
              startAdornment={<SearchIcon className="search-icon" />}
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
                      <Checkbox
                        checked={
                          this.state.selectedStatuses.indexOf(status) > -1
                        }
                      />
                      <ListItemText primary={status} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {this.props.params.pageType === USER_PAGE && (
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
                        <Checkbox
                          checked={
                            this.state.selectedProjects.indexOf(project) > -1
                          }
                        />
                        <ListItemText primary={project} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
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
                      <Checkbox
                        checked={
                          this.state.selectedPatchTypes.indexOf(patchType) > -1
                        }
                      />
                      <ListItemText primary={patchType} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Grid>
          <Grid item={true} xs={3}>
            <div className="expand-container">
              <Button
                className="expand-button"
                variant="outlined"
                onClick={this.onExpandAllClick}
              >
                Expand All
              </Button>
              <Button
                className="expand-button"
                variant="outlined"
                onClick={this.onCollapseAllClick}
              >
                Collapse All
              </Button>
            </div>
          </Grid>
        </Grid>
        <InfiniteScroll
          hasMore={this.state.hasMore}
          loadMore={this.loadPatches}
          initialLoad={true}
        >
          <Grid className="patch-container" container={true} spacing={3}>
            {filteredPatches.map(patchObj => (
              <Grid item={true} xs={12} key={patchObj.id}>
                <Patch
                  patch={patchObj}
                  builds={
                    this.state.buildsMap[patchObj.id] === undefined
                      ? []
                      : this.state.buildsMap[patchObj.id]
                  }
                  client={this.props.client}
                  updateOpenPatches={this.updateOpenPatches}
                  expanded={this.isExpanded(patchObj)}
                />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      </div>
    );
  }

  private loadPatches = () => {
    if (this.state.hasMore && !this.state.isSearching) {
      const { pageType, owner } = this.props.params;
      const { username } = this.props;

      const getPatchesCallback = (resp: AxiosResponse<Patches>) => {
        if (resp === undefined) {
          return;
        }
        const patches = ConvertToPatches(resp.data);
        const newBuilds = patches.BuildsMap;
        const newPatches = patches.UIPatches;
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
          newPatches.forEach(patch => {
            const { status, project } = patch;
            const patchType = this.getPatchType(patch.alias);
            if (
              !this.state.allStatuses.includes(status) &&
              !newStatuses.includes(status)
            ) {
              newStatuses.push(status);
            }
            if (
              !this.state.allProjects.includes(project) &&
              !newProjects.includes(project)
            ) {
              newProjects.push(project);
            }
            if (
              !this.state.allPatchTypes.includes(patchType) &&
              !newPatchTypes.includes(patchType)
            ) {
              newPatchTypes.push(patchType);
            }
            if (this.state.pageNum === 0) {
              newExpanded[patch.id] = 1;
            }
          });
        }
        this.setState(prevState => ({
          pageNum: prevState.pageNum + 1,
          allPatches: [...this.state.allPatches, ...newPatches],
          buildsMap: { ...this.state.buildsMap, ...newBuilds },
          allStatuses: [...this.state.allStatuses, ...newStatuses],
          allProjects: [...this.state.allProjects, ...newProjects],
          allPatchTypes: [...this.state.allPatchTypes, ...newPatchTypes],
          expandedPatches:
            prevState.pageNum === 0 ? newExpanded : prevState.expandedPatches
        }));
      };
      if (pageType === PROJECT_PAGE && owner) {
        this.props.client
          .getProjectPatches(owner, this.state.pageNum)
          .then(getPatchesCallback);
      } else if (pageType === USER_PAGE) {
        this.props.client
          .getPatches(owner ? owner : username, this.state.pageNum)
          .then(getPatchesCallback);
      }
    }
  };

  private search = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      isSearching: true
    });
    const query = event.currentTarget.value;
    this.setState({
      searchText: query
    });
  };

  private updateOpenPatches = (patchObj: PatchInfo) => {
    const newExpanded = this.state.expandedPatches;
    if (patchObj.id in this.state.expandedPatches) {
      delete newExpanded[patchObj.id];
    } else {
      newExpanded[patchObj.id] = 1;
    }
    this.setState(
      {
        expandedPatches: newExpanded
      },
      this.props.onFinishStateUpdate
    );
  };

  private isExpanded = (patchObj: PatchInfo) => {
    return patchObj.id in this.state.expandedPatches;
  };

  private onStatusSelectChange = (
    event: React.ChangeEvent<{ name?: string; value: string }>
  ) => {
    const selectedStatuses = (event.target.value as unknown) as string[];
    this.setState({
      selectedStatuses
    });
  };

  private onProjectSelectChange = (
    event: React.ChangeEvent<{ name?: string; value: string }>
  ) => {
    const selectedProjects = (event.target.value as unknown) as string[];
    this.setState({
      selectedProjects
    });
  };

  private onPatchTypeSelectChange = (
    event: React.ChangeEvent<{ name?: string; value: string }>
  ) => {
    const selectedPatchTypes = (event.target.value as unknown) as string[];
    this.setState({
      selectedPatchTypes
    });
  };

  private filterPatches() {
    const {
      searchText,
      selectedStatuses,
      selectedProjects,
      selectedPatchTypes
    } = this.state;

    const noFilters =
      !searchText &&
      !selectedStatuses.length &&
      !selectedProjects.length &&
      !selectedPatchTypes.length;

    if (noFilters) {
      return this.state.allPatches;
    }

    return this.state.allPatches.filter(
      ({ description, status, project, alias }) => {
        const matchesSearch =
          searchText &&
          description.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
        const hasStatus =
          selectedStatuses &&
          selectedStatuses.length > 0 &&
          selectedStatuses.indexOf(status.toLowerCase()) > -1;
        const isProject =
          selectedProjects &&
          selectedProjects.length > 0 &&
          selectedProjects.indexOf(project.toLowerCase()) > -1;
        const isPatchType =
          selectedPatchTypes &&
          selectedPatchTypes.length > 0 &&
          selectedPatchTypes.indexOf(this.getPatchType(alias)) > -1;

        return matchesSearch || hasStatus || isProject || isPatchType;
      }
    );
  }

  private onExpandAllClick = () => {
    const newExpanded = {};
    this.state.allPatches.map(patchObj => {
      newExpanded[patchObj.id] = 1;
    });
    this.setState({
      expandedPatches: newExpanded
    });
  };

  private onCollapseAllClick = () => {
    this.setState({
      expandedPatches: {}
    });
  };

  private renderSelection = (value: string[]) => {
    return <Typography>{value.join(", ")}</Typography>;
  };

  private getPatchType(patchAlias: string): string {
    let patchType = "User Patch";
    if (patchAlias === "__github") {
      patchType = "GitHub PR";
    }
    if (patchAlias === "__commit_queue") {
      patchType = "Commit Queue Test";
    }

    return patchType;
  }
}

export default PatchContainer;
