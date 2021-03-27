declare namespace NodeJS {
  export interface ProcessEnv {
    DB_NAME: string;
    DB_USER: string;
    DB_PSW: string;
    COOKIE_NAME: string;
    FORGET_PASSWORD_PREFIX: string;
    REDIS_SECRET: string;
  }
}
