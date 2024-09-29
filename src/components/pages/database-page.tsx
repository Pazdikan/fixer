import { useGameState } from "@/hooks/use-game-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DatabasePage() {
  const { gameState } = useGameState();

  return (
    <>
      <Tabs defaultValue="characters" className="w-full">
        <TabsList className="w-full space-x-6">
          <TabsTrigger value="characters">Characters</TabsTrigger>
        </TabsList>
        <TabsContent value="characters">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Backstory</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gameState.characters.map((character, index) => (
                <TableRow key={character.id}>
                  <TableCell>{index}</TableCell>
                  <TableCell>{`${character.first_name} ${character.last_name}${
                    character.id == gameState.player_id ? " (you)" : ""
                  }`}</TableCell>
                  <TableCell>{character.previous_job}</TableCell>
                  <TableCell>{character.backstory}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </>
  );
}
