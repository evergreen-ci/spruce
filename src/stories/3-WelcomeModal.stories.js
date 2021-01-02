import { MockedProvider } from "@apollo/client/testing";
import { WelcomeModal } from "components/WelcomeModal";
import "antd/es/modal/style/css";
import "antd/es/carousel/style/css";

export const WelcomeModalView = () => (
  <MockedProvider>
    <WelcomeModal />
  </MockedProvider>
);

export default {
  title: "Welcome Modal",
  component: WelcomeModalView,
};
