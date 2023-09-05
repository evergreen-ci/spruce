import {
  unstable_BlockerFunction as BlockerFunction,
  unstable_useBlocker as useBlocker,
} from "react-router-dom";
import { DistroQuery } from "gql/generated/types";
import { SaveModal } from "../../SaveModal";
import { WritableDistroSettingsTabs } from "../types";

type UnsavedModalProps = {
  distro: DistroQuery["distro"];
  shouldBlock: boolean | BlockerFunction;
};

export const UnsavedModal: React.FC<UnsavedModalProps> = ({
  distro,
  shouldBlock,
}) => {
  const blocker = useBlocker(shouldBlock);

  return (
    blocker.state === "blocked" && (
      <SaveModal
        additionalText="Because you have modified the distro provider, your changes must be saved before navigating to a new page."
        distro={distro}
        open
        onCancel={() => blocker.reset?.()}
        onConfirm={() => blocker.proceed?.()}
        setOpen={() => {}}
        tab={WritableDistroSettingsTabs.Provider}
      />
    )
  );
};
