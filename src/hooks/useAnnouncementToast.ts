import { useEffect } from "react";
import Cookies from "js-cookie";
import { toastData } from "constants/announcementToast";
import { ANNOUNCEMENT_TOAST } from "constants/cookies";
import { useToastContext } from "context/toast";

const setClosedCookie = (message: string, expires: number = 7) => {
  Cookies.set(ANNOUNCEMENT_TOAST, message, { expires });
};

export const useAnnouncementToast = () => {
  const dispatchToast = useToastContext();

  useEffect(() => {
    if (!toastData) {
      return;
    }

    const { closable, expires, message, progress, title, variant } = toastData;
    if (message !== "" && Cookies.get(ANNOUNCEMENT_TOAST) !== message) {
      if (variant === "progress") {
        dispatchToast[variant](message, progress, closable, {
          onClose: () => setClosedCookie(message, expires),
          shouldTimeout: false,
          title,
        });
      } else {
        dispatchToast[variant](message, closable, {
          onClose: () => setClosedCookie(message, expires),
          shouldTimeout: false,
          title,
        });
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};
