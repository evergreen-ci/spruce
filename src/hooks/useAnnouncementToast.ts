import { useEffect } from "react";
import { toastData } from "constants/announcementToast";
import { ANNOUNCEMENT_TOAST } from "constants/cookies";
import { useToastContext } from "context/toast";
import Cookies from "js-cookie";

const setClosedCookie = (message: string, expires: number = 7) => {
  Cookies.set(ANNOUNCEMENT_TOAST, message, { expires });
};

export const useAnnouncementToast = () => {
  const dispatchToast = useToastContext();

  useEffect(() => {
    if (!toastData) {
      return;
    }

    const { closable, expires, message, title, variant } = toastData;
    if (message !== "" && Cookies.get(ANNOUNCEMENT_TOAST) !== message) {
      dispatchToast[variant](message, closable, {
        onClose: () => setClosedCookie(message, expires),
        shouldTimeout: false,
        title,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};
