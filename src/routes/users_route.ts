import { Router, Request, Response, NextFunction } from "express";
import {StatusCodes} from 'http-status-codes';
import userRepository from "../repositories/user.repository";

const usersRoute = Router();
usersRoute.get('/users', async (req: Request, resp: Response, next: NextFunction) => {
    
    const users =  await userRepository.findAllUsers();
    resp.status(StatusCodes.OK).send(users);

});

usersRoute.get('/users/:uuid', async (req: Request<{uuid : string}>, resp: Response, next: NextFunction) => {
    try {
      const uuid =  req.params.uuid;
      const user =  await userRepository.findbyID(uuid);    
      resp.status(StatusCodes.OK).send(user);
    } catch (error){
      next(error);
    }
});

usersRoute.post('/users',async (req: Request, resp: Response, next: NextFunction) => {

    const newUser =  req.body;
    const uuid =  await userRepository.createUser(newUser);     
    resp.status(StatusCodes.CREATED).send(uuid);
});

usersRoute.put('/users/:uuid', async (req: Request<{uuid : string}>, resp: Response, next: NextFunction)  => {
    
    const uuid =  req.params.uuid;
    const modifiedUser =  req.body; 
    await userRepository.updateUser(modifiedUser);    
    resp.status(StatusCodes.OK).send();  
});

usersRoute.delete('/users/:uuid',async (req: Request<{uuid : string}>, resp: Response, next: NextFunction) => {

    const uuid =  req.params.uuid;
    await userRepository.removeUser(uuid);     
    resp.status(StatusCodes.OK).send(uuid);
});

export default usersRoute;