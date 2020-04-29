/// <reference types="Cypress" />
/// <reference path="../../support/index.d.ts" />

type ProjectVariants = Array<{
  name: string;
  displayName: string;
  tasks: string[];
}>;
interface PatchProject {
  tasks?: string[];
  variants?: ProjectVariants;
}
type VariantsTasks = Array<{
  name: string;
  tasks: string[];
}>;
interface ConfigurePatchData {
  id: string;
  description: string;
  author: string;
  version: string;
  status: string;
  activated: boolean;
  time: {
    submittedAt: string;
  };
  project: PatchProject;
  variantsTasks: VariantsTasks;
}
interface ConfigurePatchQuery {
  data: {
    patch: ConfigurePatchData;
  };
}

const unactivatedPatchId = "5e6bb9e23066155a993e0f1a";
const patchWithNoVariantsOrTasks = "5e94c2dfe3c3312519b59480";

describe("Configure Patch Page", () => {
  let patch: ConfigurePatchData;
  before(() => {
    cy.login();
    cy.visit(`/patch/${unactivatedPatchId}`);
    cy.listenGQL();
    cy.waitForGQL("ConfigurePatch").then(({ responseBody }) => {
      const { data } = responseBody as ConfigurePatchQuery;
      patch = data.patch;
    });
  });
  describe("Initial state reflects patch data", () => {
    it("Configure patch path is present in url", () => {
      cy.location().should((loc) =>
        expect(loc.pathname).to.eq(
          `/patch/${unactivatedPatchId}/configure/tasks`
        )
      );
    });
    it("Patch name input field value is patch description", () => {
      cy.get("[data-cy=configurePatch-nameInput]")
        .invoke("val")
        .then((text) => {
          expect(text).to.equal(patch.description);
        });
    });
    it("First build variant in list is selected by default", () => {
      const firstVariantDisplayNameInList =
        patch.project.variants[0].displayName;
      cy.get("[data-cy-selected=true]")
        .invoke("text")
        .should("eq", firstVariantDisplayNameInList);
    });
    it("Patch tasks are selected by default", () => {
      const { variantsTasks } = patch;
      variantsTasks.forEach(({ name, tasks }) => {
        cy.get(`[data-cy-name=${name}]`)
          .click()
          .then(() => {
            tasks.forEach((task) => {
              cy.get(`[data-cy=configurePatch-${task}]`).should("be.checked");
            });
          });
      });
    });
  });
  describe("Configuring a patch", () => {
    it("Can update patch description by typing into `Patch Name` input field", () => {
      const val = "michelle obama";
      cy.get(`[data-cy=configurePatch-nameInput]`)
        .as("patchNameInput")
        .clear()
        .type(val);
      cy.get("@patchNameInput")
        .invoke("val")
        .should("eq", val);
    });
    it("Selecting build variant displays tasks of that variant", () => {
      patch.project.variants.forEach(({ name, tasks }) => {
        cy.get(`[data-cy-name=${name}]`)
          .click()
          .then(() => {
            cy.get(`[data-cy=configurePatch-tasks]`)
              .children()
              .its("length")
              .should("eq", tasks.length);
          });
      });
    });
    it("Clicking on tasks checks them and updates task counts", () => {
      // select last build variant in list
      const { variants } = patch.project;
      const lastVariantInList = variants[variants.length - 1];
      const firstTask = lastVariantInList.tasks[0];
      cy.get(`[data-cy-name=${lastVariantInList.name}]`)
        .as("variant")
        .click();

      cy.get("@variant").then(($variant) => {
        const taskCountBadge = `[data-cy=configurePatch-taskCountBadge-${lastVariantInList.name}]`;
        if ($variant.find(taskCountBadge).length > 0) {
          cy.get(taskCountBadge)
            .as("taskCount")
            .invoke("text")
            .then(($taskCount) => {
              const firstTask = lastVariantInList.tasks[0];
              cy.get(`[data-cy=configurePatch-${firstTask}]`).check({
                force: true,
              });
              cy.get("@taskCount")
                .invoke("text")
                .then(($newTaskCount) => {
                  expect(getTaskCountFromText($newTaskCount)).to.eq(
                    getTaskCountFromText($taskCount) + 1
                  );
                  cy.get("@taskCheckbox").uncheck({
                    force: true,
                  });
                  cy.get(taskCountBadge)
                    .invoke("text")
                    .should("eq", $taskCount);
                });
            });
        } else {
          cy.get(`[data-cy=configurePatch-${firstTask}]`)
            .as("taskCheckbox")
            .check({
              force: true,
            });
          cy.get(taskCountBadge)
            .invoke("text")
            .then(($newTaskCount) => {
              expect(getTaskCountFromText($newTaskCount)).to.eq(1);
              // unselect checkbox
              cy.get("@taskCheckbox").uncheck({
                force: true,
              });
              cy.get(taskCountBadge).should("not.exist");
            });
        }
      });
    });
    it("Select/Deselect All buttons", () => {
      cy.get("[data-cy=configurePatch-selectAll").click();
      cy.get("[data-cy=configurePatch-tasks")
        .children()
        .invoke("toArray")
        .then(($tasks) => {
          cy.get("[data-checked=true]")
            .its("length")
            .should("eq", $tasks.length);
        });
      cy.get("[data-cy=configurePatch-deselectAll").click();
      cy.get("[data-cy=configurePatch-tasks")
        .children()
        .invoke("toArray")
        .then(($tasks) => {
          cy.get("[data-checked=false]")
            .its("length")
            .should("eq", $tasks.length);
        });
    });
  });
  describe("Scheduling a patch", () => {
    beforeEach(() => {
      cy.login();
      cy.listenGQL();
    });
    it("Clicking `Schedule` button schedules patch and redirects to patch page", () => {
      cy.visit(`/patch/${unactivatedPatchId}`);
      const val = "hello world";
      cy.get(`[data-cy=configurePatch-nameInput]`)
        .as("patchNameInput")
        .clear()
        .type(val);
      cy.route({
        method: "POST",
        url: "/graphql/query",
        response: mockedSuccessfulConfigureResponse,
      });
      cy.get("[data-cy=schedule-patch]").click();
      cy.location().should("eq", `/patch/${unactivatedPatchId}/tasks`);
    });
    it("Shows error banner if unsuccessful and keeps data", () => {
      cy.visit(`/patch/${unactivatedPatchId}`);
      const val = "hello world";
      cy.get(`[data-cy=configurePatch-nameInput]`)
        .as("patchNameInput")
        .clear()
        .type(val);
      cy.route({
        method: "POST",
        url: "/graphql/query",
        response: mockedErrorConfigureResponse,
      });
      cy.get("[data-cy=schedule-patch]").click();
      cy.location().should("eq", `/patch/${unactivatedPatchId}/configure`);
      cy.get("[data-cy=error-banner]").should("exist");
    });
  });
  describe("Errors", () => {
    it("Shows full page error if patch project has no variants or tasks", () => {
      cy.login();
      cy.visit(`/patch/${patchWithNoVariantsOrTasks}`);
      cy.get("[data-cy=full-page-error").should("exist");
    });
  });
});

