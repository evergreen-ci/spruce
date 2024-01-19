import { Unpacked } from "types/utils";
import { BuildType, ProviderFormState, FleetInstanceType } from "./types";

/**
 * The provider settings list is untyped in the backend, so we manually define types here.
 */
interface ProviderSettingsList {
  user_data: string;
  merge_user_data_parts: boolean;
  security_group_ids: string[];
  image_url: string;
  build_type: string;
  docker_registry_user: string;
  docker_registry_pw: string;
  hosts: Array<{ name: string; ssh_port: string }>;
  ami: string;
  instance_type: string;
  key_name: string;
  fleet_options: {
    use_on_demand: boolean;
    use_capacity_optimized: boolean;
  };
  fallback: boolean;
  iam_instance_profile_arn: string;
  is_vpc: boolean;
  subnet_id: string;
  vpc_name: string;
  mount_points: Array<{
    device_name: string;
    virtual_name: string;
    volume_type: string;
    iops: number;
    throughput: number;
    size: number;
  }>;
  region: string;
}

const getFleetInstanceType = (
  providerSettings: Partial<ProviderSettingsList> = {},
) => {
  if (providerSettings.fleet_options?.use_on_demand) {
    return FleetInstanceType.OnDemand;
  }
  if (
    !providerSettings.fleet_options?.use_on_demand &&
    providerSettings.fallback
  ) {
    return FleetInstanceType.SpotWithOnDemandFallback;
  }
  return FleetInstanceType.Spot;
};

export const formProviderSettings = (
  providerSettings: Partial<ProviderSettingsList> = {},
) => ({
  staticProviderSettings: {
    userData: providerSettings.user_data ?? "",
    mergeUserData: providerSettings.merge_user_data_parts ?? false,
    securityGroups: providerSettings.security_group_ids ?? [],
    hosts: providerSettings.hosts?.map((h) => ({ name: h.name })) ?? [],
  },
  dockerProviderSettings: {
    userData: providerSettings.user_data ?? "",
    mergeUserData: providerSettings.merge_user_data_parts ?? false,
    securityGroups: providerSettings.security_group_ids ?? [],
    imageUrl: providerSettings.image_url ?? "",
    buildType: (providerSettings.build_type ?? "") as BuildType,
    registryUsername: providerSettings.docker_registry_user ?? "",
    registryPassword: providerSettings.docker_registry_pw ?? "",
  },
  ec2FleetProviderSettings: {
    region: providerSettings.region ?? "",
    userData: providerSettings.user_data ?? "",
    mergeUserData: providerSettings.merge_user_data_parts ?? false,
    securityGroups: providerSettings.security_group_ids ?? [],
    amiId: providerSettings.ami ?? "",
    instanceType: providerSettings.instance_type ?? "",
    sshKeyName: providerSettings.key_name ?? "",
    fleetOptions: {
      fleetInstanceType: getFleetInstanceType(providerSettings),
      useCapacityOptimization:
        providerSettings.fleet_options?.use_capacity_optimized ?? false,
    },
    instanceProfileARN: providerSettings.iam_instance_profile_arn ?? "",
    vpcOptions: {
      useVpc: providerSettings.is_vpc ?? false,
      subnetId: providerSettings.subnet_id ?? "",
      subnetPrefix: providerSettings.vpc_name ?? "",
    },
    mountPoints:
      providerSettings.mount_points?.map((mp) => ({
        deviceName: mp.device_name,
        virtualName: mp.virtual_name,
        volumeType: mp.volume_type,
        iops: mp.iops,
        throughput: mp.throughput,
        size: mp.size,
      })) ?? [],
  },
  ec2OnDemandProviderSettings: {
    region: providerSettings.region ?? "",
    userData: providerSettings.user_data ?? "",
    mergeUserData: providerSettings.merge_user_data_parts ?? false,
    securityGroups: providerSettings.security_group_ids ?? [],
    amiId: providerSettings.ami ?? "",
    instanceType: providerSettings.instance_type ?? "",
    sshKeyName: providerSettings.key_name ?? "",
    instanceProfileARN: providerSettings.iam_instance_profile_arn ?? "",
    vpcOptions: {
      useVpc: providerSettings.is_vpc ?? false,
      subnetId: providerSettings.subnet_id ?? "",
      subnetPrefix: providerSettings.vpc_name ?? "",
    },
    mountPoints:
      providerSettings.mount_points?.map((mp) => ({
        deviceName: mp.device_name,
        virtualName: mp.virtual_name,
        volumeType: mp.volume_type,
        iops: mp.iops,
        throughput: mp.throughput,
        size: mp.size,
      })) ?? [],
  },
});

