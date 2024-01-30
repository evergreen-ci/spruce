import { DistroInput } from "gql/generated/types";
import { distroData } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { ProjectFormState } from "./types";

describe("project tab", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(distroData)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(form, distroData)).toStrictEqual(gql);
  });
});

const form: ProjectFormState = {
  expansions: [
    {
      key: "decompress",
      value: "tar xzvf",
    },
    {
      key: "ps",
      value: "ps aux",
    },
    {
      key: "kill_pid",
      value: "kill -- -$(ps opgid= %v)",
    },
  ],
  validProjects: [],
};

const gql: DistroInput = {
  ...distroData,
  expansions: [
    {
      key: "decompress",
      value: "tar xzvf",
    },
    {
      key: "ps",
      value: "ps aux",
    },
    {
      key: "kill_pid",
      value: "kill -- -$(ps opgid= %v)",
    },
  ],
  validProjects: [],
};
