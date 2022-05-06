// / <reference types="Cypress" />
describe("Mainline Commits page route", () => {
  before(() => {
    cy.login();
  });
  beforeEach(() => {
    cy.preserveCookies();
  });
  it("Should default to the project saved in the mci-project-cookie when a project does not exist in the url.", () => {
    cy.setCookie("mci-project-cookie", "spruce");
    cy.visit("/commits");
    cy.location("pathname").should("eq", "/commits/spruce");
  });

  it("Should default to the project in the SpruceConfig query when a project does not exist in URL nor mci-project-cookie.", () => {
    cy.clearCookie("mci-project-cookie");
    cy.visit("/commits");
    cy.location("pathname").should("eq", "/commits/evergreen");
  });

  it("Should save what ever project the user viewed last", () => {
    cy.visit("/commits/spruce");
    cy.dataCy("project-select").click();
    cy.contains("evergreen smoke test").click();
    cy.getCookie("mci-project-cookie").should(
      "have.property",
      "value",
      "evergreen"
    );
    cy.dataCy("project-select").click();
    cy.contains("System Performance").click();
    cy.getCookie("mci-project-cookie").should(
      "have.property",
      "value",
      "sys-perf"
    );
  });
});
