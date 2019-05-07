import { Button, Card, CardActions, CardContent, Grid } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {client as evergreenClient} from 'evergreen.js';
import * as models from 'evergreen.js/lib/models';
import * as React from "react";
import '../../styles.css';
import { BannerCard } from './banner';

interface Props {
  APIClient: evergreenClient;
}

interface State {
  config?: models.AdminSettings;
  APIClient: evergreenClient;
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
            {["Banner"].map((text, index) => (
              <ListItem href="" button={true} key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
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