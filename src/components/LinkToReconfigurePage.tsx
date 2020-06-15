import React from "react";
import { paths } from "constants/routes";
import { Link } from "react-router-dom";
import { DropdownItem } from "components/ButtonDropdown";
import { Disclaimer } from "@leafygreen-ui/typography";

export const LinkToReconfigurePage: React.FC<{ patchId: string }> = ({
  patchId,
}) => (
  <Link data-cy="reconfigure-link" to={`${paths.patch}/${patchId}/configure`}>
    <DropdownItem disabled={false}>
      <Disclaimer>Reconfigure Tasks/Variants</Disclaimer>
    </DropdownItem>
  </Link>
);
