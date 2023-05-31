import {
  getViewsAndFiltersRoute,
  saveButtonEnabled,
  clickSave,
} from "./constants";

describe("Views & filters page", () => {
  const destination = getViewsAndFiltersRoute("sys-perf");

  beforeEach(() => {
    cy.visit(destination);
    // Wait for page contents to finish loading.
    cy.dataCy("parsley-filters-list").children().should("have.length", 2);
    saveButtonEnabled(false);
  });

  it("does not allow saving with invalid regular expression or empty expression", () => {
    cy.contains("button", "Add new filter").should("be.visible").click();
    cy.dataCy("filter-expression").first().type("*");
    saveButtonEnabled(false);
    cy.contains("Value should be a valid regex expression.");
    cy.dataCy("filter-expression").first().clear();
    saveButtonEnabled(false);
  });

  it("does not allow saving with duplicate filter expressions", () => {
    cy.contains("button", "Add new filter").should("be.visible").click();
    cy.dataCy("filter-expression").first().type("filter_1");
    saveButtonEnabled(false);
    cy.contains("Filter expression already appears in this project.");
  });

  it("can successfully save and delete filter", () => {
    cy.contains("button", "Add new filter").should("be.visible").click();
    cy.dataCy("filter-expression").first().type("my_filter");
    saveButtonEnabled(true);
    clickSave();
    cy.validateToast("success", "Successfully updated project");
    cy.dataCy("parsley-filters-list").children().should("have.length", 3);

    cy.dataCy("delete-item-button").first().should("be.visible").click();
    clickSave();
    cy.validateToast("success", "Successfully updated project");
    cy.dataCy("parsley-filters-list").children().should("have.length", 2);
  });
});
