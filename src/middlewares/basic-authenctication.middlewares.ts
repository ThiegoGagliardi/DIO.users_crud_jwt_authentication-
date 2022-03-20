import { NextFunction, Request, Response } from "express";
import forbidenError from "../models/forbiden.error.model";
import userRepository from "../repositories/user.repository";

export default async function basicAuthenticationMiddleware(req : Request, resp : Response, next : NextFunction)
{

    try{

        const autorizationRouteHeader = req.headers['authorization'];

        if (!autorizationRouteHeader){
            throw new forbidenError('Credenciais não informadas');
        }
  
        const [typeAutantication, token] = autorizationRouteHeader.split(' ');
  
        if (typeAutantication != 'basic' || !token )
        {
          throw new forbidenError('Tipo de autenticação inválido');   
        }
  
       const tokenContest = Buffer.from(token,'base64').toString('utf-8');
       const [userName, passWord] = tokenContest.split(':');
  
       if ( !userName || !passWord) {
          throw new forbidenError('Credenciais não preenchidas'); 
       }
  
       const user = await userRepository.findByUserNameAndPassWord(userName,passWord);
  
       if (!user){
           throw new forbidenError('Usuário ou senha inválidos');         
       }
       
       req.user = user;
       next();

    }catch(error){
        next(error);
    }
}