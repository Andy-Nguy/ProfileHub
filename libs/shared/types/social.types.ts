export enum SocialPlatform {
  GITHUB = 'github',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  DRIBBBLE = 'dribbble',
  PERSONAL = 'personal',
}

export interface ISocialLink {
  id: string;
  profileId: string;
  platform: string | SocialPlatform;
  url: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
