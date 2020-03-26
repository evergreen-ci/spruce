/// <reference types="Cypress" />
import { waitForGQL } from "../../../utils/networking";

const patch = {
  id: "5e4ff3abe3c3317e352062e4"
};
const path = `/patch/${patch.id}`;
const pathTasks = `${path}/tasks`;

describe("Tasks filters", function() {
  beforeEach(() => {
    cy.login();
    cy.server();
    cy.route("POST", "/graphql/query").as("gqlQuery");
    cy.visit(pathTasks);
  });

  describe("Variant input field", () => {
    const variantInputValue = "lint";
    it("Updates url with input value and fetches tasks filtered by variant", () => {
      cy.get("[data-cy=variant-input]").type(variantInputValue);
      locationHasUpdatedVariantParam(variantInputValue, "VARIANT");
      filteredTasksAreFetched("variant", variantInputValue);
      cy.get("[data-cy=variant-input]").clear();
      locationHasUpdatedVariantParam(null);
    });
  });
});

const filteredTasksAreFetched = (variable, value) => {
  cy.wait(200);
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

const locationHasUpdatedVariantParam = (paramValue, filterName) => {
  cy.location().should(loc => {
    expect(loc.pathname).to.equal(pathTasks);
    if (!paramValue) {
      expect(loc.search).to.not.include(filterName);
    } else {
      expect(loc.search).to.include(`${filterName}=${paramValue}`);
    }
  });
};
