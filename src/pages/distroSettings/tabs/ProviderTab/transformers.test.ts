import { DistroInput, Provider } from "gql/generated/types";
import { distroData } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { ProviderFormState } from "./types";

describe("provider tab", () => {
  describe("static provider", () => {
    it("correctly converts from GQL to a form", () => {
      expect(gqlToForm(distroData)).toStrictEqual(form);
    });

    it("correctly converts from a form to GQL", () => {
      expect(formToGql(form, distroData)).toStrictEqual(gql);
    });
  });
});

const form: ProviderFormState = {
  provider: {
    providerName: Provider.Static,
  },
  providerSettings: {
    userData: "",
    mergeUserData: false,
    securityGroups: ["1"],
  },
};

const gql: DistroInput = {
  ...distroData,
  provider: Provider.Static,
  providerSettingsList: [
    {
      merge_user_data_parts: false,
      security_group_ids: ["1"],
      user_data: "",
    },
  ],
};
