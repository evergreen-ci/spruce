import { useEffect } from "react";
import Cookies from "js-cookie";
import { toastData } from "constants/announcementToast";
import { useToastContext } from "context/toast";

const setClosedCookie = (message: string, expires: number = 7) => {
  Cookies.set(message, "closed", { expires });
};

export const useAnnouncementToast = () => {
  const dispatchToast = useToastContext();

  useEffect(() => {
    if (!toastData) {
      return;
    }

    const { closable, expires, message, title, variant } = toastData;
    if (message !== "" && Cookies.get(message) === undefined) {
      dispatchToast[variant](
        message,
        closable,
        () => setClosedCookie(message, expires),
        title
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};
