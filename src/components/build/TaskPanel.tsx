import { ExpansionPanelDetails, ExpansionPanelSummary, Grid, Typography } from '@material-ui/core';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/styles';
import { APITask, APITest, ConvertToAPITests } from 'evergreen.js/lib/models';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';

const StyledExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: "none"
  }
})(MuiExpansionPanel);

interface State {
  hasFailingTests: boolean
  hasOtherTests: boolean
  failingTests: APITest[]
  otherTests: APITest[]
}

class Props {
  public client: rest.Evergreen;
  public task: APITask
}

export class TaskPanel extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      hasFailingTests: false,
      hasOtherTests: false,
      failingTests: [],
      otherTests: []
    }
  }

  public componentDidMount() {
    this.props.client.getTestsForTask((err, resp, body) => {
      const tests = ConvertToAPITests(body) as unknown as APITest[];
      const failingTests: APITest[] = [];
      const otherTests: APITest[] = [];
      Array.from(tests).forEach(element => {
        if (element.status.includes("fail")) {
          failingTests.push(element);
        } else {
          console.log(element.status);
          otherTests.push(element);
        }
      });
      console.log(failingTests);
      console.log(otherTests);
      this.setState({
        hasFailingTests: failingTests.length !== 0 ? true : false,
        hasOtherTests: otherTests.length !== 0 ? true : false,
        failingTests: failingTests,
        otherTests: otherTests
      })
    }, this.props.task.task_id);
  }

  public render() {

    const FailedTests = () => (
      <Grid container={true}>
        {this.state.failingTests.map(test => (
          <Grid item={true} xs={12} key={test.test_id}>
            <Typography color="error">
              {test.test_id}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );

    const OtherTests = () => (
      <StyledExpansionPanel className="task-expansion-panel">
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Other Tests</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {this.state.otherTests.map(test => (
              <Typography key={test.test_id}>
                {test.test_id}
              </Typography>
          ))}
        </ExpansionPanelDetails>
      </StyledExpansionPanel>
    );

    return (
      <Grid item={true} xs={12} key={this.props.task.task_id}>
        <StyledExpansionPanel className="task-panel">
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{this.props.task.display_name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <FailedTests />
            <OtherTests />
          </ExpansionPanelDetails>
        </StyledExpansionPanel>
      </Grid>
    );
  }
}

export default TaskPanel;