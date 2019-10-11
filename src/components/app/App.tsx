import bugsnag, { Bugsnag } from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';
import { AppBar, createMuiTheme, IconButton, Link, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import * as MenuIcon from '@material-ui/icons/Menu';
import { ThemeProvider } from '@material-ui/styles';
import { AxiosResponse } from 'axios';
import * as models from 'evergreen.js/lib/models';
import * as React from 'react';
import { HashRouter, NavLink, Route } from 'react-router-dom';
import * as EvergreenIcon from "../../assets/evergreen_green.png"
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
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: "#3E4347",
        boxShadow: "none"
      }
    }
  }
});

interface State {
  APIClient: rest.Evergreen;
  PluginMenuAnchor?: HTMLElement;
  MenuAnchor?: HTMLElement;
  username?: string;
  bugsnag?: Bugsnag.Client;
  isDevMode: boolean;
}

class Props {
}

const configPath = "/config.json";

export class Evergreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      APIClient: rest.EvergreenClient("", "", "", ""),
      isDevMode: (process.env.NODE_ENV === "development")
    }
    this.tryLoadConfig();
  }

  public render() {
    const admin = () => <Admin APIClient={this.state.APIClient} />
    const patches = () => <PatchContainer client={this.state.APIClient} username={this.state.username} onFinishStateUpdate={null} />
    const config = () => <ConfigDrop updateClientConfig={this.updateConfig} onLoadFinished={null} />
    const build = () => <BuildView client={this.state.APIClient} />
    let ErrorHandler: any;
    const pluginMenuIsOpen = Boolean(this.state.PluginMenuAnchor);
    const menuIsOpen = Boolean(this.state.MenuAnchor);
    let mainAppMenu = <div />;
    if (this.state.isDevMode) {
      mainAppMenu = (<div>
        <IconButton className="menu" color="inherit" id="mainAppIcon" onClick={this.openMenu}>
          <MenuIcon.default />
        </IconButton>
        <Menu id="mainAppMenu" open={menuIsOpen} anchorEl={this.state.MenuAnchor}
          anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
          transformOrigin={{ vertical: 'top', horizontal: 'right', }}
          onClose={this.closeMenu}>
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
      </div>
      )
    }
    let app =
      <ThemeProvider theme={theme}>
        <div className="app">
          <UserContextConsumer>
            {() => {
              return (
                <HashRouter>
                  <AppBar className="app-bar" >
                    <Toolbar>
                      <img src={EvergreenIcon} className="app-icon" />
                      <Link href={this.state.APIClient.uiURL + "/waterfall"} underline="none">
                        <Typography noWrap={true} className="menu-option">
                          Waterfall
                      </Typography>
                      </Link>
                      <Link href={this.state.APIClient.uiURL + "/timeline"} underline="none">
                        <Typography noWrap={true} className="menu-option">
                          Timeline
                      </Typography>
                      </Link>
                      <Link href={this.state.APIClient.uiURL + "/grid"} underline="none">
                        <Typography noWrap={true} className="menu-option">
                          Summary
                      </Typography>
                      </Link>
                      <Link href={this.state.APIClient.uiURL + "/patches"} underline="none">
                        <Typography noWrap={true} className="menu-option">
                          Patches
                      </Typography>
                      </Link>
                      <Link href={this.state.APIClient.uiURL + "/task_timing"} underline="none">
                        <Typography noWrap={true} className="menu-option">
                          Stats
                      </Typography>
                      </Link>
                      <Link href={this.state.APIClient.uiURL + "/hosts"} underline="none">
                        <Typography noWrap={true} className="menu-option">
                          Hosts
                      </Typography>
                      </Link>
                      <Typography noWrap={true} className="menu-option" onClick={this.openPluginMenu}>
                        Plugins
                    </Typography>
                      <Menu id="mainAppMenu" open={pluginMenuIsOpen} anchorEl={this.state.PluginMenuAnchor}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
                        transformOrigin={{ vertical: 'bottom', horizontal: 'center', }}
                        onClose={this.closePluginMenu}>
                        <MenuItem onClick={this.closePluginMenu}>
                          <Link href={this.state.APIClient.uiURL + "/perfdiscovery"} underline="none">
                            <Typography noWrap={true}>
                              Performance Discovery
                          </Typography>
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={this.closePluginMenu}>
                          <Link href={this.state.APIClient.uiURL + "/perf-bb"} underline="none">
                            <Typography noWrap={true}>
                              Performance Baron
                          </Typography>
                          </Link>
                        </MenuItem>
                      </Menu>
                      <div className="spacer" />
                      {mainAppMenu}
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
    if (this.state.bugsnag) {
      ErrorHandler = this.state.bugsnag.getPlugin("react");
      app = <ErrorHandler> {app} </ErrorHandler>
    }

    return app;
  }

  private openPluginMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ PluginMenuAnchor: event.currentTarget });
  };

  private closePluginMenu = () => {
    this.setState({ PluginMenuAnchor: null });
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

    this.state.APIClient.getAdminConfig().then((resp: AxiosResponse<any>) => {
      let bugsnagClient: Bugsnag.Client;
      if (resp.data) {
        const settings = models.ConvertToAdminSettings(resp.data)
        if (settings.bugsnag) {
          bugsnagClient = bugsnag(settings.bugsnag);
          bugsnagClient.use(bugsnagReact, React);
        }

        this.setState({
          bugsnag: bugsnagClient
        })
      }
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