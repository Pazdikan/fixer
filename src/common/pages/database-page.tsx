"use client";

import { useState, useMemo } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/common/components/ui/table";
import { CharacterMiniInfo } from "@/character/components/character-hover";
import { getCharacterById } from "@/common/lib/utils";
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

export function DatabasePage() {
  const game = useGame((state) => state);
  const [charactersPage, setCharactersPage] = useState(1);
  const [companiesPage, setCompaniesPage] = useState(1);
  const [characterSearch, setCharacterSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [characterPageInput, setCharacterPageInput] = useState("");
  const [companyPageInput, setCompanyPageInput] = useState("");
  const itemsPerPage = 100;

  const filteredCharacters = useMemo(() => {
    return game.gameState.characters.filter((character) => {
      const searchLower = characterSearch.toLowerCase();
      const fullName =
        `${character.first_name} ${character.last_name}`.toLowerCase();
      const company =
        game.gameState.companies
          .find((c) => c.employees.some((e) => e.characterID === character.id))
          ?.name.toLowerCase() || "";

      return (
        fullName.includes(searchLower) ||
        character.previous_job.toLowerCase().includes(searchLower) ||
        character.backstory.toLowerCase().includes(searchLower) ||
        company.includes(searchLower)
      );
    });
  }, [game.gameState.characters, game.gameState.companies, characterSearch]);

  const filteredCompanies = useMemo(() => {
    return game.gameState.companies.filter((company) => {
      const searchLower = companySearch.toLowerCase();
      const employeeNames = company.employees
        .map((e) => {
          const character = getCharacterById(e.characterID);
          return `${character?.first_name} ${character?.last_name}`.toLowerCase();
        })
        .join(" ");

      return (
        company.name.toLowerCase().includes(searchLower) ||
        employeeNames.includes(searchLower)
      );
    });
  }, [game.gameState.companies, companySearch, game.gameState]);

  const paginateData = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const charactersData = paginateData(filteredCharacters, charactersPage);
  const companiesData = paginateData(filteredCompanies, companiesPage);

  const renderPagination = (currentPage, setPage, totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxVisiblePages = 5;

    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    const pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
          {pageNumbers.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                onClick={() => setPage(pageNumber)}
                isActive={currentPage === pageNumber}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationLink onClick={() => setPage(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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
      </TabsList>
      <TabsContent value="characters">
        <div className="mb-4">
          <Input
            placeholder="Search characters by name, job, backstory, or company"
            value={characterSearch}
            onChange={(e) => {
              setCharacterSearch(e.currentTarget.value);
              setCharactersPage(1);
            }}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Backstory</TableHead>
              <TableHead>Company</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {charactersData.map((character, index) => {
              const company = game.gameState.companies.find((c) =>
                c.employees.some((e) => e.characterID === character.id)
              );
              return (
                <TableRow key={character.id}>
                  <TableCell>
                    {(charactersPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{`${character.first_name} ${character.last_name}${
                    character.id == game.gameState.player_id ? " (you)" : ""
                  }`}</TableCell>
                  <TableCell>{character.previous_job}</TableCell>
                  <TableCell>{character.backstory}</TableCell>
                  <TableCell>
                    {company ? <CompanyMiniInfo company={company} /> : "N/A"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Employees</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companiesData.map((company, index) => (
              <TableRow key={company.id}>
                <TableCell>
                  {(companiesPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>{company.name}</TableCell>
                <TableCell>
                  {company.employees.map((employee, i) => (
                    <CharacterMiniInfo
                      key={i}
                      character={getCharacterById(employee.characterID)!}
                    />
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {renderPagination(
          companiesPage,
          setCompaniesPage,
          filteredCompanies.length
        )}
      </TabsContent>
    </Tabs>
  );
}
