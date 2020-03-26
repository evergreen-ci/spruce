/// <reference types="Cypress" />
import { waitForGQL } from "../../../utils/networking";

const patch = {
  id: "5e4ff3abe3c3317e352062e4"
};
const path = `/patch/${patch.id}`;
const pathTasks = `${path}/tasks`;

const locationHasUpdatedVariantParam = paramValue => {
  cy.location().should(loc => {
    expect(loc.pathname).to.equal(pathTasks);
    if (!paramValue) {
      expect(loc.search).to.not.include("VARIANT");
    } else {
      expect(loc.search).to.include(`VARIANT=${paramValue}`);
    }
  });
};

describe("Tasks filters", function() {
  beforeEach(() => {
    cy.login();
    cy.server();
    cy.route("POST", "/graphql/query").as("gqlQuery");
    cy.visit(pathTasks);
  });

  describe("Variant input field", () => {
    const variantInputValue = "lint";
    it("Updates url with input value and fetches filtered tasks", () => {
      cy.get("[data-cy=task-name-input]").type(variantInputValue);
      locationHasUpdatedVariantParam(variantInputValue);
      filteredTasksAreFetched("variant", variantInputValue);
      cy.get("[data-cy=variant-input]").clear();
      locationHasUpdatedVariantParam(null);
    });
  });

  describe("Task name input field", () => {
    const taskNameInputValue = "test-cloud";
    it("Updates url with input value and fetches filtered tasks", () => {
      cy.get("[data-cy=task-name-input]").type(taskNameInputValue);
      locationHasUpdatedVariantParam(taskNameInputValue);
      filteredTasksAreFetched("taskName", taskNameInputValue);
      cy.get("[data-cy=variant-input]").clear();
      locationHasUpdatedVariantParam(null);
    });
  });
});

const filteredTasksAreFetched = (variable, value) => {
  waitForGQL("@gqlQuery", "PatchTasks");
  cy.get("@gqlQuery").then(({ request, response }) => {
    expect(request.body.operationName).eq("PatchTasks");
    expect(request.body.variables[variable]).eq(value);
    cy.get(".ant-table-row")
      .invoke("toArray")
      .then(filteredResults => {
        expect(response.body.data.patchTasks.length).eq(filteredResults.length);
      });
  });
};
