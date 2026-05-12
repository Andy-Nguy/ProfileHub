export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
}

export interface IExperience {
  id: string;
  profileId: string;
  title: string;
  company: string;
  location: string | null;
  employmentType: EmploymentType;
  startDate: string | Date;
  endDate: string | Date | null;
  isCurrent: boolean;
  description: string;
  createdAt: string | Date;
}
