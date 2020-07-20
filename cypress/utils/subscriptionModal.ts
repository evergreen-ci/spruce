export const openSubscriptionModal = (
  route: string,
  dataCyToggleModalButton: string
) => {
  cy.visit(route);
  cy.dataCy(dataCyToggleModalButton).click();
  cy.dataTestId("when-select").click();
};
