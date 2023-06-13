import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import {
  SegmentedControl,
  SegmentedControlOption,
} from "@leafygreen-ui/segmented-control";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import {
  ProjectHealthView,
  ProjectHealthViewQuery,
  ProjectHealthViewQueryVariables,
} from "gql/generated/types";
import { PROJECT_HEALTH_VIEW } from "gql/queries";
import { useQueryParam } from "hooks/useQueryParam";
import { ProjectFilterOptions } from "types/commits";

type Props = {
  identifier: string;
};

export const ViewToggle: React.VFC<Props> = ({ identifier }) => {
  const [view, setView] = useQueryParam(
    ProjectFilterOptions.View,
    "" as ProjectHealthView
  );

  useQuery<ProjectHealthViewQuery, ProjectHealthViewQueryVariables>(
    PROJECT_HEALTH_VIEW,
    {
      variables: { identifier },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
      onCompleted: ({ projectSettings }) => {
        if (!view) {
          setView(projectSettings?.projectRef?.projectHealthView);
        }
      },
    }
  );

  return (
    <SegmentedControl
      aria-controls="[data-cy='waterfall-task-status-icon']"
      /* @ts-expect-error */
      label={
        <>
          Icon View
          <Tooltip
            align="bottom"
            justify="middle"
            trigger={
              <IconContainer>
                <Icon glyph="InfoWithCircle" size="small" />
              </IconContainer>
            }
            triggerEvent="hover"
          >
            <Body>
              “Default” only shows failed icons in the base view and groups some
              filtered results.
            </Body>
            <Body>
              “All Tasks” shows icons for every task without grouping.
            </Body>
          </Tooltip>
        </>
      }
      value={view || ProjectHealthView.Failed}
      onChange={setView}
    >
      <SegmentedControlOption
        data-cy="view-failed"
        value={ProjectHealthView.Failed}
      >
        Default
      </SegmentedControlOption>
      <SegmentedControlOption data-cy="view-all" value={ProjectHealthView.All}>
        All Tasks
      </SegmentedControlOption>
    </SegmentedControl>
  );
};

const IconContainer = styled.span`
  margin-left: ${size.xxs};
  vertical-align: text-top;
`;
