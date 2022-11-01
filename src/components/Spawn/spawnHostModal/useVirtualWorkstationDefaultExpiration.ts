import { useEffect } from "react";
import { usePrevious } from "hooks";
import { getDefaultExpiration } from "./getFormSchema";
import { FormState } from "./types";

interface Props {
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  formState: FormState;
  disableExpirationCheckbox: boolean;
}
export const useVirtualWorkstationDefaultExpiration = ({
  setFormState,
  formState,
  disableExpirationCheckbox,
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
