"use client";

import { useState, useMemo } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/common/components/ui/card";
import { CharacterMiniInfo } from "@/character/components/character-hover";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/common/components/ui/pagination";
import { Input } from "@/common/components/ui/input";
import { CompanyMiniInfo } from "@/company/components/company-hover";
import { useGame } from "@/core/store/game-store";
import { api } from "@/api/api";
import { CharacterMenu } from "@/character/components/character-menu";
import { Badge } from "@/common/components/ui/badge";
import { Family } from "@/character/character.types";
import { Users } from "lucide-react";

export function DatabasePage() {
  const { gameState } = useGame.getState();
  const debugRevealCharacters = gameState.debug.revealCharacters;
  const debugRevealCompanies = gameState.debug.revealCompanies;
  const [charactersPage, setCharactersPage] = useState(1);
  const [companiesPage, setCompaniesPage] = useState(1);
  const [familiesPage, setFamiliesPage] = useState(1);
  const [characterSearch, setCharacterSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [familySearch, setFamilySearch] = useState("");
  const itemsPerPage = 50;

  const filteredCharacters = useMemo(() => {
    return gameState.characters.filter((character) => {
      if (
        !api.util.hasTag(character, "known:character") &&
        debugRevealCharacters != true
      ) {
        return;
      }

      const searchLower = characterSearch.toLowerCase();
      const fullName =
        `${character.first_name} ${character.last_name}`.toLowerCase();
      const company =
        gameState.companies
          .find((c) => c.employees.some((e) => e.characterID === character.id))
          ?.name.toLowerCase() || "";

      // Add family information to search
      const familyMembers = [
        ...(character.parent_ids || []),
        ...(character.child_ids || []),
        ...(character.sibling_ids || []),
      ];
      const hasFamilyMatch = familyMembers.some((id) => {
        const member = api.character.getCharacterById(id);
        if (!member) return false;
        return `${member.first_name} ${member.last_name}`.toLowerCase().includes(
          searchLower
        );
      });

      return (
        fullName.includes(searchLower) ||
        character.previous_job.toLowerCase().includes(searchLower) ||
        character.backstory.toLowerCase().includes(searchLower) ||
        company.includes(searchLower) ||
        hasFamilyMatch
      );
    });
  }, [
    gameState.characters,
    gameState.companies,
    characterSearch,
    debugRevealCharacters,
  ]);

  const filteredCompanies = useMemo(() => {
    return gameState.companies.filter((company) => {
      if (
        !api.util.hasTag(company, "known:company") &&
        debugRevealCompanies != true
      ) {
        return;
      }

      const searchLower = companySearch.toLowerCase();
      const employeeNames = company.employees
        .map((e) => {
          const character = api.character.getCharacterById(e.characterID);
          return `${character?.first_name} ${character?.last_name}`.toLowerCase();
        })
        .join(" ");

      return (
        company.name.toLowerCase().includes(searchLower) ||
        employeeNames.includes(searchLower)
      );
    });
  }, [gameState.companies, companySearch, debugRevealCompanies]);

  // Add family filtering
  const filteredFamilies = useMemo(() => {
    if (!gameState.families) return [];

    return gameState.families.filter((family) => {
      const searchLower = familySearch.toLowerCase();

      // Search by family name
      if (family.name.toLowerCase().includes(searchLower)) return true;

      // Search by family member names
      const familyMembers = [...family.parent_ids, ...family.child_ids];
      const memberNameMatch = familyMembers.some((id) => {
        const member = api.character.getCharacterById(id);
        if (!member) return false;
        return `${member.first_name} ${member.last_name}`.toLowerCase().includes(
          searchLower
        );
      });

      return memberNameMatch;
    });
  }, [gameState.families, familySearch]);

  // Process data for display with pagination
  const charactersData = useMemo(() => {
    const startIndex = (charactersPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCharacters.slice(startIndex, endIndex);
  }, [filteredCharacters, charactersPage]);

  const companiesData = useMemo(() => {
    const startIndex = (companiesPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCompanies.slice(startIndex, endIndex);
  }, [filteredCompanies, companiesPage]);

  // Add family data processing
  const familiesData = useMemo(() => {
    const startIndex = (familiesPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredFamilies.slice(startIndex, endIndex);
  }, [filteredFamilies, familiesPage]);

  const renderPagination = (
    currentPage: number,
    setPage: (page: number) => void,
    totalItems: number
  ) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentPageNumber = currentPage;

    if (totalPages <= 1) {
      return null;
    }

    // Calculate page numbers to show
    let startPage = Math.max(1, currentPageNumber - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
              </PaginationItem>
              {startPage > 2 && <PaginationEllipsis />}
            </>
          )}
          {Array.from({ length: endPage - startPage + 1 }).map((_, i) => (
            <PaginationItem key={startPage + i}>
              <PaginationLink
                onClick={() => setPage(startPage + i)}
                isActive={currentPage === startPage + i}
              >
                {startPage + i}
              </PaginationLink>
            </PaginationItem>
          ))}
          {endPage < totalPages - 1 && <PaginationEllipsis />}
          {endPage < totalPages && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <Tabs defaultValue="characters" className="w-full">
      <TabsList className="w-full space-x-6">
        <TabsTrigger value="characters">Characters</TabsTrigger>
        <TabsTrigger value="companies">Companies</TabsTrigger>
        <TabsTrigger value="families">Families</TabsTrigger>
      </TabsList>
      <TabsContent value="characters">
        <div className="mb-4">
          <Input
            placeholder="Search characters by name, job, backstory, company, or family members"
            value={characterSearch}
            onChange={(e) => {
              setCharacterSearch(e.currentTarget.value);
              setCharactersPage(1);
            }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {charactersData.map((character, index) => {
            const company = gameState.companies.find((c) =>
              c.employees.some((e) => e.characterID === character.id)
            );

            const spouse =
              character.spouse_id !== undefined
                ? api.character.getCharacterById(character.spouse_id)
                : undefined;

            const hasFamily =
              character.spouse_id !== undefined ||
              (character.parent_ids && character.parent_ids.length > 0) ||
              (character.child_ids && character.child_ids.length > 0) ||
              (character.sibling_ids && character.sibling_ids.length > 0);

            return (
              <Card key={character.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {`${character.first_name} ${character.last_name}${
                        character.id == gameState.player_id ? " (you)" : ""
                      }`}
                      {character.bornAt && (
                        <span className="text-sm font-normal ml-2 text-muted-foreground">
                          {Math.floor(((gameState.world.time || 0) - character.bornAt) / (365 * 24 * 60 * 60 * 1000))} years old
                        </span>
                      )}
                    </CardTitle>
                    <CharacterMenu character={character} />
                  </div>
                  <CardDescription>{character.previous_job}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Family Status */}
                  {hasFamily && (
                    <div className="mb-2">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 mb-1"
                      >
                        <Users className="h-3 w-3" />
                        Family Member
                      </Badge>
                      {spouse && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Spouse: </span>
                          <CharacterMiniInfo character={spouse} />
                        </div>
                      )}
                      {character.child_ids && character.child_ids.length > 0 && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">
                            {character.child_ids.length === 1
                              ? "Child: "
                              : "Children: "}
                          </span>
                          <span className="text-muted-foreground">
                            {character.child_ids.length}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Company */}
                  <div className="mt-2">
                    <span className="text-sm font-medium">Company: </span>
                    {company ? <CompanyMiniInfo company={company} /> : "N/A"}
                  </div>

                  {/* Traits */}
                  <div className="mt-2">
                    {character.traits?.map((trait, i) => (
                      <div key={i} className="text-sm">
                        {trait.description}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {renderPagination(
          charactersPage,
          setCharactersPage,
          filteredCharacters.length
        )}
      </TabsContent>
      <TabsContent value="companies">
        <div className="mb-4">
          <Input
            placeholder="Search companies by name or employee names"
            value={companySearch}
            onChange={(e) => {
              setCompanySearch(e.currentTarget.value);
              setCompaniesPage(1);
            }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companiesData.map((company, index) => (
            <Card key={company.id}>
              <CardHeader>
                <CardTitle>{company.name}</CardTitle>
                <CardDescription>{company.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {company.employees.map((employee, i) => (
                    <CharacterMiniInfo
                      key={i}
                      character={
                        api.character.getCharacterById(employee.characterID)!
                      }
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {renderPagination(
          companiesPage,
          setCompaniesPage,
          filteredCompanies.length
        )}
      </TabsContent>

      {/* New Families Tab */}
      <TabsContent value="families">
        <div className="mb-4">
          <Input
            placeholder="Search families by name or family member"
            value={familySearch}
            onChange={(e) => {
              setFamilySearch(e.currentTarget.value);
              setFamiliesPage(1);
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {familiesData.map((family) => {
            const parents = family.parent_ids
              .map((id) => api.character.getCharacterById(id))
              .filter(Boolean);

            const children = family.child_ids
              .map((id) => api.character.getCharacterById(id))
              .filter(Boolean);

            return (
              <Card key={family.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    The {family.name} Family
                  </CardTitle>
                  <CardDescription>
                    {family.backstory} •{" "}
                    {parents.length + children.length} members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {parents.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold mb-1">Parents:</h4>
                      <div className="space-y-1">
                        {parents.map((parent) => (
                          <div
                            key={parent.id}
                            className="flex justify-between items-center"
                          >
                            <CharacterMiniInfo character={parent} />
                            <span className="text-xs text-muted-foreground">
                              {parent?.bornAt ? Math.floor(((gameState.world.time || 0) - parent.bornAt) / (365 * 24 * 60 * 60 * 1000)) : 0} years old
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {children.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Children:</h4>
                      <div className="space-y-1">
                        {children.map((child) => (
                          <div
                            key={child.id}
                            className="flex justify-between items-center"
                          >
                            <CharacterMiniInfo character={child} />
                            <span className="text-xs text-muted-foreground">
                              {child?.bornAt ? Math.floor(((gameState.world.time || 0) - child.bornAt) / (365 * 24 * 60 * 60 * 1000)) : 0} years old
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {renderPagination(
          familiesPage,
          setFamiliesPage,
          filteredFamilies.length
        )}
      </TabsContent>
    </Tabs>
  );
}
