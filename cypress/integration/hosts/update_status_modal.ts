const hostsRoute = "/hosts";

describe("Update Status Modal", () => {
  before(() => {
    cy.login();
    cy.preserveCookies();
  });

  beforeEach(() => {
    cy.visit(`${hostsRoute}?limit=100&page=0`);
    cy.dataCy("hosts-table").should("exist");
    cy.dataCy("hosts-table").should("not.have.attr", "data-loading", "true");
  });

  it("Update status for selected hosts", () => {
    cy.get(".ant-checkbox-input").first().should("exist");
    cy.get(".ant-checkbox-input").first().should("not.be.disabled");
    cy.get(".ant-checkbox-input").first().check({ force: true });

    cy.dataCy("update-status-button").click();

    cy.dataCy("host-status-select").click();

    cy.dataCy("decommissioned-option").click();

    cy.dataCy("host-status-notes").type("notes");

    cy.dataCy("modal-update-button").click();

    cy.validateToast("success");

    // MODAL FORM VALUES SHOULD BE CLEARED AFTER MUTATION
    cy.dataCy("update-status-button").click();

    cy.dataCy("host-status-select").within(() => {
      cy.get(".ant-select-selection-item").should("not.exist");
    });

    cy.dataCy("host-status-notes").invoke("val").should("eq", "");
  });
});
