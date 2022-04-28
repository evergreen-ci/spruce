import { useQuery } from "@apollo/client";
import {
  GetSpruceConfigQuery,
  GetSpruceConfigQueryVariables,
} from "gql/generated/types";
import { GET_SPRUCE_CONFIG } from "gql/queries";

export const useSpruceConfig = () => {
  const { data } = useQuery<
    GetSpruceConfigQuery,
    GetSpruceConfigQueryVariables
  >(GET_SPRUCE_CONFIG);

  const { spruceConfig } = data || {};
  return spruceConfig;
};
