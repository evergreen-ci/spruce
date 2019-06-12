import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import * as MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react';
import { HashRouter, NavLink, Route } from 'react-router-dom';
import * as rest from "../../rest/interface";
import '../../styles.css';
import { Admin } from "../admin/Admin";
import { Login } from "../login/Login";
import { PatchContainer } from '../patch/PatchContainer';

interface State {
  APIClient: rest.Evergreen;
  MenuAnchor?: HTMLElement;
}

class Props {
}

export class Evergreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // TODO: get the API client from some config
    this.state = {
      APIClient: rest.EvergreenClient("admin", "e4f2c40463dcade5248d36434cb93bac", "http://localhost:8080/api"),
    }
  }

  public render() {
    const admin = () => <Admin APIClient={this.state.APIClient} />
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
                  <NavLink to="/admin"> Admin page</NavLink>
                </MenuItem>
              </Menu>
              <Login client={this.state.APIClient} />
            </Toolbar>
          </AppBar>
          <div className="App-intro">
            <Route path="/admin" render={admin} />
          </div>
        </HashRouter>
        <PatchContainer client={this.state.APIClient} />
      </div>
    );
  }

  private openMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ MenuAnchor: event.currentTarget });
  };

  private closeMenu = () => {
    this.setState({ MenuAnchor: null })
  }
}

export default Evergreen;