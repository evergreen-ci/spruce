import * as request from "request";

export class client {
  public username: string;
  public key: string;
  public apiURL: string;
  public uiURL: string;

  constructor(username: string, key: string, apiURL: string, uiURL: string) {
    this.username = username;
    this.key = key;
    this.apiURL = apiURL;
    this.uiURL = uiURL;
  }

  public getDistros(callback: request.RequestCallback) {
    callback(null, this.dummySuccessResp(), {});
  }

  public getRecentTasks(callback: request.RequestCallback, verbose?: boolean, lookbackMins?: number, status?: string) {
    callback(null, this.dummySuccessResp(), {});
  }

  public getToken(callback: request.RequestCallback, username?: string, password?: string) {
    callback(null, this.dummySuccessResp(), {});
  }

  public getPatches(callback: request.RequestCallback, username?: string) {
    callback(null, this.dummyPatchesResp(), {});
  }

  public getAdminConfig(callback: request.RequestCallback) {
    callback(null, this.dummySuccessResp(), {});
  }

  public setAdminConfig(callback: request.RequestCallback, settings: any) {
    callback(null, this.dummySuccessResp(), {});
  }

  public getBanner(callback: request.RequestCallback) {
    callback(null, this.dummySuccessResp(), {});
  }

  private dummySuccessResp(): request.Response {
    const mockResp: mockResponse = {
      statusCode: 200,
      statusMessage: "",
      body: {},
    };

    return mockResp as request.Response;
  }

