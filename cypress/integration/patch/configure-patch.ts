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

describe("Configure Patch Page", () => {
  let patch: ConfigurePatchData;
  const unactivatedPatchId = "5e6bb9e23066155a993e0f1a";
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
    // click schedule - SchedulePatch mutation is fired
    // error - show banner, page does not change, data still intact
    // success - redirected to patch page for scheduled patch
  });
});

const getTaskCountFromText = (text) => {
  if (!text) {
    return 0;
  }
  return parseInt(text);
};
