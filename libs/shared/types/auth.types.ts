export interface ILoginDto {
  email: string;
  password: string;
}

export interface IRegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface IVerifyEmailDto {
  email: string;
  code: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: string;
  displayName?: string;
}

export interface AuthSession {
  accessToken?: string;
  user: AuthUser;
}
