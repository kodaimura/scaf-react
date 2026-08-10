export const ROUTES = {
  dashboard: "/dashboard",
  forgotPassword: "/forgot-password",
  home: "/",
  login: "/login",
  resetPassword: "/reset-password",
  signup: "/signup",
} as const;

export const PUBLIC_ROUTE_PATHS = [
  ROUTES.login,
  ROUTES.signup,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
] as const;

export const isPublicRoutePath = (pathname: string) =>
  PUBLIC_ROUTE_PATHS.some((path) => path === pathname);
