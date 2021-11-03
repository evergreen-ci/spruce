import { useQuery } from "@apollo/client";
import Button from "@leafygreen-ui/button";
import { Link } from "react-router-dom";
import { TaskAnalytics } from "analytics";
import { getVersionRoute } from "constants/routes";
import {
  LastPassingVersionQuery,
  LastPassingVersionQueryVariables,
} from "gql/generated/types";
import { GET_LAST_PASSING_VERSION } from "gql/queries";
import { applyStrictRegex } from "utils/string";

interface LastPassingVersionProps {
  variant: string;
  taskName: string;
  projectId: string;
  analytics?: TaskAnalytics;
}
export const LastPassingVersion: React.FC<LastPassingVersionProps> = ({
  variant,
  taskName,
  projectId,
  analytics,
}) => {
  const { data, loading } = useQuery<
    LastPassingVersionQuery,
    LastPassingVersionQueryVariables
  >(GET_LAST_PASSING_VERSION, {
    variables: {
      variant: applyStrictRegex(variant),
      projectId,
      taskName: applyStrictRegex(taskName),
    },
  });

  const lastPassingVersion =
    data?.mainlineCommits.versions.find(({ version }) => !!version) ?? {};
  const lastPassingVersionId = lastPassingVersion?.version?.id;

  return (
    <Button
      data-cy="last-passing-version-btn"
      as={Link}
      size="small"
      disabled={loading || !lastPassingVersionId}
      to={getVersionRoute(lastPassingVersionId)}
      onClick={() =>
        analytics?.sendEvent({ name: "Click Last Passing Version Button" })
      }
    >
      Go to last passing version
    </Button>
  );
};
