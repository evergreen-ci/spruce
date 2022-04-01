import { useState } from "react";
import styled from "@emotion/styled";
import Cookies from "js-cookie";
import { DisplayModal } from "components/DisplayModal";
import { StyledRouterLink } from "components/styles";
import { APRIL_FOOLS } from "constants/cookies";
import { routes } from "constants/routes";
import { Logo } from "./Logo";

const AprilFoolsModal = () => {
  const [open, setOpen] = useState(!Cookies.get(APRIL_FOOLS));
  const onClose = () => {
    Cookies.set(APRIL_FOOLS, "true", { expires: 365 });
    setOpen(false);
  };
  return (
    <StyledDisplayModal
      title="Introducing the Evergreen NFT platform!"
      open={open}
      setOpen={onClose}
      darkMode
      wrapper={(c) => <Wrapper>{c}</Wrapper>}
    >
      <Logo />
      <b>
        Evergreen will become the next generation decentralized Metaverse NFT
        ecosystem platform for Engineers, Release Managers and Developers.{" "}
        <StyledRouterLink onClick={onClose} to={routes.aprilFools}>
          Learn More!
        </StyledRouterLink>
      </b>
    </StyledDisplayModal>
  );
};

const StyledDisplayModal = styled(DisplayModal)`
  color: white;
  h3 {
    color: white;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export { Logo };
export default AprilFoolsModal;
