import { ApolloError } from "@apollo/client";
import { InlineCode } from "@leafygreen-ui/typography";
import {
  MetadataCard,
  MetadataItem,
  MetadataTitle,
} from "components/MetadataCard";
import { StyledRouterLink } from "components/styles";
import { getTaskRoute } from "constants/routes";
import { PodQuery } from "gql/generated/types";

const Metadata: React.FC<{
  loading: boolean;
  pod: PodQuery["pod"];
  error: ApolloError;
}> = ({ error, loading, pod }) => {
  const { task, taskContainerCreationOpts, type } = pod ?? {};
  const { arch, cpu, memoryMB, os, workingDir } =
    taskContainerCreationOpts ?? {};
  const {
    displayName: runningTaskDisplayName,
    execution: runningTaskExecution,
    id: runningTaskId,
  } = task ?? {};

  const taskLink = getTaskRoute(runningTaskId, {
    execution: runningTaskExecution,
  });

  return (
    <MetadataCard error={error} loading={loading}>
      <MetadataTitle>Container Details</MetadataTitle>
      {runningTaskId !== "" && (
        <MetadataItem>
          Running Task:{" "}
          <StyledRouterLink to={taskLink}>
            {runningTaskDisplayName}
          </StyledRouterLink>
        </MetadataItem>
      )}
      <MetadataItem>Container Type: {type}</MetadataItem>
      <MetadataItem>CPU: {cpu}</MetadataItem>
      <MetadataItem>Memory: {memoryMB} MB</MetadataItem>
      <MetadataItem>Operating System: {os}</MetadataItem>
      <MetadataItem>CPU Architecture: {arch}</MetadataItem>
      <MetadataItem>
        Working Directory: <InlineCode>{workingDir}</InlineCode>
      </MetadataItem>
    </MetadataCard>
  );
};

export default Metadata;
