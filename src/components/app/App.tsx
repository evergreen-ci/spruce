import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import * as MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react';
import { HashRouter, NavLink, Route } from 'react-router-dom';
import { ClientConfig, IsValidConfig } from '../../models/client_config';
import * as rest from "../../rest/interface";
import '../../styles.css';
import { Admin } from "../admin/Admin";
import ConfigDrop from '../configdrop/ConfigDrop';
import { Login } from "../login/Login";
import { PatchContainer } from '../patch/PatchContainer';
import { TaskView } from '../task/TaskView';

interface State {
  APIClient: rest.Evergreen;
  MenuAnchor?: HTMLElement;
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
    const patches = () => <PatchContainer client={this.state.APIClient} />
    const config = () => <ConfigDrop updateClientConfig={this.updateConfig} onLoadFinished={null}/>
    const task = () => <TaskView client={this.state.APIClient} />
    const menuOpen = Boolean(this.state.MenuAnchor);

    return (
      <div className="App">
        <HashRouter>
          <AppBar position="fixed" className="app-bar">
            <Toolbar>
              <Typography variant="h5" color="inherit" noWrap={true}>
                Evergreen
              </Typography>
              <div className="spacer" /> 
              <IconButton className="menu" color="inherit" id="mainAppIcon" onClick={this.openMenu}>
                <MenuIcon.default />
              </IconButton>
              <Menu id="mainAppMenu" open={menuOpen} anchorEl={this.state.MenuAnchor} 
                anchorOrigin={{vertical: 'top', horizontal: 'right',}}
                transformOrigin={{vertical: 'top', horizontal: 'right',}}
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
                <MenuItem onClick={this.closeMenu}>
                  <NavLink to="/task">Task View (Temp)</NavLink> 
                </MenuItem>
              </Menu>
              <Login client={this.state.APIClient} />
            </Toolbar>
          </AppBar>
          <div className="App-intro">
            <Route path="/admin" render={admin} />
            <Route path="/config" render={config} />
            <Route path="/patches" render={patches} />
            <Route path="/task" render={task} />
          </div>
        </HashRouter>
      </div>
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
      APIClient: rest.EvergreenClient(configObj.user, configObj.api_key, configObj.api_url, configObj.ui_url),
    });
  }

  private tryLoadConfig = () => {
    fetch(configPath).then((resp: Response) => {
        resp.json().then( (config: object) => {
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