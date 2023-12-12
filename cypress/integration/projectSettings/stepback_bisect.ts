import { clickSave } from "../../utils";
import { getGeneralRoute, project, projectUseRepoEnabled } from "./constants";

describe("Stepback bisect setting", () => {
  describe("Repo project present", () => {
    const destination = getGeneralRoute(projectUseRepoEnabled);

    beforeEach(() => {
      cy.visit(destination);
    });

    it("Starts as default to repo", () => {
      cy.dataCy("stepback-bisect-group")
        .children()
        .should("have.length", 3)
        .eq(2)
        .should("have.attr", "aria-clicked", "true");
    });

    it("Clicking on enabled and then save shows a success toast", () => {
      cy.dataCy("stepback-bisect-group").children().eq(0).click();
      clickSave();
      cy.validateToast("success", "Successfully updated project");

      cy.reload();
      cy.dataCy("stepback-bisect-group")
        .children()
        .eq(0)
        .should("have.attr", "aria-clicked", "true");
    });
  });

  describe("Repo project not present", () => {
    const destination = getGeneralRoute(project);

    beforeEach(() => {
      cy.visit(destination);
    });

    it("Starts as disabled", () => {
      cy.dataCy("stepback-bisect-group")
        .children()
        .should("have.length", 2)
        .eq(1)
        .should("have.attr", "aria-clicked", "true");
    });

    it("Clicking on enabled and then save shows a success toast", () => {
      cy.dataCy("stepback-bisect-group").children().eq(0).click();
      clickSave();
      cy.validateToast("success", "Successfully updated project");

      cy.reload();
      cy.dataCy("stepback-bisect-group")
        .children()
        .eq(0)
        .should("have.attr", "aria-clicked", "true");
    });
  });
});
