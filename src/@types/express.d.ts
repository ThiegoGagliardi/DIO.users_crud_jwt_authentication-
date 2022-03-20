
import {user} from '../models/user';
import JWT from 'jsonwebtoken';

declare module 'express-serve-static-core'{
    interface Request{
        user?: user;
        token?: tokenPayLoad;
    }
}