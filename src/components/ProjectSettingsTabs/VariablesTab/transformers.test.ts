import { data } from "./testData";
import { formToGql, gqlToForm } from "./transformers";

describe("project data", () => {
  const {
    form,
    gql: { input, result },
  } = data;
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(input)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL and omits empty fields", () => {
    expect(
      formToGql(
        {
          vars: [...form.vars, {}],
        },
        "123"
      )
    ).toStrictEqual(result);
  });
});
