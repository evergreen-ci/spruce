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
  TaskTab,
} from "./tabs/index";
import { gqlToFormMap } from "./tabs/transformers";

interface Props {
  distro: DistroQuery["distro"];
}

export const DistroSettingsTabs: React.FC<Props> = ({ distro }) => {
  const { tab } = useParams<{ tab: DistroSettingsTabRoutes }>();
  const { setInitialData } = useDistroSettingsContext();

  const tabData = useMemo(() => getTabData(distro), [distro]);

  useEffect(() => {
    // @ts-expect-error TODO: Type when all tabs have been implemented
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
            <GeneralTab distroData={tabData[DistroSettingsTabRoutes.General]} />
          }
        />
        <Route
          path={DistroSettingsTabRoutes.Task}
          element={
            <TaskTab distroData={tabData[DistroSettingsTabRoutes.Task]} />
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

/* Map data from query to the tab to which it will be passed */
// TODO: Type when all tabs have been implemented
const getTabData = (data: Props["distro"]) =>
  Object.keys(gqlToFormMap).reduce(
    (obj, tab) => ({
      ...obj,
      [tab]: gqlToFormMap[tab](data),
    }),
    {}
  );

const Container = styled.div`
  min-width: 600px;
  width: 60%;
`;
