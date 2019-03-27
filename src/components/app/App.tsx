import * as React from 'react';
import './App.css';
import {Admin} from "../admin/admin";
import { HashRouter, NavLink, Route } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {evergreen} from 'evergreen.js';

function App() {
  const admin = () => <Admin APIClient={new evergreen.client("admin", "e4f2c40463dcade5248d36434cb93bac", "http://localhost:8080/api")}/>

  return (
    <div className="App">
      <HashRouter>
        <AppBar position="fixed" className="appBar">
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap={true}>
              Evergreen
            </Typography>
            <NavLink to="/admin"> Admin page</NavLink>
          </Toolbar>
        </AppBar>
        <div className="App-intro">
          <Route path="/admin" render={admin} />
        </div>
      </HashRouter>
    </div>
  );
}

export default App;