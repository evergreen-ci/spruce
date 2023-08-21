import Code from "@leafygreen-ui/code";
import { Event } from "components/Settings/EventLog";

export const LegacyEventEntry: React.FC<{ data: Event["data"] }> = ({
  data,
}) => (
  <Code data-cy="legacy-event" language="json">
    {JSON.stringify(data, null, 2)}
  </Code>
);
