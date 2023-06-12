import { useQuery } from "@apollo/client";
import {
  SegmentedControl,
  SegmentedControlOption,
} from "@leafygreen-ui/segmented-control";
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
  viewFilter: ProjectHealthView;
};

export const ViewToggle: React.VFC<Props> = ({ identifier, viewFilter }) => {
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
    <SegmentedControl label="Icon View" value={view} onChange={setView}>
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
