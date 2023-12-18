import { TaskQueueItemType } from "gql/generated/types";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import TaskQueueTable from ".";

export default {
  component: TaskQueueTable,
} satisfies CustomMeta<typeof TaskQueueTable>;

export const Default: CustomStoryObj<typeof TaskQueueTable> = {
  render: (args) => <TaskQueueTable {...args} />,
  argTypes: {},
  args: {
    loading: false,
    taskQueue: [
      {
        activatedBy: "admin",
        buildVariant: "os-x-108-64-nossl",
        displayName: "compile",
        expectedDuration: 600000,
        id: "mongo_c_driver_os_x_108_64_nossl_compile_292ceeaae06844f3d759e4a05e9b9cb7be97171e_16_04_15_17_13_00",
        priority: 0,
        project:
          "0ca28fc26cf92159f774660f135f376fdcb90c23488cfa461a9969243643feb7",
        requester: TaskQueueItemType.Patch,
        version: "mms_on_prem_4.4_35dfc39b6e1e2d1efad93d9805cb59814939cdc9",
        __typename: "TaskQueueItem",
      },
      {
        activatedBy: "admin",
        buildVariant: "osx-108-ssl",
        displayName: "compile",
        expectedDuration: 600000,
        id: "evergreen_ubuntu1604_test_monitor_5e823e1f28baeaa22ae00823d83e03082cd148ab_20_02_20_20_37_06",
        priority: 0,
        project:
          "23c73fc8a605de0e6d71f776128544356dca2a243a459db334d3514ae74a1ba7",
        requester: TaskQueueItemType.Commit,
        version: "mms_on_prem_4.4_35dfc39b6e1e2d1efad93d9805cb59814939cdc9",
        __typename: "TaskQueueItem",
      },
      {
        activatedBy: "admin",
        buildVariant: "os-x-108-64-nossl",
        displayName: "compile",
        expectedDuration: 600000,
        id: "mongo_c_driver_os_x_108_64_nossl_compile_292ceeaae06844f3d759e4a05e9b9cb7be97171e_16_04_15_16_54_00",
        priority: 0,
        project:
          "0ca28fc26cf92159f774660f135f376fdcb90c23488cfa461a9969243643feb7",
        requester: TaskQueueItemType.Patch,
        version: "mms_on_prem_4.4_35dfc39b6e1e2d1efad93d9805cb59814939cdc9",
        __typename: "TaskQueueItem",
      },
      {
        activatedBy: "admin",
        buildVariant: "osx-108",
        displayName: "compile",
        expectedDuration: 600000,
        id: "mongodb_mongo_v3.0.11_osx_108_compile_336e39e76e7a65af1ec534f28e69f568ca97695c_16_06_13_21_07_12",
        priority: 0,
        project:
          "23c73fc8a605de0e6d71f776128544356dca2a243a459db334d3514ae74a1ba7",
        requester: TaskQueueItemType.Commit,
        version: "mongodb_mongo_v4.2_cef23d286f5f9af1295d8097b33df764cc2201fe",
        __typename: "TaskQueueItem",
      },
      {
        activatedBy: "admin",
        buildVariant: "os-x-108-64",
        displayName: "compile",
        expectedDuration: 600000,
        id: "mongo_c_driver_os_x_108_64_compile_d42ef14854895f02054d95a25fe7e12dfdb327d8_16_05_03_02_36_47",
        priority: 0,
        project:
          "0ca28fc26cf92159f774660f135f376fdcb90c23488cfa461a9969243643feb7",
        requester: TaskQueueItemType.Patch,
        version: "mongodb_mongo_v4.2_cef23d286f5f9af1295d8097b33df764cc2201fe",
        __typename: "TaskQueueItem",
      },
      {
        activatedBy: "admin",
        buildVariant: "osx-108-debug",
        displayName: "compile",
        expectedDuration: 600000,
        id: "mongodb_mongo_v3.0.11_osx_108_debug_compile_336e39e76e7a65af1ec534f28e69f568ca97695c_16_06_13_21_07_12",
        priority: 0,
        project:
          "23c73fc8a605de0e6d71f776128544356dca2a243a459db334d3514ae74a1ba7",
        requester: TaskQueueItemType.Commit,
        version: "mongodb_mongo_v4.2_cef23d286f5f9af1295d8097b33df764cc2201fe",
        __typename: "TaskQueueItem",
      },
      {
        activatedBy: "admin",
        buildVariant: "os-x-108-64-openssl",
        displayName: "compile",
        expectedDuration: 600000,
        id: "mongo_c_driver_os_x_108_64_openssl_compile_292ceeaae06844f3d759e4a05e9b9cb7be97171e_16_04_15_17_13_00",
        priority: 0,
        project:
          "0ca28fc26cf92159f774660f135f376fdcb90c23488cfa461a9969243643feb7",
        requester: TaskQueueItemType.Patch,
        version: "mongodb_mongo_v4.2_cef23d286f5f9af1295d8097b33df764cc2201fe",
        __typename: "TaskQueueItem",
      },
      {
        activatedBy: "admin",
        buildVariant: "os-x-108-64-nativessl",
        displayName: "compile",
        expectedDuration: 600000,
        id: "mongo_c_driver_os_x_108_64_nativessl_compile_292ceeaae06844f3d759e4a05e9b9cb7be97171e_16_04_15_17_13_00",
        priority: 0,
        project:
          "0ca28fc26cf92159f774660f135f376fdcb90c23488cfa461a9969243643feb7",
        requester: TaskQueueItemType.Patch,
        version: "mongodb_mongo_v4.2_cef23d286f5f9af1295d8097b33df764cc2201fe",
        __typename: "TaskQueueItem",
      },
      {
        activatedBy: "admin",
        buildVariant: "os-x-108-64-nativessl",
        displayName: "compile",
        expectedDuration: 600000,
        id: "mongo_c_driver_os_x_108_64_nativessl_compile_292ceeaae06844f3d759e4a05e9b9cb7be97171e_16_04_15_16_54_00",
        priority: 0,
        project:
          "0ca28fc26cf92159f774660f135f376fdcb90c23488cfa461a9969243643feb7",
        requester: TaskQueueItemType.Patch,
        version: "mongodb_mongo_v4.2_cef23d286f5f9af1295d8097b33df764cc2201fe",
        __typename: "TaskQueueItem",
      },
      {
        activatedBy: "admin",
        buildVariant: "os-x-108-64-openssl",
        displayName: "compile",
        expectedDuration: 600000,
        id: "mongo_c_driver_os_x_108_64_openssl_compile_292ceeaae06844f3d759e4a05e9b9cb7be97171e_16_04_15_16_54_00",
        priority: 0,
        project:
          "0ca28fc26cf92159f774660f135f376fdcb90c23488cfa461a9969243643feb7",
        requester: TaskQueueItemType.Patch,
        version: "mongodb_mongo_v4.2_cef23d286f5f9af1295d8097b33df764cc2201fe",
        __typename: "TaskQueueItem",
      },
      {
        activatedBy: "admin",
        buildVariant: "osx-108",
        displayName: "compile_and_test",
        expectedDuration: 600000,
        id: "mongodb_cpp_driver_dev_osx_108_compile_and_test_671bda78e9947426e78bdae3ea13be1ce64ffe18_16_07_26_16_11_48",
        priority: 0,
        project:
          "6f2c7211d1e40f3dd1d94a01990ca00513105be180ef6adced3ab46376105676",
        requester: TaskQueueItemType.Patch,
        version: "mongodb_mongo_v4.2_cef23d286f5f9af1295d8097b33df764cc2201fe",
        __typename: "TaskQueueItem",
      },
      {
        activatedBy: "admin",
        buildVariant: "osx-108",
        displayName: "compile_and_test",
        expectedDuration: 600000,
        id: "mongodb_cpp_driver_dev_osx_108_compile_and_test_671bda78e9947426e78bdae3ea13be1ce64ffe18_16_07_26_18_51_23",
        priority: 0,
        project:
          "6f2c7211d1e40f3dd1d94a01990ca00513105be180ef6adced3ab46376105676",
        requester: TaskQueueItemType.Patch,
        version: "mongodb_mongo_v4.2_cef23d286f5f9af1295d8097b33df764cc2201fe",
        __typename: "TaskQueueItem",
      },
      {
        activatedBy: "admin",
        buildVariant: "osx-108",
        displayName: "compile_and_test",
        expectedDuration: 600000,
        id: "evergreen_lint_lint_service_patch_5e823e1f28baeaa22ae00823d83e03082cd148ab_5e4ff3abe3c3317e352062e4_20_02_21_15_13_48",
        priority: 0,
        project:
          "6f2c7211d1e40f3dd1d94a01990ca00513105be180ef6adced3ab46376105676",
        requester: TaskQueueItemType.Patch,
        version: "mongodb_mongo_v4.2_cef23d286f5f9af1295d8097b33df764cc2201fe",
        __typename: "TaskQueueItem",
      },
    ],
  },
};
