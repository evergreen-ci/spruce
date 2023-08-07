import { SettingsCard, SettingsCardTitle } from "components/SettingsCard";

interface ContainerProps {
  children: React.ReactNode;
  "data-cy"?: string;
  description?: React.ReactNode;
  id?: string;
  title?: string;
}

export const SpruceFormContainer: React.FC<ContainerProps> = ({
  children,
  "data-cy": dataCy,
  description,
  id,
  title,
}) => (
  <div>
    {title && <SettingsCardTitle id={id}>{title}</SettingsCardTitle>}
    {description}
    <SettingsCard data-cy={dataCy}>{children}</SettingsCard>
  </div>
);
