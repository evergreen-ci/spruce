const hostsRoute = "/hosts";

describe("Update Status Modal", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.visit(`${hostsRoute}?limit=100&page=0`);
    cy.listenGQL();
    cy.waitForGQL("Hosts");
  });

  it("Update status for selected hosts", () => {
    cy.get(".ant-table-header-column").within(() => {
      cy.get(".ant-checkbox-input").check({ force: true });
    });

    cy.dataCy("update-status-button").click();

    cy.dataCy("host-status-select").click();

    cy.dataCy("running-option").click();

    cy.dataCy("host-status-notes").type("notes");

    cy.dataCy("modal-update-button").click();

    cy.dataCy("banner").should("exist");

    // MODAL FORM VALUES SHOULD BE CLEARED AFTER MUTATION
    cy.dataCy("update-status-button").click();

    cy.dataCy("host-status-select").within(() => {
      cy.get(".ant-select-selection-selected-value")
        .should("have.attr", "title")
        .and("not.contain.value");
    });

    cy.dataCy("host-status-notes")
      .invoke("val")
      .should("eq", "");
  });

  it("Clears form values when modal is closed", () => {
    cy.get(".ant-table-header-column").within(() => {
      cy.get(".ant-checkbox-input").check({ force: true });
    });

    cy.dataCy("update-status-button").click();

    cy.dataCy("host-status-select").click();

    cy.dataCy("running-option").click();

    cy.dataCy("host-status-notes").type("notes");

    cy.dataCy("modal-cancel-button").click();

    cy.dataCy("update-status-button").click();

    cy.dataCy("host-status-select").within(() => {
      cy.get(".ant-select-selection-selected-value")
        .should("have.attr", "title")
        .and("not.contain.value");
    });

    cy.dataCy("host-status-notes")
      .invoke("val")
      .should("eq", "");
  });
});
