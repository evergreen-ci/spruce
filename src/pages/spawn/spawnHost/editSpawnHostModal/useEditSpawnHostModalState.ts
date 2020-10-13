import { useReducer } from "react";
import { InstanceTag } from "gql/generated/types";
import { MyHost } from "types/spawn";

interface editSpawnHostState {
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
  defaultEditSpawnHostState: init(host),
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

const reducer = (state: editSpawnHostState, action: Action) => {
  switch (action.type) {
    case "reset":
      return init(action.host);
    case "editHostName":
      return { ...state, displayName: action.displayName };
    case "editExpiration":
      return {
        ...state,
        expiration: action.expiration,
        noExpiration: action.noExpiration,
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
  | { type: "reset"; host: MyHost }
  | { type: "editHostName"; displayName: string }
  | { type: "editExpiration"; expiration: Date; noExpiration: boolean }
  | { type: "editInstanceType"; instanceType: string }
  | {
      type: "editInstanceTags";
      deletedInstanceTags: InstanceTag[];
      addedInstanceTags: InstanceTag[];
    }
  | { type: "editVolumes"; volumeId: string };
