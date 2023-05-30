import { SettingsCard, SettingsCardTitle } from "components/SettingsCard";

interface ContainerProps {
  title?: string;
  id?: string;
  "data-cy"?: string;
  children: React.ReactNode;
}

export const SpruceFormContainer: React.VFC<ContainerProps> = ({
  children,
  "data-cy": dataCy,
  id,
  title,
}) => (
  <div>
    {title && <SettingsCardTitle id={id}>{title}</SettingsCardTitle>}
    <SettingsCard data-cy={dataCy}>{children}</SettingsCard>
  </div>
);
