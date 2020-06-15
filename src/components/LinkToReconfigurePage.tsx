import React from "react";
import { paths } from "constants/routes";
import { Link } from "react-router-dom";
import { DropdownItem } from "components/ButtonDropdown";
import { Disclaimer } from "@leafygreen-ui/typography";
import { usePatchAnalytics } from "analytics";

export const LinkToReconfigurePage: React.FC<{
  patchId: string;
}> = ({ patchId }) => {
  const patchAnalytics = usePatchAnalytics();
  return (
    <Link
      onClick={() => {
        patchAnalytics.sendEvent({ name: "Click Reconfigure Link" });
      }}
      data-cy="reconfigure-link"
      to={`${paths.patch}/${patchId}/configure`}
    >
      <DropdownItem disabled={false}>
        <Disclaimer>Reconfigure Tasks/Variants</Disclaimer>
      </DropdownItem>
    </Link>
  );
};
