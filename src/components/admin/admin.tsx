import * as React from "react";
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import '../../styles.css';
import {evergreen} from 'evergreen.js';
import { models } from 'evergreen.js/lib/models';
import { Button, Card, CardContent, CardActions, Grid } from '@material-ui/core';
import { BannerCard } from './banner';

interface Props {
  APIClient: evergreen.client;
}

interface State {
  config?: models.AdminSettings;
  APIClient: evergreen.client;
}

export class Admin extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      config: new models.AdminSettings,
      APIClient: props.APIClient
    };
  }

  public componentDidMount() {
    this.state.APIClient.getAdminConfig((err, resp, body) => {
      if (err || resp.statusCode >= 300) {
        console.log("got error " + err + " with status " + status);
        return;
      }
      this.setState({
        APIClient: this.props.APIClient,
        config: models.ConvertToAdminSettings(body),
      });
    })
  }

  public render() {
    return (
      <div className="root">
        <CssBaseline />
        <Drawer
          className="drawer"
          variant="permanent"
          anchor="left"
        >
          <div />
          <Divider />
          <List>
            {['section1', 'section2', 'section3', 'section4'].map((text, index) => (
              <ListItem button={true} key={text}>
                <ListItemIcon><div /></ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['section5', 'section6', 'section7'].map((text, index) => (
              <ListItem button={true} key={text}>
                <ListItemIcon><div /></ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <main className="content">
          <div />

          <Card>
            
            <CardContent>
              <Grid container={true} spacing={24}>
                <Grid item={true} xs={6}>
                  <BannerCard banner={this.state.config.banner} onBannerTextChange={this.updateSingleConfigField("banner")} />
                </Grid>
                <Grid item={true} xs={6}>
                  <Card>
                    <CardContent>
                      Some other component here
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>

            <CardActions>
              <Button variant="outlined" className="save" onClick={this.save()}>Save</Button>
            </CardActions>
          </Card>

        </main>
      </div>
    );
  };

  private updateSingleConfigField = (fieldName:string) => {
    return (value:string) => {
      const newState = Object.assign({}, this.state);
      newState.config[fieldName] = value;
      this.setState(newState);
    }
  }

  private save = () => () => {
    this.state.APIClient.setAdminConfig((err, resp, body) => console.log(body), {banner: this.state.config.banner});
  }
}

export default Admin;