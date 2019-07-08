import { Typography } from '@material-ui/core';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';

// tslint:disable-next-line: no-empty-interface
interface State {
}

class Props {
  public client: rest.Evergreen;
}

export class TaskView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  public render() {

    return (
      <div>
        <Typography>Task View</Typography>
      </div>
    );
  }
}

export default TaskView;