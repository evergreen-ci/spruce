/// <reference types="Cypress" />
import { waitForGQL } from "../../../utils/networking";

const patch = {
  id: "5e4ff3abe3c3317e352062e4"
};
const path = `/patch/${patch.id}`;
const pathTasks = `${path}/tasks`;

const variantInputValue = "lint";

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
    it("Updates the VARIANT url search param when input changes", () => {
      cy.get("[data-cy=variant-input]").type(variantInputValue);
      locationHasUpdatedVariantParam(variantInputValue);
      cy.get("[data-cy=variant-input]").clear();
      locationHasUpdatedVariantParam(null);
    });

    it("Fetches tasks filtered by the input value", () => {
      cy.get("[data-cy=variant-input]").type(variantInputValue);
      cy.wait(300);
      waitForGQL("@gqlQuery", "PatchTasks");
      cy.get("@gqlQuery").then(({ request, response }) => {
        expect(request.body.operationName).eq("PatchTasks");
        expect(request.body.variables.variant).eq(variantInputValue);
        cy.get(".ant-table-row")
          .invoke("toArray")
          .then(filteredResults => {
            expect(response.body.data.patchTasks.length).eq(
              filteredResults.length
            );
          });
      });
    });
  });
});
