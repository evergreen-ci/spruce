import { Card, CardActions, CardContent, Collapse, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Link, Typography } from '@material-ui/core';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import * as Icon from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';
import { APITask, APITest, ConvertToAPITests } from 'evergreen.js/lib/models';
import * as moment from 'moment';
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
  public onSwitchTask: (task: APITask) => void
  public onSwitchTest: (test: APITest) => void
  public isCurrentTask: boolean
  public onFinishStateUpdate: () => void
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

    const TaskDetails = () => (
      <div>
        <Typography>
          <Icon.ScheduleOutlined className="task-detail-icon" />
          {this.stringifyMilliseconds(this.props.task.time_taken_ms, true, true)}
        </Typography>
        <Typography>
          <Icon.HourglassEmptyOutlined className="task-detail-icon" />
          {this.stringifyMilliseconds(this.props.task.expected_duration_ms, true, true) + " on base commit"}
        </Typography>
        <Typography>
          <Icon.DesktopMacOutlined className="task-detail-icon" />
          <Link href={this.props.client.uiURL + "/host/" + this.props.task.host_id}>
            {this.props.task.host_id}
          </Link>
        </Typography>
        <Typography>
          <Icon.DateRangeOutlined className="task-detail-icon" />
          {" Started on " + moment(this.props.task.start_time as Date).format("lll")}
        </Typography>
        <Typography>
          <Icon.DateRangeOutlined className="task-detail-icon" />
          {" Finished on " + moment(this.props.task.finish_time as Date).format("lll")}
        </Typography>
      </div>
    );

    const FailedTests = () => (
      <Grid container={true} direction="column" spacing={1}>
        {this.state.failingTests.length !== 0 ?
          this.state.failingTests.map((test, index) => (
            <Grid item={true} xs={12} key={test.test_file}>
              <Typography color="error" onClick={this.handleTestClick} id={"failing-" + index}>
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
          <Grid container={true} onClick={this.handleExpandClick} spacing={3}>
            <Grid item={true} xs={1}>
              {this.state.isShowingOtherTests ? <Icon.ExpandLess /> : <Icon.ExpandMore />}
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
            {this.state.otherTests.length !== 0 || this.state.skippedTests.length !== 0 || this.state.silentFailTests.length !== 0 ?
              <Grid container={true} spacing={1}>
                {this.state.skippedTests.map((test, index) => (
                  <Grid item={true} xs={12} key={test.test_file}>
                    <Typography className="skip" onClick={this.handleTestClick} id={"skipped-" + index}>
                      {test.test_file.split("/").pop()}
                    </Typography>
                  </Grid>
                ))}
                {this.state.silentFailTests.map((test, index) => (
                  <Grid item={true} xs={12} key={test.test_file}>
                    <Typography className="silent-fail" onClick={this.handleTestClick} id={"silent-" + index}>
                      {test.test_file.split("/").pop()}
                    </Typography>
                  </Grid>
                ))}
                {this.state.otherTests.map((test, index) => (
                  <Grid item={true} xs={12} key={test.test_file}>
                    <Typography onClick={this.handleTestClick} id={"other-" + index}>
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
          <StyledExpansionPanel className="task-panel" expanded={this.props.isCurrentTask}>
            <ExpansionPanelSummary expandIcon={<Icon.ExpandMore />} onClick={this.handleTaskClick}>
              <Typography className="task-detail-name">{this.props.task.display_name}</Typography>
              <div className="task-detail-status-parent">
                <Typography className={this.props.task.status + " task-detail-status-child"}>{this.props.task.status.toUpperCase()}</Typography>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container={true} spacing={2}>
                <Grid item={true} xs={12}>
                  <TaskDetails />
                </Grid>
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
          <StyledExpansionPanel className="task-panel" expanded={this.props.isCurrentTask}>
            <ExpansionPanelSummary expandIcon={<Icon.ExpandMore />} onClick={this.handleTaskClick}>
              <Typography color={this.props.status === "failed" ? "error" : "textPrimary"}>{this.props.task.display_name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TaskDetails />
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
    this.props.onSwitchTask(this.props.task);
    if (this.props.onFinishStateUpdate !== null) {
      this.props.onFinishStateUpdate();
    }
  }

  private handleExpandClick = () => {
    this.setState((prevState, props) => ({
      isShowingOtherTests: !prevState.isShowingOtherTests
    }));
  }

  private handleTestClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const testArray = event.currentTarget.id.split("-")[0]
    const testIndex = event.currentTarget.id.split("-")[1];
    switch (testArray) {
      case "failing":
        this.props.onSwitchTest(this.state.failingTests[testIndex]);
        break;
      case "skipped":
        this.props.onSwitchTest(this.state.skippedTests[testIndex]);
        break;
      case "silent":
        this.props.onSwitchTest(this.state.silentFailTests[testIndex]);
        break;
      default:
        this.props.onSwitchTest(this.state.otherTests[testIndex]);
        break;
    }
  }

  // stringifyNanoseconds takes an integer count of nanoseconds and
  // returns it formatted as a human readable string, like "1h32m40s"
  // If skipDayMax is true, then durations longer than 1 day will be represented
  // in hours. Otherwise, they will be displayed as '>=1 day'
  private stringifyMilliseconds = (input: string | number, skipDayMax: boolean, skipSecMax: boolean) => {
    const MS_PER_SEC = 1000
    const MS_PER_MINUTE = MS_PER_SEC * 60;
    const MS_PER_HOUR = MS_PER_MINUTE * 60;

    if (typeof(input) === "string") {
      return "unknown";
    } else if (typeof(input) === "number") {
      if (input === 0) {
        return "0 seconds";
      } else if (input < 0) {
        return "unknown";
      } else if (input < MS_PER_SEC) {
        if (skipSecMax) {
          return input + " ms";
        } else {
          return "< 1 second"
        }
      } else if (input < MS_PER_MINUTE) {
        return Math.floor(input / MS_PER_SEC) + " seconds";
      } else if (input < MS_PER_HOUR) {
        return Math.floor(input / MS_PER_MINUTE) + "m " + Math.floor((input % MS_PER_MINUTE) / MS_PER_SEC) + "s";
      } else if (input < MS_PER_HOUR * 24 || skipDayMax) {
        return Math.floor(input / MS_PER_HOUR) + "h " +
          Math.floor((input % MS_PER_HOUR) / MS_PER_MINUTE) + "m " +
          Math.floor((input % MS_PER_MINUTE) / MS_PER_SEC) + "s";
      } else {
        return ">= 1 day";
      }
    } else {
      return "unknown";
    }
}
}

export default TaskPanel;