describe("Select hosts in hosts page table", () => {
  const hostsRoute = "/hosts";

  const selectHosts = () => {
    cy.get(".ant-table-thead .ant-table-selection-column").within(() => {
      cy.get(".ant-checkbox-input").should("not.be.disabled");
      cy.get(".ant-checkbox-input").check();
    });
    cy.get(".ant-checkbox-checked").should("have.length", 4);
  };

  beforeEach(() => {
    cy.visit(`${hostsRoute}?distroId=ubuntu1604-large&page=0&statuses=running`);
    cy.dataCy("hosts-table").should("exist");
    cy.dataCy("hosts-table").should("not.have.attr", "data-loading", "true");
    cy.dataCy("update-status-button").should(
      "have.attr",
      "aria-disabled",
      "true"
    );
    cy.dataCy("restart-jasper-button").should(
      "have.attr",
      "aria-disabled",
      "true"
    );
    cy.dataCy("reprovision-button").should(
      "have.attr",
      "aria-disabled",
      "true"
    );
  });

  it("Selecting hosts shows hosts selection data", () => {
    selectHosts();
    cy.dataCy("update-status-button").should(
      "not.have.attr",
      "aria-disabled",
      "true"
    );
    cy.dataCy("restart-jasper-button").should(
      "not.have.attr",
      "aria-disabled",
      "true"
    );
    cy.dataCy("reprovision-button").should(
      "not.have.attr",
      "aria-disabled",
      "true"
    );
  });

  it("Can restart jasper for selected hosts", () => {
    selectHosts();
    cy.dataCy("restart-jasper-button").should(
      "not.have.attr",
      "aria-disabled",
      "true"
    );
    cy.dataCy("restart-jasper-button").should("be.visible").click();
    cy.dataCy("restart-jasper-button-popover").should("be.visible");
    cy.contains("button", "Yes").click();
    cy.validateToast("success");
  });

  it("Can reprovision for selected hosts", () => {
    selectHosts();
    cy.dataCy("reprovision-button").should(
      "not.have.attr",
      "aria-disabled",
      "true"
    );
    cy.dataCy("reprovision-button").should("be.visible").click();
    cy.dataCy("reprovision-button-popover").should("be.visible");
    cy.contains("button", "Yes").click();
    cy.validateToast("success", "Marked hosts to reprovision for 0 hosts");
  });
});
