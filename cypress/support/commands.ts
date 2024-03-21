import { EVG_BASE_URL, GQL_URL, users } from "../constants";
import { hasOperationName } from "../utils/graphql-test-utils";

type cyGetOptions = Parameters<typeof cy.get>[1];

/* closeBanner */
Cypress.Commands.add("closeBanner", (dataCy: string) => {
  cy.dataCy(dataCy).within(() => cy.get("[aria-label='X Icon']").click());
});

/* dataCy */
Cypress.Commands.add("dataCy", (value: string, options: cyGetOptions = {}) => {
  cy.get(`[data-cy=${value}]`, options);
});

/* dataRowKey */
Cypress.Commands.add(
  "dataRowKey",
  (value: string, options: cyGetOptions = {}) => {
    cy.get(`[data-row-key=${value}]`, options);
  },
);

/* dataTestId */
Cypress.Commands.add(
  "dataTestId",
  (value: string, options: cyGetOptions = {}) => {
    cy.get(`[data-test-id=${value}]`, options);
  },
);

/**
 * `enterLoginCredentials` is a custom command to enter login credentials
 */
Cypress.Commands.add("enterLoginCredentials", () => {
  cy.get("input[name=username]").type(users.admin.username);
  cy.get("input[name=password]").type(users.admin.password);
  cy.get("button[id=login-submit]").click();
});

/* getInputByLabel */
Cypress.Commands.add("getInputByLabel", (label: string | RegExp) => {
  // LeafyGreen inputs start out with ids of "undefined". Wait until LeafyGreen components have proper ids.
  cy.contains("label", label)
    .should("have.attr", "for")
    .and("not.contain", "undefined");
  cy.contains("label", label)
    .invoke("attr", "for")
    .then((id) => {
      cy.get(`#${id}`);
    });
});

/* login */
Cypress.Commands.add("login", (user = users.admin) => {
  cy.getCookie("mci-token").then((c) => {
    if (!c) {
      cy.request("POST", `${EVG_BASE_URL}/login`, user);
    }
  });
});

/* logout */
Cypress.Commands.add("logout", () => {
  cy.origin(EVG_BASE_URL, () => {
    cy.request({ url: "/logout", followRedirect: false });
  });
});

/* toggleTableFilter */
// TODO: Delete this command.
Cypress.Commands.add("toggleTableFilter", (colNum: number) => {
  const selector = `.ant-table-thead > tr > :nth-child(${colNum})`;
  cy.get(selector).should("be.visible");
  cy.get(selector).find("[role=button]").first().click();
  cy.get(":not(.ant-dropdown-hidden) > .ant-table-filter-dropdown").should(
    "be.visible",
  );
});

/* validateTableSort */
Cypress.Commands.add(
  "validateTableSort",
  (direction?: "asc" | "desc" | "none") => {
    switch (direction) {
      case "asc":
        cy.get("svg[aria-label='Sort Ascending Icon']").should("be.visible");
        return;
      case "desc":
        cy.get("svg[aria-label='Sort Descending Icon']").should("be.visible");
        return;
      case "none":
      default:
        cy.get("svg[aria-label='Unsorted Icon']").should("be.visible");
    }
  },
);

/* validateToast */
Cypress.Commands.add(
  "validateToast",
  (status: string, message: string = "", shouldClose: boolean = true) => {
    cy.dataCy("toast").should("be.visible");
    cy.dataCy("toast").should("have.attr", "data-variant", status);
    if (message) {
      cy.dataCy("toast").contains(message);
    }
    if (shouldClose) {
      cy.dataCy("toast").within(() => {
        cy.get("button[aria-label='Close Message']").click();
      });
      cy.dataCy("toast").should("not.exist");
    }
  },
);

/* selectLGOption */
Cypress.Commands.add(
  "selectLGOption",
  (label: string, option: string | RegExp) => {
    cy.getInputByLabel(label).should("not.have.attr", "aria-disabled", "true");
    cy.getInputByLabel(label).click({ force: true }); // open select
    cy.get('[role="listbox"]').should("have.length", 1);
    cy.get('[role="listbox"]').within(() => {
      cy.contains(option).click();
    });
  },
);

Cypress.Commands.add("overwriteGQL", (operationName: string, body: any) => {
  cy.intercept("POST", GQL_URL, (req) => {
    if (hasOperationName(req, operationName)) {
      req.reply((res) => {
        res.body = body;
      });
    }
  });
});

// TODO: Usage of openExpandableCard introduced in DEVPROD-2415 can be deleted after DEVPROD-2608
Cypress.Commands.add("openExpandableCard", (cardTitle: string) => {
  cy.dataCy("expandable-card-title")
    .contains(cardTitle)
    .closest("[role='button']")
    .as("card-btn");
  cy.get("@card-btn").then(($btn) => {
    if ($btn.attr("aria-expanded") !== "true") {
      cy.get("@card-btn").click();
    }
  });
});
