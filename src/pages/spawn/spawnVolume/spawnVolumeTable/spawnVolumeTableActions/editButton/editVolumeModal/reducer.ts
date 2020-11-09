import { UpdateVolumeMutationVariables } from "gql/generated/types";

type Action =
  | { type: "editExpiration"; expiration?: Date; noExpiration?: boolean }
  | { type: "setDisplayName"; name: string }
  | {
      type: "reset";
      volume: UpdateVolumeMutationVariables["UpdateVolumeInput"];
    };

export function reducer(
  state: UpdateVolumeMutationVariables["UpdateVolumeInput"],
  action: Action
) {
  switch (action.type) {
    case "editExpiration":
      return {
        ...state,
        expiration:
          action.expiration !== undefined
            ? action.expiration
            : state.expiration,
        noExpiration:
          action.noExpiration !== undefined
            ? action.noExpiration
            : state.noExpiration,
      };
    case "setDisplayName":
      return {
        ...state,
        name: action.name,
      };
    case "reset":
      return {
        ...action.volume,
      };
    default:
      throw new Error("Unknown action type");
  }
}
