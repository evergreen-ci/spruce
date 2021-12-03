import { data } from "./testData";
import { formToGql, gqlToForm } from "./transformers";

const { project, repo } = data;

describe("repo data", () => {
  const {
    form,
    gql: { input, result },
  } = repo;
  test("correctly converts from GQL to a form", () => {
    expect(gqlToForm(input)).toStrictEqual(form);
  });

  test("correctly converts from a form to GQL", () => {
    expect(formToGql(form, "123")).toStrictEqual(result);
  });
});

describe("project data", () => {
  const {
    form,
    gql: { input, result },
  } = project;
  test("correctly converts from GQL to a form", () => {
    expect(gqlToForm(input)).toStrictEqual(form);
  });

  test("correctly converts from a form to GQL and omits empty strings", () => {
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
