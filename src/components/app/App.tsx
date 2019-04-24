import * as React from 'react';
import '../../styles.css';
import {Admin} from "../admin/admin";
import { HashRouter, NavLink, Route } from 'react-router-dom';
import {evergreen} from 'evergreen.js';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@material-ui/core';
import * as MenuIcon from '@material-ui/icons/Menu';

interface State {
  APIClient: evergreen.client;
  MenuAnchor?: HTMLElement;
}

class Props {
}

export class Evergreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // TODO: get the API client from some config
    this.state = {
      APIClient: new evergreen.client("admin", "e4f2c40463dcade5248d36434cb93bac", "http://localhost:8080/api")
    }
  }

  public render() {
    const admin = () => <Admin APIClient={this.state.APIClient}/>
    const menuOpen = Boolean(this.state.MenuAnchor);

    return (
      <div className="App">
        <HashRouter>
          <AppBar position="fixed" color="inherit" className="appBar">
            <Toolbar>
              <Typography variant="h5" color="inherit" noWrap={true}>
                Evergreen
              </Typography>
              <IconButton className="menu" id="mainAppIcon" onClick={this.openMenu}>
                <MenuIcon.default />
              </IconButton>
              <Menu id="mainAppMenu" open={menuOpen} anchorEl={this.state.MenuAnchor} anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  onClose={this.closeMenu}>
                    <MenuItem onClick={this.closeMenu}>
                      <NavLink to="/admin"> Admin page</NavLink>
                    </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          <div className="App-intro">
            <Route path="/admin" render={admin} />
          </div>
        </HashRouter>
      </div>
    );
  }

  private openMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({MenuAnchor: event.currentTarget});
  };

  private closeMenu = () => {
    this.setState({MenuAnchor: null})
  }
}

export default Evergreen;