  private dummyPatchesResp(): request.Response {
    const mockResp: mockResponse = {
      statusCode: 200,
      statusMessage: "",
      body: {
        "VersionsMap": {
          "5d12568ec9ec44324ddf8383": {
            "Version": {
              "id": "5d12568ec9ec44324ddf8383",
              "create_time": "2019-06-25T17:14:55.621Z",
              "start_time": "2019-06-25T17:15:07.34Z",
              "finish_time": "2019-06-25T17:16:21.343Z",
              "revision": "9f1d3ae76bd74b15f6fd7f949f1b6930d62df502",
              "author": "domino.weir",
              "message": "'evergreen-ci/spruce' pull request #3 by dominoweir: EVG-6306: Add config file dropzone (https://github.com/evergreen-ci/spruce/pull/3)",
              "status": "success",
              "order": 42,
              "ignored": false,
              "branch_name": "master",
              "build_variants_status": [
                {
                  "id": "ubuntu1604",
                  "activated": true,
                  "activate_at": "0001-01-01T00:00:00Z",
                  "build_id": "spruce_ubuntu1604_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d12568ec9ec44324ddf8383_19_06_25_17_14_55"
                }
              ],
              "builds": [
                "spruce_ubuntu1604_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d12568ec9ec44324ddf8383_19_06_25_17_14_55"
              ],
              "identifier": "spruce",
              "requester": "github_pull_request",
              "author_id": "domino.weir"
            },
            "Builds": [
              {
                "Build": {
                  "_id": "spruce_ubuntu1604_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d12568ec9ec44324ddf8383_19_06_25_17_14_55",
                  "create_time": "2019-06-25T17:14:55.621Z",
                  "start_time": "2019-06-25T17:15:05.327Z",
                  "finish_time": "2019-06-25T17:16:21.343Z",
                  "version": "5d12568ec9ec44324ddf8383",
                  "branch": "spruce",
                  "gitspec": "9f1d3ae76bd74b15f6fd7f949f1b6930d62df502",
                  "build_variant": "ubuntu1604",
                  "build_number": "39068",
                  "status": "success",
                  "activated_by": "github_pull_request",
                  "activated_time": "2019-06-27T15:40:13.712Z",
                  "order": 42,
                  "tasks": [
                    {
                      "id": "spruce_ubuntu1604_dist_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d12568ec9ec44324ddf8383_19_06_25_17_14_55",
                      "display_name": "dist",
                      "status": "success",
                      "task_end_details": {
                        "status": "success",
                        "type": "system",
                        "desc": "'s3.put' in \"upload-dist\" (#1)"
                      },
                      "start_time": "2019-06-25T17:15:05.327Z",
                      "time_taken": 75959156173,
                      "activated": true
                    },
                    {
                      "id": "spruce_ubuntu1604_lint_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d12568ec9ec44324ddf8383_19_06_25_17_14_55",
                      "display_name": "lint",
                      "status": "success",
                      "task_end_details": {
                        "status": "success",
                        "type": "test",
                        "desc": "'subprocess.exec' in \"npm-lint\" (#1)"
                      },
                      "start_time": "2019-06-25T17:15:05.509Z",
                      "time_taken": 35321279255,
                      "activated": true
                    },
                    {
                      "id": "spruce_ubuntu1604_test_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d12568ec9ec44324ddf8383_19_06_25_17_14_55",
                      "display_name": "test",
                      "status": "success",
                      "task_end_details": {
                        "status": "success",
                        "type": "test",
                        "desc": "'attach.xunit_results' in \"attach-results\" (#1)"
                      },
                      "start_time": "2019-06-25T17:15:07.34Z",
                      "time_taken": 43829126225,
                      "activated": true
                    }
                  ],
                  "time_taken": 76016921927,
                  "display_name": "Ubuntu 16.04",
                  "predicted_makespan": 75959156173,
                  "actual_makespan": 75959000000,
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
                      "id": "spruce_ubuntu1604_dist_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d12568ec9ec44324ddf8383_19_06_25_17_14_55",
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
                      "display_name": "dist",
                      "host_id": "",
                      "execution": 0,
                      "r": "",
                      "status": "success",
                      "task_end_details": {
                        "status": "success",
                        "type": "system",
                        "desc": "'s3.put' in \"upload-dist\" (#1)"
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
                      "id": "spruce_ubuntu1604_lint_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d12568ec9ec44324ddf8383_19_06_25_17_14_55",
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
                      "id": "spruce_ubuntu1604_test_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d12568ec9ec44324ddf8383_19_06_25_17_14_55",
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
                      "status": "success",
                      "task_end_details": {
                        "status": "success",
                        "type": "test",
                        "desc": "'attach.xunit_results' in \"attach-results\" (#1)"
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
          "5d1265ca7742ae061c1004ec": {
            "Version": {
              "id": "5d1265ca7742ae061c1004ec",
              "create_time": "2019-06-25T18:19:55.448Z",
              "start_time": "2019-06-25T18:20:19.974Z",
              "finish_time": "2019-06-25T18:23:16.21Z",
              "revision": "9f1d3ae76bd74b15f6fd7f949f1b6930d62df502",
              "author": "domino.weir",
              "message": "'evergreen-ci/spruce' pull request #3 by dominoweir: EVG-6306: Add config file dropzone (https://github.com/evergreen-ci/spruce/pull/3)",
              "status": "success",
              "order": 43,
              "ignored": false,
              "branch_name": "master",
              "build_variants_status": [
                {
                  "id": "ubuntu1604",
                  "activated": true,
                  "activate_at": "0001-01-01T00:00:00Z",
                  "build_id": "spruce_ubuntu1604_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d1265ca7742ae061c1004ec_19_06_25_18_19_55"
                }
              ],
              "builds": [
                "spruce_ubuntu1604_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d1265ca7742ae061c1004ec_19_06_25_18_19_55"
              ],
              "identifier": "spruce",
              "requester": "github_pull_request",
              "author_id": "domino.weir"
            },
            "Builds": [
              {
                "Build": {
                  "_id": "spruce_ubuntu1604_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d1265ca7742ae061c1004ec_19_06_25_18_19_55",
                  "create_time": "2019-06-25T18:19:55.448Z",
                  "start_time": "2019-06-25T18:20:17.303Z",
                  "finish_time": "2019-06-25T18:23:16.21Z",
                  "version": "5d1265ca7742ae061c1004ec",
                  "branch": "spruce",
                  "gitspec": "9f1d3ae76bd74b15f6fd7f949f1b6930d62df502",
                  "build_variant": "ubuntu1604",
                  "build_number": "39078",
                  "status": "success",
                  "activated_by": "github_pull_request",
                  "activated_time": "2019-06-27T15:40:13.77Z",
                  "order": 43,
                  "tasks": [
                    {
                      "id": "spruce_ubuntu1604_dist_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d1265ca7742ae061c1004ec_19_06_25_18_19_55",
                      "display_name": "dist",
                      "status": "success",
                      "task_end_details": {
                        "status": "success",
                        "type": "system",
                        "desc": "'s3.put' in \"upload-dist\" (#1)"
                      },
                      "start_time": "2019-06-25T18:20:17.303Z",
                      "time_taken": 178715142347,
                      "activated": true
                    },
                    {
                      "id": "spruce_ubuntu1604_lint_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d1265ca7742ae061c1004ec_19_06_25_18_19_55",
                      "display_name": "lint",
                      "status": "success",
                      "task_end_details": {
                        "status": "success",
                        "type": "test",
                        "desc": "'subprocess.exec' in \"npm-lint\" (#1)"
                      },
                      "start_time": "2019-06-25T18:20:18.84Z",
                      "time_taken": 136091014897,
                      "activated": true
                    },
                    {
                      "id": "spruce_ubuntu1604_test_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d1265ca7742ae061c1004ec_19_06_25_18_19_55",
                      "display_name": "test",
                      "status": "success",
                      "task_end_details": {
                        "status": "success",
                        "type": "test",
                        "desc": "'attach.xunit_results' in \"attach-results\" (#1)"
                      },
                      "start_time": "2019-06-25T18:20:19.974Z",
                      "time_taken": 138898214860,
                      "activated": true
                    }
                  ],
                  "time_taken": 178907496641,
                  "display_name": "Ubuntu 16.04",
                  "predicted_makespan": 178715142347,
                  "actual_makespan": 178715000000,
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
                      "id": "spruce_ubuntu1604_dist_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d1265ca7742ae061c1004ec_19_06_25_18_19_55",
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
                      "display_name": "dist",
                      "host_id": "",
                      "execution": 0,
                      "r": "",
                      "status": "success",
                      "task_end_details": {
                        "status": "success",
                        "type": "system",
                        "desc": "'s3.put' in \"upload-dist\" (#1)"
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
                      "id": "spruce_ubuntu1604_lint_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d1265ca7742ae061c1004ec_19_06_25_18_19_55",
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
                      "id": "spruce_ubuntu1604_test_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d1265ca7742ae061c1004ec_19_06_25_18_19_55",
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
                      "status": "success",
                      "task_end_details": {
                        "status": "success",
                        "type": "test",
                        "desc": "'attach.xunit_results' in \"attach-results\" (#1)"
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
          "5d126fa93627e070b33dbbc0": {
            "Version": {
              "id": "5d126fa93627e070b33dbbc0",
              "create_time": "2019-06-25T19:02:02.913Z",
              "start_time": "2019-06-25T19:05:33.651Z",
              "finish_time": "2019-06-25T19:06:06.989Z",
              "revision": "9f1d3ae76bd74b15f6fd7f949f1b6930d62df502",
              "author": "domino.weir",
              "message": "'evergreen-ci/spruce' pull request #3 by dominoweir: EVG-6306: Add config file dropzone (https://github.com/evergreen-ci/spruce/pull/3)",
              "status": "success",
              "order": 44,
              "ignored": false,
              "branch_name": "master",
              "build_variants_status": [
                {
                  "id": "ubuntu1604",
                  "activated": true,
                  "activate_at": "0001-01-01T00:00:00Z",
                  "build_id": "spruce_ubuntu1604_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d126fa93627e070b33dbbc0_19_06_25_19_02_02"
                }
              ],
              "builds": [
                "spruce_ubuntu1604_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d126fa93627e070b33dbbc0_19_06_25_19_02_02"
              ],
              "identifier": "spruce",
              "requester": "github_pull_request",
              "author_id": "domino.weir"
            },
            "Builds": [
              {
                "Build": {
                  "_id": "spruce_ubuntu1604_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d126fa93627e070b33dbbc0_19_06_25_19_02_02",
                  "create_time": "2019-06-25T19:02:02.913Z",
                  "start_time": "2019-06-25T19:04:07.285Z",
                  "finish_time": "2019-06-25T19:06:06.989Z",
                  "version": "5d126fa93627e070b33dbbc0",
                  "branch": "spruce",
                  "gitspec": "9f1d3ae76bd74b15f6fd7f949f1b6930d62df502",
                  "build_variant": "ubuntu1604",
                  "build_number": "39083",
                  "status": "success",
                  "activated_by": "github_pull_request",
                  "activated_time": "2019-06-27T15:40:13.829Z",
                  "order": 44,
                  "tasks": [
                    {
                      "id": "spruce_ubuntu1604_dist_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d126fa93627e070b33dbbc0_19_06_25_19_02_02",
                      "display_name": "dist",
                      "status": "success",
                      "task_end_details": {
                        "status": "success",
                        "type": "system",
                        "desc": "'s3.put' in \"upload-dist\" (#1)"
                      },
                      "start_time": "2019-06-25T19:04:07.285Z",
                      "time_taken": 84699592527,
                      "activated": true
                    },
                    {
                      "id": "spruce_ubuntu1604_lint_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d126fa93627e070b33dbbc0_19_06_25_19_02_02",
                      "display_name": "lint",
                      "status": "success",
                      "task_end_details": {
                        "status": "success",
                        "type": "test",
                        "desc": "'subprocess.exec' in \"npm-lint\" (#1)"
                      },
                      "start_time": "2019-06-25T19:04:57.499Z",
                      "time_taken": 41007409095,
                      "activated": true
                    },
                    {
                      "id": "spruce_ubuntu1604_test_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d126fa93627e070b33dbbc0_19_06_25_19_02_02",
                      "display_name": "test",
                      "status": "success",
                      "task_end_details": {
                        "status": "success",
                        "type": "test",
                        "desc": "'attach.xunit_results' in \"attach-results\" (#1)"
                      },
                      "start_time": "2019-06-25T19:05:33.651Z",
                      "time_taken": 33258570666,
                      "activated": true
                    }
                  ],
                  "time_taken": 119704508777,
                  "display_name": "Ubuntu 16.04",
                  "predicted_makespan": 84699592527,
                  "actual_makespan": 119624000000,
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
                      "id": "spruce_ubuntu1604_dist_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d126fa93627e070b33dbbc0_19_06_25_19_02_02",
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
                      "display_name": "dist",
                      "host_id": "",
                      "execution": 0,
                      "r": "",
                      "status": "success",
                      "task_end_details": {
                        "status": "success",
                        "type": "system",
                        "desc": "'s3.put' in \"upload-dist\" (#1)"
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
                      "id": "spruce_ubuntu1604_lint_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d126fa93627e070b33dbbc0_19_06_25_19_02_02",
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
                      "id": "spruce_ubuntu1604_test_patch_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502_5d126fa93627e070b33dbbc0_19_06_25_19_02_02",
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
                      "status": "success",
                      "task_end_details": {
                        "status": "success",
                        "type": "test",
                        "desc": "'attach.xunit_results' in \"attach-results\" (#1)"
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
        },
        "UIPatches": [],
        "PageNum": 0
      },
    };

    return mockResp as request.Response;
  }
}

class mockResponse {
  public statusCode: number;
  public statusMessage: string;
  public body: any;
}