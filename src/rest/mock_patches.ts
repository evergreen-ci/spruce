export function getMockPatches() {
  return {
    "VersionsMap": {
      "5d430370850e6177128e0b11": {
        "Version": {
          "id": "5d430370850e6177128e0b11",
          "create_time": "2019-08-01T15:21:21.685Z",
          "start_time": "2019-08-01T15:21:51.75Z",
          "finish_time": "2019-08-01T15:23:47.328Z",
          "revision": "d34092b13394dd7827e88f115e597add08b205b5",
          "author": "domino.weir",
          "message": "'evergreen-ci/spruce' pull request #18 by dominoweir: EVG-6407: add searching by patch attribute (https://github.com/evergreen-ci/spruce/pull/18)",
          "status": "failed",
          "order": 151,
          "ignored": false,
          "branch_name": "master",
          "build_variants_status": [
            {
              "id": "ubuntu1604",
              "activated": true,
              "activate_at": "0001-01-01T00:00:00Z",
              "build_id": "spruce_ubuntu1604_patch_d34092b13394dd7827e88f115e597add08b205b5_5d430370850e6177128e0b11_19_08_01_15_21_21"
            }
          ],
          "builds": [
            "spruce_ubuntu1604_patch_d34092b13394dd7827e88f115e597add08b205b5_5d430370850e6177128e0b11_19_08_01_15_21_21"
          ],
          "identifier": "spruce",
          "requester": "github_pull_request",
          "author_id": "domino.weir"
        },
        "Builds": [
          {
            "Build": {
              "_id": "spruce_ubuntu1604_patch_d34092b13394dd7827e88f115e597add08b205b5_5d430370850e6177128e0b11_19_08_01_15_21_21",
              "create_time": "2019-08-01T15:21:21.685Z",
              "start_time": "2019-08-01T15:21:43.812Z",
              "finish_time": "2019-08-01T15:23:47.328Z",
              "version": "5d430370850e6177128e0b11",
              "branch": "spruce",
              "gitspec": "d34092b13394dd7827e88f115e597add08b205b5",
              "build_variant": "ubuntu1604",
              "build_number": "41110",
              "status": "failed",
              "activated_by": "github_pull_request",
              "activated_time": "2019-08-01T18:30:27.576Z",
              "order": 151,
              "tasks": [
                {
                  "id": "spruce_ubuntu1604_compile_patch_d34092b13394dd7827e88f115e597add08b205b5_5d430370850e6177128e0b11_19_08_01_15_21_21",
                  "display_name": "compile",
                  "status": "success",
                  "task_end_details": {
                    "status": "success",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-build\" (#1)"
                  },
                  "start_time": "2019-08-01T15:21:43.812Z",
                  "time_taken": 123442241821,
                  "activated": true
                },
                {
                  "id": "spruce_ubuntu1604_lint_patch_d34092b13394dd7827e88f115e597add08b205b5_5d430370850e6177128e0b11_19_08_01_15_21_21",
                  "display_name": "lint",
                  "status": "success",
                  "task_end_details": {
                    "status": "success",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-lint\" (#1)"
                  },
                  "start_time": "2019-08-01T15:21:45.579Z",
                  "time_taken": 44642954368,
                  "activated": true
                },
                {
                  "id": "spruce_ubuntu1604_test_patch_d34092b13394dd7827e88f115e597add08b205b5_5d430370850e6177128e0b11_19_08_01_15_21_21",
                  "display_name": "test",
                  "status": "failed",
                  "task_end_details": {
                    "status": "failed",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-test\" (#1)"
                  },
                  "start_time": "2019-08-01T15:21:51.75Z",
                  "time_taken": 54460421128,
                  "activated": true
                }
              ],
              "time_taken": 123516157201,
              "display_name": "Ubuntu 16.04",
              "predicted_makespan": 123442241821,
              "actual_makespan": 123442000000,
              "r": "github_pull_request"
            },
            "Version": {
              "create_time": "0001-01-01T00:00:00Z",
              "start_time": "0001-01-01T00:00:00Z",
              "finish_time": "0001-01-01T00:00:00Z",
              "ignored": false
            },
            "Tasks": [
              {
                "Task": {
                  "id": "spruce_ubuntu1604_compile_patch_d34092b13394dd7827e88f115e597add08b205b5_5d430370850e6177128e0b11_19_08_01_15_21_21",
                  "secret": "",
                  "create_time": "0001-01-01T00:00:00Z",
                  "ingest_time": "0001-01-01T00:00:00Z",
                  "dispatch_time": "0001-01-01T00:00:00Z",
                  "scheduled_time": "0001-01-01T00:00:00Z",
                  "start_time": "0001-01-01T00:00:00Z",
                  "finish_time": "0001-01-01T00:00:00Z",
                  "activated_time": "0001-01-01T00:00:00Z",
                  "gitspec": "",
                  "priority": 0,
                  "task_group": "",
                  "LastHeartbeat": "0001-01-01T00:00:00Z",
                  "activated": false,
                  "activated_by": "",
                  "build_id": "",
                  "distro": "",
                  "build_variant": "",
                  "depends_on": null,
                  "display_name": "compile",
                  "host_id": "",
                  "execution": 0,
                  "r": "",
                  "status": "success",
                  "task_end_details": {
                    "status": "success",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-build\" (#1)"
                  },
                  "abort": false,
                  "time_taken": 0,
                  "test_results": null
                },
                "Gitspec": "",
                "BuildDisplay": "",
                "TaskLog": null,
                "NextTasks": null,
                "PreviousTasks": null,
                "Elapsed": 0,
                "StartTime": 0,
                "failed_test_names": null,
                "expected_duration": 0
              },
              {
                "Task": {
                  "id": "spruce_ubuntu1604_lint_patch_d34092b13394dd7827e88f115e597add08b205b5_5d430370850e6177128e0b11_19_08_01_15_21_21",
                  "secret": "",
                  "create_time": "0001-01-01T00:00:00Z",
                  "ingest_time": "0001-01-01T00:00:00Z",
                  "dispatch_time": "0001-01-01T00:00:00Z",
                  "scheduled_time": "0001-01-01T00:00:00Z",
                  "start_time": "0001-01-01T00:00:00Z",
                  "finish_time": "0001-01-01T00:00:00Z",
                  "activated_time": "0001-01-01T00:00:00Z",
                  "gitspec": "",
                  "priority": 0,
                  "task_group": "",
                  "LastHeartbeat": "0001-01-01T00:00:00Z",
                  "activated": false,
                  "activated_by": "",
                  "build_id": "",
                  "distro": "",
                  "build_variant": "",
                  "depends_on": null,
                  "display_name": "lint",
                  "host_id": "",
                  "execution": 0,
                  "r": "",
                  "status": "success",
                  "task_end_details": {
                    "status": "success",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-lint\" (#1)"
                  },
                  "abort": false,
                  "time_taken": 0,
                  "test_results": null
                },
                "Gitspec": "",
                "BuildDisplay": "",
                "TaskLog": null,
                "NextTasks": null,
                "PreviousTasks": null,
                "Elapsed": 0,
                "StartTime": 0,
                "failed_test_names": null,
                "expected_duration": 0
              },
              {
                "Task": {
                  "id": "spruce_ubuntu1604_test_patch_d34092b13394dd7827e88f115e597add08b205b5_5d430370850e6177128e0b11_19_08_01_15_21_21",
                  "secret": "",
                  "create_time": "0001-01-01T00:00:00Z",
                  "ingest_time": "0001-01-01T00:00:00Z",
                  "dispatch_time": "0001-01-01T00:00:00Z",
                  "scheduled_time": "0001-01-01T00:00:00Z",
                  "start_time": "0001-01-01T00:00:00Z",
                  "finish_time": "0001-01-01T00:00:00Z",
                  "activated_time": "0001-01-01T00:00:00Z",
                  "gitspec": "",
                  "priority": 0,
                  "task_group": "",
                  "LastHeartbeat": "0001-01-01T00:00:00Z",
                  "activated": false,
                  "activated_by": "",
                  "build_id": "",
                  "distro": "",
                  "build_variant": "",
                  "depends_on": null,
                  "display_name": "test",
                  "host_id": "",
                  "execution": 0,
                  "r": "",
                  "status": "failed",
                  "task_end_details": {
                    "status": "failed",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-test\" (#1)"
                  },
                  "abort": false,
                  "time_taken": 0,
                  "test_results": null
                },
                "Gitspec": "",
                "BuildDisplay": "",
                "TaskLog": null,
                "NextTasks": null,
                "PreviousTasks": null,
                "Elapsed": 0,
                "StartTime": 0,
                "failed_test_names": null,
                "expected_duration": 0
              }
            ],
            "Elapsed": 0,
            "time_taken": 0,
            "makespan": 0,
            "CurrentTime": 0,
            "repo_owner": "",
            "repo_name": "",
            "taskStatusCount": {
              "succeeded": 0,
              "failed": 0,
              "started": 0,
              "undispatched": 0,
              "inactive": 0,
              "dispatched": 0,
              "timed_out": 0
            }
          }
        ],
        "ActiveTasks": 0,
        "repo_owner": "",
        "repo_name": "",
        "time_taken": 0,
        "makespan": 0
      },
      "5d4306f33e8e863bf3bfa63c": {
        "Version": {
          "id": "5d4306f33e8e863bf3bfa63c",
          "create_time": "2019-08-01T15:36:20.247Z",
          "start_time": "2019-08-01T15:36:39.951Z",
          "finish_time": "2019-08-01T15:38:35.517Z",
          "revision": "d34092b13394dd7827e88f115e597add08b205b5",
          "author": "domino.weir",
          "message": "'evergreen-ci/spruce' pull request #18 by dominoweir: EVG-6407: add searching by patch attribute (https://github.com/evergreen-ci/spruce/pull/18)",
          "status": "failed",
          "order": 152,
          "ignored": false,
          "branch_name": "master",
          "build_variants_status": [
            {
              "id": "ubuntu1604",
              "activated": true,
              "activate_at": "0001-01-01T00:00:00Z",
              "build_id": "spruce_ubuntu1604_patch_d34092b13394dd7827e88f115e597add08b205b5_5d4306f33e8e863bf3bfa63c_19_08_01_15_36_20"
            }
          ],
          "builds": [
            "spruce_ubuntu1604_patch_d34092b13394dd7827e88f115e597add08b205b5_5d4306f33e8e863bf3bfa63c_19_08_01_15_36_20"
          ],
          "identifier": "spruce",
          "requester": "github_pull_request",
          "author_id": "domino.weir"
        },
        "Builds": [
          {
            "Build": {
              "_id": "spruce_ubuntu1604_patch_d34092b13394dd7827e88f115e597add08b205b5_5d4306f33e8e863bf3bfa63c_19_08_01_15_36_20",
              "create_time": "2019-08-01T15:36:20.247Z",
              "start_time": "2019-08-01T15:36:37.264Z",
              "finish_time": "2019-08-01T15:38:35.517Z",
              "version": "5d4306f33e8e863bf3bfa63c",
              "branch": "spruce",
              "gitspec": "d34092b13394dd7827e88f115e597add08b205b5",
              "build_variant": "ubuntu1604",
              "build_number": "41111",
              "status": "failed",
              "activated_by": "github_pull_request",
              "activated_time": "2019-08-01T18:30:27.622Z",
              "order": 152,
              "tasks": [
                {
                  "id": "spruce_ubuntu1604_compile_patch_d34092b13394dd7827e88f115e597add08b205b5_5d4306f33e8e863bf3bfa63c_19_08_01_15_36_20",
                  "display_name": "compile",
                  "status": "success",
                  "task_end_details": {
                    "status": "success",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-build\" (#1)"
                  },
                  "start_time": "2019-08-01T15:36:37.264Z",
                  "time_taken": 118181459864,
                  "activated": true
                },
                {
                  "id": "spruce_ubuntu1604_lint_patch_d34092b13394dd7827e88f115e597add08b205b5_5d4306f33e8e863bf3bfa63c_19_08_01_15_36_20",
                  "display_name": "lint",
                  "status": "success",
                  "task_end_details": {
                    "status": "success",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-lint\" (#1)"
                  },
                  "start_time": "2019-08-01T15:36:38.266Z",
                  "time_taken": 49564576343,
                  "activated": true
                },
                {
                  "id": "spruce_ubuntu1604_test_patch_d34092b13394dd7827e88f115e597add08b205b5_5d4306f33e8e863bf3bfa63c_19_08_01_15_36_20",
                  "display_name": "test",
                  "status": "failed",
                  "task_end_details": {
                    "status": "failed",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-test\" (#1)"
                  },
                  "start_time": "2019-08-01T15:36:39.951Z",
                  "time_taken": 54145045448,
                  "activated": true
                }
              ],
              "time_taken": 118253594753,
              "display_name": "Ubuntu 16.04",
              "predicted_makespan": 118181459864,
              "actual_makespan": 118181000000,
              "r": "github_pull_request"
            },
            "Version": {
              "create_time": "0001-01-01T00:00:00Z",
              "start_time": "0001-01-01T00:00:00Z",
              "finish_time": "0001-01-01T00:00:00Z",
              "ignored": false
            },
            "Tasks": [
              {
                "Task": {
                  "id": "spruce_ubuntu1604_compile_patch_d34092b13394dd7827e88f115e597add08b205b5_5d4306f33e8e863bf3bfa63c_19_08_01_15_36_20",
                  "secret": "",
                  "create_time": "0001-01-01T00:00:00Z",
                  "ingest_time": "0001-01-01T00:00:00Z",
                  "dispatch_time": "0001-01-01T00:00:00Z",
                  "scheduled_time": "0001-01-01T00:00:00Z",
                  "start_time": "0001-01-01T00:00:00Z",
                  "finish_time": "0001-01-01T00:00:00Z",
                  "activated_time": "0001-01-01T00:00:00Z",
                  "gitspec": "",
                  "priority": 0,
                  "task_group": "",
                  "LastHeartbeat": "0001-01-01T00:00:00Z",
                  "activated": false,
                  "activated_by": "",
                  "build_id": "",
                  "distro": "",
                  "build_variant": "",
                  "depends_on": null,
                  "display_name": "compile",
                  "host_id": "",
                  "execution": 0,
                  "r": "",
                  "status": "success",
                  "task_end_details": {
                    "status": "success",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-build\" (#1)"
                  },
                  "abort": false,
                  "time_taken": 0,
                  "test_results": null
                },
                "Gitspec": "",
                "BuildDisplay": "",
                "TaskLog": null,
                "NextTasks": null,
                "PreviousTasks": null,
                "Elapsed": 0,
                "StartTime": 0,
                "failed_test_names": null,
                "expected_duration": 0
              },
              {
                "Task": {
                  "id": "spruce_ubuntu1604_lint_patch_d34092b13394dd7827e88f115e597add08b205b5_5d4306f33e8e863bf3bfa63c_19_08_01_15_36_20",
                  "secret": "",
                  "create_time": "0001-01-01T00:00:00Z",
                  "ingest_time": "0001-01-01T00:00:00Z",
                  "dispatch_time": "0001-01-01T00:00:00Z",
                  "scheduled_time": "0001-01-01T00:00:00Z",
                  "start_time": "0001-01-01T00:00:00Z",
                  "finish_time": "0001-01-01T00:00:00Z",
                  "activated_time": "0001-01-01T00:00:00Z",
                  "gitspec": "",
                  "priority": 0,
                  "task_group": "",
                  "LastHeartbeat": "0001-01-01T00:00:00Z",
                  "activated": false,
                  "activated_by": "",
                  "build_id": "",
                  "distro": "",
                  "build_variant": "",
                  "depends_on": null,
                  "display_name": "lint",
                  "host_id": "",
                  "execution": 0,
                  "r": "",
                  "status": "success",
                  "task_end_details": {
                    "status": "success",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-lint\" (#1)"
                  },
                  "abort": false,
                  "time_taken": 0,
                  "test_results": null
                },
                "Gitspec": "",
                "BuildDisplay": "",
                "TaskLog": null,
                "NextTasks": null,
                "PreviousTasks": null,
                "Elapsed": 0,
                "StartTime": 0,
                "failed_test_names": null,
                "expected_duration": 0
              },
              {
                "Task": {
                  "id": "spruce_ubuntu1604_test_patch_d34092b13394dd7827e88f115e597add08b205b5_5d4306f33e8e863bf3bfa63c_19_08_01_15_36_20",
                  "secret": "",
                  "create_time": "0001-01-01T00:00:00Z",
                  "ingest_time": "0001-01-01T00:00:00Z",
                  "dispatch_time": "0001-01-01T00:00:00Z",
                  "scheduled_time": "0001-01-01T00:00:00Z",
                  "start_time": "0001-01-01T00:00:00Z",
                  "finish_time": "0001-01-01T00:00:00Z",
                  "activated_time": "0001-01-01T00:00:00Z",
                  "gitspec": "",
                  "priority": 0,
                  "task_group": "",
                  "LastHeartbeat": "0001-01-01T00:00:00Z",
                  "activated": false,
                  "activated_by": "",
                  "build_id": "",
                  "distro": "",
                  "build_variant": "",
                  "depends_on": null,
                  "display_name": "test",
                  "host_id": "",
                  "execution": 0,
                  "r": "",
                  "status": "failed",
                  "task_end_details": {
                    "status": "failed",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-test\" (#1)"
                  },
                  "abort": false,
                  "time_taken": 0,
                  "test_results": null
                },
                "Gitspec": "",
                "BuildDisplay": "",
                "TaskLog": null,
                "NextTasks": null,
                "PreviousTasks": null,
                "Elapsed": 0,
                "StartTime": 0,
                "failed_test_names": null,
                "expected_duration": 0
              }
            ],
            "Elapsed": 0,
            "time_taken": 0,
            "makespan": 0,
            "CurrentTime": 0,
            "repo_owner": "",
            "repo_name": "",
            "taskStatusCount": {
              "succeeded": 0,
              "failed": 0,
              "started": 0,
              "undispatched": 0,
              "inactive": 0,
              "dispatched": 0,
              "timed_out": 0
            }
          }
        ],
        "ActiveTasks": 0,
        "repo_owner": "",
        "repo_name": "",
        "time_taken": 0,
        "makespan": 0
      },
      "5d4325c961837d1fdf407a4e": {
        "Version": {
          "id": "5d4325c961837d1fdf407a4e",
          "create_time": "2019-08-01T17:47:54.609Z",
          "start_time": "2019-08-01T17:50:51.555Z",
          "finish_time": "2019-08-01T17:52:50.256Z",
          "revision": "d34092b13394dd7827e88f115e597add08b205b5",
          "author": "domino.weir",
          "message": "'evergreen-ci/spruce' pull request #18 by dominoweir: EVG-6407: add searching by patch attribute (https://github.com/evergreen-ci/spruce/pull/18)",
          "status": "failed",
          "order": 153,
          "ignored": false,
          "branch_name": "master",
          "build_variants_status": [
            {
              "id": "ubuntu1604",
              "activated": true,
              "activate_at": "0001-01-01T00:00:00Z",
              "build_id": "spruce_ubuntu1604_patch_d34092b13394dd7827e88f115e597add08b205b5_5d4325c961837d1fdf407a4e_19_08_01_17_47_54"
            }
          ],
          "builds": [
            "spruce_ubuntu1604_patch_d34092b13394dd7827e88f115e597add08b205b5_5d4325c961837d1fdf407a4e_19_08_01_17_47_54"
          ],
          "identifier": "spruce",
          "requester": "github_pull_request",
          "author_id": "domino.weir"
        },
        "Builds": [
          {
            "Build": {
              "_id": "spruce_ubuntu1604_patch_d34092b13394dd7827e88f115e597add08b205b5_5d4325c961837d1fdf407a4e_19_08_01_17_47_54",
              "create_time": "2019-08-01T17:47:54.609Z",
              "start_time": "2019-08-01T17:50:46.994Z",
              "finish_time": "2019-08-01T17:52:50.256Z",
              "version": "5d4325c961837d1fdf407a4e",
              "branch": "spruce",
              "gitspec": "d34092b13394dd7827e88f115e597add08b205b5",
              "build_variant": "ubuntu1604",
              "build_number": "41130",
              "status": "failed",
              "activated_by": "github_pull_request",
              "activated_time": "2019-08-01T18:30:27.664Z",
              "order": 153,
              "tasks": [
                {
                  "id": "spruce_ubuntu1604_compile_patch_d34092b13394dd7827e88f115e597add08b205b5_5d4325c961837d1fdf407a4e_19_08_01_17_47_54",
                  "display_name": "compile",
                  "status": "success",
                  "task_end_details": {
                    "status": "success",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-build\" (#1)"
                  },
                  "start_time": "2019-08-01T17:50:46.994Z",
                  "time_taken": 123205431181,
                  "activated": true
                },
                {
                  "id": "spruce_ubuntu1604_lint_patch_d34092b13394dd7827e88f115e597add08b205b5_5d4325c961837d1fdf407a4e_19_08_01_17_47_54",
                  "display_name": "lint",
                  "status": "success",
                  "task_end_details": {
                    "status": "success",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-lint\" (#1)"
                  },
                  "start_time": "2019-08-01T17:50:47.691Z",
                  "time_taken": 41443918416,
                  "activated": true
                },
                {
                  "id": "spruce_ubuntu1604_test_patch_d34092b13394dd7827e88f115e597add08b205b5_5d4325c961837d1fdf407a4e_19_08_01_17_47_54",
                  "display_name": "test",
                  "status": "failed",
                  "task_end_details": {
                    "status": "failed",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-test\" (#1)"
                  },
                  "start_time": "2019-08-01T17:50:51.555Z",
                  "time_taken": 50722263158,
                  "activated": true
                }
              ],
              "time_taken": 123262801974,
              "display_name": "Ubuntu 16.04",
              "predicted_makespan": 123205431181,
              "actual_makespan": 123205000000,
              "r": "github_pull_request"
            },
            "Version": {
              "create_time": "0001-01-01T00:00:00Z",
              "start_time": "0001-01-01T00:00:00Z",
              "finish_time": "0001-01-01T00:00:00Z",
              "ignored": false
            },
            "Tasks": [
              {
                "Task": {
                  "id": "spruce_ubuntu1604_compile_patch_d34092b13394dd7827e88f115e597add08b205b5_5d4325c961837d1fdf407a4e_19_08_01_17_47_54",
                  "secret": "",
                  "create_time": "0001-01-01T00:00:00Z",
                  "ingest_time": "0001-01-01T00:00:00Z",
                  "dispatch_time": "0001-01-01T00:00:00Z",
                  "scheduled_time": "0001-01-01T00:00:00Z",
                  "start_time": "0001-01-01T00:00:00Z",
                  "finish_time": "0001-01-01T00:00:00Z",
                  "activated_time": "0001-01-01T00:00:00Z",
                  "gitspec": "",
                  "priority": 0,
                  "task_group": "",
                  "LastHeartbeat": "0001-01-01T00:00:00Z",
                  "activated": false,
                  "activated_by": "",
                  "build_id": "",
                  "distro": "",
                  "build_variant": "",
                  "depends_on": null,
                  "display_name": "compile",
                  "host_id": "",
                  "execution": 0,
                  "r": "",
                  "status": "success",
                  "task_end_details": {
                    "status": "success",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-build\" (#1)"
                  },
                  "abort": false,
                  "time_taken": 0,
                  "test_results": null
                },
                "Gitspec": "",
                "BuildDisplay": "",
                "TaskLog": null,
                "NextTasks": null,
                "PreviousTasks": null,
                "Elapsed": 0,
                "StartTime": 0,
                "failed_test_names": null,
                "expected_duration": 0
              },
              {
                "Task": {
                  "id": "spruce_ubuntu1604_lint_patch_d34092b13394dd7827e88f115e597add08b205b5_5d4325c961837d1fdf407a4e_19_08_01_17_47_54",
                  "secret": "",
                  "create_time": "0001-01-01T00:00:00Z",
                  "ingest_time": "0001-01-01T00:00:00Z",
                  "dispatch_time": "0001-01-01T00:00:00Z",
                  "scheduled_time": "0001-01-01T00:00:00Z",
                  "start_time": "0001-01-01T00:00:00Z",
                  "finish_time": "0001-01-01T00:00:00Z",
                  "activated_time": "0001-01-01T00:00:00Z",
                  "gitspec": "",
                  "priority": 0,
                  "task_group": "",
                  "LastHeartbeat": "0001-01-01T00:00:00Z",
                  "activated": false,
                  "activated_by": "",
                  "build_id": "",
                  "distro": "",
                  "build_variant": "",
                  "depends_on": null,
                  "display_name": "lint",
                  "host_id": "",
                  "execution": 0,
                  "r": "",
                  "status": "success",
                  "task_end_details": {
                    "status": "success",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-lint\" (#1)"
                  },
                  "abort": false,
                  "time_taken": 0,
                  "test_results": null
                },
                "Gitspec": "",
                "BuildDisplay": "",
                "TaskLog": null,
                "NextTasks": null,
                "PreviousTasks": null,
                "Elapsed": 0,
                "StartTime": 0,
                "failed_test_names": null,
                "expected_duration": 0
              },
              {
                "Task": {
                  "id": "spruce_ubuntu1604_test_patch_d34092b13394dd7827e88f115e597add08b205b5_5d4325c961837d1fdf407a4e_19_08_01_17_47_54",
                  "secret": "",
                  "create_time": "0001-01-01T00:00:00Z",
                  "ingest_time": "0001-01-01T00:00:00Z",
                  "dispatch_time": "0001-01-01T00:00:00Z",
                  "scheduled_time": "0001-01-01T00:00:00Z",
                  "start_time": "0001-01-01T00:00:00Z",
                  "finish_time": "0001-01-01T00:00:00Z",
                  "activated_time": "0001-01-01T00:00:00Z",
                  "gitspec": "",
                  "priority": 0,
                  "task_group": "",
                  "LastHeartbeat": "0001-01-01T00:00:00Z",
                  "activated": false,
                  "activated_by": "",
                  "build_id": "",
                  "distro": "",
                  "build_variant": "",
                  "depends_on": null,
                  "display_name": "test",
                  "host_id": "",
                  "execution": 0,
                  "r": "",
                  "status": "failed",
                  "task_end_details": {
                    "status": "failed",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-test\" (#1)"
                  },
                  "abort": false,
                  "time_taken": 0,
                  "test_results": null
                },
                "Gitspec": "",
                "BuildDisplay": "",
                "TaskLog": null,
                "NextTasks": null,
                "PreviousTasks": null,
                "Elapsed": 0,
                "StartTime": 0,
                "failed_test_names": null,
                "expected_duration": 0
              }
            ],
            "Elapsed": 0,
            "time_taken": 0,
            "makespan": 0,
            "CurrentTime": 0,
            "repo_owner": "",
            "repo_name": "",
            "taskStatusCount": {
              "succeeded": 0,
              "failed": 0,
              "started": 0,
              "undispatched": 0,
              "inactive": 0,
              "dispatched": 0,
              "timed_out": 0
            }
          }
        ],
        "ActiveTasks": 0,
        "repo_owner": "",
        "repo_name": "",
        "time_taken": 0,
        "makespan": 0
      },
      "5d432ecbe3c3317db456ac59": {
        "Version": {
          "id": "5d432ecbe3c3317db456ac59",
          "create_time": "2019-08-01T18:26:20.373Z",
          "start_time": "0001-01-01T00:00:00Z",
          "finish_time": "0001-01-01T00:00:00Z",
          "revision": "d34092b13394dd7827e88f115e597add08b205b5",
          "author": "domino.weir",
          "message": "'evergreen-ci/spruce' pull request #18 by dominoweir: EVG-6407: add searching by patch attribute (https://github.com/evergreen-ci/spruce/pull/18)",
          "status": "created",
          "order": 154,
          "ignored": false,
          "branch_name": "master",
          "build_variants_status": [
            {
              "id": "ubuntu1604",
              "activated": true,
              "activate_at": "0001-01-01T00:00:00Z",
              "build_id": "spruce_ubuntu1604_patch_d34092b13394dd7827e88f115e597add08b205b5_5d432ecbe3c3317db456ac59_19_08_01_18_26_20"
            }
          ],
          "builds": [
            "spruce_ubuntu1604_patch_d34092b13394dd7827e88f115e597add08b205b5_5d432ecbe3c3317db456ac59_19_08_01_18_26_20"
          ],
          "identifier": "spruce",
          "requester": "github_pull_request",
          "author_id": "domino.weir"
        },
        "Builds": [
          {
            "Build": {
              "_id": "spruce_ubuntu1604_patch_d34092b13394dd7827e88f115e597add08b205b5_5d432ecbe3c3317db456ac59_19_08_01_18_26_20",
              "create_time": "2019-08-01T18:26:20.373Z",
              "start_time": "0001-01-01T00:00:00Z",
              "finish_time": "0001-01-01T00:00:00Z",
              "version": "5d432ecbe3c3317db456ac59",
              "branch": "spruce",
              "gitspec": "d34092b13394dd7827e88f115e597add08b205b5",
              "build_variant": "ubuntu1604",
              "build_number": "41138",
              "status": "created",
              "activated_by": "github_pull_request",
              "activated_time": "2019-08-01T18:30:27.716Z",
              "order": 154,
              "tasks": [
                {
                  "id": "spruce_ubuntu1604_compile_patch_d34092b13394dd7827e88f115e597add08b205b5_5d432ecbe3c3317db456ac59_19_08_01_18_26_20",
                  "display_name": "compile",
                  "status": "undispatched",
                  "task_end_details": {},
                  "start_time": "1970-01-01T00:00:00Z",
                  "time_taken": 0,
                  "activated": false
                },
                {
                  "id": "spruce_ubuntu1604_lint_patch_d34092b13394dd7827e88f115e597add08b205b5_5d432ecbe3c3317db456ac59_19_08_01_18_26_20",
                  "display_name": "lint",
                  "status": "undispatched",
                  "task_end_details": {},
                  "start_time": "1970-01-01T00:00:00Z",
                  "time_taken": 0,
                  "activated": false
                },
                {
                  "id": "spruce_ubuntu1604_test_patch_d34092b13394dd7827e88f115e597add08b205b5_5d432ecbe3c3317db456ac59_19_08_01_18_26_20",
                  "display_name": "test",
                  "status": "undispatched",
                  "task_end_details": {},
                  "start_time": "1970-01-01T00:00:00Z",
                  "time_taken": 0,
                  "activated": false
                }
              ],
              "display_name": "Ubuntu 16.04",
              "r": "github_pull_request"
            },
            "Version": {
              "create_time": "0001-01-01T00:00:00Z",
              "start_time": "0001-01-01T00:00:00Z",
              "finish_time": "0001-01-01T00:00:00Z",
              "ignored": false
            },
            "Tasks": [
              {
                "Task": {
                  "id": "spruce_ubuntu1604_compile_patch_d34092b13394dd7827e88f115e597add08b205b5_5d432ecbe3c3317db456ac59_19_08_01_18_26_20",
                  "secret": "",
                  "create_time": "0001-01-01T00:00:00Z",
                  "ingest_time": "0001-01-01T00:00:00Z",
                  "dispatch_time": "0001-01-01T00:00:00Z",
                  "scheduled_time": "0001-01-01T00:00:00Z",
                  "start_time": "0001-01-01T00:00:00Z",
                  "finish_time": "0001-01-01T00:00:00Z",
                  "activated_time": "0001-01-01T00:00:00Z",
                  "gitspec": "",
                  "priority": 0,
                  "task_group": "",
                  "LastHeartbeat": "0001-01-01T00:00:00Z",
                  "activated": false,
                  "activated_by": "",
                  "build_id": "",
                  "distro": "",
                  "build_variant": "",
                  "depends_on": null,
                  "display_name": "compile",
                  "host_id": "",
                  "execution": 0,
                  "r": "",
                  "status": "undispatched",
                  "task_end_details": {},
                  "abort": false,
                  "time_taken": 0,
                  "test_results": null
                },
                "Gitspec": "",
                "BuildDisplay": "",
                "TaskLog": null,
                "NextTasks": null,
                "PreviousTasks": null,
                "Elapsed": 0,
                "StartTime": 0,
                "failed_test_names": null,
                "expected_duration": 0
              },
              {
                "Task": {
                  "id": "spruce_ubuntu1604_lint_patch_d34092b13394dd7827e88f115e597add08b205b5_5d432ecbe3c3317db456ac59_19_08_01_18_26_20",
                  "secret": "",
                  "create_time": "0001-01-01T00:00:00Z",
                  "ingest_time": "0001-01-01T00:00:00Z",
                  "dispatch_time": "0001-01-01T00:00:00Z",
                  "scheduled_time": "0001-01-01T00:00:00Z",
                  "start_time": "0001-01-01T00:00:00Z",
                  "finish_time": "0001-01-01T00:00:00Z",
                  "activated_time": "0001-01-01T00:00:00Z",
                  "gitspec": "",
                  "priority": 0,
                  "task_group": "",
                  "LastHeartbeat": "0001-01-01T00:00:00Z",
                  "activated": false,
                  "activated_by": "",
                  "build_id": "",
                  "distro": "",
                  "build_variant": "",
                  "depends_on": null,
                  "display_name": "lint",
                  "host_id": "",
                  "execution": 0,
                  "r": "",
                  "status": "undispatched",
                  "task_end_details": {},
                  "abort": false,
                  "time_taken": 0,
                  "test_results": null
                },
                "Gitspec": "",
                "BuildDisplay": "",
                "TaskLog": null,
                "NextTasks": null,
                "PreviousTasks": null,
                "Elapsed": 0,
                "StartTime": 0,
                "failed_test_names": null,
                "expected_duration": 0
              },
              {
                "Task": {
                  "id": "spruce_ubuntu1604_test_patch_d34092b13394dd7827e88f115e597add08b205b5_5d432ecbe3c3317db456ac59_19_08_01_18_26_20",
                  "secret": "",
                  "create_time": "0001-01-01T00:00:00Z",
                  "ingest_time": "0001-01-01T00:00:00Z",
                  "dispatch_time": "0001-01-01T00:00:00Z",
                  "scheduled_time": "0001-01-01T00:00:00Z",
                  "start_time": "0001-01-01T00:00:00Z",
                  "finish_time": "0001-01-01T00:00:00Z",
                  "activated_time": "0001-01-01T00:00:00Z",
                  "gitspec": "",
                  "priority": 0,
                  "task_group": "",
                  "LastHeartbeat": "0001-01-01T00:00:00Z",
                  "activated": false,
                  "activated_by": "",
                  "build_id": "",
                  "distro": "",
                  "build_variant": "",
                  "depends_on": null,
                  "display_name": "test",
                  "host_id": "",
                  "execution": 0,
                  "r": "",
                  "status": "undispatched",
                  "task_end_details": {},
                  "abort": false,
                  "time_taken": 0,
                  "test_results": null
                },
                "Gitspec": "",
                "BuildDisplay": "",
                "TaskLog": null,
                "NextTasks": null,
                "PreviousTasks": null,
                "Elapsed": 0,
                "StartTime": 0,
                "failed_test_names": null,
                "expected_duration": 0
              }
            ],
            "Elapsed": 0,
            "time_taken": 0,
            "makespan": 0,
            "CurrentTime": 0,
            "repo_owner": "",
            "repo_name": "",
            "taskStatusCount": {
              "succeeded": 0,
              "failed": 0,
              "started": 0,
              "undispatched": 0,
              "inactive": 0,
              "dispatched": 0,
              "timed_out": 0
            }
          }
        ],
        "ActiveTasks": 0,
        "repo_owner": "",
        "repo_name": "",
        "time_taken": 0,
        "makespan": 0
      },
      "5d432fc1e3c3317db456be9f": {
        "Version": {
          "id": "5d432fc1e3c3317db456be9f",
          "create_time": "2019-08-01T18:30:27.16Z",
          "start_time": "2019-08-01T18:32:22.075Z",
          "finish_time": "2019-08-01T18:33:31.414Z",
          "revision": "d34092b13394dd7827e88f115e597add08b205b5",
          "author": "domino.weir",
          "message": "'evergreen-ci/spruce' pull request #18 by dominoweir: EVG-6407: add searching by patch attribute (https://github.com/evergreen-ci/spruce/pull/18)",
          "status": "failed",
          "order": 155,
          "ignored": false,
          "branch_name": "master",
          "build_variants_status": [
            {
              "id": "ubuntu1604",
              "activated": true,
              "activate_at": "0001-01-01T00:00:00Z",
              "build_id": "spruce_ubuntu1604_patch_d34092b13394dd7827e88f115e597add08b205b5_5d432fc1e3c3317db456be9f_19_08_01_18_30_27"
            }
          ],
          "builds": [
            "spruce_ubuntu1604_patch_d34092b13394dd7827e88f115e597add08b205b5_5d432fc1e3c3317db456be9f_19_08_01_18_30_27"
          ],
          "identifier": "spruce",
          "requester": "github_pull_request",
          "author_id": "domino.weir"
        },
        "Builds": [
          {
            "Build": {
              "_id": "spruce_ubuntu1604_patch_d34092b13394dd7827e88f115e597add08b205b5_5d432fc1e3c3317db456be9f_19_08_01_18_30_27",
              "create_time": "2019-08-01T18:30:27.16Z",
              "start_time": "2019-08-01T18:31:37.455Z",
              "finish_time": "2019-08-01T18:33:31.414Z",
              "version": "5d432fc1e3c3317db456be9f",
              "branch": "spruce",
              "gitspec": "d34092b13394dd7827e88f115e597add08b205b5",
              "build_variant": "ubuntu1604",
              "build_number": "41139",
              "status": "failed",
              "activated": true,
              "activated_time": "2019-08-01T18:30:27.16Z",
              "order": 155,
              "tasks": [
                {
                  "id": "spruce_ubuntu1604_compile_patch_d34092b13394dd7827e88f115e597add08b205b5_5d432fc1e3c3317db456be9f_19_08_01_18_30_27",
                  "display_name": "compile",
                  "status": "success",
                  "task_end_details": {
                    "status": "success",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-build\" (#1)"
                  },
                  "start_time": "2019-08-01T18:31:37.455Z",
                  "time_taken": 113904569588,
                  "activated": true
                },
                {
                  "id": "spruce_ubuntu1604_lint_patch_d34092b13394dd7827e88f115e597add08b205b5_5d432fc1e3c3317db456be9f_19_08_01_18_30_27",
                  "display_name": "lint",
                  "status": "success",
                  "task_end_details": {
                    "status": "success",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-lint\" (#1)"
                  },
                  "start_time": "2019-08-01T18:32:13.842Z",
                  "time_taken": 41619411783,
                  "activated": true
                },
                {
                  "id": "spruce_ubuntu1604_test_patch_d34092b13394dd7827e88f115e597add08b205b5_5d432fc1e3c3317db456be9f_19_08_01_18_30_27",
                  "display_name": "test",
                  "status": "failed",
                  "task_end_details": {
                    "status": "failed",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-test\" (#1)"
                  },
                  "start_time": "2019-08-01T18:32:22.075Z",
                  "time_taken": 51089646579,
                  "activated": true
                }
              ],
              "time_taken": 113959306346,
              "display_name": "Ubuntu 16.04",
              "predicted_makespan": 113904569588,
              "actual_makespan": 113904000000,
              "r": "github_pull_request"
            },
            "Version": {
              "create_time": "0001-01-01T00:00:00Z",
              "start_time": "0001-01-01T00:00:00Z",
              "finish_time": "0001-01-01T00:00:00Z",
              "ignored": false
            },
            "Tasks": [
              {
                "Task": {
                  "id": "spruce_ubuntu1604_compile_patch_d34092b13394dd7827e88f115e597add08b205b5_5d432fc1e3c3317db456be9f_19_08_01_18_30_27",
                  "secret": "",
                  "create_time": "0001-01-01T00:00:00Z",
                  "ingest_time": "0001-01-01T00:00:00Z",
                  "dispatch_time": "0001-01-01T00:00:00Z",
                  "scheduled_time": "0001-01-01T00:00:00Z",
                  "start_time": "0001-01-01T00:00:00Z",
                  "finish_time": "0001-01-01T00:00:00Z",
                  "activated_time": "0001-01-01T00:00:00Z",
                  "gitspec": "",
                  "priority": 0,
                  "task_group": "",
                  "LastHeartbeat": "0001-01-01T00:00:00Z",
                  "activated": false,
                  "activated_by": "",
                  "build_id": "",
                  "distro": "",
                  "build_variant": "",
                  "depends_on": null,
                  "display_name": "compile",
                  "host_id": "",
                  "execution": 0,
                  "r": "",
                  "status": "success",
                  "task_end_details": {
                    "status": "success",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-build\" (#1)"
                  },
                  "abort": false,
                  "time_taken": 0,
                  "test_results": null
                },
                "Gitspec": "",
                "BuildDisplay": "",
                "TaskLog": null,
                "NextTasks": null,
                "PreviousTasks": null,
                "Elapsed": 0,
                "StartTime": 0,
                "failed_test_names": null,
                "expected_duration": 0
              },
              {
                "Task": {
                  "id": "spruce_ubuntu1604_lint_patch_d34092b13394dd7827e88f115e597add08b205b5_5d432fc1e3c3317db456be9f_19_08_01_18_30_27",
                  "secret": "",
                  "create_time": "0001-01-01T00:00:00Z",
                  "ingest_time": "0001-01-01T00:00:00Z",
                  "dispatch_time": "0001-01-01T00:00:00Z",
                  "scheduled_time": "0001-01-01T00:00:00Z",
                  "start_time": "0001-01-01T00:00:00Z",
                  "finish_time": "0001-01-01T00:00:00Z",
                  "activated_time": "0001-01-01T00:00:00Z",
                  "gitspec": "",
                  "priority": 0,
                  "task_group": "",
                  "LastHeartbeat": "0001-01-01T00:00:00Z",
                  "activated": false,
                  "activated_by": "",
                  "build_id": "",
                  "distro": "",
                  "build_variant": "",
                  "depends_on": null,
                  "display_name": "lint",
                  "host_id": "",
                  "execution": 0,
                  "r": "",
                  "status": "success",
                  "task_end_details": {
                    "status": "success",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-lint\" (#1)"
                  },
                  "abort": false,
                  "time_taken": 0,
                  "test_results": null
                },
                "Gitspec": "",
                "BuildDisplay": "",
                "TaskLog": null,
                "NextTasks": null,
                "PreviousTasks": null,
                "Elapsed": 0,
                "StartTime": 0,
                "failed_test_names": null,
                "expected_duration": 0
              },
              {
                "Task": {
                  "id": "spruce_ubuntu1604_test_patch_d34092b13394dd7827e88f115e597add08b205b5_5d432fc1e3c3317db456be9f_19_08_01_18_30_27",
                  "secret": "",
                  "create_time": "0001-01-01T00:00:00Z",
                  "ingest_time": "0001-01-01T00:00:00Z",
                  "dispatch_time": "0001-01-01T00:00:00Z",
                  "scheduled_time": "0001-01-01T00:00:00Z",
                  "start_time": "0001-01-01T00:00:00Z",
                  "finish_time": "0001-01-01T00:00:00Z",
                  "activated_time": "0001-01-01T00:00:00Z",
                  "gitspec": "",
                  "priority": 0,
                  "task_group": "",
                  "LastHeartbeat": "0001-01-01T00:00:00Z",
                  "activated": false,
                  "activated_by": "",
                  "build_id": "",
                  "distro": "",
                  "build_variant": "",
                  "depends_on": null,
                  "display_name": "test",
                  "host_id": "",
                  "execution": 0,
                  "r": "",
                  "status": "failed",
                  "task_end_details": {
                    "status": "failed",
                    "type": "test",
                    "desc": "'subprocess.exec' in \"npm-test\" (#1)"
                  },
                  "abort": false,
                  "time_taken": 0,
                  "test_results": null
                },
                "Gitspec": "",
                "BuildDisplay": "",
                "TaskLog": null,
                "NextTasks": null,
                "PreviousTasks": null,
                "Elapsed": 0,
                "StartTime": 0,
                "failed_test_names": null,
                "expected_duration": 0
              }
            ],
            "Elapsed": 0,
            "time_taken": 0,
            "makespan": 0,
            "CurrentTime": 0,
            "repo_owner": "",
            "repo_name": "",
            "taskStatusCount": {
              "succeeded": 0,
              "failed": 0,
              "started": 0,
              "undispatched": 0,
              "inactive": 0,
              "dispatched": 0,
              "timed_out": 0
            }
          }
        ],
        "ActiveTasks": 0,
        "repo_owner": "",
        "repo_name": "",
        "time_taken": 0,
        "makespan": 0
      }
    },
    "UIPatches": [
      {
        "Patch": {
          "Id": "5d432fc1e3c3317db456be9f",
          "Description": "'evergreen-ci/spruce' pull request #18 by dominoweir: EVG-6407: add searching by patch attribute (https://github.com/evergreen-ci/spruce/pull/18)",
          "Project": "spruce",
          "Githash": "d34092b13394dd7827e88f115e597add08b205b5",
          "PatchNumber": 155,
          "Author": "domino.weir",
          "Version": "5d432fc1e3c3317db456be9f",
          "Status": "failed",
          "CreateTime": "2019-08-01T18:30:24Z",
          "StartTime": "2019-08-01T18:31:37.455Z",
          "FinishTime": "2019-08-01T18:33:31.414Z",
          "BuildVariants": [
            "ubuntu1604"
          ],
          "Tasks": [
            "lint",
            "test",
            "compile"
          ],
          "VariantsTasks": [
            {
              "Variant": "ubuntu1604",
              "Tasks": [
                "lint",
                "test",
                "compile"
              ],
              "DisplayTasks": []
            }
          ],
          "Patches": null,
          "Activated": true,
          "PatchedConfig": "stepback: true\nidentifier: spruce\ncommand_type: test\nignore:\n- '*.md'\n- .github/*\nbuildvariants:\n- name: ubuntu1604\n  display_name: Ubuntu 16.04\n  run_on:\n  - ubuntu1604-test\n  tasks:\n  - name: compile\n  - name: lint\n  - name: test\nfunctions:\n  attach-results:\n  - command: attach.xunit_results\n    params:\n      files:\n      - ./spruce/junit.xml\n    params_yaml: |\n      files:\n      - ./spruce/junit.xml\n  get-project:\n  - type: setup\n    command: git.get_project\n    params:\n      directory: spruce\n    params_yaml: |\n      directory: spruce\n  npm-build:\n  - command: subprocess.exec\n    params:\n      args:\n      - run\n      - build\n      binary: npm\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - run\n      - build\n      binary: npm\n      working_dir: spruce\n  npm-install:\n  - type: setup\n    command: subprocess.exec\n    params:\n      args:\n      - install\n      binary: npm\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - install\n      binary: npm\n      working_dir: spruce\n  npm-lint:\n  - command: subprocess.exec\n    params:\n      args:\n      - run\n      - lint\n      binary: npm\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - run\n      - lint\n      binary: npm\n      working_dir: spruce\n  npm-test:\n  - command: subprocess.exec\n    params:\n      args:\n      - test\n      - --\n      - -u\n      - --reporters=default\n      - --reporters=jest-junit\n      binary: npm\n      env:\n        CI: \"true\"\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - test\n      - --\n      - -u\n      - --reporters=default\n      - --reporters=jest-junit\n      binary: npm\n      env:\n        CI: \"true\"\n      working_dir: spruce\ntasks:\n- name: test\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-test\n  - func: attach-results\n- name: compile\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-build\n  - func: npm-build\n- name: lint\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-lint\n",
          "Alias": "__github",
          "GithubPatchData": {
            "PRNumber": 18,
            "BaseOwner": "evergreen-ci",
            "BaseRepo": "spruce",
            "BaseBranch": "master",
            "HeadOwner": "dominoweir",
            "HeadRepo": "spruce",
            "HeadHash": "7024a8715c54f902f06465d52271b80a9b2b084f",
            "Author": "dominoweir",
            "AuthorUID": 9288979,
            "MergeCommitSHA": ""
          }
        },
        "StatusDiffs": null,
        "base_time_taken": 0,
        "BaseVersionId": "spruce_d34092b13394dd7827e88f115e597add08b205b5",
        "BaseBuildId": "",
        "BaseTaskId": ""
      },
      {
        "Patch": {
          "Id": "5d432ecbe3c3317db456ac59",
          "Description": "",
          "Project": "spruce",
          "Githash": "d34092b13394dd7827e88f115e597add08b205b5",
          "PatchNumber": 154,
          "Author": "domino.weir",
          "Version": "5d432ecbe3c3317db456ac59",
          "Status": "created",
          "CreateTime": "2019-08-01T18:26:17Z",
          "StartTime": "0001-01-01T00:00:00Z",
          "FinishTime": "0001-01-01T00:00:00Z",
          "BuildVariants": [
            "ubuntu1604"
          ],
          "Tasks": [
            "lint",
            "test",
            "compile"
          ],
          "VariantsTasks": [
            {
              "Variant": "ubuntu1604",
              "Tasks": [
                "lint",
                "test",
                "compile"
              ],
              "DisplayTasks": []
            }
          ],
          "Patches": null,
          "Activated": true,
          "PatchedConfig": "stepback: true\nidentifier: spruce\ncommand_type: test\nignore:\n- '*.md'\n- .github/*\nbuildvariants:\n- name: ubuntu1604\n  display_name: Ubuntu 16.04\n  run_on:\n  - ubuntu1604-test\n  tasks:\n  - name: compile\n  - name: lint\n  - name: test\nfunctions:\n  attach-results:\n  - command: attach.xunit_results\n    params:\n      files:\n      - ./spruce/junit.xml\n    params_yaml: |\n      files:\n      - ./spruce/junit.xml\n  get-project:\n  - type: setup\n    command: git.get_project\n    params:\n      directory: spruce\n    params_yaml: |\n      directory: spruce\n  npm-build:\n  - command: subprocess.exec\n    params:\n      args:\n      - run\n      - build\n      binary: npm\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - run\n      - build\n      binary: npm\n      working_dir: spruce\n  npm-install:\n  - type: setup\n    command: subprocess.exec\n    params:\n      args:\n      - install\n      binary: npm\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - install\n      binary: npm\n      working_dir: spruce\n  npm-lint:\n  - command: subprocess.exec\n    params:\n      args:\n      - run\n      - lint\n      binary: npm\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - run\n      - lint\n      binary: npm\n      working_dir: spruce\n  npm-test:\n  - command: subprocess.exec\n    params:\n      args:\n      - test\n      - --\n      - -u\n      - --reporters=default\n      - --reporters=jest-junit\n      binary: npm\n      env:\n        CI: \"true\"\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - test\n      - --\n      - -u\n      - --reporters=default\n      - --reporters=jest-junit\n      binary: npm\n      env:\n        CI: \"true\"\n      working_dir: spruce\ntasks:\n- name: test\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-test\n  - func: attach-results\n- name: compile\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-build\n  - func: npm-build\n- name: lint\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-lint\n",
          "Alias": "__github",
          "GithubPatchData": {
            "PRNumber": 18,
            "BaseOwner": "evergreen-ci",
            "BaseRepo": "spruce",
            "BaseBranch": "master",
            "HeadOwner": "dominoweir",
            "HeadRepo": "spruce",
            "HeadHash": "03e7535ba61ac98a3a6b95b218e77f6a8740c0e8",
            "Author": "dominoweir",
            "AuthorUID": 9288979,
            "MergeCommitSHA": ""
          }
        },
        "StatusDiffs": null,
        "base_time_taken": 0,
        "BaseVersionId": "spruce_d34092b13394dd7827e88f115e597add08b205b5",
        "BaseBuildId": "",
        "BaseTaskId": ""
      },
      {
        "Patch": {
          "Id": "5d4325c961837d1fdf407a4e",
          "Description": "'evergreen-ci/spruce' pull request #18 by dominoweir: EVG-6407: add searching by patch attribute (https://github.com/evergreen-ci/spruce/pull/18)",
          "Project": "spruce",
          "Githash": "d34092b13394dd7827e88f115e597add08b205b5",
          "PatchNumber": 153,
          "Author": "domino.weir",
          "Version": "5d4325c961837d1fdf407a4e",
          "Status": "failed",
          "CreateTime": "2019-08-01T17:47:52Z",
          "StartTime": "2019-08-01T17:50:46.994Z",
          "FinishTime": "2019-08-01T17:52:50.256Z",
          "BuildVariants": [
            "ubuntu1604"
          ],
          "Tasks": [
            "test",
            "compile",
            "lint"
          ],
          "VariantsTasks": [
            {
              "Variant": "ubuntu1604",
              "Tasks": [
                "test",
                "compile",
                "lint"
              ],
              "DisplayTasks": []
            }
          ],
          "Patches": null,
          "Activated": true,
          "PatchedConfig": "stepback: true\nidentifier: spruce\ncommand_type: test\nignore:\n- '*.md'\n- .github/*\nbuildvariants:\n- name: ubuntu1604\n  display_name: Ubuntu 16.04\n  run_on:\n  - ubuntu1604-test\n  tasks:\n  - name: compile\n  - name: lint\n  - name: test\nfunctions:\n  attach-results:\n  - command: attach.xunit_results\n    params:\n      files:\n      - ./spruce/junit.xml\n    params_yaml: |\n      files:\n      - ./spruce/junit.xml\n  get-project:\n  - type: setup\n    command: git.get_project\n    params:\n      directory: spruce\n    params_yaml: |\n      directory: spruce\n  npm-build:\n  - command: subprocess.exec\n    params:\n      args:\n      - run\n      - build\n      binary: npm\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - run\n      - build\n      binary: npm\n      working_dir: spruce\n  npm-install:\n  - type: setup\n    command: subprocess.exec\n    params:\n      args:\n      - install\n      binary: npm\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - install\n      binary: npm\n      working_dir: spruce\n  npm-lint:\n  - command: subprocess.exec\n    params:\n      args:\n      - run\n      - lint\n      binary: npm\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - run\n      - lint\n      binary: npm\n      working_dir: spruce\n  npm-test:\n  - command: subprocess.exec\n    params:\n      args:\n      - test\n      - --\n      - -u\n      - --reporters=default\n      - --reporters=jest-junit\n      binary: npm\n      env:\n        CI: \"true\"\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - test\n      - --\n      - -u\n      - --reporters=default\n      - --reporters=jest-junit\n      binary: npm\n      env:\n        CI: \"true\"\n      working_dir: spruce\ntasks:\n- name: test\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-test\n  - func: attach-results\n- name: compile\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-build\n  - func: npm-build\n- name: lint\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-lint\n",
          "Alias": "__github",
          "GithubPatchData": {
            "PRNumber": 18,
            "BaseOwner": "evergreen-ci",
            "BaseRepo": "spruce",
            "BaseBranch": "master",
            "HeadOwner": "dominoweir",
            "HeadRepo": "spruce",
            "HeadHash": "7ac94240dd181ff37d990402e991a8b464fff549",
            "Author": "dominoweir",
            "AuthorUID": 9288979,
            "MergeCommitSHA": ""
          }
        },
        "StatusDiffs": null,
        "base_time_taken": 0,
        "BaseVersionId": "spruce_d34092b13394dd7827e88f115e597add08b205b5",
        "BaseBuildId": "",
        "BaseTaskId": ""
      },
      {
        "Patch": {
          "Id": "5d4306f33e8e863bf3bfa63c",
          "Description": "'evergreen-ci/spruce' pull request #18 by dominoweir: EVG-6407: add searching by patch attribute (https://github.com/evergreen-ci/spruce/pull/18)",
          "Project": "spruce",
          "Githash": "d34092b13394dd7827e88f115e597add08b205b5",
          "PatchNumber": 152,
          "Author": "domino.weir",
          "Version": "5d4306f33e8e863bf3bfa63c",
          "Status": "failed",
          "CreateTime": "2019-08-01T15:36:18Z",
          "StartTime": "2019-08-01T15:36:37.264Z",
          "FinishTime": "2019-08-01T15:38:35.517Z",
          "BuildVariants": [
            "ubuntu1604"
          ],
          "Tasks": [
            "compile",
            "lint",
            "test"
          ],
          "VariantsTasks": [
            {
              "Variant": "ubuntu1604",
              "Tasks": [
                "test",
                "compile",
                "lint"
              ],
              "DisplayTasks": []
            }
          ],
          "Patches": null,
          "Activated": true,
          "PatchedConfig": "stepback: true\nidentifier: spruce\ncommand_type: test\nignore:\n- '*.md'\n- .github/*\nbuildvariants:\n- name: ubuntu1604\n  display_name: Ubuntu 16.04\n  run_on:\n  - ubuntu1604-test\n  tasks:\n  - name: compile\n  - name: lint\n  - name: test\nfunctions:\n  attach-results:\n  - command: attach.xunit_results\n    params:\n      files:\n      - ./spruce/junit.xml\n    params_yaml: |\n      files:\n      - ./spruce/junit.xml\n  get-project:\n  - type: setup\n    command: git.get_project\n    params:\n      directory: spruce\n    params_yaml: |\n      directory: spruce\n  npm-build:\n  - command: subprocess.exec\n    params:\n      args:\n      - run\n      - build\n      binary: npm\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - run\n      - build\n      binary: npm\n      working_dir: spruce\n  npm-install:\n  - type: setup\n    command: subprocess.exec\n    params:\n      args:\n      - install\n      binary: npm\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - install\n      binary: npm\n      working_dir: spruce\n  npm-lint:\n  - command: subprocess.exec\n    params:\n      args:\n      - run\n      - lint\n      binary: npm\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - run\n      - lint\n      binary: npm\n      working_dir: spruce\n  npm-test:\n  - command: subprocess.exec\n    params:\n      args:\n      - test\n      - --\n      - -u\n      - --reporters=default\n      - --reporters=jest-junit\n      binary: npm\n      env:\n        CI: \"true\"\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - test\n      - --\n      - -u\n      - --reporters=default\n      - --reporters=jest-junit\n      binary: npm\n      env:\n        CI: \"true\"\n      working_dir: spruce\ntasks:\n- name: test\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-test\n  - func: attach-results\n- name: compile\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-build\n  - func: npm-build\n- name: lint\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-lint\n",
          "Alias": "__github",
          "GithubPatchData": {
            "PRNumber": 18,
            "BaseOwner": "evergreen-ci",
            "BaseRepo": "spruce",
            "BaseBranch": "master",
            "HeadOwner": "dominoweir",
            "HeadRepo": "spruce",
            "HeadHash": "7b11d85e5e6a0cb1c2812dfacff1b4746b1ff8f2",
            "Author": "dominoweir",
            "AuthorUID": 9288979,
            "MergeCommitSHA": ""
          }
        },
        "StatusDiffs": null,
        "base_time_taken": 0,
        "BaseVersionId": "spruce_d34092b13394dd7827e88f115e597add08b205b5",
        "BaseBuildId": "",
        "BaseTaskId": ""
      },
      {
        "Patch": {
          "Id": "5d430370850e6177128e0b11",
          "Description": "'evergreen-ci/spruce' pull request #18 by dominoweir: EVG-6407: add searching by patch attribute (https://github.com/evergreen-ci/spruce/pull/18)",
          "Project": "spruce",
          "Githash": "d34092b13394dd7827e88f115e597add08b205b5",
          "PatchNumber": 151,
          "Author": "domino.weir",
          "Version": "5d430370850e6177128e0b11",
          "Status": "failed",
          "CreateTime": "2019-08-01T15:21:19Z",
          "StartTime": "2019-08-01T15:21:43.812Z",
          "FinishTime": "2019-08-01T15:23:47.328Z",
          "BuildVariants": [
            "ubuntu1604"
          ],
          "Tasks": [
            "test",
            "compile",
            "lint"
          ],
          "VariantsTasks": [
            {
              "Variant": "ubuntu1604",
              "Tasks": [
                "test",
                "compile",
                "lint"
              ],
              "DisplayTasks": []
            }
          ],
          "Patches": null,
          "Activated": true,
          "PatchedConfig": "stepback: true\nidentifier: spruce\ncommand_type: test\nignore:\n- '*.md'\n- .github/*\nbuildvariants:\n- name: ubuntu1604\n  display_name: Ubuntu 16.04\n  run_on:\n  - ubuntu1604-test\n  tasks:\n  - name: compile\n  - name: lint\n  - name: test\nfunctions:\n  attach-results:\n  - command: attach.xunit_results\n    params:\n      files:\n      - ./spruce/junit.xml\n    params_yaml: |\n      files:\n      - ./spruce/junit.xml\n  get-project:\n  - type: setup\n    command: git.get_project\n    params:\n      directory: spruce\n    params_yaml: |\n      directory: spruce\n  npm-build:\n  - command: subprocess.exec\n    params:\n      args:\n      - run\n      - build\n      binary: npm\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - run\n      - build\n      binary: npm\n      working_dir: spruce\n  npm-install:\n  - type: setup\n    command: subprocess.exec\n    params:\n      args:\n      - install\n      binary: npm\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - install\n      binary: npm\n      working_dir: spruce\n  npm-lint:\n  - command: subprocess.exec\n    params:\n      args:\n      - run\n      - lint\n      binary: npm\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - run\n      - lint\n      binary: npm\n      working_dir: spruce\n  npm-test:\n  - command: subprocess.exec\n    params:\n      args:\n      - test\n      - --\n      - -u\n      - --reporters=default\n      - --reporters=jest-junit\n      binary: npm\n      env:\n        CI: \"true\"\n      working_dir: spruce\n    params_yaml: |\n      args:\n      - test\n      - --\n      - -u\n      - --reporters=default\n      - --reporters=jest-junit\n      binary: npm\n      env:\n        CI: \"true\"\n      working_dir: spruce\ntasks:\n- name: test\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-test\n  - func: attach-results\n- name: compile\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-build\n  - func: npm-build\n- name: lint\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-lint\n",
          "Alias": "__github",
          "GithubPatchData": {
            "PRNumber": 18,
            "BaseOwner": "evergreen-ci",
            "BaseRepo": "spruce",
            "BaseBranch": "master",
            "HeadOwner": "dominoweir",
            "HeadRepo": "spruce",
            "HeadHash": "7780d165b464d441ea3b95e8441a9f730c2376c4",
            "Author": "dominoweir",
            "AuthorUID": 9288979,
            "MergeCommitSHA": ""
          }
        },
        "StatusDiffs": null,
        "base_time_taken": 0,
        "BaseVersionId": "spruce_d34092b13394dd7827e88f115e597add08b205b5",
        "BaseBuildId": "",
        "BaseTaskId": ""
      },
    ],
    "PageNum": 0
  } as object
}