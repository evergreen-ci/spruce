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

const Metadata: React.VFC<{
  loading: boolean;
  pod: PodQuery["pod"];
  error: ApolloError;
}> = ({ loading, pod, error }) => {
  const { taskContainerCreationOpts, type, task } = pod ?? {};
  const { arch, cpu, memoryMB, os, workingDir } =
    taskContainerCreationOpts ?? {};
  const {
    id: runningTaskId,
    execution: runningTaskExecution,
    displayName: runningTaskDisplayName,
  } = task ?? {};

  const taskLink = getTaskRoute(runningTaskId, {
    execution: runningTaskExecution,
  });

  return (
    <MetadataCard error={error} loading={loading}>
      <MetadataTitle>Container Details</MetadataTitle>
      <MetadataItem>
        Running Task:{" "}
        <StyledRouterLink to={taskLink}>
          {runningTaskDisplayName}
        </StyledRouterLink>
      </MetadataItem>
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
