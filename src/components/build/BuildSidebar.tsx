import { Grid, Typography } from '@material-ui/core';
import { BuildTaskCache, UIVersion } from 'evergreen.js/lib/models';
import * as React from 'react';
import '../../styles.css';

interface State {
  tasks: BuildTaskCache[]
}

class Props {
  public patch: UIVersion
}

export class BuildSidebar extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    if (this.props.patch !== null) {
      this.state = {
        tasks: this.props.patch.Builds[0].Build.tasks,
      };
    }
  }

  public render() {

    const tasks = this.state.tasks.map(taskObj => (
      <Grid item={true} xs={12} key={taskObj.id}>
        <Typography>{taskObj.display_name}</Typography>
      </Grid>
    ));

    return (
      <Grid container={true} spacing={24} className="sidebar">
        <Grid item={true} xs={12} />
        <Grid item={true} xs={12}>
          <Typography>Patch {this.props.patch.Version.order} by {this.props.patch.Version.author}</Typography>
          <Typography>{this.props.patch.Builds[0].Build.display_name}</Typography>
        </Grid>
        {tasks}
      </Grid>
    );
  }
}

export default BuildSidebar;