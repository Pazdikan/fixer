import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function CharacterCreator() {
  const personalityTraits = [
    { name: "Peaceful - Aggressive", min: -10, max: 10 },
    { name: "Introverted - Extroverted", min: -10, max: 10 },
    { name: "Analytical - Intuitive", min: -10, max: 10 },
    { name: "Cautious - Reckless", min: -10, max: 10 },
    { name: "Loyal - Opportunistic", min: -10, max: 10 },
  ]

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-3xl">
      <h1 className="text-4xl font-bold text-center mb-8">Character Creator</h1>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="Enter first name" />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Enter last name" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Background</h2>
        <div>
          <Label htmlFor="backstory">Backstory</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select your backstory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="street-kid">Street Kid</SelectItem>
              <SelectItem value="corpo-rat">Corpo Rat</SelectItem>
              <SelectItem value="nomad">Nomad</SelectItem>
              <SelectItem value="ex-military">Ex-Military</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="previousJob">Previous Job</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select your previous job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unemployed">Unemploted</SelectItem>
              <SelectItem value="hacker">Hacker</SelectItem>
              <SelectItem value="mercenary">Mercenary</SelectItem>
              <SelectItem value="corporate-spy">Corporate Spy</SelectItem>
              <SelectItem value="street-doc">Street Doc</SelectItem>
              <SelectItem value="pd">Police officer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Personality Traits</h2>
        {personalityTraits.map((trait, index) => (
          <div key={index} className="space-y-2">
            <Label>{trait.name}</Label>
            <Slider
              defaultValue={[0]}
              max={trait.max}
              min={trait.min}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{trait.name.split(" - ")[0]}</span>
              <span>{trait.name.split(" - ")[1]}</span>
            </div>
          </div>
        ))}
      </div>

      <Button className="w-full">Create Character</Button>
    </div>
  )
}