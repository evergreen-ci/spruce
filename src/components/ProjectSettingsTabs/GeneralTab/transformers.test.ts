import { data } from "./testData";
import { formToGql, gqlToForm } from "./transformers";

const { project, repo } = data;

describe("Repo data", () => {
  const {
    form,
    gql: { input, result },
  } = repo;
  test("Correctly converts from GQL to a form", () => {
    expect(gqlToForm(input)).toStrictEqual(form);
  });

  test("Correctly converts from a form to GQL", () => {
    expect(formToGql(form, "123")).toStrictEqual(result);
  });
});

describe("Project data", () => {
  const {
    form,
    gql: { input, result },
  } = project;
  test("Correctly converts from GQL to a form", () => {
    expect(gqlToForm(input)).toStrictEqual(form);
  });

  test("Correctly converts from a form to GQL", () => {
    expect(
      formToGql(form, "456", {
        useRepoSettings: true,
      })
    ).toStrictEqual(result);
  });
});
