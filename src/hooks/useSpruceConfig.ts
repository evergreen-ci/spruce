import { useQuery } from "@apollo/client";
import {
  SpruceConfigQuery,
  SpruceConfigQueryVariables,
} from "gql/generated/types";
import { GET_SPRUCE_CONFIG } from "gql/queries";

export const useSpruceConfig = () => {
  const { data } = useQuery<SpruceConfigQuery, SpruceConfigQueryVariables>(
    GET_SPRUCE_CONFIG
  );

  const { spruceConfig } = data || {};
  return spruceConfig;
};
