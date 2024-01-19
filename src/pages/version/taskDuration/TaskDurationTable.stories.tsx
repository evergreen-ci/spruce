import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { TaskDurationTable } from "./TaskDurationTable";

export default {
  component: TaskDurationTable,
} satisfies CustomMeta<typeof TaskDurationTable>;

export const Default: CustomStoryObj<typeof TaskDurationTable> = {
  render: () => (
    <TaskDurationTable
      tasks={props.tasks}
      loading={false}
      numLoadingRows={10}
    />
  ),
};

export const LongContent: CustomStoryObj<typeof TaskDurationTable> = {
  render: () => (
    <TaskDurationTable
      tasks={props.tasksLong}
      loading={false}
      numLoadingRows={10}
    />
  ),
};

const props = {
  tasksLong: [
    {
      buildVariantDisplayName:
        "Shared Library Enterprise RHEL 8.0 Query (all feature flags and CQF enabled)",
      displayName: "sharding_multiversion ".repeat(30),
      execution: 0,
      id: "mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_and_cqf_enabled_display_sharding_multiversion_patch_5cab129eb5c35c3ad61ed9e5156539556d85dcd1_65241908850e61e75776c5c2_23_10_09_15_17_56",
      startTime: new Date("2023-10-09T16:42:53.995Z"),
      status: "known-issue",
      subRows: [
        {
          buildVariantDisplayName: `Shared Library Enterprise RHEL 8.0 Query (all feature flags and CQF enabled) ${"long ".repeat(
            80,
          )}`,
          displayName: "sharding_last_continuous_00-linux-enterprise",
          execution: 0,
          id: "mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_and_cqf_enabled_sharding_last_continuous_00_linux_enterprise_patch_5cab129eb5c35c3ad61ed9e5156539556d85dcd1_65241908850e61e75776c5c2_23_10_09_15_17_56",
          startTime: new Date("2023-10-09T16:43:20.938Z"),
          status: "success",
          timeTaken: 1248955,
        },
        {
          buildVariantDisplayName:
            "Shared Library Enterprise RHEL 8.0 Query (all feature flags and CQF enabled)",
          displayName: "sharding_last_continuous_01-linux-enterprise",
          execution: 0,
          id: "mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_and_cqf_enabled_sharding_last_continuous_01_linux_enterprise_patch_5cab129eb5c35c3ad61ed9e5156539556d85dcd1_65241908850e61e75776c5c2_23_10_09_15_17_56",
          startTime: new Date("2023-10-09T16:42:58.249Z"),
          status: "failed",
          timeTaken: 1417378,
        },
        {
          buildVariantDisplayName:
            "Shared Library Enterprise RHEL 8.0 Query (all feature flags and CQF enabled)",
          displayName: "sharding_last_continuous_02-linux-enterprise",
          execution: 0,
          id: "mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_and_cqf_enabled_sharding_last_continuous_02_linux_enterprise_patch_5cab129eb5c35c3ad61ed9e5156539556d85dcd1_65241908850e61e75776c5c2_23_10_09_15_17_56",
          startTime: new Date("2023-10-09T16:42:59.444Z"),
          status: "success",
          timeTaken: 1367157,
        },
        {
          buildVariantDisplayName:
            "Shared Library Enterprise RHEL 8.0 Query (all feature flags and CQF enabled)",
          displayName: "sharding_last_continuous_03-linux-enterprise",
          execution: 0,
          id: "mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_and_cqf_enabled_sharding_last_continuous_03_linux_enterprise_patch_5cab129eb5c35c3ad61ed9e5156539556d85dcd1_65241908850e61e75776c5c2_23_10_09_15_17_56",
          startTime: new Date("2023-10-09T16:42:56.486Z"),
          status: "success",
          timeTaken: 1852371,
        },
        {
          buildVariantDisplayName:
            "Shared Library Enterprise RHEL 8.0 Query (all feature flags and CQF enabled)",
          displayName: "sharding_last_continuous_04-linux-enterprise",
          execution: 0,
          id: "mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_and_cqf_enabled_sharding_last_continuous_04_linux_enterprise_patch_5cab129eb5c35c3ad61ed9e5156539556d85dcd1_65241908850e61e75776c5c2_23_10_09_15_17_56",
          startTime: new Date("2023-10-09T16:43:15.02Z"),
          status: "success",
          timeTaken: 2012757,
        },
        {
          buildVariantDisplayName:
            "Shared Library Enterprise RHEL 8.0 Query (all feature flags and CQF enabled)",
          displayName: "sharding_last_continuous_05-linux-enterprise",
          execution: 0,
          id: "mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_and_cqf_enabled_sharding_last_continuous_05_linux_enterprise_patch_5cab129eb5c35c3ad61ed9e5156539556d85dcd1_65241908850e61e75776c5c2_23_10_09_15_17_56",
          startTime: new Date("2023-10-09T16:43:08.172Z"),
          status: "success",
          timeTaken: 245107,
        },
        {
          buildVariantDisplayName:
            "Shared Library Enterprise RHEL 8.0 Query (all feature flags and CQF enabled)",
          displayName: "sharding_last_lts_00-linux-enterprise",
          execution: 0,
          id: "mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_and_cqf_enabled_sharding_last_lts_00_linux_enterprise_patch_5cab129eb5c35c3ad61ed9e5156539556d85dcd1_65241908850e61e75776c5c2_23_10_09_15_17_56",
          startTime: new Date("2023-10-09T16:43:13.916Z"),
          status: "success",
          timeTaken: 1301814,
        },
        {
          buildVariantDisplayName:
            "Shared Library Enterprise RHEL 8.0 Query (all feature flags and CQF enabled)",
          displayName: "sharding_last_lts_01-linux-enterprise",
          execution: 0,
          id: "mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_and_cqf_enabled_sharding_last_lts_01_linux_enterprise_patch_5cab129eb5c35c3ad61ed9e5156539556d85dcd1_65241908850e61e75776c5c2_23_10_09_15_17_56",
          startTime: new Date("2023-10-09T16:43:10.714Z"),
          status: "success",
          timeTaken: 1615699,
        },
        {
          buildVariantDisplayName:
            "Shared Library Enterprise RHEL 8.0 Query (all feature flags and CQF enabled)",
          displayName: "sharding_last_lts_02-linux-enterprise",
          execution: 0,
          id: "mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_and_cqf_enabled_sharding_last_lts_02_linux_enterprise_patch_5cab129eb5c35c3ad61ed9e5156539556d85dcd1_65241908850e61e75776c5c2_23_10_09_15_17_56",
          startTime: new Date("2023-10-09T16:43:03.408Z"),
          status: "success",
          timeTaken: 1894981,
        },
        {
          buildVariantDisplayName:
            "Shared Library Enterprise RHEL 8.0 Query (all feature flags and CQF enabled)",
          displayName: "sharding_last_lts_03-linux-enterprise",
          execution: 0,
          id: "mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_and_cqf_enabled_sharding_last_lts_03_linux_enterprise_patch_5cab129eb5c35c3ad61ed9e5156539556d85dcd1_65241908850e61e75776c5c2_23_10_09_15_17_56",
          startTime: new Date("2023-10-09T16:43:04.137Z"),
          status: "success",
          timeTaken: 1280264,
        },
        {
          buildVariantDisplayName:
            "Shared Library Enterprise RHEL 8.0 Query (all feature flags and CQF enabled)",
          displayName: "sharding_last_lts_04-linux-enterprise",
          execution: 0,
          id: "mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_and_cqf_enabled_sharding_last_lts_04_linux_enterprise_patch_5cab129eb5c35c3ad61ed9e5156539556d85dcd1_65241908850e61e75776c5c2_23_10_09_15_17_56",
          startTime: new Date("2023-10-09T16:42:53.995Z"),
          status: "success",
          timeTaken: 1464812,
        },
      ],
      timeTaken: 15701302,
    },
  ],
  tasks: [
    {
      id: "evg_ubuntu1604_container_test_model_distro_fd73e06c7bc6c5dcdf7a671dece0153916e64212_23_01_04_16_01_18",
      buildVariantDisplayName: "Ubuntu 16.04 (Container)",
      displayName: "test-model-distro",
      execution: 0,
      subRows: [
        {
          buildVariantDisplayName:
            "Shared Library Enterprise RHEL 8.0 Query (all feature flags and CQF enabled)",
          displayName: "sharding_last_continuous_01-linux-enterprise",
          execution: 0,
          id: "mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_and_cqf_enabled_sharding_last_continuous_01_linux_enterprise_patch_5cab129eb5c35c3ad61ed9e5156539556d85dcd1_65241908850e61e75776c5c2_23_10_09_15_17_56",
          startTime: new Date("2023-10-09T16:42:58.249Z"),
          status: "failed",
          timeTaken: 1417378,
        },
        {
          buildVariantDisplayName:
            "Shared Library Enterprise RHEL 8.0 Query (all feature flags and CQF enabled)",
          displayName: "sharding_last_continuous_02-linux-enterprise",
          execution: 0,
          id: "mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_and_cqf_enabled_sharding_last_continuous_02_linux_enterprise_patch_5cab129eb5c35c3ad61ed9e5156539556d85dcd1_65241908850e61e75776c5c2_23_10_09_15_17_56",
          startTime: new Date("2023-10-09T16:42:59.444Z"),
          status: "success",
          timeTaken: 1367157,
        },
      ],
      startTime: new Date("2023-01-04T16:01:25.295Z"),
      status: "failed",
      timeTaken: 4840547,
    },
    {
      id: "evg_ubuntu1604_container_test_rest_data_fd73e06c7bc6c5dcdf7a671dece0153916e64212_23_01_04_16_01_18",
      buildVariantDisplayName: "Ubuntu 16.04 (Container)",
      displayName: "test-rest-data",
      execution: 0,
      subRows: null,
      startTime: new Date("2023-01-04T16:01:25.242Z"),
      status: "system-failed",
      timeTaken: 4840553,
    },
    {
      id: "evg_ubuntu1604_container_test_agent_internal_fd73e06c7bc6c5dcdf7a671dece0153916e64212_23_01_04_16_01_18",
      buildVariantDisplayName: "Ubuntu 16.04 (Container)",
      displayName: "test-agent-internal",
      execution: 0,
      subRows: null,
      startTime: new Date("2023-01-04T16:01:25.234Z"),
      status: "system-failed",
      timeTaken: 4840526,
    },
    {
      id: "evg_ubuntu1604_container_test_evergreen_fd73e06c7bc6c5dcdf7a671dece0153916e64212_23_01_04_16_01_18",
      buildVariantDisplayName: "Ubuntu 16.04 (Container)",
      displayName: "test-evergreen",
      execution: 0,
      subRows: null,
      startTime: new Date("2023-01-04T16:01:25.258Z"),
      status: "system-failed",
      timeTaken: 4840512,
    },
    {
      id: "evg_ubuntu1604_container_test_model_artifact_fd73e06c7bc6c5dcdf7a671dece0153916e64212_23_01_04_16_01_18",
      buildVariantDisplayName: "Ubuntu 16.04 (Container)",
      displayName: "test-model-artifact",
      execution: 0,
      subRows: null,
      startTime: new Date("2023-01-04T16:01:25.272Z"),
      status: "system-failed",
      timeTaken: 4840399,
    },
    {
      id: "evg_ubuntu1604_container_test_thirdparty_fd73e06c7bc6c5dcdf7a671dece0153916e64212_23_01_04_16_01_18",
      buildVariantDisplayName: "Ubuntu 16.04 (Container)",
      displayName: "test-thirdparty",
      execution: 0,
      subRows: null,
      startTime: new Date("2023-01-04T16:01:25.259Z"),
      status: "system-failed",
      timeTaken: 4840375,
    },
    {
      id: "evg_ubuntu1604_container_test_model_event_fd73e06c7bc6c5dcdf7a671dece0153916e64212_23_01_04_16_01_18",
      buildVariantDisplayName: "Ubuntu 16.04 (Container)",
      displayName: "test-model-event",
      execution: 0,
      subRows: null,
      startTime: new Date("2023-01-04T16:01:25.275Z"),
      status: "system-failed",
      timeTaken: 4840347,
    },
    {
      id: "evg_ubuntu1604_container_test_model_testresult_fd73e06c7bc6c5dcdf7a671dece0153916e64212_23_01_04_16_01_18",
      buildVariantDisplayName: "Ubuntu 16.04 (Container)",
      displayName: "test-model-testresult",
      execution: 0,
      subRows: null,
      startTime: new Date("2023-01-04T16:01:25.291Z"),
      status: "system-failed",
      timeTaken: 4840319,
    },
    {
      id: "evg_ubuntu1604_container_test_model_alertrecord_fd73e06c7bc6c5dcdf7a671dece0153916e64212_23_01_04_16_01_18",
      buildVariantDisplayName: "Ubuntu 16.04 (Container)",
      displayName: "test-model-alertrecord",
      execution: 0,
      subRows: null,
      startTime: new Date("2023-01-04T16:01:25.268Z"),
      status: "system-failed",
      timeTaken: 4840303,
    },
    {
      id: "evg_ubuntu1604_container_test_model_patch_fd73e06c7bc6c5dcdf7a671dece0153916e64212_23_01_04_16_01_18",
      buildVariantDisplayName: "Ubuntu 16.04 (Container)",
      displayName: "test-model-patch",
      execution: 0,
      subRows: null,
      startTime: new Date("2023-01-04T16:01:25.281Z"),
      status: "system-failed",
      timeTaken: 4840277,
    },
  ],
  loading: false,
};
