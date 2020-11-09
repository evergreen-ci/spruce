import React from "react";
import { Disclaimer } from "@leafygreen-ui/typography";
import { useHistory } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import { DropdownItem } from "components/ButtonDropdown";
import { paths } from "constants/routes";

export const LinkToReconfigurePage: React.FC<{
  patchId: string;
  disabled?: boolean;
}> = ({ patchId, disabled = false }) => {
  const patchAnalytics = usePatchAnalytics();

  const router = useHistory();

  return (
    <DropdownItem
      data-cy="reconfigure-link"
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          patchAnalytics.sendEvent({ name: "Click Reconfigure Link" });
          router.push(`${paths.patch}/${patchId}/configure`);
        }
      }}
    >
      <Disclaimer>Reconfigure tasks/variants</Disclaimer>
    </DropdownItem>
  );
};
