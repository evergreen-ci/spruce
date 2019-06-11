import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';
import Variant from '../variant/variant';

interface State {
  APIClient: rest.Evergreen;
}

class Props {
  public name : string;
  public month : string;
  public day : number;
  public time : string;
  public project : string;
  public patch : string;
}

export class Patch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // TODO: get the API client from some config
    this.state = {
      APIClient: rest.EvergreenClient("admin", "e4f2c40463dcade5248d36434cb93bac", "http://localhost:8080/api")
    }
  }

  public render() {

    return (
      <Grid>
        <ExpansionPanel className="patch">
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography className="patch-header" variant="h6">{this.props.name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container={true} spacing={24}>
              <Grid item={true} xs={12}>
                <Typography>
                  {this.props.day} {this.props.month}, {this.props.time} on {this.props.project} applied to {this.props.patch}
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