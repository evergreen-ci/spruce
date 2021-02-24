import { MockedProvider } from "@apollo/client/testing";
import { WelcomeModal } from "components/WelcomeModal";

export const WelcomeModalView = () => (
  <MockedProvider>
    <WelcomeModal />
  </MockedProvider>
);

export default {
  title: "Welcome Modal",
  component: WelcomeModalView,
};
