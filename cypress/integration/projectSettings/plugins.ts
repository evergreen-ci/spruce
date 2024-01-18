import { getPluginsRoute, projectUseRepoEnabled } from "./constants";
import { clickSave } from "../../utils";

describe("Plugins", () => {
  const patchPage = "version/5ecedafb562343215a7ff297";

  const addMetadataLink = (metadataLink: {
    displayName: string;
    url: string;
  }) => {
    cy.contains("button", "Add metadata link").scrollIntoView();
    cy.contains("button", "Add metadata link").click();
    cy.dataCy("requesters-input").first().click();
    cy.getInputByLabel("Patches").check({ force: true });
    cy.dataCy("requesters-input").first().click();
    cy.dataCy("display-name-input").first().type(metadataLink.displayName);
    cy.dataCy("url-template-input").first().type(metadataLink.url, {
      parseSpecialCharSequences: false,
    });
  };

  it("Should be able to set external links to render on patch metadata panel", () => {
    // Add external links.
    cy.visit(getPluginsRoute(projectUseRepoEnabled));
    addMetadataLink({
      displayName: "An external link 1",
      url: "https://example-1.com/{version_id}",
    });
    addMetadataLink({
      displayName: "An external link 2",
      url: "https://example-2.com/{version_id}",
    });
    cy.dataCy("save-settings-button").scrollIntoView();
    clickSave();

    cy.visit(patchPage);
    cy.dataCy("external-link").should("have.length", 2);
    cy.dataCy("external-link").last().contains("An external link 1");
    cy.dataCy("external-link")
      .last()
      .should(
        "have.attr",
        "href",
        "https://example-1.com/5ecedafb562343215a7ff297",
      );
    cy.dataCy("external-link").first().contains("An external link 2");
    cy.dataCy("external-link")
      .first()
      .should(
        "have.attr",
        "href",
        "https://example-2.com/5ecedafb562343215a7ff297",
      );

    // Remove external links.
    cy.visit(getPluginsRoute(projectUseRepoEnabled));
    cy.dataCy("delete-item-button").first().click();
    cy.dataCy("delete-item-button").first().click();
    cy.dataCy("save-settings-button").scrollIntoView();
    clickSave();

    cy.visit(patchPage);
    cy.dataCy("external-link").should("not.exist");
  });
});
