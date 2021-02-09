import React from "react";
import { useHistory } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import { DropdownItem } from "components/ButtonDropdown";
import { getPatchRoute } from "constants/routes";

export const LinkToReconfigurePage: React.FC<{
  patchId: string;
  disabled?: boolean;
}> = ({ patchId, disabled }) => {
  const patchAnalytics = usePatchAnalytics();

  const router = useHistory();

  return (
    <DropdownItem
      data-cy="reconfigure-link"
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          patchAnalytics.sendEvent({ name: "Click Reconfigure Link" });
          router.push(getPatchRoute(patchId, { configure: true }));
        }
      }}
    >
      Reconfigure tasks/variants
    </DropdownItem>
  );
};
