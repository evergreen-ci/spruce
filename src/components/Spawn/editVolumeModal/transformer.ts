import { diff } from "deep-object-diff";
import { FormState } from "./types";

export const formToGql = (
  initialState: FormState,
  formData: FormState,
  volumeId: string
) => {
  const updatedFields: Partial<FormState> = diff(initialState, formData);
  const { expirationDetails = {} as FormState["expirationDetails"], name } =
    updatedFields;
  return {
    ...("noExpiration" in expirationDetails && {
      noExpiration: expirationDetails.noExpiration,
    }),
    ...("expiration" in expirationDetails &&
      !expirationDetails.noExpiration && {
        expiration: new Date(expirationDetails.expiration),
      }),
    ...("name" in updatedFields && { name }),
    volumeId,
  };
};
