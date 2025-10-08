import { useEffect } from "react";
import Mousetrap from "mousetrap";

interface KeybindType {
  key: string;
  execute: () => void;
}

/**
 * Custom hook for registering global keyboard shortcuts using Mousetrap.
 */
const useGlobalKeybindings = () => {
  const keybinds: KeybindType[] = [
    {
      key: "2+1+3+7",
      execute: () => {
        console.log("debug toggle");
      },
    },
  ];

  useEffect(() => {
    keybinds.forEach((kb) => {
      Mousetrap.bind(kb.key, kb.execute);
    });

    return () => {
      keybinds.forEach((kb) => {
        Mousetrap.unbind(kb.key);
      });
    };
  }, []);
};

export default useGlobalKeybindings;
