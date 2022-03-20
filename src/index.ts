import express, {Request, Response, NextFunction} from 'express';
import usersRoute from './routes/users_route';
import statusRoute from './routes/statusRoute';
import autorizationRoute from './routes/authorization.route';
import jwtAuthenticationMiddleware from './middlewares/jwt-authentication.middlewares';
import errorHanddler from './middlewares/error-handler.middleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(statusRoute);
app.use(autorizationRoute);

app.use(jwtAuthenticationMiddleware);
app.use(usersRoute);

app.use(errorHanddler);
app.listen(3000, () => {
    console.log('Aplicação executando na porta 3000!');
});