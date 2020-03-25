/// <reference types="Cypress" />

const patch = {
  id: "5e4ff3abe3c3317e352062e4"
};
const path = `/patch/${patch.id}`;
const pathTasks = `${path}/tasks`;

const variantInputValue = "ubuntu1604";

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
      cy.get("[data-cy=variant-input]")
        .type(variantInputValue)
        .then(() => {
          locationHasUpdatedVariantParam(variantInputValue);
        })
        .then(() => {
          cy.get("[data-cy=variant-input]")
            .clear()
            .then(() => {
              locationHasUpdatedVariantParam(null);
            });
        });
    });
  });
});
