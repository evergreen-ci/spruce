import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Typography } from '@material-ui/core';
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
  builds: UIBuild[]
}

class Props {
  public Patch: UIVersion;
}

export class Patch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const datetime = moment(String(this.props.Patch.Version.create_time));
    let description = this.props.Patch.Version.message;

    if (description === undefined) {
      description = "Patch from " + this.props.Patch.Version.author + " at " + datetime.format("MM/DD/YY h:mm a") +
        " on project " + this.props.Patch.Version.identifier;
    }

    this.state = {
      description: description,
      datetime: datetime,
      project: this.props.Patch.Version.identifier,
      author: this.props.Patch.Version.author,
      builds: this.props.Patch.Builds
    };
  }

  public render() {

    const Variants = () => (
      <Grid container={true} spacing={24}>
        <Grid item={true} xs={12}>
          <Typography>
            Created at {this.state.datetime.format("D MMM YYYY, h:mm a")} on {this.state.project}
          </Typography>
        </Grid>
        {this.state.builds.map(obj => (
          <Grid item={true} xs={3} key={obj.Build._id}>
            <Variant build={obj} />
          </Grid>
        ))}
      </Grid>
    );

    return (
      <Grid>
        <ExpansionPanel className="patch">
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography className="patch-header" variant="h6">{this.state.description}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Variants />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    );
  }
}

export default Patch;