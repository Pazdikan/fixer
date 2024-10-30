export interface Company {
  id: number;
  name: string;
  employees: Employee[];
}

export interface Employee {
  characterID: number;
  position: CompanyPosition;
}

export enum CompanyPosition {
  OWNER,
  EMPLOYEE,
}
