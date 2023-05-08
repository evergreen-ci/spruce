import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Outlet } from "react-router-dom";
import { useAnalyticsAttributes } from "analytics";
import { Feedback } from "components/Feedback";
import { Header } from "components/Header";
import { FullPageLoad } from "components/Loading/FullPageLoad";
import { PageGrid } from "components/styles/Layout";
import { TaskStatusIconLegend } from "components/TaskStatusIconLegend";
import WelcomeModal from "components/WelcomeModal";
import { zIndex, size } from "constants/tokens";
import { newSpruceUser } from "constants/welcomeModalProps";
import { useAuthStateContext } from "context/auth";
import { GetUserQuery, GetUserQueryVariables } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { useUserSettings } from "hooks";
import { useAnnouncementToast } from "hooks/useAnnouncementToast";

export const Layout: React.VFC = () => {
  const { isAuthenticated } = useAuthStateContext();
  useAnalyticsAttributes();
  useAnnouncementToast();

  // this top-level query is required for authentication to work
  // afterware is used at apollo link level to authenticate or deauthenticate user based on response to query
  // therefore this could be any query as long as it is top-level
  const { data } = useQuery<GetUserQuery, GetUserQueryVariables>(GET_USER);
  localStorage.setItem("userId", data?.user?.userId ?? "");
  const { userSettings } = useUserSettings();
  const { useSpruceOptions } = userSettings ?? {};
  const { hasUsedSpruceBefore = true } = useSpruceOptions ?? {};

  if (!isAuthenticated) {
    return <FullPageLoad />;
  }

  return (
    <PageGrid>
      <Header />
      <Outlet />
      {!hasUsedSpruceBefore && (
        <WelcomeModal
          title="Welcome to the New Evergreen UI!"
          param="hasUsedSpruceBefore"
          carouselCards={newSpruceUser}
        />
      )}
      <FloatingContent>
        <TaskStatusIconLegend />
        <Feedback />
      </FloatingContent>
    </PageGrid>
  );
};

const FloatingContent = styled.div`
  position: fixed;
  z-index: ${zIndex.tooltip};
  bottom: 0;
  right: 0;
  margin-left: ${size.l};
  margin-bottom: ${size.s};
  background-color: white;
  padding: ${size.xs};
  border-radius: ${size.s};
  transition: opacity 0.2s ease-in-out;
  opacity: 0.2;
  :hover {
    transition: opacity 0.2s ease-in-out;
    opacity: 1;
  }
`;
