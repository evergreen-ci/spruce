import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';
import Variant from '../variant/Variant';

class State {
  public name : string;
  public month : string;
  public day : number;
  public time : string;
  public project : string;
  public patch : string;
}

class Props {
  public client : rest.Evergreen;
}

export class Patch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name : "Patch 2", 
      month : "June", 
      day : 23,
      time : "11:11 AM", 
      project : "Evergreen", 
      patch : "3d3fa0", 
    };
  }

  public render() {

    return (
      <Grid>
        <ExpansionPanel className="patch">
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography className="patch-header" variant="h6">{this.state.name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container={true} spacing={24}>
              <Grid item={true} xs={12}>
                <Typography>
                  {this.state.day} {this.state.month}, {this.state.time} on {this.state.project} applied to {this.state.patch}
                </Typography>
              </Grid>
              <Grid item={true} xs={4}>
                <Variant name="Variant 1"/>
              </Grid>
              <Grid item={true} xs={4}>
                <Variant name="Variant 2"/>
              </Grid>
              <Grid item={true} xs={4}>
                <Variant name="Variant 3"/>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    );
  }
}

export default Patch;