import { Grid } from '@material-ui/core';
import { ConvertToPatches, UIPatch } from 'evergreen.js/lib/models';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';
import { Patch } from "./Patch";

interface State {
  patches: UIPatch[]
}

class Props {
  public client: rest.Evergreen;
}

export class PatchContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      patches: [],
    };
  }

  public componentDidMount() {
    this.loadPatches();
  }

  public render() {

    const Patches = () => (
      <Grid className="patch-container" container={true} spacing={24}>
        {this.state.patches.map(patch => (
          <Grid item={true} xs={12} key={patch.Patch.Id}>
            <Patch UIPatch={patch} />
          </Grid>
        ))}
      </Grid>
    );

    return (
      <div>
        <div className="patch-search-bar">Insert patch search bar here</div>
        <Patches />
      </div>
    );
  }

  private loadPatches() {
    this.props.client.getPatches((err, resp, body) => {
      const patches = ConvertToPatches(JSON.stringify(resp.body)).UIPatches
      this.setState({ patches: patches });
    }, this.props.client.username);
  }
}

export default PatchContainer;