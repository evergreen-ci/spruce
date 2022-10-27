import { useEffect } from "react";
import { usePrevious } from "hooks";
import { getDefaultExpiration } from "./getFormSchema";

export const useVirtualWorkstationDefaultExpiration = ({
  setFormState,
  formState,
  disableExpirationCheckbox,
}) => {
  const isVirtualWorkstation = !!formState?.distro?.isVirtualWorkstation;
  // Default virtual workstations to unexpirable upon selection if possible
  const prevIsVirtualWorkStation = usePrevious(isVirtualWorkstation);
  useEffect(() => {
    if (isVirtualWorkstation && !prevIsVirtualWorkStation) {
      setFormState({
        ...formState,
        expirationDetails: {
          noExpiration: isVirtualWorkstation && disableExpirationCheckbox,
          expiration: getDefaultExpiration(),
        },
      });
    }
  }, [
    disableExpirationCheckbox,
    formState,
    isVirtualWorkstation,
    prevIsVirtualWorkStation,
    setFormState,
  ]);
};
