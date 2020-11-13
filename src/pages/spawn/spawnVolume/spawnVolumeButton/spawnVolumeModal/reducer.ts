import { SpawnVolumeMutationVariables } from "gql/generated/types";

export const initialState: SpawnVolumeMutationVariables["SpawnVolumeInput"] = {
  availabilityZone: "",
  size: 500,
  type: "gp2",
  expiration: null,
  noExpiration: true,
  host: "",
};

type Action =
  | { type: "setSize"; data: number }
  | { type: "setAvailabilityZone"; data: string }
  | { type: "editExpiration"; expiration?: Date; noExpiration?: boolean }
  | { type: "setHost"; hostId: string }
  | { type: "setType"; typeId: string };

export function reducer(
  state: SpawnVolumeMutationVariables["SpawnVolumeInput"],
  action: Action
) {
  switch (action.type) {
    case "setSize":
      return { ...state, size: action.data };
    case "setAvailabilityZone":
      return { ...state, availabilityZone: action.data };
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
    case "setType":
      return {
        ...state,
        type: action.typeId,
      };
    case "setHost":
      return {
        ...state,
        host: action.hostId,
      };
    default:
      throw new Error("Unknown action type");
  }
}
