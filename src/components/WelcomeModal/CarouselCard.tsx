import { useRef, useEffect } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  Body,
  BodyProps,
  Subtitle,
  SubtitleProps,
} from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { CardType } from "./types";

interface CarouselCardProps {
  card: CardType;
  visible: boolean;
}

const CarouselCard: React.FC<CarouselCardProps> = ({ card, visible }) => {
  const { alt, description, img, subtitle, title, video } = card;
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (visible && videoRef.current) {
      const playPromise = videoRef.current.play();
      // https://developer.chrome.com/blog/play-request-was-interrupted/
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name === "NotAllowedError") {
            // User blocked autoplay.
          }
        });
      }
    }
  }, [visible]);
  return (
    <CardContainer>
      {title && <StyledTitle>{title}</StyledTitle>}
      {subtitle && <StyledBody weight="medium">{subtitle}</StyledBody>}
      <Body>{description}</Body>
      {img && (
        <ImgContainer
          src={`/static/img/${img}`}
          alt={alt}
          data-cy="carousel-image"
        />
      )}
      {video && (
        <VideoContainer
          loop
          controls
          src={`/static/img/${video}`}
          ref={videoRef}
          data-cy="carousel-video"
        />
      )}
    </CardContainer>
  );
};

const containerStyles = css`
  width: 80%;
  margin: ${size.m} 0;
`;

const ImgContainer = styled.img`
  ${containerStyles}
`;

const VideoContainer = styled.video`
  ${containerStyles}
`;

const CardContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding-bottom: ${size.s};
  text-align: left;
  user-select: none;
  cursor: default;
`;

const StyledBody = styled(Body)<BodyProps>`
  margin-bottom: ${size.s};
`;

const StyledTitle = styled(Subtitle)<SubtitleProps>`
  margin-bottom: ${size.s};
`;

export default CarouselCard;
