import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Link, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { UIBuild, UIPatch } from 'evergreen.js/lib/models';
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

class Props {
  public client: rest.Evergreen
  public patch: UIPatch
  public builds: UIBuild[]
  public expanded: boolean
  public updateOpenPatches: (patchObj: UIPatch) => void
}

export class Patch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const datetime = moment(String(this.props.patch.Patch.CreateTime));
    console.log(this.props.patch.Patch.Description);
    if (this.props.patch.Patch.Description === "") {
      this.props.patch.Patch.Description = "Patch from " + this.props.patch.Patch.Author + " at " + datetime.format("LLLL") +
        " on project " + this.props.patch.Patch.Project;
    }
    this.state = {
      description: this.props.patch.Patch.Description,
      datetime: datetime,
      project: this.props.patch.Patch.Project,
      author: this.props.patch.Patch.Author,
      reconfigureLink: this.props.client.uiURL + "/patch/" + this.props.patch.Patch.Id
    };
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
          <Grid item={true} xs={4} key={obj.Build._id}>
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