import { useState } from "react";
import { GuideCue } from "@leafygreen-ui/guide-cue";
import Cookies from "js-cookie";

type GuideCueProps = Omit<
  React.ComponentProps<typeof GuideCue>,
  "open" | "setOpen" | "children"
>;

type FirstTimeGuideCueProps = GuideCueProps & {
  cookieName: string;
  defaultOpen?: boolean;
  description: string;
};

const FirstTimeGuideCue: React.FC<FirstTimeGuideCueProps> = ({
  cookieName,
  defaultOpen,
  description,
  ...props
}) => {
  const [openGuideCue, setOpenGuideCue] = useState(
    defaultOpen || !Cookies.get(cookieName)
  );
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
