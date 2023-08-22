import { DistroOnSaveOperation } from "gql/generated/types";
import { clickSave } from "../../utils";

export const save = (onSave?: DistroOnSaveOperation) => {
  clickSave();

  if (onSave) {
    cy.get(`input[value=${onSave}]`).check({ force: true });
  }

  cy.dataCy("save-modal").within(() => {
    cy.contains("button", "Save").click();
  });
};
