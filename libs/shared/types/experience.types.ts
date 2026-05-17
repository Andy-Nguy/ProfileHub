export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
  VOLUNTEER = 'volunteer',
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
  description: string | null;
  displayOrder: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}
