import { AppBar, createMuiTheme, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import * as MenuIcon from '@material-ui/icons/Menu';
import { ThemeProvider } from '@material-ui/styles';
import * as React from 'react';
import { HashRouter, NavLink, Route } from 'react-router-dom';
import { ClientConfig, IsValidConfig } from '../../models/client_config';
import * as rest from "../../rest/interface";
import '../../styles.css';
import { Admin } from "../admin/Admin";
import { BuildView } from '../build/BuildView';
import ConfigDrop from '../configdrop/ConfigDrop';
import { Login, UserContextConsumer } from "../login/Login";
import { PatchContainer } from '../patch/PatchContainer';

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      "Akzidenz",
      "Helvetica Neue",
      "Helvetica",
      "Arial",
      "sans-serif"
    ].join(','),
    fontSize: 14
  },
});

interface State {
  APIClient: rest.Evergreen;
  MenuAnchor?: HTMLElement;
  username?: string;
}

class Props {
}

const configPath = "/config.json";

export class Evergreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      APIClient: rest.EvergreenClient("", "", "", "", true),
    }
    this.tryLoadConfig();
  }

  public render() {
    const admin = () => <Admin APIClient={this.state.APIClient} />
    const patches = () => <PatchContainer client={this.state.APIClient} username={this.state.username} onFinishStateUpdate={null} />
    const config = () => <ConfigDrop updateClientConfig={this.updateConfig} onLoadFinished={null} />
    const build = () => <BuildView client={this.state.APIClient} />
    const menuOpen = Boolean(this.state.MenuAnchor);

    return (
      <ThemeProvider theme={theme}>
        <div className="app">
          <UserContextConsumer>
            {() => {
              return (
                <HashRouter>
                  <AppBar position="fixed" className="app-bar">
                    <Toolbar>
                      <img src={"https://evergreen.mongodb.com/static/img/evergreen_green.png"} className="app-icon" />
                      <Typography variant="h5" color="inherit" noWrap={true}>
                        Evergreen
                      </Typography>
                      <div className="spacer" />
                      <IconButton className="menu" color="inherit" id="mainAppIcon" onClick={this.openMenu}>
                        <MenuIcon.default />
                      </IconButton>
                      <Menu id="mainAppMenu" open={menuOpen} anchorEl={this.state.MenuAnchor}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right', }}
                        onClose={this.closeMenu}>
                        <MenuItem />
                        <MenuItem onClick={this.closeMenu}>
                          <NavLink to="/admin"> Admin Page</NavLink>
                        </MenuItem>
                        <MenuItem onClick={this.closeMenu}>
                          <NavLink to="/patches">My Patches</NavLink>
                        </MenuItem>
                        <MenuItem onClick={this.closeMenu}>
                          <NavLink to="/config">Upload Config File</NavLink>
                        </MenuItem>
                      </Menu>
                      <Login client={this.state.APIClient} updateUsername={this.updateUsername} />
                    </Toolbar>
                  </AppBar>
                  <div className="app-intro">
                    <Route path="/admin" render={admin} />
                    <Route path="/config" render={config} />
                    <Route path="/patches" render={patches} />
                    <Route path="/build" render={build} />
                  </div>
                </HashRouter>
              )
            }}
          </UserContextConsumer>
        </div>
      </ThemeProvider>
    );
  }

  private openMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ MenuAnchor: event.currentTarget });
  };

  private closeMenu = () => {
    this.setState({ MenuAnchor: null });
  }

  private updateConfig = (configObj: ClientConfig) => {
    this.setState({
      APIClient: rest.EvergreenClient(configObj.api_url, configObj.ui_url),
    });
  }

  private updateUsername = (username: string) => {
    this.setState({
      username: username
    });
  }

  private tryLoadConfig = () => {
    fetch(configPath).then((resp: Response) => {
      resp.json().then((config: object) => {
        if (IsValidConfig(config)) {
          this.updateConfig(config as ClientConfig);
        } else {
          console.log("Config is missing required fields");
        }
      }, (reason: any) => {
        console.log("Error parsing config. You may need to manually drop a config file. Error: " + reason);
      });
    });
  }
}

export default Evergreen;