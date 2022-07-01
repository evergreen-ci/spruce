import {
  newSpruceUser,
  newMainlineCommitsUser,
} from "constants/welcomeModalProps";
import CarouselCard from "./CarouselCard";
import WelcomeModal from "./WelcomeModal";

export default {
  title: "Components/Welcome Modal",
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
  <WelcomeModal
    param="hasUsedMainlineCommitsBefore"
    carouselCards={newMainlineCommitsUser}
  />
);

export const MovieCard = () => (
  <CarouselCard
    card={{
      title: "A Title",
      subtitle: "A Subtitle",
      description: "A Description",
      video: "mainline_commits/carousel_2_05_4.webm",
    }}
    visible
  />
);

export const ImageCard = () => (
  <CarouselCard
    card={{
      title: "A Title",
      subtitle: "A Subtitle",
      description: "A Description",
      img: "welcome_modal/mypatch_gif_06_10.gif",
      alt: "First slide gif",
    }}
    visible
  />
);
