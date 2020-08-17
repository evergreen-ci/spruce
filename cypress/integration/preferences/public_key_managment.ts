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

  describe("Public keys list", () => {
    it("Displays the user's public keys", () => {
      cy.visit(route);
      cy.dataCy("table-key-name").each(($el, index) =>
        cy.wrap($el).contains([keyName1, keyName2][index])
      );
    });
    it("Removes a public key from the table after deletion", () => {
      cy.dataCy("delete-btn")
        .first()
        .click();
      cy.get(popconfirmYesClassName).click();
      cy.dataCy("table-key-name").each(($el, index) =>
        cy.wrap($el).contains([keyName2][index])
      );
    });
    it('Displays "No keys saved. Add a new key to populate the list." when no keys are available', () => {
      cy.dataCy("delete-btn")
        .first()
        .click();
      cy.get(popconfirmYesClassName).click();
      cy.contains("No keys saved. Add a new key to populate the list.");
    });
  });

  describe("Add New Key Modal", () => {
    // error messages show up on open
    it("Displays errors when the modal opens", () => {
      cy.visit(route);
      cy.dataCy("add-key-button").click();
      cy.dataCy("error-messages").each(($el, index) =>
        cy.wrap($el).contains([err1, err2][index])
      );
    });

    it("Error messages go away after typing valid input", () => {
      cy.dataCy("key-name-input").type(keyName3);
      cy.dataCy("key-value-input").type("ssh-dss");
      cy.dataCy("error-messages").should("have.length", 0);
    });

    it("Should include the public in the public key list after adding", () => {
      cy.dataCy("key-value-input").clear();
      cy.dataCy("key-value-input")
        .type(pubKey)
        .then(() => {
          cy.dataCy("save-key-button").click();
          cy.dataCy("table-key-name").each(($el, index) =>
            cy.wrap($el).contains([keyName3][index])
          );
        });
    });

    it("Should show an error if the key name already exists", () => {
      cy.dataCy("add-key-button").click();
      cy.dataCy("key-name-input").type(keyName3);
      cy.dataCy("error-messages").each(($el, index) =>
        cy.wrap($el).contains([err3][index])
      );
    });

    it("Modal has correct title", () => {
      cy.dataCy("modal-title").contains("Add Public Key");
      cy.dataCy("cancel-subscription-button").click();
    });
  });

  describe("Edit Key Modal", () => {
    it("Should not have any errors when the modal opens", () => {
      cy.visit(route);
      cy.dataCy("edit-btn")
        .first()
        .click();
      cy.dataCy("error-messages").should("have.length", 0);
    });

    it("After submitting, the key name and key value are updated", () => {
      cy.dataCy("key-name-input").clear();
      cy.dataCy("key-name-input").type(keyName4);
      cy.dataCy("key-value-input").clear();
      cy.dataCy("key-value-input").type(pubKey2);
      cy.dataCy("save-key-button").click();
      cy.dataCy("table-key-name").each(($el, index) =>
        cy.wrap($el).contains([keyName4][index])
      );
      cy.dataCy("edit-btn")
        .first()
        .click();
      cy.dataCy("key-name-input").should("have.value", keyName4);
      cy.dataCy("key-value-input").should("have.value", pubKey2);
    });

    it("Modal has correct title", () => {
      cy.dataCy("modal-title").contains("Update Public Key");
    });
  });
});

const keyName1 =
  "a loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong name";
const keyName2 = "bKey";
const keyName3 = "a unique key name";
const keyName4 = "stuff!";
const err1 = "The key name cannot be empty.";
const err2 = "The SSH key must begin with 'ssh-rsa' or 'ssh-dss'.";
const err3 = "The key name already exists.";
const pubKey =
  "ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSUGPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XAt3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/EnmZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbxNrRFi9wrf+M7Q== schacon@mylaptop.local";
const pubKey2 =
  "ssh-dss AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSUGPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XAt3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/EnmZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbxNrRFi9wrf+M7Q== schacon@mylaptop.local";
