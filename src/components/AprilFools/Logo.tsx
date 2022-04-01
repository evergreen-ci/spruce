import styled from "@emotion/styled";
import LOGO from "./evg-logo-nft.svg";

export const Logo = () => <StyledImg src={LOGO} alt="Evergreen NFT Logo" />;

const StyledImg = styled.img`
  width: 100%;
`;
