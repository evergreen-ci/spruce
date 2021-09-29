// / <reference types="Cypress" />
// / <reference path="../../support/index.d.ts" />
const unactivatedPatchId = "5e6bb9e23066155a993e0f1a";
const patchWithDisplayTasks = "5e6bb9e23066155a993e0f1b";

describe("Configure Patch Page", () => {
  before(() => {
    cy.login();
  });
  beforeEach(() => {
    cy.preserveCookies();
  });

  describe("Initial state reflects patch data", () => {
    before(() => {
      cy.visit(`/version/${unactivatedPatchId}`);
    });
    it("Should Redirect to configure page for unconfigured patches", () => {
      cy.location().should((loc) =>
        expect(loc.pathname).to.eq(
          `/patch/${unactivatedPatchId}/configure/tasks`
        )
      );
    });
    it("Patch name input field value is patch description", () => {
      cy.dataCy("patch-name-input")
        .invoke("val")
        .then((text) => {
          expect(text).to.equal("test meee");
        });
    });
    it("First build variant in list is selected by default", () => {
      cy.dataCy("build-variant-list-item")
        .first()
        .should("have.attr", "data-selected", "true");
    });
    describe("Visiting configure page from a redirect", () => {
      it("should default to the tasks tab when there isn't one in the url", () => {
        cy.visit(`/patch/${unactivatedPatchId}/configure`);
        cy.get('button[data-cy="tasks-tab"]').should(
          "have.attr",
          "aria-selected",
          "true"
        );
        cy.dataCy("tasks-tab").should("be.visible");
      });
    });
    describe("Visiting a configure page with display tasks", () => {
      before(() => {
        cy.visit(`patch/${patchWithDisplayTasks}/configure/tasks`);
      });
      it("should show display tasks if there are any", () => {
        cy.contains("display_task");
      });
    });
    it("Required tasks should be auto selected", () => {
      cy.visit(`patch/${patchWithDisplayTasks}/configure/tasks`);
      cy.getInputByLabel("test-graphql").should("be.checked");
    });
  });

  describe("Switching tabs", () => {
    before(() => {
      cy.visit(`patch/${unactivatedPatchId}/configure/tasks`);
      cy.wait(10);
    });
    it("Should be able to switch between tabs", () => {
      cy.get('button[data-cy="changes-tab"]').click();
      cy.location("pathname").should(
        "eq",
        `/patch/${unactivatedPatchId}/configure/changes`
      );
      cy.get('button[data-cy="parameters-tab"]').click();
      cy.location("pathname").should(
        "eq",
        `/patch/${unactivatedPatchId}/configure/parameters`
      );
      cy.get('button[data-cy="tasks-tab"]').click();
      cy.location("pathname").should(
        "eq",
        `/patch/${unactivatedPatchId}/configure/tasks`
      );
    });
    it("Navigating away from the configure tab should disable the build variant selector", () => {
      cy.get('button[data-cy="changes-tab"]').click();
      cy.dataCy("build-variant-select-wrapper").should("have.attr", "disabled");
      cy.dataCy("build-variant-select-wrapper").should(
        "have.css",
        "pointer-events",
        "none"
      );
    });
  });

  describe("Patch Parameters", () => {
    describe("Unactivated Patch", () => {
      before(() => {
        cy.visit(`patch/${unactivatedPatchId}/configure/tasks`);
        cy.get('button[data-cy="parameters-tab"]').click();
      });
      it("Adding a parameter is reflected on the page", () => {
        cy.dataCy("add-tag-button").click();
        cy.dataCy("user-tag-key-field").type("testKey");
        cy.dataCy("user-tag-value-field").type("testValue");
        cy.dataCy("user-tag-edit-icon").click();
        cy.dataCy("user-tag-row").its("length").should("eq", 1);
      });
    });
    describe("Activated Patch", () => {
      before(() => {
        cy.visit(`patch/5ecedafb562343215a7ff297/configure/tasks`);
        cy.get('button[data-cy="parameters-tab"]').click();
      });
      it("Parameters cannot be added once activated", () => {
        cy.dataCy("add-tag-button").should("not.exist");
        cy.dataCy("parameters-disclaimer").should("exist");
        cy.dataCy("badge-this-is-a-parameter").should("exist");
        cy.dataCy("badge-my_team").should("exist");
      });
    });
  });

  describe("Configuring a patch", () => {
    before(() => {
      cy.visit(`patch/${unactivatedPatchId}/configure/tasks`);
    });
    it("Can update patch description by typing into `Patch Name` input field", () => {
      const val = "michelle obama";
      cy.dataCy(`patch-name-input`).clear().type(val);
      cy.dataCy(`patch-name-input`).should("have.value", val);
    });
    it("Schedule button should be disabled when no tasks are selected and enabled when they are", () => {
      cy.dataCy("task-checkbox").should("not.be.checked");
      cy.dataCy("schedule-patch").should("be.disabled");
      cy.dataCy("task-checkbox").check({ force: true });

      cy.dataCy("schedule-patch").should("not.be.disabled");
      cy.dataCy("task-checkbox").uncheck({ force: true });
    });
    it("Clicking on unchecked tasks checks them and updates task counts", () => {
      const variantItem = cy.dataCy("build-variant-list-item");
      variantItem.eq(-1).click();

      variantItem.find('[data-cy="task-count-badge"]').should("not.exist");
      let count = 0;
      cy.dataCy("selected-task-disclaimer").contains(
        `${count} tasks across 0 build variants`
      );
      cy.dataCy("task-checkbox").each(($el) => {
        const checkbox = cy.wrap($el);
        checkbox.should("not.be.checked");
        checkbox.check({
          force: true,
        });
        count += 1;
        checkbox.should("be.checked");
        cy.dataCy("selected-task-disclaimer").contains(`${count} task`);
        cy.dataCy("selected-task-disclaimer").contains(`1 build variant`);
        cy.dataCy("build-variant-list-item")
          .find('[data-cy="task-count-badge"]')
          .should("exist");
        cy.dataCy("build-variant-list-item")
          .find('[data-cy="task-count-badge"]')
          .should("have.text", count);
      });
    });
    it("Clicking on checked tasks unchecks them and updates task counts", () => {
      const variantItem = cy.dataCy("build-variant-list-item");
      variantItem.find('[data-cy="task-count-badge"]').should("exist");
      let count = 7;
      cy.dataCy("selected-task-disclaimer").contains(
        `${count} tasks across 1 build variant`
      );

      cy.dataCy("task-checkbox").each(($el) => {
        const checkbox = cy.wrap($el);
        checkbox.should("be.checked");
        checkbox.uncheck({
          force: true,
        });
        count -= 1;
        checkbox.should("not.be.checked");
      });

      cy.dataCy("build-variant-list-item")
        .find('[data-cy="task-count-badge"]')
        .should("not.exist");
      cy.dataCy("selected-task-disclaimer").contains(
        `0 tasks across 0 build variants`
      );
    });

    describe("Select/Deselect All buttons", () => {
      it("Checking Select All should check all task checkboxes when all of the task checkboxes unchecked", () => {
        cy.dataCy("select-all-checkbox").check({
          force: true,
        });
        cy.dataCy("task-checkbox").each(($el) => {
          cy.wrap($el).should("be.checked");
        });
      });
      it("Unchecking the Select All checkbox should uncheck all task checkboxes when all of the task checkboxes are checked", () => {
        cy.dataCy("select-all-checkbox").uncheck({
          force: true,
        });
        cy.dataCy("task-checkbox").each(($el) => {
          cy.wrap($el).should("not.be.checked");
        });
      });
      it("Checking all task checkboxes should check the Select All checkbox", () => {
        cy.dataCy("select-all-checkbox").should("not.be.checked");
        cy.dataCy("task-checkbox").each(($el) => {
          cy.wrap($el).check({ force: true });
        });
        cy.dataCy("select-all-checkbox").should("be.checked");
      });
      it("Unchecking all task checkboxes should uncheck the Select All checkbox", () => {
        cy.dataCy("select-all-checkbox").should("be.checked");
        cy.dataCy("task-checkbox").each(($el) => {
          cy.wrap($el).uncheck({ force: true });
        });
        cy.dataCy("select-all-checkbox").should("not.be.checked");
      });
      it("A mixture of checked and unchecked task checkboxes sets the Select All checkbox in an indeterminate state", () => {
        cy.dataCy("build-variant-list-item")
          .contains("RHEL 7.2 zLinux")
          .click();
        cy.dataCy("task-checkbox").first().check({ force: true });
        cy.dataCy("select-all-checkbox").should(
          "have.attr",
          "aria-checked",
          "mixed"
        );
      });
      it("Selecting all tasks on an an indeterminate state should check all the checkboxes", () => {
        cy.dataCy("select-all-checkbox").check({ force: true });
        cy.dataCy("task-checkbox").each(($el) => {
          cy.wrap($el).should("be.checked");
        });
        cy.dataCy("select-all-checkbox").should("be.checked");
        cy.dataCy("select-all-checkbox").uncheck({ force: true });
        cy.dataCy("task-checkbox").each(($el) => {
          cy.wrap($el).should("not.be.checked");
        });
      });
    });

    describe("Build variant selection", () => {
      it("Should be able to select and unselect an individual task and have task count be reflected in variant tab badge and task count label", () => {
        cy.dataCy("build-variant-list-item")
          .contains("RHEL 7.2 zLinux")
          .click();
        cy.getInputByLabel("test-agent").check({
          force: true,
        });
        cy.dataCy("task-count-badge").should("have.length", 1);
        cy.dataCy("task-count-badge").contains("1");

        cy.dataCy("selected-task-disclaimer").contains(
          "1 task across 1 build variant"
        );
        cy.getInputByLabel("test-agent").uncheck({
          force: true,
        });
        cy.dataCy("task-count-badge").should("not.exist");
        cy.dataCy("selected-task-disclaimer").contains(
          "0 tasks across 0 build variants"
        );
      });
      it("Selecting multiple build variants should display deduplicated task checkboxes", () => {
        cy.get("body").type("{meta}", {
          release: false,
        });
        cy.dataCy("build-variant-list-item")
          .contains("RHEL 7.2 zLinux")
          .click();

        cy.dataCy("build-variant-list-item")
          .contains("RHEL 7.1 POWER8")
          .click();

        cy.dataCy("build-variant-list-item").contains("Race Detector").click();
        cy.get("body").type("{meta}", {
          release: true,
        });
        cy.getInputByLabel("test-agent").should("have.length", 1);
      });

      it("Deselecting multiple build variants should remove the associated tasks ", () => {
        cy.dataCy("task-checkbox").as("before-tasks");
        cy.get("body").type("{meta}", {
          release: false,
        });
        cy.dataCy("build-variant-list-item").contains("Race Detector").click();
        cy.dataCy("build-variant-list-item")
          .contains("RHEL 7.1 POWER8")
          .click();

        cy.dataCy("build-variant-list-item")
          .contains("RHEL 7.2 zLinux")
          .click();
        cy.dataCy("task-checkbox").should("have.length", 6);
      });

      it("Checking a deduplicated task between multiple build variants updates the task within each selected build variant", () => {
        cy.get("body").type("{meta}", {
          release: false,
        });
        cy.dataCy("build-variant-list-item")
          .contains("RHEL 7.2 zLinux")
          .click();
        cy.dataCy("build-variant-list-item")
          .contains("RHEL 7.1 POWER8")
          .click();
        cy.get("body").type("{meta}", {
          release: true,
        });
        cy.getInputByLabel("test-agent").should("have.length", 1);
        cy.getInputByLabel("test-agent").check({
          force: true,
        });
        cy.dataCy("build-variant-list-item").within(($el) => {
          cy.wrap($el)
            .find('[data-cy="task-count-badge"]')
            .should("have.text", 11);
        });

        cy.dataCy("build-variant-list-item")
          .contains("RHEL 7.2 zLinux")
          .click();

        cy.getInputByLabel("test-agent").should("be.checked");

        cy.dataCy("build-variant-list-item")
          .contains("RHEL 7.1 POWER8")
          .click();
        cy.getInputByLabel("test-agent").should("be.checked");

        // Deselect the buttons and reset                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ;
        cy.getInputByLabel("test-agent").uncheck({
          force: true,
        });
        cy.dataCy("build-variant-list-item")
          .contains("RHEL 7.2 zLinux")
          .click();

        cy.getInputByLabel("test-agent").uncheck({
          force: true,
        });
      });

      describe("Selecting/deselecting all multiple buildvariants", () => {
        it("Should be able to select all tasks from multiple build variants", () => {
          cy.dataCy("build-variant-list-item")
            .contains("RHEL 7.2 zLinux")
            .click();

          cy.dataCy("task-checkbox").its("length").as("variant1TaskCount");

          cy.dataCy("build-variant-list-item")
            .contains("RHEL 7.1 POWER8")
            .click();

          cy.dataCy("task-checkbox").its("length").as("variant2TaskCount");

          cy.get("body").type("{meta}", {
            release: false,
          });
          cy.dataCy("build-variant-list-item")
            .contains("RHEL 7.2 zLinux")
            .click();

          cy.dataCy("select-all-checkbox").check({
            force: true,
          });
          cy.dataCy("task-checkbox").each(($el) => {
            cy.wrap($el).should("be.checked");
          });

          cy.get("@variant1TaskCount").then((variant1TaskCount) => {
            cy.get("@variant2TaskCount").then((variant2TaskCount) => {
              cy.dataCy("selected-task-disclaimer").contains(
                `${
                  variant1TaskCount + variant2TaskCount
                } tasks across 2 build variants`
              );
            });
          });
          cy.get("body").type("{meta}", {
            release: true,
          });
        });

        it("Should be able to deselect all tasks from multiple build variants", () => {
          cy.dataCy("build-variant-list-item")
            .contains("RHEL 7.2 zLinux")
            .click();

          cy.dataCy("task-checkbox").each(($el) => {
            cy.wrap($el).should("be.checked");
          });

          cy.dataCy("build-variant-list-item")
            .contains("RHEL 7.1 POWER8")
            .click();

          cy.dataCy("task-checkbox").each(($el) => {
            cy.wrap($el).should("be.checked");
          });

          cy.get("body").type("{meta}", {
            release: false,
          });
          cy.dataCy("build-variant-list-item")
            .contains("RHEL 7.2 zLinux")
            .click();

          cy.dataCy("select-all-checkbox").uncheck({
            force: true,
          });

          cy.dataCy("task-checkbox").each(($el) => {
            cy.wrap($el).should("not.be.checked");
          });

          cy.dataCy("selected-task-disclaimer").contains(
            `0 tasks across 0 build variants`
          );
        });
      });

      it("Shift+click will select the clicked build variant along with all build variants between the clicked build variant and the first selected build variant in the list", () => {
        cy.get("body").type("{shift}", {
          release: false,
        }); // hold shift
        cy.dataCy("build-variant-list-item")
          .contains("RHEL 7.2 zLinux")
          .click();

        cy.dataCy("build-variant-list-item").contains("Windows").click();

        cy.get("[data-selected=true]").its("length").should("eq", 6);
      });
    });

    describe("Selecting a trigger alias", () => {
      before(() => {
        cy.dataCy("trigger-alias-list-item")
          .contains("logkeeper-alias")
          .click();
      });

      it("Should show one disabled task", () => {
        cy.dataCy("alias-task-checkbox").should("have.length", 1);
        cy.dataCy("alias-task-checkbox").should("have.attr", "disabled");
      });

      it("Should update the 'Select all' label", () => {
        cy.dataCy("select-all-checkbox")
          .siblings("span")
          .contains("Add alias to patch");
      });

      it("Clicking select all should update the task count", () => {
        cy.dataCy("trigger-alias-list-item")
          .find('[data-cy="task-count-badge"]')
          .should("not.exist");

        cy.dataCy("select-all-checkbox").check({
          force: true,
        });

        cy.dataCy("selected-task-disclaimer").contains(
          `0 tasks across 0 build variants, 1 trigger alias`
        );

        const countBadge = cy
          .dataCy("trigger-alias-list-item")
          .find('[data-cy="task-count-badge"]');
        countBadge.should("exist");
        countBadge.should("have.text", 1);
      });

      it("Cmd+click will select the clicked trigger alias along with the build variant and will show a checkbox for the trigger alias", () => {
        cy.get("body").type("{meta}", {
          release: false,
        });

        cy.dataCy("build-variant-list-item").contains("Windows").click();
        cy.dataCy("alias-checkbox").should("have.length", 1);

        cy.get("[data-selected=true]").its("length").should("eq", 2);
      });

      it("Updates the badge count when the trigger alias is deselected", () => {
        cy.dataCy("alias-checkbox").uncheck({
          force: true,
        });

        cy.dataCy("trigger-alias-list-item")
          .find('[data-cy="task-count-badge"]')
          .should("not.exist");
      });
    });
  });

  //   Using mocked responses because we are unable to schedule a patch because of a missing github token
  describe("Scheduling a patch", () => {
    beforeEach(() => {
      cy.server();
      cy.visit(`/patch/${unactivatedPatchId}`);
    });
    it("Clicking `Schedule` button schedules patch and redirects to patch page", () => {
      const val = "hello world";
      cy.dataCy(`patch-name-input`).as("patchNameInput").clear().type(val);
      cy.dataCy("task-checkbox").first().check({ force: true });
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
      const val = "hello world";
      cy.dataCy(`patch-name-input`).as("patchNameInput").clear().type(val);
      cy.dataCy("task-checkbox").first().check({ force: true });

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
});

const mockedErrorConfigureResponse = {
  errors: [
    {
      message: "WAH WAH CHICKEN WAH",
      path: ["schedulePatch"],
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
      },
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
            __typename: "Task",
          },
          {
            id:
              "mci_osx_test_auth_patch_c12773e028910390ab4fda66e4b1745cfdc9ee65_5ea99425b23736089a09a98f_20_04_29_14_53_16",
            name: "test-auth",
            status: "success",
            __typename: "Task",
          },
          {
            id:
              "mci_osx_test_graphql_patch_c12773e028910390ab4fda66e4b1745cfdc9ee65_5ea99425b23736089a09a98f_20_04_29_14_53_16",
            name: "test-graphql",
            status: "success",
            __typename: "Task",
          },
        ],
        __typename: "GroupedBuildVariant",
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
