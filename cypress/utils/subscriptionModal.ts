export const openSubscriptionModal = (
  route: string,
  dataCyToggleModalButton: string,
) => {
  cy.visit(route);
  cy.dataCy(dataCyToggleModalButton).click();
};
