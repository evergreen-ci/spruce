export function waitForGQL(alias, queryName, onQueryFoundFn) {
  function waitOnce() {
    cy.wait(alias).then(xhr => {
      if (xhr.requestBody && xhr.requestBody.query.includes(queryName)) {
        if (onQueryFoundFn) onQueryFoundFn(xhr);
      } else {
        waitOnce();
      }
    });
  }

  waitOnce();
}
