import * as React from "react";
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import "./admin.css";
import { Card, CardContent, CardHeader, TextField, Button } from '@material-ui/core';
import {evergreen} from 'evergreen.js';
import { models } from 'evergreen.js/lib/models';

export interface Props {
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
      if (err || resp.statusCode !== 200) {
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
            <CardHeader title="Announcements" />
            <CardContent>
              <TextField label="Banner Message" value={this.state.config.banner || ""} onChange={this.setBanner()}/>
            </CardContent>
          </Card>
          <Button variant="contained" className="save" onClick={this.save()}>Save</Button>
        </main>
      </div>
    );
  };


  private setBanner = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = Object.assign({}, this.state);
    newState.config.banner = event.currentTarget.value;
    this.setState(newState);
  }

  private save = () => () => {
    this.state.APIClient.setAdminConfig((err, resp, body) => console.log(body), {banner: this.state.config.banner});
  }
}

export default Admin;