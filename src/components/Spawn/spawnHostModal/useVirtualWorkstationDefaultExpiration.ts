import { useEffect } from "react";
import { usePrevious } from "hooks";
import { getDefaultExpiration } from "../utils";
import { FormState } from "./types";

interface Props {
  setFormState: (formState: FormState) => void;
  formState: FormState;
  disableExpirationCheckbox: boolean;
}
export const useVirtualWorkstationDefaultExpiration = ({
  disableExpirationCheckbox,
  formState,
  setFormState,
}: Props) => {
  const isVirtualWorkstation = !!formState?.distro?.isVirtualWorkstation;
  // Default virtual workstations to unexpirable upon selection if possible
  const prevIsVirtualWorkStation = usePrevious(isVirtualWorkstation);
  useEffect(() => {
    if (isVirtualWorkstation && !prevIsVirtualWorkStation) {
      setFormState({
        ...formState,
        expirationDetails: {
          noExpiration: isVirtualWorkstation && !disableExpirationCheckbox,
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
