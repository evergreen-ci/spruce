import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Button } from "components/Button";
import { Modal } from "components/Modal";
import { StyledLink } from "components/styles";
import { useToastContext } from "context/toast";

const START_PRANK = new Date("April 1, 2021 11:00:00");
const END_PRANK = new Date("April 2, 2021 00:00:00");
const COOKIE_NAME = "PRANK_EXPERIENCED";

export const Prank = () => {
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const { info } = useToastContext();
  const now = new Date();
  const isTodayAprilFoolsDay = now >= START_PRANK && now < END_PRANK;
  const prankExperienced = Boolean(Cookies.get(COOKIE_NAME));
  const shouldRunPrank = !prankExperienced && isTodayAprilFoolsDay;

  useEffect(() => {
    if (shouldRunPrank) {
      setTimeout(
        () =>
          info(
            <>
              <StyledLink
                onClick={() => {
                  //   Cookies.set(COOKIE_NAME, "true");
                  setIsVisibleModal(true);
                }}
              >
                Click here
              </StyledLink>{" "}
              to learn more
            </>,
            true,
            "Earn bonusly for green patch builds!"
          ),
        1000
      );
    }
  }, [shouldRunPrank]); // eslint-disable-line react-hooks/exhaustive-deps
  const hideModal = () => setIsVisibleModal(false);
  return (
    <Modal
      visible={isVisibleModal}
      onCancel={hideModal}
      title=""
      footer={[
        <Button variant="primary" onClick={hideModal}>
          Bye!
        </Button>,
      ]}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 24,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            height: 0,
            paddingBottom: "56%",
            position: "relative",
          }}
        >
          <iframe
            title="Evergreen ship"
            src="https://giphy.com/embed/utv08mo255WRN8AK6k"
            width="100%"
            height="100%"
            style={{ position: "absolute" }}
            frameBorder={0}
          />
        </div>
      </div>
      <div style={{ textAlign: "center", position: "relative", top: 24 }}>
        <h1>🚢 We got you! Happy April Fool’s Day! 🚢</h1>
      </div>
    </Modal>
  );
};
