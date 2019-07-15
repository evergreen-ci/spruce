export function getMockBuild() {
  return {
    "_id": "spruce_ubuntu1604_patch_e44b6da8831497cdd4621daf4c62985f0c1c9ca9_5d28cfa05623434037b0294c_19_07_12_18_21_22",
    "project_id": "spruce",
    "create_time": "2019-07-12T18:21:22.913Z",
    "start_time": "2019-07-12T18:30:09.414Z",
    "finish_time": "2019-07-12T18:32:17.147Z",
    "version": "5d28cfa05623434037b0294c",
    "branch": "spruce",
    "git_hash": "e44b6da8831497cdd4621daf4c62985f0c1c9ca9",
    "build_variant": "ubuntu1604",
    "status": "success",
    "activated": false,
    "activated_by": "github_pull_request",
    "activated_time": "2019-07-12T18:33:08.026Z",
    "order": 94,
    "task_cache": [
      {
        "id": "spruce_ubuntu1604_compile_patch_e44b6da8831497cdd4621daf4c62985f0c1c9ca9_5d28cfa05623434037b0294c_19_07_12_18_21_22",
        "display_name": "compile",
        "status": "success",
        "task_end_details": {
          "status": "success",
          "type": "test",
          "desc": "'subprocess.exec' in \"npm-build\" (#1)"
        },
        "start_time": "2019-07-12T18:30:09.414Z",
        "time_taken": 127414241328,
        "activated": true
      },
      {
        "id": "spruce_ubuntu1604_lint_patch_e44b6da8831497cdd4621daf4c62985f0c1c9ca9_5d28cfa05623434037b0294c_19_07_12_18_21_22",
        "display_name": "lint",
        "status": "success",
        "task_end_details": {
          "status": "success",
          "type": "test",
          "desc": "'subprocess.exec' in \"npm-lint\" (#1)"
        },
        "start_time": "2019-07-12T18:30:11.561Z",
        "time_taken": 53705398637,
        "activated": true
      },
      {
        "id": "spruce_ubuntu1604_test_patch_e44b6da8831497cdd4621daf4c62985f0c1c9ca9_5d28cfa05623434037b0294c_19_07_12_18_21_22",
        "display_name": "test",
        "status": "success",
        "task_end_details": {
          "status": "success",
          "type": "test",
          "desc": "'attach.xunit_results' in \"attach-results\" (#1)"
        },
        "start_time": "2019-07-12T18:30:38.038Z",
        "time_taken": 49443215767,
        "activated": true
      }
    ],
    "tasks": [
      "spruce_ubuntu1604_compile_patch_e44b6da8831497cdd4621daf4c62985f0c1c9ca9_5d28cfa05623434037b0294c_19_07_12_18_21_22",
      "spruce_ubuntu1604_lint_patch_e44b6da8831497cdd4621daf4c62985f0c1c9ca9_5d28cfa05623434037b0294c_19_07_12_18_21_22",
      "spruce_ubuntu1604_test_patch_e44b6da8831497cdd4621daf4c62985f0c1c9ca9_5d28cfa05623434037b0294c_19_07_12_18_21_22"
    ],
    "time_taken_ms": 127733,
    "display_name": "Ubuntu 16.04",
    "predicted_makespan_ms": 127414,
    "actual_makespan_ms": 127414,
    "origin": "patch",
    "status_counts": {
      "succeeded": 3,
      "failed": 0,
      "started": 0,
      "undispatched": 0,
      "inactive": 0,
      "dispatched": 0,
      "timed_out": 0
    }
  } as object
}