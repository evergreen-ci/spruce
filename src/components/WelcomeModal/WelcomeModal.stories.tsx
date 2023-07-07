import {
  newSpruceUser,
  newMainlineCommitsUser,
} from "constants/welcomeModalProps";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import CarouselCard from "./CarouselCard";
import WelcomeModal from "./WelcomeModal";

export default {
  component: WelcomeModal,
  parameters: {
    storyshots: {
      disable: true,
    },
  },
} satisfies CustomMeta<typeof WelcomeModal>;

export const NewSpruceUser: CustomStoryObj<typeof WelcomeModal> = {
  render: () => (
    <WelcomeModal
      title="Welcome to the New Evergreen UI!"
      param="hasUsedSpruceBefore"
      carouselCards={newSpruceUser}
    />
  ),
};

export const NewMainlineCommitsUser: CustomStoryObj<typeof WelcomeModal> = {
  render: () => (
    <WelcomeModal
      param="hasUsedMainlineCommitsBefore"
      carouselCards={newMainlineCommitsUser}
    />
  ),
};

export const MovieCard: CustomStoryObj<typeof CarouselCard> = {
  render: () => (
    <CarouselCard
      card={{
        title: "A Title",
        subtitle: "A Subtitle",
        description: "A Description",
        video: "mainline_commits/carousel_2_05_4.webm",
      }}
      visible
    />
  ),
};

export const ImageCard: CustomStoryObj<typeof CarouselCard> = {
  render: () => (
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
  ),
};
