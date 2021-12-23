import { data } from "./testData";
import { formToGql, gqlToForm } from "./transformers";

const { project, repo } = data;

describe("repo data", () => {
  const {
    form,
    gql: { input, result },
  } = repo;
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(input)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(form, "123")).toStrictEqual(result);
  });
});

describe("project data", () => {
  const {
    form,
    gql: { input, result },
  } = project;
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(input)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL and omits empty strings", () => {
    expect(
      formToGql(
        {
          ...form,
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
        "456"
      )
    ).toStrictEqual(result);
  });
});
