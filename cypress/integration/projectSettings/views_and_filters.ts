import { getViewsAndFiltersRoute, saveButtonEnabled } from "./constants";
import { clickSave } from "../../utils";

describe("Views & filters page", () => {
  const destination = getViewsAndFiltersRoute("sys-perf");

  beforeEach(() => {
    cy.visit(destination);
    // Wait for page content to finish loading.
    cy.dataCy("parsley-filter-list").children().should("have.length", 2);
    saveButtonEnabled(false);
  });

  describe("parsley filters", () => {
    it("does not allow saving with invalid regular expression or empty expression", () => {
      cy.contains("button", "Add filter").should("be.visible").click();
      cy.dataCy("parsley-filter-expression").first().type("*");
      saveButtonEnabled(false);
      cy.contains("Value should be a valid regex expression.");
      cy.dataCy("parsley-filter-expression").first().clear();
      saveButtonEnabled(false);
    });

    it("does not allow saving with duplicate filter expressions", () => {
      cy.contains("button", "Add filter").should("be.visible").click();
      cy.dataCy("parsley-filter-expression").first().type("filter_1");
      saveButtonEnabled(false);
      cy.contains("Filter expression already appears in this project.");
    });

    it("can successfully save and delete filter", () => {
      cy.contains("button", "Add filter").should("be.visible").click();
      cy.dataCy("parsley-filter-expression").first().type("my_filter");
      saveButtonEnabled(true);
      clickSave();
      cy.validateToast("success", "Successfully updated project");
      cy.dataCy("parsley-filter-list").children().should("have.length", 3);

      cy.dataCy("delete-item-button").first().should("be.visible").click();
      clickSave();
      cy.validateToast("success", "Successfully updated project");
      cy.dataCy("parsley-filter-list").children().should("have.length", 2);
    });
  });

  describe("project view", () => {
    it("updates field to 'all' view, which shows all icons on the waterfall, and back to 'default'", () => {
      cy.getInputByLabel("All tasks view").click({ force: true });
      clickSave();
      cy.validateToast("success", "Successfully updated project");
      cy.getInputByLabel("All tasks view").should("be.checked");

      cy.visit("/commits/sys-perf");
      cy.dataCy("waterfall-task-status-icon")
        .should("be.visible")
        .should("have.length", 2);
      cy.visit(destination);

      cy.getInputByLabel("Default view").click({ force: true });
      clickSave();
      cy.validateToast("success", "Successfully updated project");
    });
  });
});
