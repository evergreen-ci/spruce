import { MockedProvider } from "@apollo/client/testing";
import {
  newSpruceUser,
  newMainlineCommitsUser,
} from "constants/welcomeModalProps";
import CarouselCard from "./CarouselCard";
import WelcomeModal from "./WelcomeModal";

export default {
  title: "Welcome Modal",
  component: WelcomeModal,
};

export const NewSpruceUser = () => (
  <WelcomeModal
    title="Welcome to the New Evergreen UI!"
    param="hasUsedSpruceBefore"
    carouselCards={newSpruceUser}
  />
);

export const NewMainlineCommitsUser = () => (
  <MockedProvider>
    <WelcomeModal
      param="hasUsedMainlineCommitsBefore"
      carouselCards={newMainlineCommitsUser}
    />
  </MockedProvider>
);

export const MovieCard = () => (
  <MockedProvider>
    <CarouselCard
      movie="mainline_commits/carousel_2_05_4.webm"
      subtitle="A Subtitle"
      description="A description"
      visible
    />
  </MockedProvider>
);

export const ImageCard = () => (
  <MockedProvider>
    <CarouselCard
      img="welcome_modal/mypatch_gif_06_10.gif"
      subtitle="A Subtitle"
      description="A description"
      visible
    />
  </MockedProvider>
);
