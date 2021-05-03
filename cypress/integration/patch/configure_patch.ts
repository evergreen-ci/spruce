// / <reference types="Cypress" />
// / <reference path="../../support/index.d.ts" />

const unactivatedPatchId = "5e6bb9e23066155a993e0f1a";
const patchWithDisplayTasks = "5e6bb9e23066155a993e0f1b";
const patch = {
  id: "5e6bb9e23066155a993e0f1a",
  description: "test meee",
  author: "admin",
  alias: "",
  status: "created",
  activated: false,
  commitQueuePosition: null,
  time: { submittedAt: "March 13, 2020, 4:50PM", __typename: "PatchTime" },
  project: {
    tasks: [
      "coverage",
      "smoke-test-task",
      "smoke-test-endpoints",
      "smoke-test-agent-monitor",
      "generate-lint",
      "js-test",
      "dist",
      "test-thirdparty-docker",
      "test-auth",
      "test-rest-route",
      "test-rest-client",
      "test-rest-model",
      "test-command",
      "test-units",
      "test-agent",
      "test-rest-data",
      "test-operations",
      "test-db",
      "test-cloud",
      "test-scheduler",
      "test-service",
      "test-monitor",
      "test-evergreen",
      "test-thirdparty",
      "test-trigger",
      "test-util",
      "test-validator",
      "test-model",
      "test-model-alertrecord",
      "test-model-artifact",
      "test-model-build",
      "test-model-event",
      "test-model-host",
      "test-model-notification",
      "test-model-patch",
      "test-model-stats",
      "test-model-task",
      "test-model-testresult",
      "test-model-user",
      "test-model-distro",
      "test-model-commitqueue",
      "test-model-manifest",
      "test-plugin",
      "test-migrations",
      "test-model-grid",
      "test-graphql",
      "docker-cleanup",
      "test-repotracker",
    ],
    variants: [
      {
        name: "linux-docker",
        displayName: "ArchLinux (Docker)",
        tasks: ["docker-cleanup"],
        __typename: "ProjectBuildVariant",
      },
      {
        name: "coverage",
        displayName: "Coverage",
        tasks: ["coverage"],
        __typename: "ProjectBuildVariant",
      },
      {
        name: "lint",
        displayName: "Lint",
        tasks: ["generate-lint"],
        __typename: "ProjectBuildVariant",
      },
      {
        name: "osx",
        displayName: "OSX",
        tasks: [
          "dist",
          "test-agent",
          "test-auth",
          "test-cloud",
          "test-command",
          "test-db",
          "test-evergreen",
          "test-graphql",
          "test-migrations",
          "test-model",
          "test-model-alertrecord",
          "test-model-artifact",
          "test-model-build",
          "test-model-commitqueue",
          "test-model-distro",
          "test-model-event",
          "test-model-grid",
          "test-model-host",
          "test-model-manifest",
          "test-model-notification",
          "test-model-patch",
          "test-model-stats",
          "test-model-task",
          "test-model-testresult",
          "test-model-user",
          "test-monitor",
          "test-operations",
          "test-plugin",
          "test-repotracker",
          "test-rest-client",
          "test-rest-data",
          "test-rest-model",
          "test-rest-route",
          "test-scheduler",
          "test-service",
          "test-thirdparty",
          "test-thirdparty-docker",
          "test-trigger",
          "test-units",
          "test-util",
          "test-validator",
        ],
        __typename: "ProjectBuildVariant",
      },
      {
        name: "rhel71-power8",
        displayName: "RHEL 7.1 POWER8",
        tasks: [
          "test-agent",
          "test-command",
          "test-rest-client",
          "test-thirdparty",
          "test-thirdparty-docker",
          "test-util",
        ],
        __typename: "ProjectBuildVariant",
      },
      {
        name: "rhel72-s390x",
        displayName: "RHEL 7.2 zLinux",
        tasks: [
          "test-agent",
          "test-command",
          "test-rest-client",
          "test-thirdparty",
          "test-thirdparty-docker",
          "test-util",
        ],
        __typename: "ProjectBuildVariant",
      },
      {
        name: "race-detector",
        displayName: "Race Detector",
        tasks: [
          "test-agent",
          "test-auth",
          "test-cloud",
          "test-command",
          "test-db",
          "test-evergreen",
          "test-graphql",
          "test-migrations",
          "test-model",
          "test-model-alertrecord",
          "test-model-artifact",
          "test-model-build",
          "test-model-commitqueue",
          "test-model-distro",
          "test-model-event",
          "test-model-grid",
          "test-model-host",
          "test-model-manifest",
          "test-model-notification",
          "test-model-patch",
          "test-model-stats",
          "test-model-task",
          "test-model-testresult",
          "test-model-user",
          "test-monitor",
          "test-operations",
          "test-plugin",
          "test-repotracker",
          "test-rest-client",
          "test-rest-data",
          "test-rest-model",
          "test-rest-route",
          "test-scheduler",
          "test-service",
          "test-thirdparty",
          "test-thirdparty-docker",
          "test-trigger",
          "test-units",
          "test-util",
          "test-validator",
        ],
        __typename: "ProjectBuildVariant",
      },
      {
        name: "ubuntu1604",
        displayName: "Ubuntu 16.04",
        tasks: [
          "dist",
          "js-test",
          "smoke-test-agent-monitor",
          "smoke-test-endpoints",
          "smoke-test-task",
          "test-agent",
          "test-auth",
          "test-cloud",
          "test-command",
          "test-db",
          "test-evergreen",
          "test-graphql",
          "test-migrations",
          "test-model",
          "test-model-alertrecord",
          "test-model-artifact",
          "test-model-build",
          "test-model-commitqueue",
          "test-model-distro",
          "test-model-event",
          "test-model-grid",
          "test-model-host",
          "test-model-manifest",
          "test-model-notification",
          "test-model-patch",
          "test-model-stats",
          "test-model-task",
          "test-model-testresult",
          "test-model-user",
          "test-monitor",
          "test-operations",
          "test-plugin",
          "test-repotracker",
          "test-rest-client",
          "test-rest-data",
          "test-rest-model",
          "test-rest-route",
          "test-scheduler",
          "test-service",
          "test-thirdparty",
          "test-thirdparty-docker",
          "test-trigger",
          "test-units",
          "test-util",
          "test-validator",
        ],
        __typename: "ProjectBuildVariant",
      },
      {
        name: "ubuntu1604-docker",
        displayName: "Ubuntu 16.04 (Docker)",
        tasks: [
          "dist",
          "smoke-test-agent-monitor",
          "smoke-test-endpoints",
          "smoke-test-task",
          "test-agent",
          "test-auth",
          "test-cloud",
          "test-command",
          "test-db",
          "test-evergreen",
          "test-graphql",
          "test-migrations",
          "test-model",
          "test-model-alertrecord",
          "test-model-artifact",
          "test-model-build",
          "test-model-commitqueue",
          "test-model-distro",
          "test-model-event",
          "test-model-grid",
          "test-model-host",
          "test-model-manifest",
          "test-model-notification",
          "test-model-patch",
          "test-model-stats",
          "test-model-task",
          "test-model-testresult",
          "test-model-user",
          "test-monitor",
          "test-operations",
          "test-plugin",
          "test-repotracker",
          "test-rest-client",
          "test-rest-data",
          "test-rest-model",
          "test-rest-route",
          "test-scheduler",
          "test-service",
          "test-thirdparty",
          "test-thirdparty-docker",
          "test-trigger",
          "test-units",
          "test-util",
          "test-validator",
        ],
        __typename: "ProjectBuildVariant",
      },
      {
        name: "ubuntu1604-arm64",
        displayName: "Ubuntu 16.04 ARM",
        tasks: [
          "test-agent",
          "test-command",
          "test-rest-client",
          "test-thirdparty",
          "test-thirdparty-docker",
          "test-util",
        ],
        __typename: "ProjectBuildVariant",
      },
      {
        name: "windows",
        displayName: "Windows",
        tasks: [
          "test-agent",
          "test-command",
          "test-operations",
          "test-rest-client",
          "test-thirdparty",
          "test-thirdparty-docker",
          "test-util",
        ],
        __typename: "ProjectBuildVariant",
      },
    ],
    __typename: "PatchProject",
  },
  variantsTasks: [
    {
      name: "ubuntu1604",
      tasks: ["test-graphql"],
      __typename: "VariantTask",
    },
  ],
  __typename: "Patch",
};

