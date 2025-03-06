export interface Company {
  tags: string[];
  id: number;
  name: string;
  employees: Employee[];
}

export interface Employee {
  tags: string[];
  characterID: number;
  position: CompanyPosition;
}

export enum CompanyPosition {
  OWNER,
  EMPLOYEE,
}
