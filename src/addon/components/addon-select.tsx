import { useState } from "react";
import { Addon, addonManager, Flags } from "@/addon/addon";
import { Card } from "@/common/components/ui/card";
import { Switch } from "@/common/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/common/components/ui/collapsible";
import { Button } from "@/common/components/ui/button";
import { ChevronDown, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/common/components/ui/dialog";
import { useTranslation } from "react-i18next";

export function AddonSelect() {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(true);
  const [enabledAddons, setEnabledAddons] = useState<Set<string>>(
    new Set(addonManager.getEnabledAddons().map((addon) => addon.id))
  );

  const handleToggleAddon = (addon: Addon) => {
    if (addon.flags.includes(Flags.CORE)) return;

    const newEnabledAddons = new Set(enabledAddons);
    if (newEnabledAddons.has(addon.id)) {
      newEnabledAddons.delete(addon.id);
      addonManager.disable(addon.id);
    } else {
      newEnabledAddons.add(addon.id);
      addonManager.enable(addon.id);
    }
    setEnabledAddons(newEnabledAddons);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            {t("addon.list-title")} <AddAddonModal />
          </h2>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
            <span className="sr-only">{t("addon.toggle")}</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-4">
        {addonManager.getRegisteredAddons().map((addon) => (
          <Card key={addon.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{addon.name}</h3>
                <p className="text-sm text-gray-500">{addon.description}</p>
                <p className="text-xs text-gray-400">
                  Version: {addon.version}{" "}
                  {addon.author ? `by ${addon.author}` : ""}
                </p>
              </div>
              <Switch
                checked={enabledAddons.has(addon.id)}
                onCheckedChange={() => handleToggleAddon(addon)}
                disabled={addon.flags.includes(Flags.CORE)}
              />
            </div>
          </Card>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function AddAddonModal() {
  const { t } = useTranslation();

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button variant="outline" size="icon">
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <h1 className="poppins-bold">{t("addon.add")}</h1>

          <p>{t("addon.coming-soon")}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
