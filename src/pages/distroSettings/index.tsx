import { useQuery } from "@apollo/client";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  SideNav,
  SideNavGroup,
  SideNavItem,
  PageWrapper,
} from "components/styles";
import {
  DistroSettingsTabRoutes,
  getDistroSettingsRoute,
} from "constants/routes";
import { useToastContext } from "context/toast";
import { DistroQuery, DistroQueryVariables } from "gql/generated/types";
import { DISTRO } from "gql/queries";
import { usePageTitle } from "hooks";
import { isProduction } from "utils/environmentVariables";
import { DistroSettingsProvider } from "./Context";
import { getTabTitle } from "./getTabTitle";
import { DistroSettingsTabs } from "./Tabs";

const DistroSettings: React.VFC = () => {
  usePageTitle("Distro Settings");
  const dispatchToast = useToastContext();
  const { distroId, tab: currentTab } = useParams<{
    distroId: string;
    tab: DistroSettingsTabRoutes;
  }>();

  const { data, loading } = useQuery<DistroQuery, DistroQueryVariables>(
    DISTRO,
    {
      variables: { distroId },
      onError: (e) => {
        dispatchToast.error(
          `There was an error loading the distro ${distroId}: ${e.message}`
        );
      },
    }
  );

  if (isProduction()) {
    return (
      <PageWrapper>
        <h1>Coming Soon 🌱⚙️</h1>
      </PageWrapper>
    );
  }

  if (!Object.values(DistroSettingsTabRoutes).includes(currentTab)) {
    return (
      <Navigate
        to={getDistroSettingsRoute(distroId, DistroSettingsTabRoutes.General)}
      />
    );
  }

  return (
    <DistroSettingsProvider>
      <SideNav aria-label="Distro Settings" widthOverride={250}>
        <SideNavGroup>
          {Object.values(DistroSettingsTabRoutes).map((tab) => (
            <SideNavItem
              active={tab === currentTab}
              as={Link}
              key={tab}
              to={getDistroSettingsRoute(distroId, tab)}
              data-cy={`navitem-${tab}`}
            >
              {getTabTitle(tab).title}
            </SideNavItem>
          ))}
        </SideNavGroup>
      </SideNav>
      <PageWrapper data-cy="distro-settings-page">
        {!loading && data.distro && <DistroSettingsTabs distro={data.distro} />}
      </PageWrapper>
    </DistroSettingsProvider>
  );
};

export default DistroSettings;
