import { useState, useEffect } from "react";
import { useAprilFoolsAnalytics } from "analytics/aprilFools/useAprilFoolsAnalytics";
import { konamiSoundTrackUrl } from "constants/externalResources";
import { useToastContext } from "context/toast";
import { cache } from "gql/GQLWrapper";
import { PatchStatus } from "types/patch";
import { TaskStatus } from "types/task";

const konamiCode =
  "ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba";

const useKonamiCode = () => {
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const dispatchToast = useToastContext();
  const { sendEvent } = useAprilFoolsAnalytics();
  const downHandler = ({ key, target }: KeyboardEvent) => {
    // Ignore key presses if the user is typing in an input
    if (target instanceof HTMLInputElement) return;
    setPressedKeys((curr) => [...curr, key]);
  };

  const playMusic = () => {
    const audio = new Audio(konamiSoundTrackUrl);
    audio.play();
  };
  // Listen to all key presses
  useEffect(() => {
    // Register event listeners
    window.addEventListener("keydown", downHandler);

    return () => {
      // Unregister event listeners
      window.removeEventListener("keydown", downHandler);
    };
  }, []);

  useEffect(() => {
    // Check if the pressed keys match the konami code
    if (pressedKeys.join("").includes(konamiCode)) {
      dispatchToast.success("To reset just refresh the page", true, {
        title: "Konami Code Activated!",
      });
      sendEvent({ name: "Triggered Konami Code" });
      setPressedKeys([]);
      const TaskKeys = Object.keys(cache.extract()).filter((key) =>
        key.includes("Task")
      );
      const VersionKeys = Object.keys(cache.extract()).filter((key) =>
        key.includes("Version")
      );
      playMusic();

      //   eslint-disable-next-line no-restricted-syntax
      for (const key of TaskKeys) {
        cache.modify({
          id: key,
          fields: {
            status: () => TaskStatus.Succeeded,
          },
          broadcast: true,
        });
      }
      //   eslint-disable-next-line no-restricted-syntax
      for (const key of VersionKeys) {
        cache.modify({
          id: key,
          fields: {
            status: () => PatchStatus.Success,
            taskStatusStats: (stats) => ({
              ...stats,
              counts: [
                {
                  count: 100,
                  status: TaskStatus.Succeeded,
                  __typename: "StatusCount",
                },
              ],
            }),
            buildVariantStats: (stats) => {
              const newStats = stats.map((stat) => ({
                ...stat,
                statusCounts: [
                  {
                    count: 100,
                    status: TaskStatus.Succeeded,
                    __typename: "StatusCount",
                  },
                ],
              }));
              return newStats;
            },
          },
          broadcast: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pressedKeys]);
};

export default useKonamiCode;
