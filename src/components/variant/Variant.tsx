import { Card, Grid, Typography } from '@material-ui/core';
import { UIBuild } from 'evergreen.js/lib/models';
import * as React from 'react';
import '../../styles.css';

interface State {
  name: string,
  statusCount: { [id: string]: number; },
}

class Props {
  public build: UIBuild;
}

export class Variant extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const statusCount = {
      "success": 0,
      "scheduled": 0,
      "dispatched": 0,
      "started": 0,
    };
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

    return (
      <Card className="variant-card">
        <Grid container={true}>
          <Grid className="success" item={true} xs={4}>
            {this.state.statusCount.success}
          </Grid>
          <Grid className="started" item={true} xs={4}>
          {this.state.statusCount.dispatched}
          </Grid>
          <Grid className="unstarted" item={true} xs={4}>
            {this.state.statusCount.scheduled}
          </Grid>
        </Grid>
        <Typography variant="body1" className="variant-title">
          {this.state.name}
        </Typography>
      </Card>
    );
  }
}

export default Variant;