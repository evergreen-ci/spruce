import { useMemo } from "react";
import styled from "@emotion/styled";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import CommitChartLabel from "components/CommitChartLabel";
import { CommitVersion, BuildVariantDict } from "types/commits";
import { array, string } from "utils";
import { BuildVariantCard } from "./BuildVariantCard";

const { arrayUnion, convertArrayToObject } = array;
const { shortenGithash } = string;

interface ActiveCommitLabelProps {
  version: CommitVersion;
}
export const ActiveCommitLabel: React.FC<ActiveCommitLabelProps> = ({
  version,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({
    page: "Commit chart",
  });
  return (
    <CommitChartLabel
      versionId={version.id}
      githash={shortenGithash(version.revision)}
      gitTags={version.gitTags}
      createTime={version.createTime}
      author={version.author}
      message={version.message}
      onClickGithash={() => {
        sendEvent({
          name: "Click commit label",
          commitType: "active",
          link: "githash",
        });
      }}
      onClickJiraTicket={() => {
        sendEvent({
          name: "Click commit label",
          commitType: "active",
          link: "jira",
        });
      }}
      onClickUpstreamProject={() => {
        sendEvent({
          name: "Click commit label",
          commitType: "active",
          link: "upstream project",
        });
      }}
      upstreamProject={version.upstreamProject}
    />
  );
};

interface BuildVariantContainerProps {
  version: CommitVersion;
  buildVariantDict: BuildVariantDict;
}
export const BuildVariantContainer: React.FC<BuildVariantContainerProps> = ({
  buildVariantDict,
  version,
}) => {
  const { buildVariantStats, buildVariants, id, order, projectIdentifier } =
    version;

  const memoizedBuildVariantCards = useMemo(() => {
    const groupedBuildVariants = convertArrayToObject(buildVariants, "variant");
    const groupedBuildVariantStats = convertArrayToObject(
      buildVariantStats,
      "variant",
    );
    const allBuildVariants = arrayUnion(
      Object.keys(groupedBuildVariantStats),
      Object.keys(groupedBuildVariants),
      (a, b) =>
        buildVariantDict[b].priority - buildVariantDict[a].priority ||
        a.localeCompare(b),
    );

    const buildVariantCards = allBuildVariants.map((v) => {
      const { badgeHeight, iconHeight } = buildVariantDict[v];
      const height = iconHeight + badgeHeight;

      const buildVariant = groupedBuildVariants[v];
      const variantStats = groupedBuildVariantStats[v];
      const { displayName, variant } = buildVariant ?? variantStats;

      return (
        <BuildVariantCard
          key={`${id}_${variant}`}
          height={height}
          variant={variant}
          buildVariantDisplayName={displayName}
          groupedVariantStats={variantStats}
          versionId={id}
          projectIdentifier={projectIdentifier}
          tasks={buildVariant?.tasks}
          order={order}
        />
      );
    });
    return buildVariantCards;
  }, [
    buildVariantDict,
    buildVariants,
    buildVariantStats,
    id,
    projectIdentifier,
    order,
  ]);

  return <ColumnContainer>{memoizedBuildVariantCards}</ColumnContainer>;
};

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
