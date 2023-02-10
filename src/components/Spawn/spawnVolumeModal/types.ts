export type FormState = {
  requiredVolumeInformation?: {
    availabilityZone?: string;
    volumeSize?: number;
    type?: string;
  };
  optionalVolumeInformation?: {
    expirationDetails?: {
      expiration?: string;
      noExpiration: boolean;
    };
    mountToHost?: string;
  };
};
