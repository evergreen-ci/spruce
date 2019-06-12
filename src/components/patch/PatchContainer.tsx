import { Grid } from '@material-ui/core';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';
import { Patch } from "./Patch";

class Props {
  public client: rest.Evergreen;
}

export class PatchContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {

    return (
        <Grid className="patch-container" container={true} spacing={24}>
          <Grid item={true} xs={12}>
            <Patch client={this.props.client} />
          </Grid>
          <Grid item={true} xs={12}>
            <Patch client={this.props.client}/>
          </Grid>  
        </Grid>
    );
  }
}

export default PatchContainer;