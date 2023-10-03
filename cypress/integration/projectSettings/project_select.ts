import { getGeneralRoute, project } from "./constants";

describe("Clicking on The Project Select Dropdown", () => {
  const origin = getGeneralRoute(project);

  beforeEach(() => {
    cy.visit(origin);
  });

  it("Headers are clickable", () => {
    cy.dataCy("project-select").should("be.visible");
    cy.dataCy("project-select").click();
    cy.dataCy("project-select-options").should("be.visible");
    cy.dataCy("project-select-options")
      .find("div")
      .contains("evergreen-ci/evergreen")
      .click();
    cy.location().should((loc) => expect(loc.pathname).to.not.eq(origin));
  });
});
