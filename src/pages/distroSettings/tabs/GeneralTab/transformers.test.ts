import { DistroInput } from "gql/generated/types";
import { distroData } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { GeneralFormState } from "./types";

describe("general tab", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(distroData)).toStrictEqual(generalForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(generalForm, distroData)).toStrictEqual(generalGql);
  });
});

const generalForm: GeneralFormState = {
  distroName: {
    identifier: "rhel71-power8-large",
  },
  distroAliases: {
    aliases: ["rhel71-power8", "rhel71-power8-build"],
  },
  distroOptions: {
    adminOnly: false,
    isCluster: false,
    disableShallowClone: true,
    disabled: false,
    note: "distro note",
  },
};

const generalGql: DistroInput = {
  ...distroData,
  name: "rhel71-power8-large",
  adminOnly: false,
  aliases: ["rhel71-power8", "rhel71-power8-build"],
  isCluster: false,
  disableShallowClone: true,
  disabled: false,
  note: "distro note",
};
