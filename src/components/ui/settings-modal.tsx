import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Bolt } from "lucide-react"


export default function SettingsModal() {
    return (
        <>
            <Dialog>
                <DialogTrigger>
                    <button className="p-2 hover:bg-gray-200 rounded-full">
                        <Bolt />
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <h1>Settings</h1>
                </DialogContent>
            </Dialog>
        </>
    )
}