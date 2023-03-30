/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import MarketingModal from "@leafygreen-ui/marketing-modal";
import { InlineKeyCode } from "@leafygreen-ui/typography";
import Cookies from "js-cookie";
import { SEEN_KONAMI_CODE } from "constants/cookies";
import { zIndex } from "constants/tokens";
import useKonamiCode from ".";
import evergreenKonami from "./EvergreenKonami.png";
import streetfighterTree from "./StreetFighterTree.png";

const KonamiModal = () => {
  const [open, setOpen] = useState(false);
  const [graphic, setGraphic] = useState(evergreenKonami);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setOpen(Cookies.get(SEEN_KONAMI_CODE) !== "true");
    }, 2000);
  }, []);
  useKonamiCode(() => {
    setGraphic(streetfighterTree);
    audioRef.current?.play();
  });

  const handleClose = () => {
    setOpen(false);
    Cookies.set(SEEN_KONAMI_CODE, "true", { expires: 5 });
  };

  const keys = ["↑", "↑", "↓", "↓", "←", "→", "←", "→", "b", "a"];
  return (
    <>
      <MarketingModal
        buttonText="Dismiss"
        closeIconColor="default"
        graphicStyle="center"
        open={open}
        size="default"
        title="New Evergreen Feature!"
        graphic={
          <img
            src={graphic}
            alt="Evergreen Konami Code"
            css={css`
              max-height: 600px;
            `}
          />
        }
        linkText=""
        onButtonClick={handleClose}
        onClose={handleClose}
        css={css`
          z-index: ${zIndex.modal};
        `}
      >
        <div>
          Tired of looking at all of these failures? Try the Konami Code!
        </div>
        <div>
          {keys.map((key) => (
            <>
              <InlineKeyCode key={key}>{key.toUpperCase()}</InlineKeyCode>{" "}
            </>
          ))}
        </div>
      </MarketingModal>
      <audio
        src="https://www.myinstants.com/media/sounds/mvssf-win.mp3"
        ref={audioRef}
      />
    </>
  );
};

export default KonamiModal;