const getTaskCountFromText = (text) => {
  if (!text) {
    return 0;
  }
  return parseInt(text);
};

const mockedErrorConfigureResponse = {
  errors: [
    {
      message: "WAH WAH CHICKEN WAH",
      path: ["schedulePatch"],
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    },
  ],
  data: null,
};

const mockedSuccessfulConfigureResponse = {
  data: {
    schedulePatch: {
      id: unactivatedPatchId,
      activated: true,
      __typename: "Patch",
    },
    patchTasks: {
      count: 3,
      tasks: [
        {
          id:
            "mci_osx_dist_patch_c12773e028910390ab4fda66e4b1745cfdc9ee65_5ea99425b23736089a09a98f_20_04_29_14_53_16",
          status: "success",
          baseStatus: "success",
          displayName: "dist",
          buildVariant: "osx",
          __typename: "TaskResult",
        },
        {
          id:
            "mci_osx_test_auth_patch_c12773e028910390ab4fda66e4b1745cfdc9ee65_5ea99425b23736089a09a98f_20_04_29_14_53_16",
          status: "success",
          baseStatus: "success",
          displayName: "test-auth",
          buildVariant: "osx",
          __typename: "TaskResult",
        },
        {
          id:
            "mci_osx_test_graphql_patch_c12773e028910390ab4fda66e4b1745cfdc9ee65_5ea99425b23736089a09a98f_20_04_29_14_53_16",
          status: "success",
          baseStatus: "success",
          displayName: "test-graphql",
          buildVariant: "osx",
          __typename: "TaskResult",
        },
      ],
      __typename: "PatchTasks",
    },
    patchBuildVariants: [
      {
        variant: "osx",
        tasks: [
          {
            id:
              "mci_osx_dist_patch_c12773e028910390ab4fda66e4b1745cfdc9ee65_5ea99425b23736089a09a98f_20_04_29_14_53_16",
            name: "dist",
            status: "success",
            __typename: "PatchBuildVariantTask",
          },
          {
            id:
              "mci_osx_test_auth_patch_c12773e028910390ab4fda66e4b1745cfdc9ee65_5ea99425b23736089a09a98f_20_04_29_14_53_16",
            name: "test-auth",
            status: "success",
            __typename: "PatchBuildVariantTask",
          },
          {
            id:
              "mci_osx_test_graphql_patch_c12773e028910390ab4fda66e4b1745cfdc9ee65_5ea99425b23736089a09a98f_20_04_29_14_53_16",
            name: "test-graphql",
            status: "success",
            __typename: "PatchBuildVariantTask",
          },
        ],
        __typename: "PatchBuildVariant",
      },
    ],
    patch: {
      id: unactivatedPatchId,
      description: "whoaaaaaa mama!!!",
      projectID: "mci",
      githash: "c12773e028910390ab4fda66e4b1745cfdc9ee65",
      patchNumber: 6,
      author: "trey.granderson",
      version: "5ea99425b23736089a09a98f",
      status: "succeeded",
      activated: true,
      alias: "",
      taskCount: 3,
      duration: {
        makespan: "18m31s",
        timeTaken: null,
        __typename: "PatchDuration",
      },
      time: {
        started: "April 29, 2020, 11:09AM",
        submittedAt: "April 29, 2020, 10:50AM",
        finished: "April 29, 2020, 11:27AM",
        __typename: "PatchTime",
      },
      variantsTasks: [
        {
          name: "osx",
          tasks: ["test-graphql", "test-auth", "dist"],
          __typename: "VariantTask",
        },
      ],
      __typename: "Patch",
    },
  },
};
