import Code from "@leafygreen-ui/code";

export const LegacyEventEntry: React.FC<{ data: Record<string, any> }> = ({
  data,
}) => (
  <Code data-cy="legacy-event" language="json">
    {JSON.stringify(data, null, 2)}
  </Code>
);
