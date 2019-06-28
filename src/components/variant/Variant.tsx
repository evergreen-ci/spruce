import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { UIBuild } from 'evergreen.js/lib/models';
import * as React from 'react';
import '../../styles.css';

interface State {
  name: string,
  statusCount: {[id: string]: number}
}

class Props {
  public build: UIBuild;
}

export class Variant extends React.Component<Props, State> {

  private displayPriority = {
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

  constructor(props: Props) {
    super(props);
    const statusCount = {};
    for (const task of this.props.build.Build.tasks) {
      if (statusCount[task.status]) {
        statusCount[task.status] = statusCount[task.status] + 1;
      } else {
        statusCount[task.status] = 1;
      }
    }
    this.state = {
      name: this.props.build.Build.display_name,
      statusCount: statusCount,
    };
  }

  public render() {

    const VariantsByStatus = () => (
      <Grid container={true} spacing={8}>
        {this.orderByPriority().map(status => (
          <Grid item={true} xs={4} key={status}>
            <Card>
              <CardContent className={status}>
                {this.state.statusCount[status]}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );

    return (
      <Card className="variant-card">
        <VariantsByStatus />
        <Typography variant="body1" className="variant-title">
          {this.state.name}
        </Typography>
      </Card>
    );
  }

  private compareByPriority(a: any, b: any) {
    return this.displayPriority[a] - this.displayPriority[b];
  }

  private orderByPriority() {
    const sortedStatus = {[id: string]: number};
    const asArray = [];
    for(const key of this.state.statusCount) {
      asArray[asArray.length] = key
    }
    asArray.sort(this.compareByPriority);
    for(const sortedKey of asArray) {
      sortedStatus.push({
        sortedKey: this.state.statusCount[sortedKey]
      });
    }
    return sortedStatus;
  }
}

export default Variant;