// / <reference types="Cypress" />
// / <reference path="../../support/index.d.ts" />

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
    cy.visit(`/version/${unactivatedPatchId}`);
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
              const firstTask1 = lastVariantInList.tasks[0];
              cy.get(`[data-cy=configurePatch-${firstTask1}]`).check({
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
    describe("Select/Deselect All buttons", () => {
      const checkboxTaskNames = [
        "test-agent",
        "test-command",
        "test-operations",
        "test-rest-client",
        "test-thirdparty",
        "test-thirdparty-docker",
        "test-util",
      ];
      it("clicking Select All should Select all task checkboxes", () => {
        cy.get("[data-cy=configurePatch-selectAll").click({ force: true });
        cy.get("[data-checked=task-checkbox-checked]")
          .its("length")
          .should("eq", 7);
      });
      it("clicking on Deselect All should deselect all task checkboxes", () => {
        cy.get("[data-cy=configurePatch-deselectAll").click({ force: true });
        cy.get("[data-checked=task-checkbox-unchecked]")
          .its("length")
          .should("eq", 7);
      });
      it("Checking all task checkboxes should check the Select All checkbox and check the Deselect All checkbox", () => {
        cy.wrap(checkboxTaskNames).each((taskName) => {
          cy.dataCy(`configurePatch-${taskName}`).click({ force: true });
        });
        cy.get("[data-checked=selectAll-checked]").should("exist");
        cy.get("[data-checked=deselectAll-unchecked]").should("exist");
      });
      it("Unchecking all task checkboxes should uncheck the Select All checkbox and check the Deselect All checkbox", () => {
        cy.wrap(checkboxTaskNames).each((taskName) => {
          cy.dataCy(`configurePatch-${taskName}`).click({ force: true });
        });
        cy.get("[data-checked=selectAll-unchecked]").should("exist");
        cy.get("[data-checked=deselectAll-checked]").should("exist");
      });
      it("A mixture of checked and unchecked task checkboxes sets the Select All and Deselect All checkboxes in an indeterminate state", () => {
        cy.dataCy("configurePatch-test-agent").click({ force: true });
        cy.get("[data-checked=selectAll-indeterminate]").should("exist");
        cy.get("[data-checked=deselectAll-indeterminate]").should("exist");
      });
    });

    describe("Build variant selection", () => {
      it("Selecting multiple build variants should display deduplicated task checkboxes", () => {
        cy.get("body").type("{meta}", { release: false });
        cy.get('[data-cy-name="rhel72-s390x"]').click();
        cy.get("[data-cy=configurePatch-tasks")
          .children()
          .its("length")
          .should("eq", 7);
        cy.get('[data-cy-name="rhel71-power8"]').click();
        cy.get("[data-cy=configurePatch-tasks")
          .children()
          .its("length")
          .should("eq", 7);
        cy.get('[data-cy-name="race-detector"]').click();
        cy.get("[data-cy=configurePatch-tasks")
          .children()
          .its("length")
          .should("eq", 40);
        cy.get("body").type("{meta}", { release: true });
      });

      it("Deselecting multiple build variants should display deduplicated task checkboxes", () => {
        cy.get("body").type("{meta}", { release: false });
        cy.get('[data-cy-name="rhel72-s390x"]').click();
        cy.get("[data-cy=configurePatch-tasks")
          .children()
          .its("length")
          .should("eq", 40);
        cy.get('[data-cy-name="rhel71-power8"]').click();
        cy.get("[data-cy=configurePatch-tasks")
          .children()
          .its("length")
          .should("eq", 40);
        cy.get('[data-cy-name="race-detector"]').click();
        cy.get("[data-cy=configurePatch-tasks")
          .children()
          .its("length")
          .should("eq", 7);
      });

      it("Checking a deduplicated task between multiple build variants updates the task within each selected build variant", () => {
        cy.get("body").type("{meta}", { release: false });
        cy.get('[data-cy-name="rhel72-s390x"]').click();
        cy.get('[data-cy-name="rhel71-power8"]').click();
        cy.get("body").type("{meta}", { release: true });
        cy.dataCy("configurePatch-test-agent").click({ force: true });
        cy.dataCy("configurePatch-test-agent").click({ force: true });
        cy.get('[data-cy-name="rhel72-s390x"]').click({ force: true });
        cy.get("[data-checked=task-checkbox-checked]")
          .its("length")
          .should("eq", 1);
        cy.get('[data-cy-name="rhel71-power8"').click({ force: true });
        cy.get("[data-checked=task-checkbox-checked]")
          .its("length")
          .should("eq", 1);
        cy.get('[data-cy-name="windows"').click({ force: true });
        cy.get("[data-checked=task-checkbox-checked]")
          .its("length")
          .should("eq", 1);
      });

      it("Should be able to select/deselect all for multiple build variants and have the number of selected tasks reflected in the variant tab bade and task count label", () => {
        cy.get("body").type("{meta}", { release: false });
        cy.get('[data-cy-name="rhel72-s390x"]').click();
        cy.get('[data-cy-name="rhel71-power8"]').click();
        cy.dataCy("configurePatch-selectAll").click({ force: true });
        cy.get("[data-checked=task-checkbox-checked]")
          .its("length")
          .should("eq", 7);
        cy.contains("20 tasks across 4 build variants");
        cy.dataCy("configurePatch-taskCountBadge-rhel71-power8").contains("6");
        cy.dataCy("configurePatch-taskCountBadge-rhel72-s390x").contains("6");
        cy.dataCy("configurePatch-taskCountBadge-windows").contains("7");
        cy.dataCy("configurePatch-deselectAll").click({ force: true });
        cy.get("[data-checked=task-checkbox-unchecked]")
          .its("length")
          .should("eq", 7);
        cy.contains("1 task across 1 build variant");
        cy.dataCy("configurePatch-taskCountBadge-rhel71-power8").should(
          "not.exist"
        );
        cy.dataCy("configurePatch-taskCountBadge-rhel72-s390x").should(
          "not.exist"
        );
        cy.dataCy("configurePatch-taskCountBadge-windows").should("not.exist");
      });
      it("Should be able to select and unselect an individual task and have task count be reflected in variant tab badge and task count label", () => {
        cy.dataCy("configurePatch-test-agent").click({ force: true });
        cy.dataCy("configurePatch-taskCountBadge-rhel71-power8").contains("1");
        cy.dataCy("configurePatch-taskCountBadge-rhel72-s390x").contains("1");
        cy.dataCy("configurePatch-taskCountBadge-windows").contains("1");
        cy.contains("4 tasks across 4 build variants");
      });
    });
  });
  describe("Indeterminate task checkbox states", () => {
    it("Checking a task in 1 build variant but not the other shows the task checkbox as indeterminate when viewing tasks from both variants", () => {
      cy.get('[data-cy-name="rhel72-s390x"]').click();
      cy.dataCy("configurePatch-test-agent").click({ force: true });
      cy.get("body").type("{meta}", { release: false });
      cy.get('[data-cy-name="rhel71-power8"]').click();
      cy.get(
        "[data-name-checked=task-checkbox-test-agent-indeterminate]"
      ).should("exist");
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
      cy.location("pathname").should(
        "eq",
        `/version/${unactivatedPatchId}/tasks`
      );
    });
    it("Shows error banner if unsuccessful and keeps data", () => {
      cy.visit(`/version/${unactivatedPatchId}`);
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
      cy.location("pathname").should(
        "eq",
        `/patch/${unactivatedPatchId}/configure/tasks`
      );
      cy.get("[data-cy=error-banner]").should("exist");
    });
  });
  describe("Errors", () => {
    it("Shows full page error if patch project has no variants or tasks", () => {
      cy.login();
      cy.visit(`/version/${patchWithNoVariantsOrTasks}`);
      cy.get("[data-cy=full-page-error").should("exist");
    });
  });
  describe("Switching tabs", () => {
    it("Navigating to 'Changes' tab from 'Configure' disables the 'Select Build Variants and Tasks' card", () => {
      cy.login();
      cy.visit(`patch/${unactivatedPatchId}/configure/tasks`);
      cy.dataCy("changes-tab").click();
      cy.dataCy("select-variants-and-task-card-wrapper").should(
        "have.css",
        "pointer-events",
        "none"
      );
      cy.dataCy("select-variants-and-task-card-wrapper").should(
        "have.css",
        "opacity",
        "0.4"
      );
    });
  });
});

const getTaskCountFromText = (text) => {
  if (!text) {
    return 0;
  }
  return parseInt(text, 10);
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
