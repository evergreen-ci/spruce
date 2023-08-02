import { DistroQuery } from "gql/generated/types";

const distroData: DistroQuery["distro"] = {
  __typename: "Distro",
  name: "rhel71-power8-large",
  aliases: ["rhel71-power8", "rhel71-power8-build"],
  note: "distro note",
  isCluster: false,
  disableShallowClone: true,
  disabled: false,
};

export { distroData };
