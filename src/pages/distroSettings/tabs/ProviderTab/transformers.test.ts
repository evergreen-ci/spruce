import { DistroInput, Provider } from "gql/generated/types";
import { distroData } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { BuildType, FleetInstanceType, ProviderFormState } from "./types";

const defaultFormState = {
  staticProviderSettings: {
    userData: "",
    mergeUserData: false,
    securityGroups: ["1"],
    hosts: [],
  },
  dockerProviderSettings: {
    imageUrl: "",
    buildType: "" as BuildType,
    registryUsername: "",
    registryPassword: "",
    containerPoolId: "",
    poolMappingInfo: "",
    userData: "",
    mergeUserData: false,
    securityGroups: ["1"],
  },
  ec2FleetProviderSettings: [
    {
      region: "",
      displayTitle: undefined,
      amiId: "",
      fleetOptions: {
        fleetInstanceType: FleetInstanceType.Spot,
        useCapacityOptimization: false,
      },
      instanceProfileARN: "",
      instanceType: "",
      mergeUserData: false,
      mountPoints: [],
      securityGroups: ["1"],
      sshKeyName: "",
      userData: "",
      vpcOptions: {
        subnetId: "",
        useVpc: false,
        subnetPrefix: "",
      },
    },
  ],
  ec2OnDemandProviderSettings: [
    {
      region: "",
      displayTitle: undefined,
      amiId: "",
      instanceProfileARN: "",
      instanceType: "",
      mergeUserData: false,
      mountPoints: [],
      securityGroups: ["1"],
      sshKeyName: "",
      userData: "",
      vpcOptions: {
        subnetId: "",
        useVpc: false,
        subnetPrefix: "",
      },
    },
  ],
};

