import { clickSave } from "../../utils";
import { getGeneralRoute, project, projectUseRepoEnabled } from "./constants";

type stepbackButtonType = "enabled" | "disabled" | "repo";

/**
 * Retrieves the stepback label associated with type. The stepback labels are
 * inside of the div container with "stepback-bisect-group". The labels contain
 * the radio button (input) and a div with the text.
 * @param type The type of stepback label to get
 * @returns The stepback label corresponding to the type
 */
function getStepbackLabel(
  type: stepbackButtonType
): Cypress.Chainable<JQuery<HTMLElement>> {
  let i = 0;
  if (type === "disabled") {
    i = 1;
  }
  if (type === "repo") {
    i = 2;
  }
  return cy.dataCy("stepback-bisect-group").children().eq(i);
}

/**
 * Retrieves the stepback button associated with type. The stepback buttons are
 * inside of the div container with "stepback-bisect-group", inside their label.
 * @param type The type of stepback button to get
 * @returns The stepback button corresponding to the type
 */
function getStepbackButton(
  type: stepbackButtonType
): Cypress.Chainable<JQuery<HTMLElement>> {
  return getStepbackLabel(type).children().get("input");
}

describe("Stepback bisect setting", () => {
  describe("Repo project present", () => {
    const destination = getGeneralRoute(projectUseRepoEnabled);

    beforeEach(() => {
      cy.visit(destination);
    });

    it("Starts as default to repo", () => {
      getStepbackButton("repo").should("have.attr", "aria-clicked", "true");
    });

    it("Clicking on enabled and then save shows a success toast", () => {
      getStepbackLabel("enabled").click();
      clickSave();
      cy.validateToast("success", "Successfully updated project");

      cy.reload();
      getStepbackButton("enabled").should("have.attr", "aria-clicked", "true");
    });
  });

  describe("Repo project not present", () => {
    const destination = getGeneralRoute(project);

    beforeEach(() => {
      cy.visit(destination);
    });

    it("Starts as disabled", () => {
      getStepbackButton("disabled").should("have.attr", "aria-clicked", "true");
    });

    it("Clicking on enabled and then save shows a success toast", () => {
      getStepbackLabel("enabled").click();
      clickSave();
      cy.validateToast("success", "Successfully updated project");

      cy.reload();
      getStepbackButton("enabled").should("have.attr", "aria-clicked", "true");
    });
  });
});