type ProviderSettings = ProviderFormState["staticProviderSettings"] &
  ProviderFormState["dockerProviderSettings"] &
  Unpacked<ProviderFormState["ec2FleetProviderSettings"]> &
  Unpacked<ProviderFormState["ec2OnDemandProviderSettings"]>;

export const gqlProviderSettings = (
  providerSettings: Partial<ProviderSettings> = {},
) => {
  const { fleetOptions, vpcOptions } = providerSettings;
  return {
    staticProviderSettings: {
      user_data: providerSettings.userData,
      merge_user_data_parts: providerSettings.mergeUserData,
      security_group_ids: providerSettings.securityGroups,
      hosts:
        providerSettings.hosts?.map((h) => ({
          name: h.name,
        })) ?? [],
    },
    dockerProviderSettings: {
      user_data: providerSettings.userData,
      merge_user_data_parts: providerSettings.mergeUserData,
      security_group_ids: providerSettings.securityGroups,
      image_url: providerSettings.imageUrl,
      build_type: providerSettings.buildType,
      docker_registry_user: providerSettings.registryUsername,
      docker_registry_pw: providerSettings.registryPassword,
    },
    ec2FleetProviderSettings: {
      region: providerSettings.region,
      user_data: providerSettings.userData,
      merge_user_data_parts: providerSettings.mergeUserData,
      security_group_ids: providerSettings.securityGroups,
      ami: providerSettings.amiId,
      instance_type: providerSettings.instanceType,
      key_name: providerSettings.sshKeyName,
      fleet_options: {
        use_on_demand:
          fleetOptions?.fleetInstanceType === FleetInstanceType.OnDemand,
        use_capacity_optimized:
          fleetOptions?.fleetInstanceType === FleetInstanceType.OnDemand
            ? false
            : fleetOptions?.useCapacityOptimization,
      },
      fallback:
        fleetOptions?.fleetInstanceType ===
        FleetInstanceType.SpotWithOnDemandFallback,
      iam_instance_profile_arn: providerSettings.instanceProfileARN,
      is_vpc: vpcOptions?.useVpc,
      subnet_id: vpcOptions?.useVpc ? vpcOptions?.subnetId : undefined,
      vpc_name: vpcOptions?.useVpc ? vpcOptions?.subnetPrefix : undefined,
      mount_points:
        providerSettings.mountPoints?.map((mp) => ({
          device_name: mp.deviceName,
          virtual_name: mp.virtualName,
          volume_type: mp.volumeType,
          iops: mp.iops,
          throughput: mp.throughput,
          size: mp.size,
        })) ?? [],
    },
    ec2OnDemandProviderSettings: {
      region: providerSettings.region,
      user_data: providerSettings.userData,
      merge_user_data_parts: providerSettings.mergeUserData,
      security_group_ids: providerSettings.securityGroups,
      ami: providerSettings.amiId,
      instance_type: providerSettings.instanceType,
      key_name: providerSettings.sshKeyName,
      iam_instance_profile_arn: providerSettings.instanceProfileARN,
      is_vpc: vpcOptions?.useVpc,
      subnet_id: vpcOptions?.useVpc ? vpcOptions?.subnetId : undefined,
      vpc_name: vpcOptions?.useVpc ? vpcOptions?.subnetPrefix : undefined,
      mount_points:
        providerSettings.mountPoints?.map((mp) => ({
          device_name: mp.deviceName,
          virtual_name: mp.virtualName,
          volume_type: mp.volumeType,
          iops: mp.iops,
          throughput: mp.throughput,
          size: mp.size,
        })) ?? [],
    },
  };
};
