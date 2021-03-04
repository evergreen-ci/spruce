import { popconfirmYesClassName } from "../../utils/popconfirm";

describe("Host page restart jasper and update host status buttons", () => {
  before(() => {
    cy.login();
    cy.visit("/host/i-0d0ae8b83366d22be");
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("Should show a toast when jasper restarted", () => {
    cy.dataCy("restart-jasper-button").click();
    cy.get(popconfirmYesClassName).click();
    cy.dataCy("toast").should("exist");
  });

  it("Should show and hide the modal for update status", () => {
    cy.dataCy("update-status-button").click();
    cy.dataCy("update-host-status-modal").should("be.visible");

    cy.dataCy("host-status-select").click();
    cy.dataCy("decommissioned-option").click();
    cy.dataCy("modal-update-button").click();

    cy.dataCy("toast").should("exist");
    cy.dataCy("update-host-status-modal").should("not.be.visible");
  });
});
