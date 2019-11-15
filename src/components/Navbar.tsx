import * as React from "react";
import { AppBar, Link, Toolbar, Typography } from "@material-ui/core";
import * as EvergreenIcon from "../assets/evergreen_green.png";
import { isDevelopment } from "../utils/isDevelopment";
import { PluginsMenu } from "./navbar/PluginsMenu";
import { DevMenu } from "./navbar/DevMenu";
import { ApiClientContext } from "../context/apiClient";

const { useContext, useState } = React;

export const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { apiClient } = useContext(ApiClientContext);
  const { uiURL } = apiClient;

  function handleClick(e: React.MouseEvent<HTMLElement>) {
    setAnchorEl(e.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <AppBar className="app-bar">
      <Toolbar>
        <img src={EvergreenIcon} className="app-icon" />
        <Link href={`${uiURL}/waterfall`} underline="none">
          <Typography noWrap={true} className="menu-option">
            Waterfall
          </Typography>
        </Link>
        <Link href={`${uiURL}/timeline`} underline="none">
          <Typography noWrap={true} className="menu-option">
            Timeline
          </Typography>
        </Link>
        <Link href={`${uiURL}/grid`} underline="none">
          <Typography noWrap={true} className="menu-option">
            Summary
          </Typography>
        </Link>
        <Link href={`${uiURL}/patches`} underline="none">
          <Typography noWrap={true} className="menu-option">
            Patches
          </Typography>
        </Link>
        <Link href={`${uiURL}/task_timing`} underline="none">
          <Typography noWrap={true} className="menu-option">
            Stats
          </Typography>
        </Link>
        <Link href={`${uiURL}/hosts`} underline="none">
          <Typography noWrap={true} className="menu-option">
            Hosts
          </Typography>
        </Link>
        <Typography noWrap={true} className="menu-option" onClick={handleClick}>
          Plugins
        </Typography>
        <PluginsMenu
          anchorEl={anchorEl}
          handleClose={handleClose}
          uiURL={uiURL}
        />
        <div className="spacer" />
        {isDevelopment() && <DevMenu apiClient={apiClient} />}
      </Toolbar>
    </AppBar>
  );
};
