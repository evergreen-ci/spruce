import { ProjectSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { gqlToForm, formToGql } from "./transformers";
import { ContainersFormState } from "./types";

const { projectBase } = data;

describe("containers", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(projectBase)).toStrictEqual(projectFormBase);
  });
  it("correctly converts from a form to GQL", () => {
    expect(formToGql(projectFormBase, "spruce")).toStrictEqual(
      projectResultBase,
    );
  });
});

const projectFormBase: ContainersFormState = {
  containerSizeDefinitions: {
    variables: [
      {
        cpu: 1024,
        memoryMb: 1024,
        name: "default",
      },
    ],
  },
};

const projectResultBase: ProjectSettingsInput = {
  projectRef: {
    id: "spruce",
    containerSizeDefinitions: [
      {
        cpu: 1024,
        memoryMb: 1024,
        name: "default",
      },
    ],
  },
};
