export interface GeneralFormState {
  distroName: {
    identifier: string;
  };
  distroAliases: {
    aliases: string[];
  };
  distroOptions: {
    isCluster: boolean;
    disableShallowClone: boolean;
    disabled: boolean;
    note: string;
  };
}

export type TabProps = {
  distroData: GeneralFormState;
  minimumHosts: number;
};
