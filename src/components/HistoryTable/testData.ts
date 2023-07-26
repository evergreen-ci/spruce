export const mainlineCommitData = {
  versions: [
    {
      version: {
        id: "evergreen_d4cf298cf0b2536fb3bff875775b93a9ceafb75c",
        author: "Malik Hadjri",
        createTime: "2021-09-02T14:20:04Z" as any,
        message:
          "EVG-15213: Reference a project’s configuration when interacting with perf plugin configs (#4992)",
        revision: "d4cf298cf0b2536fb3bff875775b93a9ceafb75c",
        order: 3399,
        buildVariants: [
          {
            displayName: "Lint",
            variant: "lint",
            tasks: [
              {
                id: "evergreen_lint_lint_model_distro_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
                execution: 0,
                status: "success",
                displayName: "Lint",
              },
            ],
          },
          {
            displayName: "Race Detector",
            variant: "race-detector",
            tasks: [
              {
                id: "evergreen_race_detector_test_model_distro_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
                execution: 0,
                status: "success",
                displayName: "test-model-distro",
              },
            ],
          },
          {
            displayName: "Ubuntu 16.04",
            variant: "ubuntu1604",
            tasks: [
              {
                id: "evergreen_ubuntu1604_dist_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
                execution: 0,
                status: "failed",
                displayName: "dist",
              },
              {
                id: "evergreen_ubuntu1604_test_model_distro_d4cf298cf0b2536fb3bff875775b93a9ceafb75c_21_09_02_14_20_04",
                execution: 0,
                status: "success",
                displayName: "test-model-distro",
              },
            ],
          },
        ],
      },
      rolledUpVersions: null,
    },
    {
      version: {
        id: "evergreen_f476f5f137d385858d633300521a744970540f54",
        author: "Mohamed Khelif",
        createTime: "2021-09-02T14:07:07Z" as any,
        message: "EVG-15357 Include display name for build variants (#4990)",
        revision: "f476f5f137d385858d633300521a744970540f54",
        order: 3398,
        buildVariants: [
          {
            displayName: "Lint",
            variant: "lint",
            tasks: [
              {
                id: "evergreen_lint_lint_model_distro_f476f5f137d385858d633300521a744970540f54_21_09_02_14_07_07",
                execution: 0,
                status: "success",
                displayName: "Lint",
              },
            ],
          },
          {
            displayName: "Race Detector",
            variant: "race-detector",
            tasks: [
              {
                id: "evergreen_race_detector_test_model_distro_f476f5f137d385858d633300521a744970540f54_21_09_02_14_07_07",
                execution: 0,
                status: "success",
                displayName: "test-model-distro",
              },
            ],
          },
          {
            displayName: "Ubuntu 16.04",
            variant: "ubuntu1604",
            tasks: [
              {
                id: "evergreen_ubuntu1604_dist_f476f5f137d385858d633300521a744970540f54_21_09_02_14_07_07",
                execution: 0,
                status: "success",
                displayName: "dist",
              },
              {
                id: "evergreen_ubuntu1604_test_model_distro_f476f5f137d385858d633300521a744970540f54_21_09_02_14_07_07",
                execution: 0,
                status: "unscheduled",
                displayName: "test-model-distro",
              },
            ],
          },
        ],
      },
      rolledUpVersions: null,
    },
    {
      version: {
        id: "evergreen_d74a055481b3c706f37098b0b1bd8c3ae73ef9ac",
        author: "Bynn Lee",
        createTime: "2021-09-01T20:41:31Z" as any,
        message:
          "EVG-14956 Verify that PatchedConfig stores the merged config (#4981)",
        revision: "d74a055481b3c706f37098b0b1bd8c3ae73ef9ac",
        order: 3397,
        buildVariants: [
          {
            displayName: "Lint",
            variant: "lint",
            tasks: [
              {
                id: "evergreen_lint_lint_model_distro_d74a055481b3c706f37098b0b1bd8c3ae73ef9ac_21_09_01_20_41_31",
                execution: 0,
                status: "success",
                displayName: "Lint",
              },
            ],
          },
          {
            displayName: "Race Detector",
            variant: "race-detector",
            tasks: [
              {
                id: "evergreen_race_detector_test_model_distro_d74a055481b3c706f37098b0b1bd8c3ae73ef9ac_21_09_01_20_41_31",
                execution: 0,
                status: "success",
                displayName: "test-model-distro",
              },
            ],
          },
          {
            displayName: "Ubuntu 16.04",
            variant: "ubuntu1604",
            tasks: [
              {
                id: "evergreen_ubuntu1604_dist_d74a055481b3c706f37098b0b1bd8c3ae73ef9ac_21_09_01_20_41_31",
                execution: 0,
                status: "success",
                displayName: "dist",
              },
              {
                id: "evergreen_ubuntu1604_test_model_distro_d74a055481b3c706f37098b0b1bd8c3ae73ef9ac_21_09_01_20_41_31",
                execution: 0,
                status: "success",
                displayName: "test-model-distro",
              },
            ],
          },
        ],
      },
      rolledUpVersions: null,
    },
    {
      version: {
        id: "evergreen_5c34535229dcda24f968b707b022c51245958aab",
        author: "Malik Hadjri",
        createTime: "2021-09-01T18:25:38Z" as any,
        message:
          "EVG-15212: Only reference a project’s configuration when interacting with build baron configs (#4959)",
        revision: "5c34535229dcda24f968b707b022c51245958aab",
        order: 3396,
        buildVariants: [
          {
            displayName: "Lint",
            variant: "lint",
            tasks: [
              {
                id: "evergreen_lint_lint_model_distro_5c34535229dcda24f968b707b022c51245958aab_21_09_01_18_25_38",
                execution: 0,
                status: "success",
                displayName: "Lint",
              },
            ],
          },
          {
            displayName: "Race Detector",
            variant: "race-detector",
            tasks: [
              {
                id: "evergreen_race_detector_test_model_distro_5c34535229dcda24f968b707b022c51245958aab_21_09_01_18_25_38",
                execution: 0,
                status: "success",
                displayName: "test-model-distro",
              },
            ],
          },
          {
            displayName: "Ubuntu 16.04",
            variant: "ubuntu1604",
            tasks: [
              {
                id: "evergreen_ubuntu1604_dist_5c34535229dcda24f968b707b022c51245958aab_21_09_01_18_25_38",
                execution: 0,
                status: "success",
                displayName: "dist",
              },
              {
                id: "evergreen_ubuntu1604_test_model_distro_5c34535229dcda24f968b707b022c51245958aab_21_09_01_18_25_38",
                execution: 0,
                status: "success",
                displayName: "test-model-distro",
              },
            ],
          },
        ],
      },
      rolledUpVersions: null,
    },
    {
      version: {
        id: "evergreen_fc023273280db4689ee824983736401521e73d71",
        author: "Annie Black",
        createTime: "2021-09-01T18:19:34Z" as any,
        message: "EVG-15338 use valid js syntax (#4991)",
        revision: "fc023273280db4689ee824983736401521e73d71",
        order: 3395,
        buildVariants: [
          {
            displayName: "Lint",
            variant: "lint",
            tasks: [
              {
                id: "evergreen_lint_lint_model_distro_fc023273280db4689ee824983736401521e73d71_21_09_01_18_19_34",
                execution: 0,
                status: "success",
                displayName: "Lint",
              },
            ],
          },
          {
            displayName: "Race Detector",
            variant: "race-detector",
            tasks: [
              {
                id: "evergreen_race_detector_test_model_distro_fc023273280db4689ee824983736401521e73d71_21_09_01_18_19_34",
                execution: 0,
                status: "success",
                displayName: "test-model-distro",
              },
            ],
          },
          {
            displayName: "Ubuntu 16.04",
            variant: "ubuntu1604",
            tasks: [
              {
                id: "evergreen_ubuntu1604_dist_fc023273280db4689ee824983736401521e73d71_21_09_01_18_19_34",
                execution: 0,
                status: "success",
                displayName: "dist",
              },
              {
                id: "evergreen_ubuntu1604_test_model_distro_fc023273280db4689ee824983736401521e73d71_21_09_01_18_19_34",
                execution: 0,
                status: "success",
                displayName: "test-model-distro",
              },
            ],
          },
        ],
      },
      rolledUpVersions: null,
    },
    {
      version: null,
      rolledUpVersions: [
        {
          id: "evergreen_5c34535229dcda24f968b707b022c51245923ad",
          author: "Malik Hadjri",
          createTime: "2021-08-31T18:25:38Z" as any,
          message: "EVG-15211: Don't run this (#4957)",
          revision: "5c34535229dcda24f968b707b022c51245958aab",
          order: 3395,
        },
      ],
    },
  ],
  nextPageOrderNumber: 3395,
  prevPageOrderNumber: null,
};

export const columns = [
  "enterprise-windows-required",
  "enterprise-windows-all-feature-flags-required",
  "enterprise-rhel-80-64-bit-dynamic-required",
  "enterprise-rhel-80-64-bit-dynamic-all-feature-flags-required",
  "linux-64-debug-required",
  "ubuntu1804-debug-aubsan-lite-required",
  "ubuntu1804-debug-aubsan-lite-all-feature-flags-required",
  "enterprise-rhel-80-64-bit-suggested",
  "enterprise-windows-suggested",
  "enterprise-windows-all-feature-flags-suggested",
  "ubuntu1804-debug-suggested",
  "macos-debug-suggested",
  "windows-debug-suggested",
  "amazon",
  "amazon2",
  "amazon2-arm64",
  "debian10",
  "debian92",
  "enterprise-linux-64-amazon-ami",
  "enterprise-amazon2",
  "enterprise-amazon2-arm64",
  "enterprise-debian10-64",
  "enterprise-debian92-64",
  "enterprise-rhel-70-64-bit",
  "enterprise-rhel-72-s390x",
];
