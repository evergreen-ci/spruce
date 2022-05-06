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
  parameters: {
    storyshots: {
      disable: true,
    },
  },
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
      card={{
        title: "A Title",
        subtitle: "A Subtitle",
        description: "A Description",
        video: "mainline_commits/carousel_2_05_4.webm",
      }}
      visible
    />
  </MockedProvider>
);

export const ImageCard = () => (
  <MockedProvider>
    <CarouselCard
      card={{
        title: "A Title",
        subtitle: "A Subtitle",
        description: "A Description",
        img: "welcome_modal/mypatch_gif_06_10.gif",
      }}
      visible
    />
  </MockedProvider>
);
