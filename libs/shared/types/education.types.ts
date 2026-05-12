export interface IEducation {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string | Date;
  endDate: string | Date | null;
  isCurrent: boolean;
  description: string | null;
  createdAt: string | Date;
}
