import { Router, Request,Response, NextFunction } from "express";
import JWT, { SignOptions } from 'jsonwebtoken';
import { StatusCodes } from "http-status-codes";
import forbidenError from "../models/forbiden.error.model";
import basicAuthenticationMiddleware from '../middlewares/basic-authenctication.middlewares';

const autorizationRoute = Router();

autorizationRoute.post('/token/validate',async(req: Request, res :Response, next: NextFunction) => {
    res.status(StatusCodes.OK);
});

autorizationRoute.post('/token/refresh',async(req: Request, res :Response, next: NextFunction) => {

    try{

        const user  = req.user;

        const jwt = getjwtValid(user);

        res.status(StatusCodes.OK).json({token:jwt});
        
    }catch(error){
        next(error);
    }       
});

autorizationRoute.post('/token',basicAuthenticationMiddleware,async(req: Request, res :Response, next: NextFunction) => {
    try{
        
        
     const user  = req.user;

     if (!user){
        throw new forbidenError('Usuário ou senha inválidos');         
    }

    const jwt = getjwtValid(user);

     res.status(StatusCodes.OK).json({token:jwt});

    }catch (error){
         next(error);
    }
})

function getjwtValid(user : any)
{
   const jwtPayLoad = {userName: user.userName};
   const jwtOptions: SignOptions = {subject: user?.uuid, expiresIn: '15m'};
   const secretKey  = 'mySecretKey';

   const jwt = JWT.sign(jwtPayLoad,secretKey,jwtOptions);

  return jwt;
}

export default autorizationRoute;