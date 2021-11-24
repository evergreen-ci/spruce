import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AD_BLOCKER_DISMISSED } from "constants/cookies";
import { useToastContext } from "context/toast";
import { environmentalVariables } from "utils";
import { get } from "utils/request";

const { isProduction } = environmentalVariables;
// This url is what newrelic downloads to support analytics it gets blocked by adblockers
const AD_URL = "https://js-agent.newrelic.com/nr-spa-1158.min.js";

/** useAdBlockDetection is a hook that detects if a user has an adblocker enabled. It checks this by trying to download
 * a file from a url that is blocked by adblockers. If the file is not downloaded, the user has an adblocker enabled.
 */
export const useAdBlockDetection = () => {
  const [isAdBlockEnabled, setIsAdBlockEnabled] = useState(false);
  const dispatchToast = useToastContext();

  const fetchAdData = async () => {
    // Try to fetch the new relic url and see if the request is blocked
    const result = await get(AD_URL, {
      sameDomain: false,
      onFailure: () => {
        setIsAdBlockEnabled(true);
      },
    });
    if (result) {
      setIsAdBlockEnabled(false);
    }
  };
  useEffect(() => {
    const shouldCheckIfAdBlockIsEnabled =
      Cookies.get(AD_BLOCKER_DISMISSED) !== "true";
    if (isProduction() && shouldCheckIfAdBlockIsEnabled) {
      fetchAdData();
    }
  }, []);
  useEffect(() => {
    if (isAdBlockEnabled) {
      dispatchToast.info(
        "Would you consider disabling it for Spruce? Adblock prevents our analytics and error reporting services from notifying us. We use the data collected from these services to help guide our decisions so we can provide you with a better experience. ",
        true,
        {
          title: "We noticed you have Adblock enabled",
          onClose: () => {
            Cookies.set(AD_BLOCKER_DISMISSED, "true", { expires: 365 });
          },
        }
      );
    }
  }, [isAdBlockEnabled]); // eslint-disable-line react-hooks/exhaustive-deps
};
