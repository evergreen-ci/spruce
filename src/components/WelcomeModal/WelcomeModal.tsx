import { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { ClassNames } from "@emotion/react";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import Modal from "@leafygreen-ui/modal";
import { Subtitle } from "@leafygreen-ui/typography";
import { Carousel } from "antd";
import { CarouselRef } from "antd/es/carousel";
import { StyledLink as Link } from "components/styles";
import { size, zIndex } from "constants/tokens";
import {
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables,
  UseSpruceOptionsInput,
} from "gql/generated/types";
import { UPDATE_USER_SETTINGS } from "gql/mutations";
import { errorReporting } from "utils";
import CarouselCard from "./CarouselCard";
import CarouselDots from "./CarouselDots";
import { CardType } from "./types";

const { reportError } = errorReporting;

interface WelcomeModalProps {
  param: keyof UseSpruceOptionsInput;
  title?: string;
  carouselCards: CardType[];
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

  const handleCarouselChange = (index: number) => {
    setActiveSlide(index);
    slider.current?.goTo(index);
  };
  return (
    <ClassNames>
      {({ css }) => (
        <Modal
          setOpen={handleClosed}
          open={visible}
          data-cy="welcome-modal"
          className={css`
            z-index: ${zIndex.max_do_not_use};
          `}
          size="large"
        >
          {/* @ts-expect-error */}
          {title && <CardTitle>{title}</CardTitle>}
          <Carousel
            dots={false}
            ref={slider}
            lazyLoad="ondemand"
            draggable
            infinite={false}
            afterChange={(index) => setActiveSlide(index)}
          >
            {carouselCards.map((card, index) => (
              <CarouselCard
                key={`card_${card.subtitle}`}
                card={{ ...card }}
                visible={activeSlide === index}
              />
            ))}
          </Carousel>
          <Footer>
            <CarouselDots
              activeSlide={activeSlide}
              cards={carouselCards}
              onClick={handleCarouselChange}
            />
            <div>
              {carouselCards[activeSlide].href && (
                <StyledLink
                  href={carouselCards[activeSlide].href}
                  target="__blank"
                >
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
      )}
    </ClassNames>
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
