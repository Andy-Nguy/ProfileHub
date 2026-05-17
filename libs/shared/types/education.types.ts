export interface IEducation {
  id: string;
  profileId: string;
  institution: string;
  degree: string | null;
  fieldOfStudy: string | null;
  startDate: string | Date;
  endDate: string | Date | null;
  isCurrent: boolean;
  description: string | null;
  displayOrder: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}
