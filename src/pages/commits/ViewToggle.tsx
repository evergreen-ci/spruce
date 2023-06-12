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
  hasFilters: boolean;
  identifier: string;
  viewFilter: ProjectHealthView;
};

export const ViewToggle: React.VFC<Props> = ({
  hasFilters,
  identifier,
  viewFilter,
}) => {
  const [view, setView] = useQueryParam(
    ProjectFilterOptions.View,
    ProjectHealthView.Failed
  );

  useQuery<ProjectHealthViewQuery, ProjectHealthViewQueryVariables>(
    PROJECT_HEALTH_VIEW,
    {
      variables: { identifier },
      onCompleted: ({ projectSettings }) => {
        if (!viewFilter) {
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
            <Body>Defines which task icons are visible in the base view.</Body>
            <Body>
              Once any filters are applied, all tasks will be queried regardless
              of this setting.
            </Body>
          </Tooltip>
        </>
      }
      value={view}
      onChange={setView}
    >
      <SegmentedControlOption
        data-cy="view-failed"
        disabled={hasFilters}
        value={ProjectHealthView.Failed}
      >
        Default
      </SegmentedControlOption>
      <SegmentedControlOption
        data-cy="view-all"
        disabled={hasFilters}
        value={ProjectHealthView.All}
      >
        All Tasks
      </SegmentedControlOption>
    </SegmentedControl>
  );
};

const IconContainer = styled.span`
  margin-left: ${size.xxs};
  vertical-align: text-top;
`;
