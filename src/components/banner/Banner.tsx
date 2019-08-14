import { Grid, Link, Paper, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as React from 'react';
import * as rest from "../../rest/interface";
import '../../styles.css';

interface State {
  bannerIsHidden: boolean
}

class Props {
  public client: rest.Evergreen
  public message: string
  public storageKey: string
  public showOptOut: boolean
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

    const OptOutLink = () => (
      <Typography>{"You can go back to the old interface "}<Link href={this.props.client.uiURL + "/settings"}>here</Link>.</Typography>
    )

    return (
      <div className="banner-container" hidden={this.state.bannerIsHidden}>
        <Paper className="banner">
          <Grid container={true}>
            <Grid item={true} xs={11}>
              <Typography>{this.props.message}</Typography>
              {this.props.showOptOut ? <OptOutLink /> : null}
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