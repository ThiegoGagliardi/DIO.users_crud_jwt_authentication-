import { NextFunction, Response, Request} from "express";
import { StatusCodes } from "http-status-codes";
import DatabaseError from "../models/database.error.model";
import tokenExpirationError from "../models/token.expiration.error.model";

function errorHanddler(error: any, req: Request, resp: Response, next: NextFunction)
{
    if (error instanceof DatabaseError) {

        resp.sendStatus(StatusCodes.BAD_REQUEST);
    } else if (error instanceof tokenExpirationError){
        resp.sendStatus(StatusCodes.UNAUTHORIZED);
    } else {
        resp.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export default errorHanddler;