describe("Update Status Modal", () => {
  const hostsRoute = "/hosts";

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

    cy.dataCy("update-host-status-modal").should("be.visible");
    cy.dataCy("update-host-status-modal").within(() => {
      cy.contains("button", "Update").click({ force: true });
    });
    cy.dataCy("update-host-status-modal").should("not.exist");
    // Because the static hosts that exists in the dev environment cannot be decommissioned, we should expect an error.
    cy.validateToast("error");

    // MODAL FORM VALUES SHOULD BE CLEARED AFTER MUTATION
    cy.dataCy("update-status-button").click();

    cy.dataCy("host-status-select").within(() => {
      cy.get(".ant-select-selection-item").should("not.exist");
    });

    cy.dataCy("host-status-notes").invoke("val").should("eq", "");
  });
});
