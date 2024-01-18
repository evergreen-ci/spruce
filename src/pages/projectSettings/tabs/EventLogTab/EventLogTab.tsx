import { useParams } from "react-router-dom";
import { EventLog } from "components/Settings/EventLog";
import { ProjectType } from "../utils";
import { useProjectSettingsEvents } from "./useProjectSettingsEvents";

type TabProps = {
  limit?: number;
  projectType: ProjectType;
};

export const EventLogTab: React.FC<TabProps> = ({ limit, projectType }) => {
  const { projectIdentifier: identifier } = useParams<{
    projectIdentifier: string;
  }>();

  const isRepo = projectType === ProjectType.Repo;
  const { allEventsFetched, events, fetchMore } = useProjectSettingsEvents(
    identifier,
    isRepo,
    limit,
  );

  const lastEventTimestamp = events[events.length - 1]?.timestamp;

  return (
    <EventLog
      allEventsFetched={allEventsFetched}
      events={events}
      handleFetchMore={() => {
        fetchMore({
          variables: {
            identifier,
            before: lastEventTimestamp,
          },
        });
      }}
    />
  );
};
