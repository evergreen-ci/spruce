import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { useParams, Link } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/Divider";
import { H3, P1 } from "components/Typography";
import { pollInterval } from "constants/index";
import { getVersionRoute } from "constants/routes";
import {
  PatchBuildVariantsQuery,
  PatchBuildVariantsQueryVariables,
} from "gql/generated/types";
import { GET_PATCH_BUILD_VARIANTS } from "gql/queries";
import { useNetworkStatus } from "hooks";
import { GroupedTaskSquare } from "pages/patch/buildVariants/GroupedTaskSquare";
import { groupTasksByColor } from "./buildVariants/utils";

export const BuildVariants: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const patchAnalytics = usePatchAnalytics();

  const { data, loading, error, startPolling, stopPolling } = useQuery<
    PatchBuildVariantsQuery,
    PatchBuildVariantsQueryVariables
  >(GET_PATCH_BUILD_VARIANTS, {
    variables: { patchId: id },
    pollInterval,
  });
  useEffect(() => stopPolling, [stopPolling]);
  useNetworkStatus(startPolling, stopPolling);

  return (
    <>
      {/* @ts-expect-error */}
      <SiderCard>
        <H3>Build Variants</H3>
        <Divider />
        {error && !loading && <div>{error.message}</div>}{" "}
        {loading && !error && (
          <Skeleton active title={false} paragraph={{ rows: 4 }} />
        )}
        {data &&
          data.patchBuildVariants.map(({ displayName, tasks, variant }) => (
            <BuildVariant
              key={`buildVariant_${displayName}_${tasks.length}`}
              data-cy="patch-build-variant"
            >
              <P1>
                <Link
                  to={`${getVersionRoute(id, {
                    page: 0,
                    variant: `^${variant}$`, // strict regex
                  })}`}
                  onClick={() =>
                    patchAnalytics.sendEvent({
                      name: "Click Build Variant Grid Link",
                    })
                  }
                >
                  {displayName}
                </Link>
              </P1>
              <VariantTaskGroup variant={variant} tasks={tasks} />
            </BuildVariant>
          ))}
      </SiderCard>
    </>
  );
};

interface VariantTaskGroupProps {
  tasks: { status: string }[];
  variant: string;
}
const VariantTaskGroup: React.FC<VariantTaskGroupProps> = ({
  tasks,
  variant,
}) => {
  const groupedTasks = groupTasksByColor(tasks);
  return (
    <VariantTasks>
      {Object.keys(groupedTasks).map((color) => (
        <GroupedTaskSquare
          key={`${variant}_${color}`}
          statuses={groupedTasks[color].statuses}
          count={groupedTasks[color].count}
          color={color}
          textColor={groupedTasks[color].textColor}
          variant={variant}
        />
      ))}
    </VariantTasks>
  );
};

const BuildVariant = styled.div`
  margin-bottom: 8px;
`;
const VariantTasks = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
