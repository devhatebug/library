import { Request } from "express";
import { TokenPayload } from "./token-payload";
declare global {
    namespace Express {
        export interface Request {
            user?: TokenPayload;
        }
    }
}
