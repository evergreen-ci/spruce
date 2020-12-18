import React from "react";
import { StyledLink } from "components/styles";
import { P2 } from "components/Typography";
import { getTaskRoute, getVersionRoute } from "constants/routes";
import { AbortInfo } from "gql/generated/types";

export const AbortMessage = ({
  user,
  taskID,
  newVersion,
  prClosed,
  buildVariantDisplayName,
  taskDisplayName,
}: AbortInfo) => (
  <>
    {user && (
      <P2>
        {`Aborted by ${user} `}
        {taskID && buildVariantDisplayName && taskDisplayName && (
          <span>
            because of failing task:{" "}
            <StyledLink
              data-cy="abort-message-failing-task"
              href={getTaskRoute(taskID)}
            >
              {`${buildVariantDisplayName}: ${taskDisplayName}`}
            </StyledLink>
          </span>
        )}
        {newVersion && (
          <span>
            because of a new version:{" "}
            <StyledLink
              data-cy="abort-message-new-version"
              href={getVersionRoute(newVersion)}
            >
              {newVersion}
            </StyledLink>
          </span>
        )}
        {prClosed && <span>because the GitHub PR was closed</span>}
      </P2>
    )}
  </>
);
