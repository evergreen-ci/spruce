import { MetadataItem } from "components/MetadataCard";
import { StyledRouterLink } from "components/styles";
import { getTaskRoute, getVersionRoute } from "constants/routes";
import { AbortInfo } from "gql/generated/types";

export const AbortMessage: React.FC<AbortInfo> = ({
  buildVariantDisplayName,
  newVersion,
  prClosed,
  taskDisplayName,
  taskID,
  user,
}) =>
  user ? (
    <MetadataItem>
      {`Aborted by: ${user} `}
      {taskID && buildVariantDisplayName && taskDisplayName && (
        <span>
          because of failing task:{" "}
          <StyledRouterLink
            data-cy="abort-message-failing-task"
            to={getTaskRoute(taskID)}
          >
            {`${buildVariantDisplayName}: ${taskDisplayName}`}
          </StyledRouterLink>
        </span>
      )}
      {newVersion && (
        <span>
          because of a new version:{" "}
          <StyledRouterLink
            data-cy="abort-message-new-version"
            to={getVersionRoute(newVersion)}
          >
            {newVersion}
          </StyledRouterLink>
        </span>
      )}
      {prClosed && <span>because the GitHub PR was closed</span>}
    </MetadataItem>
  ) : null;
