import { useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { useParams, Routes, Route, Navigate } from "react-router-dom";
import { DistroSettingsTabRoutes } from "constants/routes";
import { DistroQuery } from "gql/generated/types";
import { useDistroSettingsContext } from "./Context";
import { Header } from "./Header";
import { NavigationModal } from "./NavigationModal";
import {
  EventLogTab,
  GeneralTab,
  HostTab,
  ProjectTab,
  ProviderTab,
  TaskTab,
} from "./tabs/index";
import { gqlToFormMap } from "./tabs/transformers";
import { FormStateMap } from "./tabs/types";

interface Props {
  distro: DistroQuery["distro"];
}

export const DistroSettingsTabs: React.FC<Props> = ({ distro }) => {
  const { tab } = useParams<{ tab: DistroSettingsTabRoutes }>();
  const { setInitialData } = useDistroSettingsContext();

  const tabData = useMemo(() => getTabData(distro), [distro]);

  useEffect(() => {
    setInitialData(tabData);
  }, [setInitialData, tabData]);

  return (
    <Container>
      <NavigationModal />
      <Header tab={tab} distro={distro} />
      <Routes>
        <Route
          path="*"
          element={<Navigate to={DistroSettingsTabRoutes.General} replace />}
        />
        <Route
          path={DistroSettingsTabRoutes.General}
          element={
            <GeneralTab
              distroData={tabData[DistroSettingsTabRoutes.General]}
              minimumHosts={distro.hostAllocatorSettings.minimumHosts}
            />
          }
        />
        <Route
          path={DistroSettingsTabRoutes.Provider}
          element={
            <ProviderTab
              distro={distro}
              distroData={tabData[DistroSettingsTabRoutes.Provider]}
            />
          }
        />
        <Route
          path={DistroSettingsTabRoutes.Task}
          element={
            <TaskTab
              distroData={tabData[DistroSettingsTabRoutes.Task]}
              provider={distro.provider}
            />
          }
        />
        <Route
          path={DistroSettingsTabRoutes.Host}
          element={
            <HostTab
              distroData={tabData[DistroSettingsTabRoutes.Host]}
              provider={distro.provider}
            />
          }
        />
        <Route
          path={DistroSettingsTabRoutes.Project}
          element={
            <ProjectTab distroData={tabData[DistroSettingsTabRoutes.Project]} />
          }
        />
        <Route
          element={<EventLogTab />}
          path={DistroSettingsTabRoutes.EventLog}
        />
      </Routes>
    </Container>
  );
};

const getTabData = (data: Props["distro"]): FormStateMap =>
  Object.keys(gqlToFormMap).reduce(
    (obj, tab) => ({
      ...obj,
      [tab]: gqlToFormMap[tab](data),
    }),
    {} as FormStateMap,
  );

const Container = styled.div`
  min-width: 600px;
  width: 60%;
`;
