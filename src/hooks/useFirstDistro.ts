import { useQuery } from "@apollo/client";
import { DistrosQuery, DistrosQueryVariables } from "gql/generated/types";
import { DISTROS } from "gql/queries";

/**
 * `useFirstDistro` returns the alphabetically first distro from Evergreen's list of distros.
 * This can be used to generate a general link to distro settings.
 * @returns the distro ID
 */
export const useFirstDistro = () => {
  const { data, loading } = useQuery<DistrosQuery, DistrosQueryVariables>(
    DISTROS,
    {
      variables: {
        onlySpawnable: false,
      },
    }
  );

  return { distro: data?.distros?.[0]?.name ?? "ubuntu2204-large", loading };
};
