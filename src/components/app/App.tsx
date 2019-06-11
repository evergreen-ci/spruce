import { AppBar, Grid, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import * as MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react';
import { HashRouter, NavLink, Route } from 'react-router-dom';
import * as rest from "../../rest/interface";
import '../../styles.css';
import { Admin } from "../admin/admin";
import { Login } from "../login/login";
import { Patch } from "../patch/patch";

interface State {
  APIClient: rest.Evergreen;
  MenuAnchor?: HTMLElement;
  Patches: JSON;
}

class Props {
}

export class Evergreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // TODO: get the API client from some config
    this.state = {
      APIClient: rest.EvergreenClient("admin", "e4f2c40463dcade5248d36434cb93bac", "http://localhost:8080/api"),
      Patches: null
    }
  }

  public getDummyData() {
    this.state.APIClient.getRecentTasks(() => {
      this.setState({
        Patches: null
      })
    }, true, 20)
  }

  public render() {
    const admin = () => <Admin APIClient={this.state.APIClient} />
    const menuOpen = Boolean(this.state.MenuAnchor);

    return (
      <div className="App">
        <HashRouter>
          <AppBar position="fixed" className="appBar">
            <Toolbar>
              <Typography variant="h5" className="title" noWrap={true}>
                Evergreen
              </Typography>
              <IconButton className="menu" id="mainAppIcon" onClick={this.openMenu}>
                <MenuIcon.default />
              </IconButton>
              <Menu id="mainAppMenu" open={menuOpen} anchorEl={this.state.MenuAnchor} 
                anchorOrigin={{vertical: 'top', horizontal: 'right',}}
                transformOrigin={{vertical: 'top', horizontal: 'right',}}
                onClose={this.closeMenu}>
                <MenuItem onClick={this.closeMenu}>
                  <NavLink to="/admin"> Admin page</NavLink>
                </MenuItem>
                <MenuItem>
                  <Login/>
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          <div className="App-intro">
            <Route path="/admin" render={admin} />
          </div>
        </HashRouter>
        <div className="searchBar">Insert search bar here</div>
        <Grid className="patchContainer" container={true} spacing={24}>
          <Grid item={true} xs={12}>
          <Patch name="Patch 1" month="June" day={23} time="11:30 AM" project="Evergreen" patch="3d3faf"/>
          </Grid>
          <Grid item={true} xs={12}>
            <Patch name="Patch 2" month="June" day={23} time="11:11 AM" project="Evergreen" patch="3d3fa0"/>
          </Grid>  
        </Grid>
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