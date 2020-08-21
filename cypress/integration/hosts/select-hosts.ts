import { popconfirmYesClassName } from "../../utils/popconfirm";
const hostsRoute = "/hosts";

describe("Select hosts in hosts page table", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.listenGQL();
  });

  it("Selecting hosts shows hosts selection data", () => {
    cy.visit(`${hostsRoute}?limit=100&page=0`);

    cy.waitForGQL("Hosts");

    cy.dataCy("restart-jasper-button")
      .should("have.attr", "aria-disabled")
      .and("eq", "true");
    cy.dataCy("update-status-button")
      .should("have.attr", "aria-disabled")
      .and("eq", "true");

    cy.get(".ant-table-selection-column").within(() => {
      cy.get(".ant-checkbox-input").check({ force: true });
    });

    cy.dataCy("restart-jasper-button")
      .should("have.attr", "aria-disabled")
      .and("eq", "false");
    cy.dataCy("update-status-button")
      .should("have.attr", "aria-disabled")
      .and("eq", "false");
  });

  it("Can restart jasper for selected hosts", () => {
    cy.visit(`${hostsRoute}?limit=100&page=0`);

    cy.waitForGQL("Hosts");

    cy.get(".ant-table-selection-column").within(() => {
      cy.get(".ant-checkbox-input").check({ force: true });
    });

    cy.dataCy("restart-jasper-button").click();

    cy.get(popconfirmYesClassName).click();

    cy.dataCy("banner").should("exist");
  });
});