describe("provider tab", () => {
  describe("static provider", () => {
    const staticDistroData = {
      ...distroData,
      provider: Provider.Static,
      containerPool: "",
      providerSettingsList: [
        {
          user_data: "",
          merge_user_data: false,
          security_group_ids: ["1"],
          hosts: [{ name: "localhost-1" }, { name: "localhost-2" }],
        },
      ],
    };

    const staticForm: ProviderFormState = {
      ...defaultFormState,
      provider: {
        providerName: Provider.Static,
      },
      staticProviderSettings: {
        userData: "",
        mergeUserData: false,
        securityGroups: ["1"],
        hosts: [{ name: "localhost-1" }, { name: "localhost-2" }],
      },
    };

    const staticGql: DistroInput = {
      ...distroData,
      provider: Provider.Static,
      containerPool: "",
      providerSettingsList: [
        {
          merge_user_data_parts: false,
          security_group_ids: ["1"],
          user_data: "",
          hosts: [{ name: "localhost-1" }, { name: "localhost-2" }],
        },
      ],
    };

    it("correctly converts from GQL to a form", () => {
      expect(gqlToForm(staticDistroData)).toStrictEqual(staticForm);
    });

    it("correctly converts from a form to GQL", () => {
      expect(formToGql(staticForm, staticDistroData)).toStrictEqual(staticGql);
    });
  });

  describe("docker provider", () => {
    const dockerDistroData = {
      ...distroData,
      provider: Provider.Docker,
      containerPool: "pool-1",
      providerSettingsList: [
        {
          image_url: "https://some-url",
          build_type: "import",
          docker_registry_user: "testuser",
          docker_registry_pw: "abc-123",
          user_data: "",
          merge_user_data: false,
          security_group_ids: ["1"],
        },
      ],
    };

    const dockerForm: ProviderFormState = {
      ...defaultFormState,
      provider: {
        providerName: Provider.Docker,
      },
      dockerProviderSettings: {
        imageUrl: "https://some-url",
        buildType: BuildType.Import,
        registryUsername: "testuser",
        registryPassword: "abc-123",
        containerPoolId: "pool-1",
        poolMappingInfo: "",
        userData: "",
        mergeUserData: false,
        securityGroups: ["1"],
      },
    };

    const dockerGql: DistroInput = {
      ...distroData,
      provider: Provider.Docker,
      containerPool: "pool-1",
      providerSettingsList: [
        {
          image_url: "https://some-url",
          build_type: "import",
          docker_registry_user: "testuser",
          docker_registry_pw: "abc-123",
          user_data: "",
          merge_user_data_parts: false,
          security_group_ids: ["1"],
        },
      ],
    };

    it("correctly converts from GQL to a form", () => {
      expect(gqlToForm(dockerDistroData)).toStrictEqual(dockerForm);
    });

    it("correctly converts from a form to GQL", () => {
      expect(formToGql(dockerForm, dockerDistroData)).toStrictEqual(dockerGql);
    });
  });

  describe("ec2 fleet provider", () => {
    const ec2FleetDistroData = {
      ...distroData,
      provider: Provider.Ec2Fleet,
      containerPool: "",
      providerSettingsList: [
        {
          region: "us-east-1",
          ami: "ami-east",
          instance_type: "m5.xlarge",
          key_name: "admin",
          fleet_options: {
            use_on_demand: false,
            use_capacity_optimized: true,
          },
          fallback: true,
          iam_instance_profile_arn: "profile-east",
          is_vpc: true,
          subnet_id: "subnet-east",
          vpc_name: "vpc-east",
          mount_points: [
            {
              device_name: "device-east",
              size: 200,
            },
          ],
          user_data: "",
          merge_user_data_parts: false,
          security_group_ids: ["1"],
        },
      ],
    };

    const ec2Form: ProviderFormState = {
      ...defaultFormState,
      provider: {
        providerName: Provider.Ec2Fleet,
      },
      ec2FleetProviderSettings: [
        {
          region: "us-east-1",
          displayTitle: "us-east-1",
          amiId: "ami-east",
          fleetOptions: {
            fleetInstanceType: FleetInstanceType.SpotWithOnDemandFallback,
            useCapacityOptimization: true,
          },
          instanceProfileARN: "profile-east",
          instanceType: "m5.xlarge",
          mergeUserData: false,
          mountPoints: [
            {
              deviceName: "device-east",
              virtualName: undefined,
              volumeType: undefined,
              iops: undefined,
              throughput: undefined,
              size: 200,
            },
          ],
          securityGroups: ["1"],
          sshKeyName: "admin",
          userData: "",
          vpcOptions: {
            subnetId: "subnet-east",
            useVpc: true,
            subnetPrefix: "vpc-east",
          },
        },
      ],
      ec2OnDemandProviderSettings: [
        {
          region: "us-east-1",
          displayTitle: "us-east-1",
          amiId: "ami-east",
          instanceProfileARN: "profile-east",
          instanceType: "m5.xlarge",
          mergeUserData: false,
          mountPoints: [
            {
              deviceName: "device-east",
              virtualName: undefined,
              volumeType: undefined,
              iops: undefined,
              throughput: undefined,
              size: 200,
            },
          ],
          securityGroups: ["1"],
          sshKeyName: "admin",
          userData: "",
          vpcOptions: {
            subnetId: "subnet-east",
            useVpc: true,
            subnetPrefix: "vpc-east",
          },
        },
      ],
    };

    const ec2Gql: DistroInput = {
      ...distroData,
      provider: Provider.Ec2Fleet,
      containerPool: "",
      providerSettingsList: [
        {
          region: "us-east-1",
          ami: "ami-east",
          instance_type: "m5.xlarge",
          key_name: "admin",
          fleet_options: {
            use_on_demand: false,
            use_capacity_optimized: true,
          },
          fallback: true,
          iam_instance_profile_arn: "profile-east",
          is_vpc: true,
          subnet_id: "subnet-east",
          vpc_name: "vpc-east",
          mount_points: [
            {
              device_name: "device-east",
              iops: undefined,
              throughput: undefined,
              virtual_name: undefined,
              volume_type: undefined,
              size: 200,
            },
          ],
          user_data: "",
          merge_user_data_parts: false,
          security_group_ids: ["1"],
        },
      ],
    };

    it("correctly converts from GQL to a form", () => {
      expect(gqlToForm(ec2FleetDistroData)).toStrictEqual(ec2Form);
    });

    it("correctly converts from a form to GQL", () => {
      expect(formToGql(ec2Form, ec2FleetDistroData)).toStrictEqual(ec2Gql);
    });
  });

  describe("ec2 on demand provider", () => {
    const ec2OnDemandDistroData = {
      ...distroData,
      provider: Provider.Ec2OnDemand,
      containerPool: "",
      providerSettingsList: [
        {
          region: "us-east-1",
          ami: "ami-east",
          instance_type: "m5.xlarge",
          key_name: "admin",
          iam_instance_profile_arn: "profile-east",
          is_vpc: true,
          subnet_id: "subnet-east",
          vpc_name: "vpc-east",
          mount_points: [
            {
              device_name: "device-east",
              size: 200,
            },
          ],
          user_data: "",
          merge_user_data_parts: false,
          security_group_ids: ["1"],
        },
      ],
    };

    const ec2Form: ProviderFormState = {
      ...defaultFormState,
      provider: {
        providerName: Provider.Ec2OnDemand,
      },
      ec2FleetProviderSettings: [
        {
          region: "us-east-1",
          displayTitle: "us-east-1",
          amiId: "ami-east",
          fleetOptions: {
            fleetInstanceType: FleetInstanceType.Spot,
            useCapacityOptimization: false,
          },
          instanceProfileARN: "profile-east",
          instanceType: "m5.xlarge",
          mergeUserData: false,
          mountPoints: [
            {
              deviceName: "device-east",
              virtualName: undefined,
              volumeType: undefined,
              iops: undefined,
              throughput: undefined,
              size: 200,
            },
          ],
          securityGroups: ["1"],
          sshKeyName: "admin",
          userData: "",
          vpcOptions: {
            subnetId: "subnet-east",
            useVpc: true,
            subnetPrefix: "vpc-east",
          },
        },
      ],
      ec2OnDemandProviderSettings: [
        {
          region: "us-east-1",
          displayTitle: "us-east-1",
          amiId: "ami-east",
          instanceProfileARN: "profile-east",
          instanceType: "m5.xlarge",
          mergeUserData: false,
          mountPoints: [
            {
              deviceName: "device-east",
              virtualName: undefined,
              volumeType: undefined,
              iops: undefined,
              throughput: undefined,
              size: 200,
            },
          ],
          securityGroups: ["1"],
          sshKeyName: "admin",
          userData: "",
          vpcOptions: {
            subnetId: "subnet-east",
            useVpc: true,
            subnetPrefix: "vpc-east",
          },
        },
      ],
    };

    const ec2Gql: DistroInput = {
      ...distroData,
      provider: Provider.Ec2OnDemand,
      containerPool: "",
      providerSettingsList: [
        {
          region: "us-east-1",
          ami: "ami-east",
          instance_type: "m5.xlarge",
          key_name: "admin",
          iam_instance_profile_arn: "profile-east",
          is_vpc: true,
          subnet_id: "subnet-east",
          vpc_name: "vpc-east",
          mount_points: [
            {
              device_name: "device-east",
              iops: undefined,
              throughput: undefined,
              virtual_name: undefined,
              volume_type: undefined,
              size: 200,
            },
          ],
          user_data: "",
          merge_user_data_parts: false,
          security_group_ids: ["1"],
        },
      ],
    };

    it("correctly converts from GQL to a form", () => {
      expect(gqlToForm(ec2OnDemandDistroData)).toStrictEqual(ec2Form);
    });

    it("correctly converts from a form to GQL", () => {
      expect(formToGql(ec2Form, ec2OnDemandDistroData)).toStrictEqual(ec2Gql);
    });
  });
});
