// / <reference types="Cypress" />
import { popconfirmYesClassName } from "../../utils/popconfirm";
const route = "/preferences/publickeys";

describe("Public Key Management Page", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  it("displays the user's public keys", () => {
    cy.visit(route);
    cy.dataCy("table-key-name").each(($el, index) =>
      cy.wrap($el).contains(allPublicKeys[index])
    );
  });

  it("Removes a public key from the table after deletion", () => {
    cy.dataCy("delete-btn")
      .first()
      .click();
    cy.get(popconfirmYesClassName).click();
    cy.dataCy("table-key-name").each(($el, index) =>
      cy.wrap($el).contains(publicKeysAfterDeletion[index])
    );
  });
});
const keyName1 =
  "a loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong name";
const keyName2 = "bKey";
const allPublicKeys = [keyName1, keyName2];
const publicKeysAfterDeletion = [keyName2];
