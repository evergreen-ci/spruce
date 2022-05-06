import { useRef, useEffect } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Body, Subtitle } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { OneOf } from "types/utils";
import { ImageCardType, VideoCardType } from "./types";

interface CarouselCardProps {
  card: OneOf<ImageCardType, VideoCardType>;
  visible: boolean;
}

const CarouselCard: React.VFC<CarouselCardProps> = ({ card, visible }) => {
  const { img, video, subtitle, title, description } = card;

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (visible && videoRef.current) {
      videoRef.current.play();
    }
  }, [visible]);
  return (
    <CardContainer>
      {title && <Subtitle>{title}</Subtitle>}
      {subtitle && <Body weight="medium">{subtitle}</Body>}
      <Body>{description}</Body>
      {img && <ImgContainer src={`/static/img/${img}`} />}
      {video && (
        <VideoContainer
          loop
          controls
          src={`/static/img/${video}`}
          ref={videoRef}
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
  width: 800px;
`;

export default CarouselCard;
