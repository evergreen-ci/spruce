export interface GeneralFormState {
  distroName: {
    identifier: string;
  };
  distroAliases: {
    aliases: string[];
  };
  distroNote: {
    note: string;
  };
  distroOptions: {
    isCluster: boolean;
    disableShallowClone: boolean;
    disabled: boolean;
  };
}

export type TabProps = {
  distroData: GeneralFormState;
};
