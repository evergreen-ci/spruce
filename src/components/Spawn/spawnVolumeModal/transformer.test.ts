import { formToGql } from "./transformer";

describe("spawn volume modal", () => {
  it("correctly converts from a form to GQL", () => {
    expect(
      formToGql({
        formData: formState,
      }),
    ).toStrictEqual({
      size: 200,
      availabilityZone: "us-east-1c",
      type: "gp3",
      noExpiration: true,
      expiration: null,
      host: "mount-host-id",
    });
  });
});

const formState = {
  requiredVolumeInformation: {
    size: 200,
    availabilityZone: "us-east-1c",
    type: "gp3",
  },
  optionalVolumeInformation: {
    expirationDetails: {
      noExpiration: true,
      expiration: "Wed Oct 19 2022 08:56:42 GMT-0400 (Eastern Daylight Time)",
    },
    mountToHost: "mount-host-id",
  },
};
