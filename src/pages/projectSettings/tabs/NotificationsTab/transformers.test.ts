import { BannerTheme, ProjectSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { ProjectType } from "../utils";
import { formToGql, gqlToForm } from "./transformers";
import { NotificationsFormState } from "./types";

const { projectBase } = data;

describe("project data", () => {
  it("correctly converts from GQL to a form for project type", () => {
    expect(
      gqlToForm(projectBase, { projectType: ProjectType.Project })
    ).toStrictEqual({ ...projectFormBase, banner });
  });

  it("correctly converts from GQL to a form for repo type", () => {
    expect(
      gqlToForm(projectBase, { projectType: ProjectType.Repo })
    ).toStrictEqual(projectFormBase);
  });

  it("correctly converts from a form to GQL when a banner value exists in the form", () => {
    expect(formToGql({ ...projectFormBase, banner }, "spruce")).toStrictEqual({
      ...projectResultBase,
      projectRef: {
        ...projectResultBase.projectRef,
        banner: banner.bannerData,
      },
    });
  });

  it("correctly converts from a form to GQL when the subscriptions field is empty", () => {
    expect(formToGql(projectFormBase, "spruce")).toStrictEqual(
      projectResultBase
    );
  });

  it("correctly converts from a form to GQL when the subscriptions field is populated", () => {
    const projectForm = {
      ...projectFormBase,
      subscriptions: [
        {
          subscriptionData: {
            event: {
              eventSelect: "any-version-finishes",
              extraFields: {
                requester: "gitter_request",
              },
            },
            id: "xyz",
            notification: {
              jiraCommentInput: "evg-123",
              notificationSelect: "jira-comment",
            },
          },
        },
      ],
    };
    const projectResult = {
      ...projectResultBase,
      subscriptions: [
        {
          id: "xyz",
          owner_type: "project",
          regex_selectors: [],
          resource_type: "VERSION",
          selectors: [
            {
              data: "spruce",
              type: "project",
            },
            {
              data: "gitter_request",
              type: "requester",
            },
          ],
          subscriber: {
            jiraIssueSubscriber: undefined,
            target: "evg-123",
            type: "jira-comment",
            webhookSubscriber: undefined,
          },
          trigger: "family-outcome",
          trigger_data: {
            requester: "gitter_request",
          },
        },
      ],
    };

    expect(formToGql(projectForm, "spruce")).toStrictEqual(projectResult);
  });

  it("handles jira issue subscriptions", () => {
    const projectForm = {
      ...projectFormBase,
      subscriptions: [
        {
          subscriptionData: {
            event: {
              eventSelect: "any-version-finishes",
              extraFields: {
                requester: "gitter_request",
              },
            },
            id: "abc",
            notification: {
              jiraIssueInput: {
                issueInput: "Bug",
                projectInput: "EVG",
              },
              notificationSelect: "jira-issue",
            },
          },
        },
      ],
    };

    const projectResult = {
      ...projectResultBase,
      subscriptions: [
        {
          id: "abc",
          owner_type: "project",
          regex_selectors: [],
          resource_type: "VERSION",
          selectors: [
            {
              data: "spruce",
              type: "project",
            },
            {
              data: "gitter_request",
              type: "requester",
            },
          ],
          subscriber: {
            jiraIssueSubscriber: {
              issueType: "Bug",
              project: "EVG",
            },
            target: "EVG",
            type: "jira-issue",
            webhookSubscriber: undefined,
          },
          trigger: "family-outcome",
          trigger_data: {
            requester: "gitter_request",
          },
        },
      ],
    };
    expect(formToGql(projectForm, "spruce")).toStrictEqual(projectResult);
  });
  it("handles webhook subscriptions", () => {
    const projectForm = {
      ...projectFormBase,
      subscriptions: [
        {
          subscriptionData: {
            event: {
              eventSelect: "any-version-finishes",
              extraFields: {
                requester: "gitter_request",
              },
            },
            id: "def",
            notification: {
              notificationSelect: "evergreen-webhook",
              webhookInput: {
                httpHeaders: [
                  {
                    keyInput: "Content-Type",
                    valueInput: "application/json",
                  },
                ],
                minDelayInput: 100,
                retryInput: 0,
                secretInput: "webhook_secret",
                timeoutInput: 1000,
                urlInput: "https://example.com",
              },
            },
          },
        },
      ],
    };

    const projectResult = {
      ...projectResultBase,
      subscriptions: [
        {
          id: "def",
          owner_type: "project",
          regex_selectors: [],
          resource_type: "VERSION",
          selectors: [
            {
              data: "spruce",
              type: "project",
            },
            {
              data: "gitter_request",
              type: "requester",
            },
          ],
          subscriber: {
            jiraIssueSubscriber: undefined,
            target: "https://example.com",
            type: "evergreen-webhook",
            webhookSubscriber: {
              headers: [
                {
                  key: "Content-Type",
                  value: "application/json",
                },
              ],
              minDelayMs: 100,
              retries: 0,
              secret: "webhook_secret",
              timeoutMs: 1000,
              url: "https://example.com",
            },
          },
          trigger: "family-outcome",
          trigger_data: {
            requester: "gitter_request",
          },
        },
      ],
    };

    expect(formToGql(projectForm, "spruce")).toStrictEqual(projectResult);
  });
});

const projectFormBase: NotificationsFormState = {
  buildBreakSettings: {
    notifyOnBuildFailure: null,
  },
  subscriptions: [],
};

const projectResultBase: ProjectSettingsInput = {
  projectRef: {
    id: "spruce",
    notifyOnBuildFailure: null,
  },
  subscriptions: [],
};

const banner = { bannerData: { text: "", theme: BannerTheme.Announcement } };
