export type FormState = {
  requiredVolumeInformation?: {
    availabilityZone?: string;
    size?: number;
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
