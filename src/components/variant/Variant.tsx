import { Card, CardActionArea, CardContent, Grid, Typography } from '@material-ui/core';
import { UIBuild } from 'evergreen.js/lib/models';
import * as React from 'react';
import { Redirect } from 'react-router-dom';
import '../../styles.css';

interface StatusCount { [id: string]: number };

interface State {
  name: string,
  statusCount: StatusCount,
  sortedStatus: Array<{
    "status": string,
    "count": number
  }>,
  variantHasBeenClicked: boolean
}

class Props {
  public build: UIBuild;
}

export class Variant extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    const statusCount = {};
    for (const task of this.props.build.Build.tasks) {
      if (statusCount[task.status]) {
        statusCount[task.status]++;
      } else {
        statusCount[task.status] = 1;
      }
    }
    this.state = {
      name: this.props.build.Build.display_name,
      statusCount: statusCount,
      sortedStatus: this.orderByPriority(statusCount),
      variantHasBeenClicked: false,
    };
  }

  public render() {

    if (this.state.variantHasBeenClicked) {
      const url = '/build?id=' + this.props.build.Build._id; 
      return <Redirect to={url}/>
    }

    const VariantsByStatus = () => (
      <Grid container={true} spacing={1}>
        {this.state.sortedStatus.map(statusObj => (
          <Grid item={true} xs={4} key={statusObj.status}>
            <Card>
              <CardContent className={statusObj.status}>
                <Typography variant="h5">{statusObj.count}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );

    return (
      <Card className="variant-card">
        <CardActionArea onClick={this.redirectToBuild}>
          <VariantsByStatus />
          <Typography variant="body1">
            {this.state.name}
          </Typography>
        </CardActionArea>
      </Card>
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

  private orderByPriority(statusCount: StatusCount) {
    const sortedStatus = [];
    const asArray = [];
    for (const key of Object.keys(statusCount)) {
      asArray.push(key);
    }
    asArray.sort(this.compareByPriority);
    for (const sortedKey of asArray) {
      const statusObj = {
        "status": sortedKey,
        "count": statusCount[sortedKey]
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
}

export default Variant;