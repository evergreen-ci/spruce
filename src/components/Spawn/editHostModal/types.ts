export type FormState = {
  hostName?: string;
  expirationDetails?: {
    expiration?: string;
    noExpiration: boolean;
  };
  instanceType?: string;
  volume?: string;
  rdpPassword?: string;
  userTags?: Array<{
    key: string;
    value: string;
  }>;
  publicKeySection?: {
    useExisting: boolean;
    newPublicKey?: string;
    publicKeyNameDropdown?: string;
    savePublicKey?: boolean;
    newPublicKeyName?: string;
  };
};
