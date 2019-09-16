import { Card, CardActionArea, CardContent, Grid, Link, Typography } from '@material-ui/core';
import {Tooltip} from "@material-ui/core"
import { GridSize } from '@material-ui/core/Grid';
import { BuildTaskCache, UIBuild } from 'evergreen.js/lib/models';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';

class StatusCounts { [id: string]: { count: number, tasks: string[]} };

interface State {
  name: string,
  sortedStatus: Array<{
    "status": string,
    "count": number,
    "tasks": string[]
  }>,
  columnsPerStatus: number,
  variantHasBeenClicked: boolean,
  isDevMode: boolean // TODO: put in context
}

class Props {
  public build: UIBuild;
  public client: rest.Evergreen;
}

export class Variant extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    const statusCounts = this.computeStatuses(this.props.build.Build.tasks);
    const uniqueStatusCount = Object.keys(statusCounts).length;
    let columnsPerStatus = 4;
    if (uniqueStatusCount === 1) {
      columnsPerStatus = 12;
    } else if (uniqueStatusCount === 2) {
      columnsPerStatus = 6;
    }
    this.state = {
      name: this.props.build.Build.display_name,
      sortedStatus: this.orderByPriority(statusCounts),
      columnsPerStatus: columnsPerStatus,
      variantHasBeenClicked: false,
      isDevMode: (process.env.NODE_ENV === "development")
    };
  }

  public render() {
    const url = (this.state.isDevMode ? '/#/build?id=' + this.props.build.Build._id : this.props.client.uiURL + "/build/" + this.props.build.Build._id );

    return (
      <Link href={url} underline={"none"}>
        <Card className="variant-card">
          <CardActionArea onClick={this.redirectToBuild}>
            <Grid container={true} spacing={1}>
              {this.state.sortedStatus.map(statusObj => (
                <Grid item={true} xs={this.state.columnsPerStatus as GridSize} key={statusObj.status}>
                  <Tooltip placement="bottom" title={ <div style={{whiteSpace: "pre-line"}}>{statusObj.tasks.join("\n")}</div> }>
                    <Card>
                      <CardContent className={statusObj.status}>
                        <Typography variant="h5">{statusObj.count}</Typography>
                      </CardContent>
                    </Card>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
            <Typography variant="body1">
              {this.state.name}
            </Typography>
          </CardActionArea>
        </Card>
      </Link>
    );
  }

  private compareByPriority(a: string, b: string) {
    const displayPriority = {
      "failed": 0,
      "timed-out": 1,
      "system-failed": 2,
      "system-unresponsive": 3,
      "setup-failed": 4,
      "success": 5,
      "started": 6,
      "dispatched": 7,
      "undispatched": 8,
      "inactive": 9,
    }
    return displayPriority[a] > displayPriority[b] ? 1 : -1;
  }

  private orderByPriority(statusCount: StatusCounts) {
    const sortedStatus = [];
    const asArray = [];
    for (const key of Object.keys(statusCount)) {
      asArray.push(key);
    }
    asArray.sort(this.compareByPriority);
    for (const sortedKey of asArray) {
      const statusObj = {
        "status": sortedKey,
        "count": statusCount[sortedKey].count,
        "tasks": statusCount[sortedKey].tasks
      };
      sortedStatus.push(statusObj);
    }
    return sortedStatus;
  }

  private redirectToBuild = () => {
    this.setState({
      variantHasBeenClicked: true
    });
  }

  private computeStatuses(tasks: BuildTaskCache[]):StatusCounts {
    const statusCounts = new StatusCounts();
    for (const task of tasks) {
      if (statusCounts[task.status]) {
        statusCounts[task.status].count++;
        statusCounts[task.status].tasks.push(task.display_name);
      } else {
        statusCounts[task.status] = { count: 1, tasks: [ task.display_name ]};
      }
    }
    return statusCounts
  }
}

export default Variant;