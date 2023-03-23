import { MockedProvider } from "@apollo/client/testing";
import { StoryObj } from "@storybook/react";
import {
  newSpruceUser,
  newMainlineCommitsUser,
} from "constants/welcomeModalProps";
import CarouselCard from "./CarouselCard";
import WelcomeModal from "./WelcomeModal";

export default {
  component: WelcomeModal,
  parameters: {
    storyshots: {
      disable: true,
    },
  },
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider>
        <Story />
      </MockedProvider>
    ),
  ],
};

export const NewSpruceUser: StoryObj<typeof WelcomeModal> = {
  render: () => (
    <WelcomeModal
      title="Welcome to the New Evergreen UI!"
      param="hasUsedSpruceBefore"
      carouselCards={newSpruceUser}
    />
  ),
};

export const NewMainlineCommitsUser: StoryObj<typeof WelcomeModal> = {
  render: () => (
    <WelcomeModal
      param="hasUsedMainlineCommitsBefore"
      carouselCards={newMainlineCommitsUser}
    />
  ),
};

export const MovieCard: StoryObj<typeof CarouselCard> = {
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

export const ImageCard: StoryObj<typeof CarouselCard> = {
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
