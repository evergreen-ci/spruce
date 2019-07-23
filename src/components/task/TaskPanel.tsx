import { Card, CardActions, CardContent, Collapse, ExpansionPanelDetails, ExpansionPanelSummary, Grid, IconButton, Typography } from '@material-ui/core';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/styles';
// import clsx from 'clsx';
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

// const useStyles = makeStyles((theme?: Theme) =>
//   createStyles({
//     card: {
//       maxWidth: 345,
//     },
//     expand: {
//       transform: 'rotate(0deg)',
//       marginLeft: 'auto',
//       transition: theme.transitions.create('transform', {
//         duration: theme.transitions.duration.shortest,
//       }),
//     },
//     expandOpen: {
//       transform: 'rotate(180deg)',
//     },
//   }),
// );

interface State {
  hasFailingTests: boolean
  hasOtherTests: boolean
  failingTests: APITest[]
  otherTests: APITest[]
  isShowingOtherTests: boolean
}

class Props {
  public client: rest.Evergreen
  public task: APITask
  public status: string
  public switchTask: (task: APITask) => void
  public isCurrentTask: boolean
}

export class TaskPanel extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      hasFailingTests: false,
      hasOtherTests: false,
      failingTests: [],
      otherTests: [],
      isShowingOtherTests: false
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
          otherTests.push(element);
        }
      });
      failingTests.sort(this.sortByTestFile);
      otherTests.sort(this.sortByTestFile);
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
      <Grid container={true} direction="column">
        {this.state.hasFailingTests === true ?
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
        <IconButton onClick={this.handleOtherTestsClick}>
            <ExpandMoreIcon />
          </IconButton>
          <Typography>
            Other Tests
          </Typography>
        </CardActions>
        <Collapse in={this.state.isShowingOtherTests} timeout="auto" unmountOnExit={true}>
          <CardContent className="other-tests-list">
            <Grid container={true}>
              {this.state.otherTests.map(test => (
                <Grid item={true} xs={12}>
                  <Typography key={test.test_file}>
                    {test.test_file.split("/").pop()}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
    );

    if (this.state.hasFailingTests || this.state.hasOtherTests) {
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
    const testFileA = a.test_file.toUpperCase();
    const testFileB = b.test_file.toUpperCase();

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
    }  
  }

  private handleOtherTestsClick = () => {
    this.setState((prevState, props) => ({
      isShowingOtherTests: !prevState.isShowingOtherTests
    }));
  }
}

export default TaskPanel;