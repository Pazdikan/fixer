import { useEffect, useState } from "react";
import { addonManager } from "@/addon/addon";

export function useAddonEnabled(addonId: string) {
  const [enabled, setEnabled] = useState<boolean>(
    addonManager.isEnabled(addonId)
  );

  useEffect(() => {
    const unsub = addonManager.subscribe(() => {
      setEnabled(addonManager.isEnabled(addonId));
    });

    return () => unsub();
  }, [addonId]);

  return enabled;
}
