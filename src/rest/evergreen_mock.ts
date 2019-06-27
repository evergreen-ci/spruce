import * as request from "request";

<<<<<<< HEAD
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
        "VersionsMap": {},
        "UIPatches": [
          {
            "Patch": {
              "Id": "5d0d3ba83e8e8626eeae08de",
              "Project": "spruce",
              "Githash": "9f1d3ae76bd74b15f6fd7f949f1b6930d62df502",
              "PatchNumber": 35,
              "Author": "domino.weir",
              "Version": "5d0d3ba83e8e8626eeae08de",
              "Status": "created",
              "CreateTime": "2019-06-21T20:18:47Z",
              "StartTime": "0001-01-01T00:00:00Z",
              "FinishTime": "0001-01-01T00:00:00Z",
              "BuildVariants": [
                "ubuntu1604"
              ],
              "Tasks": [
                "test",
                "dist",
                "lint"
              ],
              "VariantsTasks": [
                {
                  "Variant": "ubuntu1604",
                  "Tasks": [
                    "test",
                    "dist",
                    "lint"
                  ],
                  "DisplayTasks": []
                }
              ],
              "Patches": null,
              "Activated": true,
              "PatchedConfig": "stepback: true\nidentifier: spruce\ncommand_type: test\nignore:\n- '*.md'\n- .github/*\nbuildvariants:\n- name: ubuntu1604\n  display_name: Ubuntu 16.04\n  run_on:\n  - ubuntu1604-test\n  tasks:\n  - name: dist\n  - name: lint\n  - name: test\nfunctions:\n  attach-results:\n  - command: attach.xunit_results\n    params:\n      files:\n      - ./spruce/junit.xml\n  get-project:\n  - type: setup\n    command: git.get_project\n    params:\n      directory: spruce\n  npm-build:\n  - command: subprocess.exec\n    params:\n      args:\n      - run\n      - build\n      binary: npm\n      working_dir: spruce\n  npm-dist:\n  - command: subprocess.exec\n    params:\n      args:\n      - run\n      - dist\n      binary: npm\n      working_dir: spruce\n  npm-install:\n  - type: setup\n    command: subprocess.exec\n    params:\n      args:\n      - install\n      binary: npm\n      working_dir: spruce\n  npm-lint:\n  - command: subprocess.exec\n    params:\n      args:\n      - run\n      - lint\n      binary: npm\n      working_dir: spruce\n  npm-test:\n  - command: subprocess.exec\n    params:\n      args:\n      - test\n      - --\n      - -u\n      - --reporters=default\n      - --reporters=jest-junit\n      binary: npm\n      env:\n        CI: \"true\"\n      working_dir: spruce\n  upload-dist:\n  - type: system\n    command: s3.put\n    params:\n      aws_key: ${aws_key}\n      aws_secret: ${aws_secret}\n      bucket: mciuploads\n      content_type: application/x-gzip\n      display_name: dist.tar.gz\n      local_file: spruce/bin/dist.tar.gz\n      optional: true\n      permissions: public-read\n      remote_file: spruce/${build_id}-${build_variant}/spruce-${task_name}-${revision}.tar.gz\ntasks:\n- name: test\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-test\n  - func: attach-results\n- name: dist\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-build\n  - func: npm-dist\n  - func: upload-dist\n- name: lint\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-lint\n",
              "Alias": "__github",
              "GithubPatchData": {
                "PRNumber": 3,
                "BaseOwner": "evergreen-ci",
                "BaseRepo": "spruce",
                "BaseBranch": "master",
                "HeadOwner": "dominoweir",
                "HeadRepo": "spruce",
                "HeadHash": "616590ae56218fbb5c47498bc1cb0eaa766f78af",
                "Author": "dominoweir",
                "AuthorUID": 9288979,
                "MergeCommitSHA": ""
              }
            },
            "StatusDiffs": null,
            "base_time_taken": 0,
            "BaseVersionId": "spruce_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502",
            "BaseBuildId": "",
            "BaseTaskId": ""
          },
          {
            "Patch": {
              "Id": "5d0d3a5332f41749162af641",
              "Description": "'evergreen-ci/spruce' pull request #3 by dominoweir: EVG-6306: Add config file dropzone (https://github.com/evergreen-ci/spruce/pull/3)",
              "Project": "spruce",
              "Githash": "9f1d3ae76bd74b15f6fd7f949f1b6930d62df502",
              "PatchNumber": 34,
              "Author": "domino.weir",
              "Version": "5d0d3a5332f41749162af641",
              "Status": "failed",
              "CreateTime": "2019-06-21T20:11:13Z",
              "StartTime": "2019-06-21T20:13:36.286Z",
              "FinishTime": "2019-06-21T20:14:57.678Z",
              "BuildVariants": [
                "ubuntu1604"
              ],
              "Tasks": [
                "lint",
                "test",
                "dist"
              ],
              "VariantsTasks": [
                {
                  "Variant": "ubuntu1604",
                  "Tasks": [
                    "test",
                    "dist",
                    "lint"
                  ],
                  "DisplayTasks": []
                }
              ],
              "Patches": null,
              "Activated": true,
              "PatchedConfig": "stepback: true\nidentifier: spruce\ncommand_type: test\nignore:\n- '*.md'\n- .github/*\nbuildvariants:\n- name: ubuntu1604\n  display_name: Ubuntu 16.04\n  run_on:\n  - ubuntu1604-test\n  tasks:\n  - name: dist\n  - name: lint\n  - name: test\nfunctions:\n  attach-results:\n  - command: attach.xunit_results\n    params:\n      files:\n      - ./spruce/junit.xml\n  get-project:\n  - type: setup\n    command: git.get_project\n    params:\n      directory: spruce\n  npm-build:\n  - command: subprocess.exec\n    params:\n      args:\n      - run\n      - build\n      binary: npm\n      working_dir: spruce\n  npm-dist:\n  - command: subprocess.exec\n    params:\n      args:\n      - run\n      - dist\n      binary: npm\n      working_dir: spruce\n  npm-install:\n  - type: setup\n    command: subprocess.exec\n    params:\n      args:\n      - install\n      binary: npm\n      working_dir: spruce\n  npm-lint:\n  - command: subprocess.exec\n    params:\n      args:\n      - run\n      - lint\n      binary: npm\n      working_dir: spruce\n  npm-test:\n  - command: subprocess.exec\n    params:\n      args:\n      - test\n      - --\n      - -u\n      - --reporters=default\n      - --reporters=jest-junit\n      binary: npm\n      env:\n        CI: \"true\"\n      working_dir: spruce\n  upload-dist:\n  - type: system\n    command: s3.put\n    params:\n      aws_key: ${aws_key}\n      aws_secret: ${aws_secret}\n      bucket: mciuploads\n      content_type: application/x-gzip\n      display_name: dist.tar.gz\n      local_file: spruce/bin/dist.tar.gz\n      optional: true\n      permissions: public-read\n      remote_file: spruce/${build_id}-${build_variant}/spruce-${task_name}-${revision}.tar.gz\ntasks:\n- name: test\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-test\n  - func: attach-results\n- name: dist\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-build\n  - func: npm-dist\n  - func: upload-dist\n- name: lint\n  commands:\n  - func: get-project\n  - func: npm-install\n  - func: npm-lint\n",
              "Alias": "__github",
              "GithubPatchData": {
                "PRNumber": 3,
                "BaseOwner": "evergreen-ci",
                "BaseRepo": "spruce",
                "BaseBranch": "master",
                "HeadOwner": "dominoweir",
                "HeadRepo": "spruce",
                "HeadHash": "e176426b64a72f710f67073c4c58868ffae7c17e",
                "Author": "dominoweir",
                "AuthorUID": 9288979,
                "MergeCommitSHA": ""
              }
            },
            "StatusDiffs": null,
            "base_time_taken": 0,
            "BaseVersionId": "spruce_9f1d3ae76bd74b15f6fd7f949f1b6930d62df502",
            "BaseBuildId": "",
            "BaseTaskId": ""
          }
        ],
        "PageNum": 0
      },
    };

    return mockResp as request.Response;
  }
=======
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

     public getRecentTasks(callback: request.RequestCallback, verbose?: boolean, lookbackMins?: number, status?: string)  {
        callback(null, this.dummySuccessResp(), {});
    }

    public getRecentPatches(callback: request.RequestCallback, verbose?: boolean, lookbackMins?: number)  {
        callback(null, this.dummySuccessResp(), {});
    }

    public getToken(callback: request.RequestCallback, username?: string, password?: string) {
        callback(null, this.dummySuccessResp(), {});
    }

    public getPatches(callback: request.RequestCallback, username?: string) {
        callback(null, this.dummySuccessResp(), {});
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
>>>>>>> master
}

class mockResponse {
  public statusCode: number;
  public statusMessage: string;
  public body: any;
}