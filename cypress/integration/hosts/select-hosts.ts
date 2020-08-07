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

    cy.dataCy("hosts-selection-badge").should("not.exist");

    cy.get(".ant-table-header-column").within(() => {
      cy.get(".ant-checkbox-input").check({ force: true });
    });

    cy.dataCy("hosts-selection-badge").should("exist");

    cy.get(".ant-table-header-column").within(() => {
      cy.get(".ant-checkbox-input").uncheck({ force: true });
    });

    cy.dataCy("hosts-selection-badge").should("not.exist");
  });

  it("Can restart jasper for selected hosts", () => {
    cy.visit(`${hostsRoute}?limit=100&page=0`);

    cy.waitForGQL("Hosts");

    cy.get(".ant-table-header-column").within(() => {
      cy.get(".ant-checkbox-input").check({ force: true });
    });

    cy.dataCy("restart-jasper-button").click();

    cy.get(".ant-btn.ant-btn-primary.ant-btn-sm").click();

    cy.dataCy("banner").should("exist");
  });
});
