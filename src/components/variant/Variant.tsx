import { Card, Grid, Typography } from '@material-ui/core';
import * as React from 'react';
import '../../styles.css';

class Props {
  public name: string;
}

export class Variant extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {

    return (
      <Card className="variant-card">
        <Grid container={true}>
          <Grid className="success" item={true} xs={4}>
            Green
          </Grid>
          <Grid className="started" item={true} xs={4}>
            Yellow
          </Grid>
          <Grid className="unstarted" item={true} xs={4}>
            Gray
          </Grid>
        </Grid>
        <Typography variant="body1" className="variant-title">
          {this.props.name}
        </Typography>      
      </Card>
    );
  }
}

export default Variant;