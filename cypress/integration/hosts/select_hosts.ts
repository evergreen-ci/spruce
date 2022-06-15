const hostsRoute = "/hosts";

describe("Select hosts in hosts page table", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.visit(`${hostsRoute}?distroId=ubuntu1604-large&page=0&statuses=running`);
    cy.dataCy("hosts-table").should("exist");
    cy.dataCy("hosts-table").should("not.have.attr", "data-loading", "true");
  });

  it("Selecting hosts shows hosts selection data", () => {
    cy.dataCy("restart-jasper-button").should("be.disabled");
    cy.dataCy("update-status-button").should("be.disabled");

    cy.get(".ant-table-selection-column").within(() => {
      cy.get(".ant-checkbox-input").should("not.be.disabled");
      cy.get(".ant-checkbox-input").check({ force: true });
    });

    cy.dataCy("restart-jasper-button").should("not.be.disabled");
    cy.dataCy("update-status-button").should("not.be.disabled");
  });

  it("Can restart jasper for selected hosts", () => {
    cy.get(".ant-table-selection-column").within(() => {
      cy.get(".ant-checkbox-input").should("not.be.disabled");

      cy.get(".ant-checkbox-input").check({ force: true });
    });

    cy.dataCy("restart-jasper-button").click();
    cy.contains("button", "Yes").click();
    cy.validateToast("success");
  });

  it("Can reprovision for selected hosts", () => {
    cy.get(".ant-table-selection-column").within(() => {
      cy.get(".ant-checkbox-input").should("not.be.disabled");

      cy.get(".ant-checkbox-input").check({ force: true });
    });

    cy.dataCy("reprovision-button").click();
    cy.contains("button", "Yes").click();
    cy.validateToast("success", "Marked hosts to reprovision for 0 hosts");
  });
});
