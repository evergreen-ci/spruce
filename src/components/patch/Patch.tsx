import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Link, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { UIBuild, UIVersion } from 'evergreen.js/lib/models';
import * as moment from 'moment';
import * as React from 'react';
import '../../styles.css';
import { Variant } from '../variant/Variant';

interface State {
  description: string;
  datetime: moment.Moment;
  project: string;
  author: string;
  builds: UIBuild[];
  reconfigureLink: string;
}

class Props {
  public Patch: UIVersion;
  public expanded: boolean;
  public updateOpenPatches: (patchObj: UIVersion) => void;
}

export class Patch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const datetime = moment(String(this.props.Patch.Version.create_time));
    if (this.props.Patch.Version.message === undefined) {
      this.props.Patch.Version.message = "Patch from " + this.props.Patch.Version.author + " at " + datetime.format("LLLL") +
        " on project " + this.props.Patch.Version.identifier;
    }
    this.state = {
      description: this.props.Patch.Version.message,
      datetime: datetime,
      project: this.props.Patch.Version.identifier,
      author: this.props.Patch.Version.author,
      builds: this.props.Patch.Builds,
      reconfigureLink: "https://evergreen.mongodb.com/patch/" + this.props.Patch.Version.id
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
        {this.state.builds.map(obj => (
          <Grid item={true} xs={4} key={obj.Build._id}>
            <Variant build={obj} />
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
    this.props.updateOpenPatches(this.props.Patch);
  }
}

export default Patch;