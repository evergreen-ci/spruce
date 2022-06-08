describe("Host page restart jasper, reprovision, and update host status buttons", () => {
  before(() => {
    cy.login();
    cy.visit("/host/i-0d0ae8b83366d22be");
  });

  beforeEach(() => {
    cy.preserveCookies();
  });
  it("Should show a toast when jasper restarted", () => {
    cy.dataCy("restart-jasper-button").click();
    cy.contains("button", "Yes").click();
    cy.validateToast("success");
    cy.get(`[aria-label="Close Message"]`).click();
  });

  it("Should show a toast when host is reprovisioned", () => {
    cy.dataCy("reprovision-button").click();
    cy.contains("button", "Yes").click();
    cy.validateToast("success");
    cy.get(`[aria-label="Close Message"]`).click();
  });

  it("Should show and hide the modal for update status", () => {
    cy.dataCy("update-status-button").click();
    cy.dataCy("update-host-status-modal").should("be.visible");

    cy.dataCy("host-status-select").click();
    cy.dataCy("decommissioned-option").click();
    cy.dataCy("modal-update-button").click();

    cy.validateToast("success");
    cy.dataCy("update-host-status-modal").should("not.exist");
  });
});
