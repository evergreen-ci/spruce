import { useEffect, useState } from "react";
import { GuideCue } from "@leafygreen-ui/guide-cue";
import Cookies from "js-cookie";

type GuideCueProps = Omit<
  React.ComponentProps<typeof GuideCue>,
  "open" | "setOpen" | "children"
>;

type FirstTimeGuideCueProps = GuideCueProps & {
  cookieName: string;
  isOpen?: boolean;
  description: string;
};
/**
 * `FirstTimeGuideCue` is a wrapper around `GuideCue` that handles the logic of
 * whether or not to show the guide cue. It uses a cookie to determine whether or not
 * to show the guide cue.
 * @param cookieName - the name of the cookie to use to determine whether or not to show the guide cue
 * @param isOpen - whether or not to show the guide cue by default
 * @param description - the description to show in the guide cue
 */
const FirstTimeGuideCue: React.FC<FirstTimeGuideCueProps> = ({
  cookieName,
  isOpen = true,
  description,
  ...props
}) => {
  const [openGuideCue, setOpenGuideCue] = useState(
    isOpen && Cookies.get(cookieName) !== "true"
  );

  useEffect(() => {
    setOpenGuideCue(isOpen && Cookies.get(cookieName) !== "true");
  }, [isOpen, cookieName]);

  const onHideCue = () => {
    Cookies.set(cookieName, "true");
    setOpenGuideCue(false);
  };
  return (
    <GuideCue
      open={openGuideCue}
      setOpen={setOpenGuideCue}
      onPrimaryButtonClick={onHideCue}
      currentStep={1}
      {...props}
    >
      {description}
    </GuideCue>
  );
};

export type { FirstTimeGuideCueProps };
export default FirstTimeGuideCue;
