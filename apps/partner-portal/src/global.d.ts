import type { Request } from 'express';
import type { Token } from "@lib"
declare module 'express' {
    export interface Request {
        token?: Token
    }
}