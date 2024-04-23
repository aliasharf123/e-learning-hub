import type { NextFunction, Request, Response } from 'express';

/* The `export {};` statement is used to indicate that the file is a module and exports nothing. It is
often used in TypeScript files that only contain type declarations or interfaces, without any actual
code or exports. This statement ensures that the file is treated as a module and not as a script. */
export {};

declare global {
  namespace Express {
    export interface Request {
      realIp?: string;
      idx?: string;
      ip: string;
      i18nLang?: string;
      ips: string[];
    }
  }

  // Using this allows is to quickly switch between express and fastify and others
  export type NestifyRequest = Request;
  export type NestifyResponse = Response;
  export type NestifyNextFunction = NextFunction;
}
