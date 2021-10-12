import { useQuery } from "@apollo/client";
import Button from "@leafygreen-ui/button";
import { Link } from "react-router-dom";
import { getVersionRoute } from "constants/routes";
import {
  LastPassingVersionQuery,
  LastPassingVersionQueryVariables,
} from "gql/generated/types";
import { GET_LAST_PASSING_VERSION } from "gql/queries";

interface LastPassingVersionProps {
  variant: string;
  taskName: string;
  projectId: string;
}
export const LastPassingVersion: React.FC<LastPassingVersionProps> = ({
  variant,
  taskName,
  projectId,
}) => {
  const { data, loading } = useQuery<
    LastPassingVersionQuery,
    LastPassingVersionQueryVariables
  >(GET_LAST_PASSING_VERSION, { variables: { variant, projectId, taskName } });

  const lastPassingVersion =
    data?.mainlineCommits.versions.find(({ version }) => !!version) ?? {};
  const lastPassingVersionId = lastPassingVersion?.version?.id;

  return (
    <Button
      as={Link}
      size="small"
      disabled={loading || !lastPassingVersionId}
      to={getVersionRoute(lastPassingVersionId)}
    >
      Go to last passing version
    </Button>
  );
};
