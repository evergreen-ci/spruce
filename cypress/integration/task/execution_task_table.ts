// / <reference types="Cypress" />

const pathExecutionTasks =
  "/task/mci_ubuntu1604_display_asdf_patch_a1d2c8f70bf5c543de8b9641ac1ec08def1ddb26_5f74d99ab2373627c047c5e5_20_09_30_19_16_47/execution-tasks";

describe("Execution task table", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Should sort execution task table if no sort order is specified", () => {
    cy.visit(pathExecutionTasks);
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC"
    );
  });

  it("Updates the url when column headers are clicked", () => {
    cy.get("th.cy-task-table-col-NAME").click();
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC%3BNAME%3AASC"
    );

    cy.get("th.cy-task-table-col-NAME").click();
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC%3BNAME%3ADESC"
    );

    cy.get("th.cy-task-table-col-NAME").click();
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC"
    );

    cy.get("th.cy-task-table-col-VARIANT").click();
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC%3BVARIANT%3AASC"
    );

    cy.get("th.cy-task-table-col-VARIANT").click();
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC%3BVARIANT%3ADESC"
    );

    cy.get("th.cy-task-table-col-VARIANT").click();
    cy.location("search").should(
      "contain",
      "sorts=STATUS%3AASC%3BBASE_STATUS%3ADESC"
    );
  });
});
