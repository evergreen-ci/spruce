import * as React from "react";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import * as MenuIcon from "@material-ui/icons/Menu";
import { NavLink } from "react-router-dom";
import { Login } from "../login/Login";
import { Evergreen } from "../../rest/interface";
import { UserContext } from "../../context/user";

const { useState, useContext } = React;

interface DevMenuProps {
  apiClient: Evergreen;
}

// The dev menu renders a dropdown menu that is only available in dev mode
// It allows users to upload a config file which determines the environment
// TODO: use env-cmd to set environment and then delete this component
export const DevMenu: React.FC<DevMenuProps> = ({ apiClient }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    actions: { setUsername }
  } = useContext(UserContext);

  function handleOpenMenu(e: React.MouseEvent<HTMLElement>) {
    setAnchorEl(e.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div>
      <IconButton
        className="menu"
        color="inherit"
        id="mainAppIcon"
        onClick={handleOpenMenu}
      >
        <MenuIcon.default />
      </IconButton>
      <Menu
        id="mainAppMenu"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <NavLink to="/admin"> Admin Page</NavLink>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <NavLink to="/patches/user">My Patches</NavLink>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <NavLink to="/config">Upload Config File</NavLink>
        </MenuItem>
      </Menu>
      <Login client={apiClient} updateUsername={setUsername} />
    </div>
  );
};
