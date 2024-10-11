export type AccessTokenClaims = {
  id: string;
  role: UserRole;
  name: string;
};

export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export type VerifyTokenClaims = {
  id: string;
};
