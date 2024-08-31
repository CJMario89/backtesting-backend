export type UserProfile = {
  id: string;
  googleId: string;
  email: string;
  displayName: string;
  givenName: string;
  familyName: string;
  photo: string;
  provider: string;
  accessToken: string;
  refreshToken?: string;
};

export type UserFromJwt = {
  id: string;
  email: string;
  name: string;
};

export type RequestWithUser = Request & {
  user: UserProfile;
};

export type RequestWithJwt = Request & {
  user: UserFromJwt;
};
