import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";
import { data } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { FormState } from "./types";

const { projectBase, repoBase } = data;

describe("repo data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(repoBase)).toStrictEqual(repoForm);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(repoForm, "repo")).toStrictEqual(repoResult);
  });
});

describe("project data", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(projectBase)).toStrictEqual(projectForm);
  });

  it("correctly converts from a form to GQL and omits empty strings", () => {
    expect(
      formToGql(
        {
          ...projectForm,
          ...{
            admin: {
              admins: [
                {
                  username: "",
                },
              ],
            },
          },
        },
        "project"
      )
    ).toStrictEqual(projectResult);
  });
});

const projectForm: FormState = {
  accessSettings: {
    private: null,
    restricted: true,
  },
  admin: {
    admins: [],
  },
};

const projectResult: Pick<ProjectSettingsInput, "projectRef"> = {
  projectRef: {
    id: "project",
    private: null,
    restricted: true,
    admins: [],
  },
};

const repoForm: FormState = {
  accessSettings: {
    private: false,
    restricted: true,
  },
  admin: {
    admins: [
      {
        username: "admin",
      },
    ],
  },
};

const repoResult: Pick<RepoSettingsInput, "projectRef"> = {
  projectRef: {
    id: "repo",
    private: false,
    restricted: true,
    admins: ["admin"],
  },
};
