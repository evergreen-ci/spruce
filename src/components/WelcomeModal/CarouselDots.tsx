import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { CarouselRef } from "antd/es/carousel";
import { size } from "constants/tokens";

const { gray, green } = uiColors;

interface CarouselDotProps {
  activeSlide: number;
  total: number;
  slider: React.MutableRefObject<CarouselRef>;
}

const CarouselDots: React.VFC<CarouselDotProps> = ({
  activeSlide,
  total,
  slider,
}) => (
  <DotContainer>
    {Array.from({ length: total }).map((val, index) => (
      <Dot
        // eslint-disable-next-line react/no-array-index-key
        key={`dot_${index}`}
        active={activeSlide === index}
        onClick={() => slider.current.goTo(index)}
      />
    ))}
  </DotContainer>
);

interface DotProps {
  active: boolean;
}
const Dot = styled.div`
  height: 10px;
  width: 10px;
  background-color: ${(props: DotProps): string =>
    props.active ? green.base : gray.light2};
  border-radius: 50%;
  margin-left: ${size.xs};
  margin-right: ${size.xs};
  :hover {
    cursor: pointer;
  }
`;

const DotContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export default CarouselDots;
