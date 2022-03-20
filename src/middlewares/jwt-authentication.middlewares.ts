import {Request, Response, NextFunction} from 'express';
import forbidenError from "../models/forbiden.error.model";
import tokenExpirationError from "../models/token.expiration.error.model";
import JWT from 'jsonwebtoken';

export default async function jwtAuthenticationMiddleware(req: Request, res: Response, next: NextFunction){

    try{

        const authorizationHeader = req.headers['authorization'];

        const url =   req.headers['URL'];

        if (!authorizationHeader){
            throw new forbidenError('Credenciais não informadas');
        }

        const [typeauthorization, token] = authorizationHeader.split(' ');
  
        if (typeauthorization != 'bearer' || !token )
        {
          throw new forbidenError('Tipo de autenticação inválido');   
        }

        try{

            const tokenPayLoad = JWT.verify(token,'mySecretKey');            
            if (typeof tokenPayLoad !== 'object'  || !tokenPayLoad.sub){
                throw new forbidenError('Token inválido.');    
            }          

            if (url?.indexOf("/token/refresh") === 0 ){
              if (tokenPayLoad.exp) {
                if (tokenPayLoad.exp <= (new Date().getTime() + 1) / 1000){
                   throw new tokenExpirationError('Token vencido.');
                }
              }
           }
    
            const uuid = tokenPayLoad.sub;            
    
            const user = {
                uuid     : tokenPayLoad.sub,
                userName : tokenPayLoad.username
            }

            req.user = user;   
            req.token = tokenPayLoad;

            next();
        }
        catch (error){
            throw new forbidenError('Token inválido.');
        }
        
    }catch(error){
        next(error);
    }
}