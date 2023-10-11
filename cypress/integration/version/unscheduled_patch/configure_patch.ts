import { GQL_URL } from "../../../constants";
import { hasOperationName } from "../../../utils/graphql-test-utils";
import { mockErrorResponse } from "../../../utils/mockErrorResponse";

describe("Configure Patch Page", () => {
  const unactivatedPatchId = "5e6bb9e23066155a993e0f1a";
  const patchWithDisplayTasks = "5e6bb9e23066155a993e0f1b";

  describe("Initial state reflects patch data", () => {
    it("Should Redirect to configure page for unconfigured patches", () => {
      cy.visit(`/version/${unactivatedPatchId}`);
      cy.location().should((loc) =>
        expect(loc.pathname).to.eq(
          `/patch/${unactivatedPatchId}/configure/tasks`
        )
      );
    });
    it("Patch name input field value is patch description", () => {
      cy.visit(`/version/${unactivatedPatchId}`);
      cy.dataCy("patch-name-input")
        .invoke("val")
        .then((text) => {
          expect(text).to.equal("test meee");
        });
    });
    it("First build variant in list is selected by default", () => {
      cy.visit(`/version/${unactivatedPatchId}`);
      cy.dataCy("build-variant-list-item")
        .first()
        .should("have.attr", "data-selected", "true");
    });

    it("should allow canceling a configured patch", () => {
      cy.visit(`/patch/5ecedafb562343215a7ff297/configure/tasks`);
      cy.dataCy("cancel-button").should("exist");
      cy.dataCy("cancel-button").click();
      cy.location().should((loc) =>
        expect(loc.pathname).to.eq(`/version/5ecedafb562343215a7ff297/tasks`)
      );
    });
    it("should not allow canceling an unconfigured patch", () => {
      cy.visit(`/patch/${unactivatedPatchId}/configure/tasks`);
      cy.dataCy("cancel-button").should("not.exist");
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
      it("should show display tasks if there are any", () => {
        cy.visit(`patch/${patchWithDisplayTasks}/configure/tasks`);
        cy.contains("display_task");
      });
    });

    it("Required tasks should be auto selected", () => {
      cy.visit(`patch/${patchWithDisplayTasks}/configure/tasks`);
      cy.dataCy("task-count-badge").contains("1");
      cy.getInputByLabel("test-graphql").should("be.checked");
    });
  });

  describe("Switching tabs", () => {
    beforeEach(() => {
      cy.visit(`patch/${unactivatedPatchId}/configure/tasks`);
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
      it("Adding a parameter is reflected on the page", () => {
        cy.visit(`patch/${unactivatedPatchId}/configure/tasks`);
        cy.get('button[data-cy="parameters-tab"]').click();
        cy.dataCy("add-tag-button").click();
        cy.dataCy("user-tag-key-field").type("testKey");
        cy.dataCy("user-tag-value-field").type("testValue");
        cy.dataCy("user-tag-edit-icon").click();
        cy.dataCy("user-tag-row").its("length").should("eq", 1);
      });
    });
    describe("Activated Patch", () => {
      it("Parameters cannot be added once activated", () => {
        cy.visit(`patch/5ecedafb562343215a7ff297/configure/tasks`);
        cy.get('button[data-cy="parameters-tab"]').click();
        cy.dataCy("add-tag-button").should("not.exist");
        cy.dataCy("parameters-disclaimer").should("exist");
        cy.dataCy("badge-this-is-a-parameter").should("exist");
        cy.dataCy("badge-my_team").should("exist");
      });
    });
  });

  describe("Configuring a patch", () => {
    beforeEach(() => {
      cy.visit(`patch/${unactivatedPatchId}/configure/tasks`);
    });
    it("Can update patch description by typing into `Patch Name` input field", () => {
      const val = "michelle obama";
      cy.dataCy("patch-name-input").clear();
      cy.dataCy("patch-name-input").type(val);
      cy.dataCy("patch-name-input").should("have.value", val);
    });
    it("Schedule button should be disabled when no tasks are selected and enabled when they are", () => {
      cy.getInputByLabel("Select all tasks in this variant").uncheck({
        force: true,
      });
      cy.dataCy("task-checkbox").should("not.be.checked");
      cy.dataCy("schedule-patch").should("have.attr", "aria-disabled", "true");
      cy.dataCy("task-checkbox").check({ force: true });

      cy.dataCy("schedule-patch").should("not.be.disabled");
      cy.dataCy("task-checkbox").uncheck({ force: true });
    });
    it("Checking and unchecking task checkboxes updates the task count label", () => {
      // setup
      cy.dataCy("selected-task-disclaimer").contains(
        "1 task across 1 build variant"
      );
      cy.dataCy("build-variant-list-item")
        .find('[data-cy="task-count-badge"]')
        .as("selectedTaskCountBadge")
        .click();
      cy.getInputByLabel("Select all tasks in this variant").uncheck({
        force: true,
      });
      // No tasks selected
      cy.get("@selectedTaskCountBadge").should("not.exist");
      cy.dataCy("selected-task-disclaimer").contains(
        "0 tasks across 0 build variants"
      );
      // Test check
      cy.dataCy("build-variant-list-item").eq(-1).click();
      cy.dataCy("task-checkbox").each(($el, index) => {
        cy.wrap($el).should("not.be.checked");
        cy.wrap($el).check({
          force: true,
        });
        cy.wrap($el).should("be.checked");
        const count = index + 1;
        cy.dataCy("selected-task-disclaimer").contains(
          new RegExp(`${count} tasks? across 1 build variant`)
        );
        cy.get("@selectedTaskCountBadge")
          .should("be.visible")
          .should("have.text", count);
      });
      // Test Uncheck
      cy.dataCy("task-checkbox").each(($el, index, list) => {
        cy.wrap($el).should("be.checked");
        cy.wrap($el).uncheck({
          force: true,
        });
        cy.wrap($el).should("not.be.checked");
        const count = list.length - index - 1;
        cy.dataCy("selected-task-disclaimer").contains(
          new RegExp(`${count} tasks? across [10] build variants?`)
        );
        if (count) {
          cy.get("@selectedTaskCountBadge")
            .should("be.visible")
            .should("have.text", count);
        } else {
          cy.get("@selectedTaskCountBadge").should("not.exist");
        }
      });
    });

    describe("Task filter input", () => {
      beforeEach(() => {
        cy.visit(`/version/${unactivatedPatchId}`);
      });
      it("Updating the task filter input filters tasks in view", () => {
        cy.contains("Ubuntu 16.04").click();
        cy.dataCy("task-checkbox").should("have.length", 45);
        cy.dataCy("selected-task-disclaimer").contains(
          "1 task across 1 build variant"
        );
        cy.dataCy("task-filter-input").type("dist");
        cy.dataCy("task-checkbox").should("have.length", 2);
        cy.contains("Select all tasks in view").click();
        cy.dataCy("selected-task-disclaimer").contains(
          "3 tasks across 2 build variant"
        );
      });
      it("The task filter input works across multiple build variants", () => {
        cy.holdMeta(() => {
          cy.dataCy("build-variant-list-item").contains("Ubuntu 16.04").click();
          cy.dataCy("build-variant-list-item")
            .contains("Ubuntu 16.04 (Docker)")
            .click();
        });

        cy.dataCy("task-checkbox").should("have.length", 46);
        cy.dataCy("selected-task-disclaimer").contains(
          "1 task across 1 build variant"
        );
        cy.dataCy("task-filter-input").type("dist");
        cy.dataCy("task-checkbox").should("have.length", 2);
        cy.contains("Select all tasks in view").click();
        cy.dataCy("selected-task-disclaimer").contains(
          "5 tasks across 3 build variants"
        );
        cy.dataCy("task-filter-input").clear();
      });
    });

    describe("Select/Deselect All buttons", () => {
      beforeEach(() => {
        cy.visit(`/version/${unactivatedPatchId}`);
      });
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
      it("Checking all task checkboxes should check the 'Select All' checkbox and unchecking all should uncheck it", () => {
        cy.dataCy("build-variant-list-item").contains("OSX").click();
        cy.dataCy("select-all-checkbox").should("not.be.checked");
        cy.dataCy("task-checkbox").each(($el) => {
          cy.wrap($el).check({ force: true });
        });
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
        cy.dataCy("build-variant-list-item")
          .contains("RHEL 7.2 zLinux")
          .click();
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
      it("Selecting/deselecting multiple build variants should display/hide the task checkboxes and checking a task will select it across multiple build variants", () => {
        cy.holdMeta(() => {
          cy.dataCy("build-variant-list-item")
            .contains("RHEL 7.2 zLinux")
            .click();

          cy.dataCy("build-variant-list-item")
            .contains("RHEL 7.1 POWER8")
            .click();

          cy.dataCy("build-variant-list-item")
            .contains("Race Detector")
            .click();
        });
        cy.dataCy("task-checkbox").should("have.length", 41);
        // Test select all when multiple build variants are selected
        cy.dataCy("selected-task-disclaimer").contains(
          "1 task across 1 build variant, 0 trigger aliases"
        );
        cy.getInputByLabel("Select all tasks in these variants").check({
          force: true,
        });
        cy.dataCy("selected-task-disclaimer").contains(
          "53 tasks across 4 build variants, 0 trigger aliases"
        );
        cy.holdMeta(() => {
          cy.dataCy("build-variant-list-item")
            .contains("Race Detector")
            .click();
          cy.dataCy("build-variant-list-item")
            .contains("RHEL 7.1 POWER8")
            .click();

          cy.dataCy("build-variant-list-item")
            .contains("RHEL 7.2 zLinux")
            .click();
        });

        cy.dataCy("task-checkbox").should("have.length", 1);
      });

      it("Checking a deduplicated task between multiple build variants updates the task within each selected build variant", () => {
        cy.holdMeta(() => {
          cy.dataCy("build-variant-list-item")
            .contains("RHEL 7.2 zLinux")
            .click();
          cy.dataCy("build-variant-list-item")
            .contains("RHEL 7.1 POWER8")
            .click();
        });
        cy.getInputByLabel("test-agent").should("have.length", 1);
        cy.getInputByLabel("test-agent").check({
          force: true,
        });
        cy.dataCy("build-variant-select-wrapper").within(($el) => {
          cy.wrap($el).find('[data-cy="task-count-badge"]').contains("1");
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
        it("Should be able to select/deselect all tasks from multiple build variants", () => {
          // Test select all
          cy.dataCy("build-variant-list-item")
            .contains("ArchLinux (Docker)")
            .click();

          cy.holdShift(() =>
            cy.dataCy("build-variant-list-item").contains("Windows").click()
          );

          // Uncheck "Select all" to setup for checking
          cy.dataCy("select-all-checkbox").uncheck({
            force: true,
          });
          cy.dataCy("selected-task-disclaimer").contains(
            "0 tasks across 0 build variants, 0 trigger aliases"
          );
          cy.getInputByLabel("Select all tasks in these variants").check({
            force: true,
          });
          cy.dataCy("selected-task-disclaimer").contains(
            "198 tasks across 11 build variants, 0 trigger aliases"
          );
          // Ensure all of them are checked
          cy.dataCy("build-variant-list-item").each((bvListItem) => {
            cy.wrap(bvListItem).click();
            cy.dataCy("task-checkbox").should("be.checked");
          });
          // Test deselect all
          cy.dataCy("build-variant-list-item")
            .contains("ArchLinux (Docker)")
            .click();
          cy.holdShift(() =>
            cy.dataCy("build-variant-list-item").contains("Windows").click()
          );
          cy.dataCy("select-all-checkbox").uncheck({
            force: true,
          });
          cy.dataCy("selected-task-disclaimer").contains(
            "0 tasks across 0 build variants, 0 trigger aliases"
          );
          cy.dataCy("build-variant-list-item").each((bvListItem) => {
            cy.wrap(bvListItem).click();
            cy.dataCy("task-checkbox").should("not.be.checked");
          });
        });
      });

      it("Shift+click will select the clicked build variant along with all build variants between the clicked build variant and the first selected build variant in the list", () => {
        cy.dataCy("build-variant-list-item")
          .contains("RHEL 7.2 zLinux")
          .click();
        cy.holdShift(() => {
          cy.dataCy("build-variant-list-item").contains("Windows").click();
        });
        cy.get("[data-selected=true]").its("length").should("eq", 6);
      });
    });

    describe.only("Selecting a trigger alias", () => {
      beforeEach(() => {
        cy.dataCy("trigger-alias-list-item")
          .contains("logkeeper-alias")
          .click();
      });

      it("Should show one disabled task", () => {
        cy.dataCy("alias-task-checkbox").should("have.length", 1);
        cy.dataCy("alias-task-checkbox").should("have.attr", "disabled");
        cy.dataCy("alias-task-checkbox").should("not.be.checked");
      });

      it("Should update the 'Select all' label", () => {
        cy.dataCy("select-all-checkbox")
          .siblings("span")
          .contains("Add alias to patch");
      });

      it("Clicking select all should update the task count and select the disabled task", () => {
        cy.dataCy("trigger-alias-list-item")
          .find('[data-cy="task-count-badge"]')
          .should("not.exist");

        cy.dataCy("select-all-checkbox").check({
          force: true,
        });

        cy.dataCy("selected-task-disclaimer").contains(
          `0 tasks across 0 build variants, 1 trigger alias`
        );

        cy.dataCy("trigger-alias-list-item").find(
          '[data-cy="task-count-badge"]'
        );
        cy.dataCy("trigger-alias-list-item")
          .find('[data-cy="task-count-badge"]')
          .should("exist");
        cy.dataCy("trigger-alias-list-item")
          .find('[data-cy="task-count-badge"]')
          .should("have.text", 1);

        cy.dataCy("alias-task-checkbox").should("be.checked");
      });

      it("Holding Cmd allows selecting a trigger alias and build variant at the same time", () => {
        cy.holdMeta(() => {
          cy.dataCy("build-variant-list-item").contains("Windows").click();
        });
        cy.dataCy("alias-checkbox").should("have.length", 1);
        cy.get("[data-selected=true]").its("length").should("eq", 2);
        cy.dataCy("alias-checkbox").check({
          force: true,
        });
        cy.dataCy("trigger-alias-list-item")
          .find('[data-cy="task-count-badge"]')
          .should("be.visible");
        cy.dataCy("alias-checkbox").uncheck({
          force: true,
        });
        cy.dataCy("trigger-alias-list-item")
          .find('[data-cy="task-count-badge"]')
          .should("not.exist");
      });
    });
  });

  // Using mocked responses because we are unable to schedule a patch because of a missing github token
  describe("Scheduling a patch", () => {
    beforeEach(() => {
      cy.visit(`/patch/${unactivatedPatchId}`);
    });
    it("Clicking 'Schedule' button schedules patch and redirects to patch page", () => {
      const val = "hello world";
      cy.dataCy("patch-name-input").as("patchNameInput");
      cy.get("patch-name-input").clear();
      cy.get("patch-name-input").type(val);
      cy.dataCy("task-checkbox").first().check({ force: true });
      cy.intercept("POST", GQL_URL, (req) => {
        if (hasOperationName(req, "SchedulePatch")) {
          req.reply((res) => {
            res.body = mockedSuccessConfigureResponse;
          });
        }
      });
      cy.dataCy("schedule-patch").click();
      cy.location("pathname").should(
        "eq",
        `/version/${activatedPatchId}/tasks`
      );
    });

    it("Shows error toast if unsuccessful and keeps data", () => {
      const val = "hello world";
      cy.dataCy("patch-name-input").clear();
      cy.dataCy("patch-name-input").type(val);
      cy.dataCy("task-checkbox").first().check({ force: true });
      mockErrorResponse({
        errorMessage: "An error occured",
        operationName: "SchedulePatch",
        path: "schedulePatch",
      });
      cy.dataCy("schedule-patch").click();
      cy.location("pathname").should(
        "eq",
        `/patch/${unactivatedPatchId}/configure/tasks`
      );
      cy.validateToast("error");
    });
  });
});

const activatedPatchId = "5e4ff3abe3c3317e352062e4";
const mockedSuccessConfigureResponse = {
  data: {
    schedulePatch: {
      id: activatedPatchId,
      description: "cypress_v10: turn on retries",
      author: "person",
      status: "created",
      activated: true,
      alias: "",
      commitQueuePosition: null,
      variantsTasks: [
        {
          name: "ubuntu1604",
          tasks: ["test"],
        },
      ],
      parameters: [
        {
          key: "a",
          value: "b",
        },
      ],
      versionFull: {
        id: activatedPatchId,
      },
      tasks: ["test"],
      variants: ["ubuntu1604"],
    },
  },
  errors: null,
};
