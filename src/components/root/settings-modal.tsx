import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Bolt } from "lucide-react";

export default function SettingsModal() {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Bolt />
        </DialogTrigger>
        <DialogContent>
          <h1>Settings</h1>
        </DialogContent>
      </Dialog>
    </>
  );
}
