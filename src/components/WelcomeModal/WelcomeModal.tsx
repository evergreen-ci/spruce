import { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import Modal from "@leafygreen-ui/modal";
import { Subtitle } from "@leafygreen-ui/typography";
import { Carousel } from "antd";
import { CarouselRef } from "antd/es/carousel";
import { StyledLink as Link } from "components/styles";
import { size } from "constants/tokens";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { errorReporting } from "utils";
import CarouselCard from "./CarouselCard";
import CarouselDots from "./CarouselDots";

const { reportError } = errorReporting;

type CardTypes =
  | {
      img: string;
      subtitle: string;
      description: string;
      href?: string;
    }
  | {
      movie: string;
      subtitle: string;
      description: string;
      href?: string;
    };

interface WelcomeModalProps {
  param: "hasUsedSpruceBefore" | "hasUsedMainlineCommitsBefore";
  title?: string;
  carouselCards: CardTypes[];
}
const WelcomeModal: React.VFC<WelcomeModalProps> = ({
  carouselCards,
  param,
  title,
}) => {
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

  const handleClosed = () => {
    try {
      updateUserSettings({
        variables: {
          userSettings: {
            useSpruceOptions: {
              [param]: true,
            },
          },
        },
        refetchQueries: ["GetUserSettings"],
      });
    } catch (e) {}
  };
  return (
    <Modal setOpen={handleClosed} open={visible} data-cy="welcome-modal">
      {/* @ts-expect-error */}
      {title && <CardTitle>{title}</CardTitle>}
      <Carousel
        afterChange={(number) => setActiveSlide(number)}
        autoplay
        autoplaySpeed={10000}
        dots={false}
        slickGoTo={activeSlide}
        ref={slider}
      >
        {carouselCards.map((card) => (
          <CarouselCard key={`card_${card.subtitle}`} {...card} />
        ))}
      </Carousel>
      <Footer>
        <CarouselDots
          activeSlide={activeSlide}
          total={carouselCards.length}
          slider={slider}
        />
        <div>
          {carouselCards[activeSlide].href && (
            <StyledLink href={carouselCards[activeSlide].href} target="__blank">
              Learn more
            </StyledLink>
          )}
          <Button
            variant={Variant.Primary}
            onClick={handleClosed}
            data-cy="close-welcome-modal"
          >
            Done
          </Button>
        </div>
      </Footer>
    </Modal>
  );
};

const StyledLink = styled(Link)`
  margin-right: ${size.s};
`;

// @ts-expect-error
const CardTitle = styled(Subtitle)`
  display: flex;
  justify-content: center;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`;
export default WelcomeModal;
