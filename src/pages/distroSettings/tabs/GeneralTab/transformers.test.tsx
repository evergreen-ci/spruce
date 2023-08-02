import { DistroInput } from "gql/generated/types";
import { distroData } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { GeneralFormState } from "./types";

describe("general tab", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(distroData)).toStrictEqual(generalForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(generalForm)).toStrictEqual(generalGql);
  });
});

const generalForm: GeneralFormState = {
  distroName: {
    identifier: "rhel71-power8-large",
  },
  distroAliases: {
    aliases: ["rhel71-power8", "rhel71-power8-build"],
  },
  distroNote: {
    note: "distro note",
  },
  distroOptions: {
    isCluster: false,
    disableShallowClone: true,
    disabled: false,
  },
};

const generalGql: DistroInput = {
  name: "rhel71-power8-large",
  aliases: ["rhel71-power8", "rhel71-power8-build"],
  note: "distro note",
  isCluster: false,
  disableShallowClone: true,
  disabled: false,
};
