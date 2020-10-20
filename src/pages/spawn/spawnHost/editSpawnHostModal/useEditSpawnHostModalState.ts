import { useReducer } from "react";
import { ExpirationDateType } from "components/Spawn/ExpirationField";
import { InstanceTag } from "gql/generated/types";
import { MyHost } from "types/spawn";
import { UserTagsData, VolumesData } from "../fields";

export interface editSpawnHostStateType {
  expiration?: Date;
  noExpiration: boolean;
  displayName?: string;
  instanceType?: string;
  volumeId?: string;
  addedInstanceTags?: InstanceTag[];
  deletedInstanceTags?: InstanceTag[];
}

export const useEditSpawnHostModalState = (host: MyHost) => ({
  reducer: useReducer(reducer, host, init),
  defaultEditSpawnHostState: init(host) as editSpawnHostStateType,
});

const init = (host: MyHost) => ({
  displayName: host.displayName,
  expiration: host.expiration,
  noExpiration: host.noExpiration,
  instanceType: host.instanceType,
  volumeId: "",
  addedInstanceTags: [],
  deletedInstanceTags: [],
});

const reducer = (state: editSpawnHostStateType, action: Action) => {
  switch (action.type) {
    case "reset":
      return init(action.host);
    case "editHostName":
      return { ...state, displayName: action.displayName };
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
    case "editInstanceType":
      return { ...state, instanceType: action.instanceType };
    case "editVolumes":
      return { ...state, volumeId: action.volumeId };
    case "editInstanceTags":
      return {
        ...state,
        deletedInstanceTags: action.deletedInstanceTags,
        addedInstanceTags: action.addedInstanceTags,
      };
    default:
      throw new Error();
  }
};

type Action =
  | { type: "editInstanceType"; instanceType: string }
  | { type: "editHostName"; displayName: string }
  | { type: "reset"; host: MyHost }
  | ({ type: "editExpiration" } & ExpirationDateType)
  | ({ type: "editInstanceTags" } & UserTagsData)
  | ({ type: "editVolumes" } & VolumesData);
