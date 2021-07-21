import { useReducer } from "react";
import { ExpirationDateType } from "components/Spawn/ExpirationField";
import { InstanceTagInput, PublicKeyInput } from "gql/generated/types";
import { MyHost } from "types/spawn";
import { UserTagsData, VolumesData } from "../fields";
import { publicKeyStateType } from "../spawnHostModal/PublicKeyForm";

export interface editSpawnHostStateType {
  publicKey: PublicKeyInput;
  savePublicKey: boolean;
  expiration?: Date;
  noExpiration: boolean;
  displayName?: string;
  instanceType?: string;
  volumeId?: string;
  addedInstanceTags?: InstanceTagInput[];
  deletedInstanceTags?: InstanceTagInput[];
  servicePassword?: string;
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
  servicePassword: null,
  publicKey: {
    name: "",
    key: "",
  },
  savePublicKey: false,
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
    case "editServicePassword":
      return {
        ...state,
        servicePassword: action.servicePassword.length
          ? action.servicePassword
          : null,
      };
    case "editPublicKey":
      return {
        ...state,
        publicKey: action.publicKey,
        savePublicKey: action.savePublicKey,
      };
    default:
      throw new Error();
  }
};

type Action =
  | { type: "editInstanceType"; instanceType: string }
  | { type: "editHostName"; displayName: string }
  | { type: "editServicePassword"; servicePassword: string }
  | { type: "reset"; host: MyHost }
  | ({ type: "editExpiration" } & ExpirationDateType)
  | ({ type: "editInstanceTags" } & UserTagsData)
  | ({ type: "editVolumes" } & VolumesData)
  | ({ type: "editPublicKey" } & publicKeyStateType);
