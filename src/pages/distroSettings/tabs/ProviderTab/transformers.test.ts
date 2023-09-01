import { DistroInput, Provider } from "gql/generated/types";
import { distroData } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { BuildType, ProviderFormState } from "./types";

describe("provider tab", () => {
  describe("static provider", () => {
    const staticDistroData = { ...distroData };

    const staticForm: ProviderFormState = {
      provider: {
        providerName: Provider.Static,
      },
      providerSettings: {
        userData: "",
        mergeUserData: false,
        securityGroups: ["1"],
      },
    };

    const staticGql: DistroInput = {
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

    it("correctly converts from GQL to a form", () => {
      expect(gqlToForm(staticDistroData)).toStrictEqual(staticForm);
    });

    it("correctly converts from a form to GQL", () => {
      expect(formToGql(staticForm, staticDistroData)).toStrictEqual(staticGql);
    });
  });

  describe("docker provider", () => {
    const dockerDistroData = { ...distroData };
    dockerDistroData.provider = Provider.Docker;
    dockerDistroData.containerPool = "pool-1";
    dockerDistroData.providerSettingsList = [
      {
        image_url: "https://some-url",
        build_type: "import",
        docker_registry_user: "testuser",
        docker_registry_pw: "abc-123",
        user_data: "",
        merge_user_data: false,
        security_group_ids: ["1"],
      },
    ];

    const dockerForm: ProviderFormState = {
      provider: {
        providerName: Provider.Docker,
      },
      providerSettings: {
        imageUrl: "https://some-url",
        buildType: BuildType.Import,
        registryUsername: "testuser",
        registryPassword: "abc-123",
        containerPoolId: "pool-1",
        userData: "",
        mergeUserData: false,
        securityGroups: ["1"],
      },
    };

    const dockerGql: DistroInput = {
      ...distroData,
      provider: Provider.Docker,
      containerPool: "pool-1",
      providerSettingsList: [
        {
          image_url: "https://some-url",
          build_type: "import",
          docker_registry_user: "testuser",
          docker_registry_pw: "abc-123",
          user_data: "",
          merge_user_data_parts: false,
          security_group_ids: ["1"],
        },
      ],
    };

    it("correctly converts from GQL to a form", () => {
      expect(gqlToForm(dockerDistroData)).toStrictEqual(dockerForm);
    });

    it("correctly converts from a form to GQL", () => {
      expect(formToGql(dockerForm, dockerDistroData)).toStrictEqual(dockerGql);
    });
  });
});
