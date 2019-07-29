import { Grid, Link, Paper } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as React from 'react';
import '../../styles.css';

interface State {
  bannerIsHidden: boolean
}

class Props {
  public message: any
  public storageKey: string
  public onFinishStateUpdate: () => void
}

export class PatchContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let shouldHideBanner = false;
    if (localStorage.getItem(this.props.storageKey) !== null) {
      shouldHideBanner = true;
    }
    this.state = {
      bannerIsHidden: shouldHideBanner
    };
  }

  public render() {

    return (
      <div className="banner-container" hidden={this.state.bannerIsHidden}>
        <Paper className="banner">
          <Grid container={true}>
            <Grid item={true} xs={11}>
              <p className="vertical-center">
                {"Welcome to the new patches page! You can opt out of this page or report bugs "}
                <Link href={"https://evergreen.mongodb.com/settings"}>here</Link>.
              </p>
            </Grid>
            <Grid item={true} xs={1}>
              <CloseIcon onClick={this.hideBanner} className="close-banner" />
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }

  private hideBanner = () => {
    localStorage.setItem(this.props.storageKey, "true");
    this.setState({
      bannerIsHidden: true
    }, this.props.onFinishStateUpdate);
  }
}

export default PatchContainer;