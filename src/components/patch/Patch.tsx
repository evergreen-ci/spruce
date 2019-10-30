import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Link, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { BuildInfo, PatchInfo } from 'evergreen.js/lib/models';
import * as moment from 'moment';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';
import { Variant } from '../variant/Variant';

interface State {
  description: string;
  datetime: moment.Moment;
  project: string;
  author: string;
  reconfigureLink: string;
}

export class PatchProps {
  public client: rest.Evergreen
  public patch: PatchInfo
  public builds: BuildInfo[]
  public expanded: boolean
  public updateOpenPatches: (patchObj: PatchInfo) => void
}

export class Patch extends React.Component<PatchProps, State> {
  constructor(props: PatchProps) {
    super(props);
    const datetime = moment(String(this.props.patch.create_time));
    if (this.props.patch.description === "") {
      this.props.patch.description = "Patch from " + this.props.patch.author + " at " + datetime.format("LLLL") +
        " on project " + this.props.patch.project;
    }
    this.state = {
      description: this.props.patch.description,
      datetime: datetime,
      project: this.props.patch.project,
      author: this.props.patch.author,
      reconfigureLink: this.props.client.uiURL + "/patch/" + this.props.patch.id
    };
  }

  public shouldComponentUpdate(nextProps: Readonly<PatchProps>, nextState: Readonly<State>): boolean {
    return nextProps.expanded !== this.props.expanded;
  }

  public render() {

    const Variants = () => (
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12}>
          <Typography>
            Created at {this.state.datetime.format("LLLL")} on {this.state.project} [
            <Link href={this.state.reconfigureLink}>
              Reconfigure
            </Link>
            ]
          </Typography>
        </Grid>
        {this.props.builds.map(obj => (
          <Grid item={true} xs={3} key={obj.id}>
            <Variant build={obj} client={this.props.client}/>
          </Grid>
        ))}
      </Grid>
    );

    return (
      <Grid>
        <ExpansionPanel className="patch" expanded={this.props.expanded} onChange={this.onExpandChange}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className="patch-header">{this.state.description}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Variants />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    );
  }

  private onExpandChange = () => {
    this.props.updateOpenPatches(this.props.patch);
  }
}

export default Patch;