import { useQuery } from "@apollo/client";
import {
  SpruceConfigQuery,
  SpruceConfigQueryVariables,
} from "gql/generated/types";
import { SPRUCE_CONFIG } from "gql/queries";

export const useSpruceConfig = () => {
  const { data } = useQuery<SpruceConfigQuery, SpruceConfigQueryVariables>(
    SPRUCE_CONFIG
  );

  const { spruceConfig } = data || {};
  return spruceConfig;
};
