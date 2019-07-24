import { Card, CardActions, CardContent, Collapse, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Typography } from '@material-ui/core';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/styles';
import { APITask, APITest, ConvertToAPITests } from 'evergreen.js/lib/models';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';

export const StyledExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: "none"
  }
})(MuiExpansionPanel);

interface State {
  failingTests: APITest[]
  silentFailTests: APITest[]
  skippedTests: APITest[]
  otherTests: APITest[]
  isShowingOtherTests: boolean
}

class Props {
  public client: rest.Evergreen
  public task: APITask
  public status: string
  public switchTask: (task: APITask) => void
  public isCurrentTask: boolean
  public onFinishStateUpdate: () => void;
}

export class TaskPanel extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      failingTests: [],
      silentFailTests: [],
      skippedTests: [],
      otherTests: [],
      isShowingOtherTests: false
    }
  }

  public componentDidMount() {
    this.props.client.getTestsForTask((err, resp, body) => {
      const tests = ConvertToAPITests(body) as unknown as APITest[];
      let failingTests: APITest[] = [];
      let silentFailTests: APITest[] = [];
      let skippedTests: APITest[] = [];
      let otherTests: APITest[] = [];
      Array.from(tests).forEach(element => {
        switch (element.status) {
          case "fail":
            failingTests.push(element);
            break;
          case "silentfail":
            silentFailTests.push(element);
            break;
          case "skip":
            skippedTests.push(element);
            break;
          default:
            otherTests.push(element);
            break;
        }
      });
      failingTests = failingTests.sort(this.sortByTestFile);
      silentFailTests = silentFailTests.sort(this.sortByTestFile);
      skippedTests = skippedTests.sort(this.sortByTestFile);
      otherTests = otherTests.sort(this.sortByTestFile);
      this.setState({
        failingTests: failingTests,
        silentFailTests: silentFailTests,
        skippedTests: skippedTests,
        otherTests: otherTests
      })
    }, this.props.task.task_id);
  }

  public render() {

    const FailedTests = () => (
      <Grid container={true} direction="column" spacing={1}>
        {this.state.failingTests.length !== 0 ?
          this.state.failingTests.map(test => (
            <Grid item={true} xs={12} key={test.test_file}>
              <Typography color="error">
                {test.test_file.split("/").pop()}
              </Typography>
            </Grid>
          )) :
          <Grid item={true} xs={12}>
            <Typography className="no-tests-text">
              No failing tests
            </Typography>
          </Grid>
        }
      </Grid>
    );

    const OtherTests = () => (
      <Card>
        <CardActions>
          <Grid container={true} onClick={this.handleOtherTestsClick} spacing={3}>
            <Grid item={true} xs={1}>
              {this.state.isShowingOtherTests ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Grid>
            <Grid item={true} xs={11}>
              <Typography>
                Other Tests
              </Typography>
            </Grid>
          </Grid>
        </CardActions>
        <Collapse in={this.state.isShowingOtherTests} timeout="auto" unmountOnExit={true}>
          <CardContent className="other-tests-list">
            {this.state.otherTests.length !== 0 && this.state.skippedTests.length !== 0 && this.state.silentFailTests.length !== 0 ?
              <Grid container={true} spacing={1}>
                {this.state.skippedTests.map(test => (
                  <Grid item={true} xs={12} key={test.test_file}>
                    <Typography className="skip">
                      {test.test_file.split("/").pop()}
                    </Typography>
                  </Grid>
                ))}
                {this.state.silentFailTests.map(test => (
                  <Grid item={true} xs={12} key={test.test_file}>
                    <Typography className="silent-fail">
                      {test.test_file.split("/").pop()}
                    </Typography>
                  </Grid>
                ))}
                {this.state.otherTests.map(test => (
                  <Grid item={true} xs={12} key={test.test_file}>
                    <Typography>
                      {test.test_file.split("/").pop()}
                    </Typography>
                  </Grid>
                ))}
              </Grid> :
              <Typography className="no-tests-text">
                No other tests
              </Typography>
            }
          </CardContent>
        </Collapse>
      </Card>
    );

    if (this.state.failingTests.length !== 0 || this.state.otherTests.length !== 0) {
      return (
        <Grid item={true} xs={12} key={this.props.task.task_id}>
          <StyledExpansionPanel className="task-panel" expanded={this.props.isCurrentTask} onClick={this.handleTaskClick}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color={this.props.status === "failed" ? "error" : "textPrimary"}>{this.props.task.display_name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container={true} spacing={2}>
                <Grid item={true} xs={12}>
                  <FailedTests />
                </Grid>
                <Grid item={true} xs={12}>
                  <OtherTests />
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </StyledExpansionPanel>
        </Grid>
      );
    } else {
      return (
        <Grid item={true} xs={12} key={this.props.task.task_id}>
          <StyledExpansionPanel className="task-panel" expanded={this.props.isCurrentTask} onClick={this.handleTaskClick}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color={this.props.status === "failed" ? "error" : "textPrimary"}>{this.props.task.display_name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography className="no-tests-text">
                No tests to show.
              </Typography>
            </ExpansionPanelDetails>
          </StyledExpansionPanel>
        </Grid>
      );
    }

  }

  private sortByTestFile(a: APITest, b: APITest) {
    const testFileA = a.test_file.split("/").pop().toUpperCase();
    const testFileB = b.test_file.split("/").pop().toUpperCase();

    if (testFileA > testFileB) {
      return 1;
    } else if (testFileA < testFileB) {
      return -1;
    } else {
      return 0;
    }
  }

  private handleTaskClick = () => {
    if (!this.props.isCurrentTask) {
      this.props.switchTask(this.props.task);
      if (this.props.onFinishStateUpdate !== null) {
        this.props.onFinishStateUpdate();
      }
    }
  }

  private handleOtherTestsClick = () => {
    this.setState((prevState, props) => ({
      isShowingOtherTests: !prevState.isShowingOtherTests
    }));
  }
}

export default TaskPanel;