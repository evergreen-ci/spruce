import { DistroOnSaveOperation } from "gql/generated/types";
import { save } from "./utils";

describe("using an on-save operation", () => {
  beforeEach(() => {
    cy.visit("/distro/localhost/settings/general");
  });

  it("notes how many hosts were updated in the resulting toast", () => {
    cy.getInputByLabel("Notes").type("My note");

    save(DistroOnSaveOperation.Decommission);
    cy.validateToast(
      "success",
      "Updated distro and scheduled 0 hosts to update.",
    );

    // Reset field
    cy.getInputByLabel("Notes").clear();
    save(DistroOnSaveOperation.RestartJasper);
    cy.validateToast(
      "success",
      "Updated distro and scheduled 0 hosts to update.",
    );
  });
});
