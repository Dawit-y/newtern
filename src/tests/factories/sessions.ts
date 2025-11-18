export const ORG_SESSION = {
  session: {
    id: "s1",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "org123",
    expiresAt: new Date(),
    token: "token",
  },
  user: {
    id: "org123",
    role: "ORGANIZATION",
    name: "org",
    email: "org@gmail.com",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const INTERN_SESSION = {
  session: {
    id: "s2",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "u10",
    expiresAt: new Date(),
    token: "token",
  },
  user: {
    id: "u10",
    role: "INTERN",
    name: "int",
    email: "int@gmail.com",
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};
