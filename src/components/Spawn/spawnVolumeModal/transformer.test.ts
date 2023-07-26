import { formToGql } from "./transformer";

describe("spawn volume modal", () => {
  it("correctly converts from a form to GQL", () => {
    expect(
      formToGql({
        formData: formState,
      })
    ).toStrictEqual({
      availabilityZone: "us-east-1c",
      expiration: null,
      host: "mount-host-id",
      noExpiration: true,
      size: 200,
      type: "gp3",
    });
  });
});

const formState = {
  optionalVolumeInformation: {
    expirationDetails: {
      expiration: "Wed Oct 19 2022 08:56:42 GMT-0400 (Eastern Daylight Time)",
      noExpiration: true,
    },
    mountToHost: "mount-host-id",
  },
  requiredVolumeInformation: {
    availabilityZone: "us-east-1c",
    size: 200,
    type: "gp3",
  },
};