describe("Configure Patch Page", () => {
  before(() => {
    cy.login();
    cy.visit(`/version/${unactivatedPatchId}`);
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
      cy.dataCy("configurePatch-nameInput")
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
        cy.get(`[data-cy-name=${name}`)
          .click()
          .then(() => {
            tasks.forEach((task) => {
              cy.dataCy(`configurePatch-${task}`).should("be.checked");
            });
          });
      });
    });
  });
  describe("Add parameters", () => {
    before(() => {
      cy.login();
    });
    beforeEach(() => {
      cy.preserveCookies();
    });
    it("Navigating to 'Parameters' tab shows the existing parameters", () => {
      cy.visit(`patch/${unactivatedPatchId}/configure/tasks`);
      cy.wait(10);
      cy.get('button[data-cy="parameters-tab"]').click();
      cy.dataCy("select-variants-and-task-card-wrapper").should(
        "have.css",
        "pointer-events",
        "none"
      );
    });
    it("Adding a parameter is reflected on the page", () => {
      cy.visit(`patch/${unactivatedPatchId}/configure/tasks`);
      cy.wait(10);
      cy.get('button[data-cy="parameters-tab"]').click();
      cy.dataCy("add-tag-button").click();
      cy.dataCy("user-tag-key-field").type("testKey");
      cy.dataCy("user-tag-value-field").type("testValue");
      cy.dataCy("user-tag-edit-icon").click();
      cy.dataCy("user-tag-row").its("length").should("eq", 1);
    });
    it("Parameters cannot be added once activated", () => {
      cy.visit(`patch/5ecedafb562343215a7ff297/configure/tasks`);
      cy.wait(10);
      cy.get('button[data-cy="parameters-tab"]').click();
      cy.dataCy("parameters-disclaimer").should("exist");
      cy.dataCy("badge-this-is-a-parameter").should("exist");
      cy.dataCy("badge-my_team").should("exist");
    });
  });

  describe("Configuring a patch", () => {
    before(() => {
      cy.login();
      cy.preserveCookies();
    });
    it("Can update patch description by typing into `Patch Name` input field", () => {
      cy.visit(`patch/${unactivatedPatchId}/configure/tasks`);
      const val = "michelle obama";
      cy.dataCy(`configurePatch-nameInput`)
        .as("patchNameInput")
        .clear()
        .type(val);
      cy.get("@patchNameInput").invoke("val").should("eq", val);
    });
    it("Selecting build variant displays tasks of that variant", () => {
      patch.project.variants.forEach(({ name, tasks }) => {
        cy.get(`[data-cy-name=${name}`)
          .click()
          .then(() => {
            cy.dataCy(`configurePatch-tasks`)
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
      cy.get(`[data-cy-name=${lastVariantInList.name}`).as("variant").click();

      cy.get("@variant").then(($variant) => {
        const taskCountBadge = `[data-cy=configurePatch-taskCountBadge-${lastVariantInList.name}]`;
        if ($variant.find(taskCountBadge).length > 0) {
          cy.get(taskCountBadge)
            .as("taskCount")
            .invoke("text")
            .then(($taskCount) => {
              const firstTask1 = lastVariantInList.tasks[0];
              cy.dataCy(`configurePatch-${firstTask1}`).check({
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
          cy.dataCy(`configurePatch-${firstTask}`).as("taskCheckbox").check({
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
      it("Clicking Select All should check all task checkboxes when all of the task checkboxes unchecked", () => {
        cy.dataCy("configurePatch-selectAll").click({ force: true });
        cy.get("[data-checked=task-checkbox-checked]")
          .its("length")
          .should("eq", 7);
      });
      it("Clicking on Select All should uncheck all task checkboxes when all of the task checkboxes are checked", () => {
        cy.dataCy("configurePatch-selectAll").click({ force: true });
        cy.get("[data-checked=task-checkbox-unchecked]")
          .its("length")
          .should("eq", 7);
      });
      it("Checking all task checkboxes should check the Select All checkbox", () => {
        cy.wrap(checkboxTaskNames).each((taskName) => {
          cy.dataCy(`configurePatch-${taskName}`).click({ force: true });
        });
        cy.get("[data-checked=selectAll-checked]").should("exist");
      });
      it("Unchecking all task checkboxes should uncheck the Select All checkbox", () => {
        cy.wrap(checkboxTaskNames).each((taskName) => {
          cy.dataCy(`configurePatch-${taskName}`).click({ force: true });
        });
        cy.get("[data-checked=selectAll-unchecked]").should("exist");
      });
      it("A mixture of checked and unchecked task checkboxes sets the Select All checkbox in an indeterminate state", () => {
        cy.dataCy("configurePatch-test-agent").click({ force: true });
        cy.get("[data-checked=selectAll-indeterminate]").should("exist");
      });
    });

    describe("Build variant selection", () => {
      it("Selecting multiple build variants should display deduplicated task checkboxes", () => {
        cy.get("body").type("{meta}", { release: false });
        cy.get('[data-cy-name="rhel72-s390x"]').click();
        cy.dataCy("configurePatch-tasks")
          .children()
          .its("length")
          .should("eq", 7);
        cy.get('[data-cy-name="rhel71-power8"]').click();
        cy.dataCy("configurePatch-tasks")
          .children()
          .its("length")
          .should("eq", 7);
        cy.get('[data-cy-name="race-detector"]').click();
        cy.dataCy("configurePatch-tasks")
          .children()
          .its("length")
          .should("eq", 40);
        cy.get("body").type("{meta}", { release: true });
      });

      it("Deselecting multiple build variants should display deduplicated task checkboxes", () => {
        cy.get("body").type("{meta}", { release: false });
        cy.get('[data-cy-name="rhel72-s390x"]').click();
        cy.dataCy("configurePatch-tasks")
          .children()
          .its("length")
          .should("eq", 40);
        cy.get('[data-cy-name="rhel71-power8"]').click();
        cy.dataCy("configurePatch-tasks")
          .children()
          .its("length")
          .should("eq", 40);
        cy.get('[data-cy-name="race-detector"]').click();
        cy.dataCy("configurePatch-tasks")
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
        cy.dataCy("configurePatch-selectAll").click({ force: true });
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
      it("Shift+click will select the clicked build variant along with all build variants between the clicked build variant and the first selected build variant in the list", () => {
        cy.get("body").type("{shift}", { release: false }); // hold shift
        cy.get('[data-cy-name="windows"]').click();
        cy.get("[data-cy-selected=true]").its("length").should("eq", 7);
        const variantsFirstTime = [
          "RHEL 7.1 POWER81",
          "RHEL 7.2 zLinux",
          "Race Detector",
          "Ubuntu 16.041",
          "Ubuntu 16.04 (Docker)",
          "Ubuntu 16.04 ARM",
          "Windows1",
        ];
        cy.get("[data-cy-selected=true]").each((v, i) => {
          cy.wrap(v).contains(variantsFirstTime[i]);
        });
        cy.get("body").type("{shift}", { release: true }); // release shift
        cy.get("body").type("{meta}", { release: false }); // hold meta
        cy.get('[data-cy-name="lint"]').click();
        cy.get("body").type("{meta}", { release: true }); // release meta
        cy.get("body").type("{shift}", { release: false }); // hold shift
        cy.get('[data-cy-name="linux-docker"]').click();
        const variantsSecondTime = [
          "ArchLinux (Docker)",
          "Coverage",
          "Lint",
        ].concat(variantsFirstTime);
        cy.get("[data-cy-selected=true]").each((v, i) => {
          cy.wrap(v).contains(variantsSecondTime[i]);
        });
        cy.get("[data-cy-selected=true]").its("length").should("eq", 10);
      });
    });
  });
  describe("visiting a configure page with display tasks", () => {
    before(() => {
      cy.login();
      cy.preserveCookies();
    });
    it("should show display tasks if there are any", () => {
      cy.visit(`patch/${patchWithDisplayTasks}/configure/tasks`);
      cy.dataCy("configurePatch-display_task").should("exist");
    });
  });
  describe("Indeterminate task checkbox states", () => {
    it("Checking a task in 1 build variant but not the other shows the task checkbox as indeterminate when viewing tasks from both variants and puts the Select All checkbox in an indeterminate state", () => {
      cy.get('[data-cy-name="rhel72-s390x"]').click();
      cy.dataCy("configurePatch-test-agent").click({ force: true });
      cy.get("body").type("{meta}", { release: false });
      cy.get('[data-cy-name="rhel71-power8"]').click();
      cy.get(
        "[data-name-checked=task-checkbox-test-agent-indeterminate]"
      ).should("exist");
      cy.get("[data-checked=selectAll-indeterminate]").should("exist");
    });
  });
  describe("Scheduling a patch", () => {
    before(() => {
      cy.login();
    });
    beforeEach(() => {
      cy.preserveCookies();
      cy.server();
    });
    it("Clicking `Schedule` button schedules patch and redirects to patch page", () => {
      cy.visit(`/patch/${unactivatedPatchId}`);
      const val = "hello world";
      cy.dataCy(`configurePatch-nameInput`)
        .as("patchNameInput")
        .clear()
        .type(val);
      cy.route({
        method: "POST",
        url: "/graphql/query",
        response: mockedSuccessfulConfigureResponse,
      });
      cy.dataCy("schedule-patch").click();
      cy.location("pathname").should(
        "eq",
        `/version/${unactivatedPatchId}/tasks`
      );
    });

    it("Shows error toast if unsuccessful and keeps data", () => {
      cy.visit(`/version/${unactivatedPatchId}`);
      const val = "hello world";
      cy.dataCy(`configurePatch-nameInput`)
        .as("patchNameInput")
        .clear()
        .type(val);
      cy.route({
        method: "POST",
        url: "/graphql/query",
        response: mockedErrorConfigureResponse,
      });
      cy.dataCy("schedule-patch").click();
      cy.location("pathname").should(
        "eq",
        `/patch/${unactivatedPatchId}/configure/tasks`
      );
      cy.dataCy("toast").contains("WAH WAH CHICKEN WAH");
    });
  });
  describe("Switching tabs", () => {
    before(() => {
      cy.login();
    });
    beforeEach(() => {
      cy.preserveCookies();
    });
    it("Navigating to 'Changes' tab from 'Configure' disables the 'Select Build Variants and Tasks' card", () => {
      cy.visit(`patch/${unactivatedPatchId}/configure/tasks`);
      cy.wait(10);
      cy.get('button[data-cy="changes-tab"]').click();
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
