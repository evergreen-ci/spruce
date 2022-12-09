describe("Mainline Commits page route", () => {
  const projectCookie = "mci-project-cookie";

  it("Should default to the project saved in the mci-project-cookie when a project does not exist in the url", () => {
    cy.setCookie(projectCookie, "spruce");
    cy.visit("/commits");
    cy.location("pathname").should("eq", "/commits/spruce");
  });

  it("Should default to the project in the SpruceConfig query when a project does not exist in URL and project cookie is unset", () => {
    cy.clearCookie(projectCookie);
    cy.visit("/commits");
    cy.location("pathname").should("eq", "/commits/evergreen");
  });

  it("Should save what ever project the user viewed last", () => {
    cy.visit("/commits/spruce");
    cy.dataCy("project-select").click();
    cy.contains("evergreen smoke test").click();
    cy.getCookie(projectCookie).should("have.property", "value", "evergreen");
    cy.dataCy("project-select").click();
    cy.contains("System Performance").click();
    cy.getCookie(projectCookie).should("have.property", "value", "sys-perf");
  });

  it("Should update the project cookie when visiting a specific project", () => {
    cy.clearCookie(projectCookie);
    cy.visit("/commits/spruce");
    cy.dataCy("commit-chart-container").should("be.visible");
    cy.getCookie(projectCookie).should("have.property", "value", "spruce");
  });
});
