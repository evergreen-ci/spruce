export const clickSave = () => {
  cy.dataCy("save-settings-button")
    .should("not.have.attr", "aria-disabled", "true")
    .click();
};
