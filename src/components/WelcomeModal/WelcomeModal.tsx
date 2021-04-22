import React, { useState, useRef } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { uiColors } from "@leafygreen-ui/palette";
import { Subtitle, Body } from "@leafygreen-ui/typography";
import { Modal, Carousel } from "antd";
import { CarouselRef } from "antd/es/carousel";
import get from "lodash/get";
import {
  GetUserSettingsQuery,
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { GET_USER_SETTINGS } from "gql/queries";
import { errorReporting } from "utils";

const { reportError } = errorReporting;
const { gray, green, black } = uiColors;

const carouselCards = [
  {
    img: "mypatch_gif_06_10.gif",
    subtitle: "Discover your new and improved patches workflow!",
    description:
      "We’ve made your patches workflow better by adding more filtering options, reducing load times, and improving the design.",
  },
  {
    img: "patch_gif_06_10.gif",
    subtitle: "We’ve also updated the patch page!",
    description:
      "We’ve made it easier to navigate through your tasks and find the information you’re looking for.",
  },
  {
    img: "newui_gif_06_10.gif",
    subtitle:
      "We really hope you enjoy the new UI, but just in case you miss the old Evergreen…",
    description:
      "We’re still working every day to make this better, adding new features and new pages all the time. In case you want to opt out of the new UI and miss all the updates... navigate to your preferences to do so.",
  },
];

const WelcomeModal = () => {
  const [visible, setVisible] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const slider = useRef<CarouselRef>(null);
  const [updateUserSettings] = useMutation<
    UpdateUserSettingsMutation,
    UpdateUserSettingsMutationVariables
  >(UPDATE_USER_SETTINGS, {
    onCompleted: () => {
      setVisible(false);
    },
    onError: (err) => {
      reportError(err).warning();
    },
  });
  const { data } = useQuery<GetUserSettingsQuery>(GET_USER_SETTINGS);
  const spruceV1 = get(data, "userSettings.useSpruceOptions.spruceV1");
  const handleWelcomeClosed = async () => {
    try {
      await updateUserSettings({
        variables: {
          userSettings: {
            useSpruceOptions: {
              hasUsedSpruceBefore: true,
              spruceV1,
            },
          },
        },
        refetchQueries: ["GetUserSettings"],
      });
    } catch (e) {}
  };
  return (
    <Modal
      centered
      footer={
        <Button
          variant={Variant.Primary}
          onClick={handleWelcomeClosed}
          data-cy="close-welcome-modal"
        >
          Done
        </Button>
      }
      onCancel={handleWelcomeClosed}
      style={{ top: 20 }}
      visible={visible}
      width={800}
      maskStyle={{
        backgroundColor: black,
        opacity: 0.9,
      }}
      wrapProps={{
        "data-cy": "welcome-modal",
      }}
    >
      {/* @ts-expect-error */}
      <CardTitle>Welcome to the New Evergreen UI!</CardTitle>
      <Carousel
        afterChange={(number) => setActiveSlide(number)}
        autoplay
        autoplaySpeed={8000}
        dots={false}
        slickGoTo={activeSlide}
        ref={slider}
      >
        {carouselCards.map((card) => (
          <CarouselCard key={`card_${card.img}`} {...card} />
        ))}
      </Carousel>
      <CarouselDots
        activeSlide={activeSlide}
        cards={carouselCards}
        slider={slider}
      />
    </Modal>
  );
};

type CarouselCardProps = {
  img: string;
  subtitle: string;
  description: string;
};

const CarouselCard: React.FC<CarouselCardProps> = ({
  img,
  subtitle,
  description,
}) => (
  <CardContainer>
    <CardWrapper>
      <ImgContainer src={`/static/img/welcome_modal/${img}`} />
      <Body weight="medium">{subtitle}</Body>
      <Body>{description}</Body>
    </CardWrapper>
  </CardContainer>
);

interface CarouselDotProps {
  activeSlide: number;
  cards: CarouselCardProps[];
  slider: React.MutableRefObject<CarouselRef>;
}

const CarouselDots: React.FC<CarouselDotProps> = ({
  activeSlide,
  cards,
  slider,
}) => (
  <DotContainer>
    {cards.map((card, index) => (
      <Dot
        key={`dot_${card.img}`}
        active={activeSlide === index}
        onClick={() => slider.current.goTo(index)}
      />
    ))}
  </DotContainer>
);

const ImgContainer = styled.img`
  height: 250px;
  width: 500px;
  margin-top: 40px;
  margin-bottom: 20px;
  background-color: gray;
`;

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-bottom: 16px;
`;

const CardWrapper = styled.div`
  width: 500px;
  text-align: center;
`;

// @ts-expect-error
const CardTitle = styled(Subtitle)`
  display: flex;
  justify-content: center;
`;

interface DotProps {
  active: boolean;
}
const Dot = styled.div`
  height: 10px;
  width: 10px;
  background-color: ${(props: DotProps): string =>
    props.active ? green.base : gray.light2};
  border-radius: 50%;
  margin-left: 8px;
  margin-right: 8px;
  :hover {
    cursor: pointer;
  }
`;
const DotContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default WelcomeModal;
