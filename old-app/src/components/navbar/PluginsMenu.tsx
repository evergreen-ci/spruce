import * as React from "react";
import { Link, Menu, MenuItem, Typography } from "@material-ui/core";

interface PluginsMenuProps {
  anchorEl: Element;
  handleClose: () => void;
  uiURL: string;
}

export const PluginsMenu: React.FC<PluginsMenuProps> = ({
  anchorEl,
  handleClose,
  uiURL
}) => {
  return (
    <Menu
      id="mainAppMenu"
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center"
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "center"
      }}
      onClose={handleClose}
    >
      <MenuItem onClick={handleClose}>
        <Link href={`${uiURL}/perfdiscovery`} underline="none">
          <Typography noWrap={true}>Performance Discovery</Typography>
        </Link>
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <Link href={`${uiURL}/perf-bb`} underline="none">
          <Typography noWrap={true}>Performance Baron</Typography>
        </Link>
      </MenuItem>
    </Menu>
  );
};
