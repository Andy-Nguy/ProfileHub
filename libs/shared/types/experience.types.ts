export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
  VOLUNTEER = 'volunteer',
}

export interface ICompany {
  id: string;
  name: string;
  domain: string | null;
  logoUrl: string | null;
  createdAt: string | Date;
}

export interface IExperience {
  id: string;
  profileId: string;
  companyId?: string | null;
  title: string;
  company: string;
  companyDetails?: ICompany | null;
  location: string | null;
  employmentType: EmploymentType;
  startDate: string | Date;
  endDate: string | Date | null;
  isCurrent: boolean;
  description: string | null;
  displayOrder: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}
