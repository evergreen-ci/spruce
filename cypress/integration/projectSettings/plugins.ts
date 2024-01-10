import { getPluginsRoute, projectUseRepoEnabled } from "./constants";
import { clickSave } from "../../utils";

describe("Plugins", () => {
  const patchPage = "version/5ecedafb562343215a7ff297";
  it("Should set an external link to render on patch metadata panel and then unset it to revert the changes", () => {
    // Set the external link
    cy.visit(getPluginsRoute(projectUseRepoEnabled));
    cy.dataCy("requesters-input").click();
    cy.getInputByLabel("Commits").check({ force: true });
    cy.getInputByLabel("Patches").check({ force: true });
    cy.dataCy("requesters-input").click();
    cy.dataCy("display-name-input").type("An external link");
    cy.dataCy("url-template-input").type("https://example.com/{version_id}", {
      parseSpecialCharSequences: false,
    });
    cy.dataCy("save-settings-button").scrollIntoView();
    clickSave();
    cy.visit(patchPage);
    cy.dataCy("external-link").contains("An external link");
    cy.dataCy("external-link").should(
      "have.attr",
      "href",
      "https://example.com/5ecedafb562343215a7ff297",
    );

    // Unset the external link
    cy.visit(getPluginsRoute(projectUseRepoEnabled));
    cy.dataCy("requesters-input").click();
    cy.getInputByLabel("Commits").uncheck({ force: true });
    cy.getInputByLabel("Patches").uncheck({ force: true });
    cy.dataCy("requesters-input").click();
    cy.dataCy("display-name-input").clear();
    cy.dataCy("url-template-input").clear();
    cy.dataCy("save-settings-button").scrollIntoView();
    clickSave();
    cy.visit(patchPage);
    cy.dataCy("external-link").should("not.exist");
  });
});
