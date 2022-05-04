import { useRef, useEffect } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";

type CarouselCardProps = {
  img?: string;
  movie?: string;
  subtitle: string;
  description: string;
  visible: boolean;
};

const CarouselCard: React.VFC<CarouselCardProps> = ({
  img,
  movie,
  subtitle,
  description,
  visible,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (visible && videoRef.current) {
      videoRef.current.play();
    }
  }, [visible]);
  return (
    <CardContainer>
      <Body weight="medium">{subtitle}</Body>
      <Body>{description}</Body>
      {img && <ImgContainer src={`/static/img/${img}`} />}
      {movie && (
        <MovieContainer
          loop
          controls
          src={`/static/img/${movie}`}
          ref={videoRef}
        />
      )}
    </CardContainer>
  );
};

const containerStyles = css`
  height: 250px;
  width: 100%;
  margin: ${size.m} 0;
`;

const ImgContainer = styled.img`
  ${containerStyles}
`;

const MovieContainer = styled.video`
  ${containerStyles}
`;

const CardContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding-bottom: ${size.s};
  width: 500px;
  text-align: left;
`;

export default CarouselCard;
