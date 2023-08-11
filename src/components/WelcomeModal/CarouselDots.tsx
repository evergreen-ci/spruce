import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";
import { CardType } from "./types";

const { gray, green } = palette;

interface CarouselDotProps {
  cards: CardType[];
  activeSlide: number;
  onClick: (slide: number) => void;
}

const CarouselDots: React.FC<CarouselDotProps> = ({
  activeSlide,
  cards,
  onClick,
}) => (
  <DotContainer>
    {cards.map((card, index) => (
      <Dot
        key={`dot_${card.description}`}
        data-cy={`carousel-dot-${index}`}
        active={activeSlide === index}
        onClick={() => onClick(index)}
        role="button"
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
