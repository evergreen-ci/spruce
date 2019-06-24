import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { UIPatch } from 'evergreen.js/lib/models';
import * as moment from 'moment';
import * as React from 'react';
import '../../styles.css';
import Variant from '../variant/Variant';

interface State {
  description: string;
  datetime: moment.Moment;
  project: string;
  githash: string;
  author: string;
}

class Props {
  public UIPatch: UIPatch;
}

export class Patch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const datetime = moment(String(this.props.UIPatch.Patch.CreateTime));
    let description = this.props.UIPatch.Patch.Description;

    if (description === undefined) {
      description = "Patch from " + this.props.UIPatch.Patch.Author + " at " + datetime.format("MM/DD/YY h:mm a") +
        " on project " + this.props.UIPatch.Patch.Project +
        " applied to " + this.props.UIPatch.Patch.Githash.slice(0, 7);
    }

    this.state = {
      description: description,
      datetime: datetime,
      project: this.props.UIPatch.Patch.Project,
      githash: this.props.UIPatch.Patch.Githash.slice(0, 7),
      author: this.props.UIPatch.Patch.Author,
    };
  }

  public render() {

    return (
      <Grid>
        <ExpansionPanel className="patch">
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography className="patch-header" variant="h6">{this.state.description}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container={true} spacing={24}>
              <Grid item={true} xs={12}>
                <Typography>
                  {this.state.datetime.format("D MMM YYYY, h:mm a")} on {this.state.project} applied to {this.state.githash}
                </Typography>
              </Grid>
              <Grid item={true} xs={4}>
                <Variant name="Variant 1" />
              </Grid>
              <Grid item={true} xs={4}>
                <Variant name="Variant 2" />
              </Grid>
              <Grid item={true} xs={4}>
                <Variant name="Variant 3" />
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    );
  }
}

export default Patch;