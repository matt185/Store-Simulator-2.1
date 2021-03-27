export const __prod__ = process.env.NODE_ENV === "production";
export const FORGET_PASSWORD_PREFIX = process.env.FORGET_PASSWORD_PREFIX!
export const COOKIE_NAME = process.env.COOKIE_NAME!
export const REDIS_SECRET = process.env.REDIS_SECRET!
export const globalAuth = ["master"];
export const partialAuth = ["master", "admin"];
