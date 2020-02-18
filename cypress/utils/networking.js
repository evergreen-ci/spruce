// this fn will wait until a query with queryName is executed on the aliased route
export const waitForGQL = (alias, queryName) => {
  const waitOnce = () => {
    cy.wait(alias).then(xhr => {
      if (!xhr.requestBody || !xhr.requestBody.query.includes(queryName)) {
        waitOnce();
      }
    });
  };

  waitOnce();
};
