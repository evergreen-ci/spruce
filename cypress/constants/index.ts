export const EVG_BASE_URL = "http://localhost:9090";
export const GQL_URL = `${EVG_BASE_URL}/graphql/query`;

/**
 * Defines user credentials that can be used to log in to the application.
 * - admin: A user who has admin permissions and is a superuser.
 * - privileged: A user who has admin permissions, but is not a superuser.
 * - regular: A user who has no admin permissions.
 */
export const users = {
  admin: { username: "admin", password: "password" },
  privileged: { username: "privileged", password: "password" },
  regular: { username: "regular", password: "password" },
};
