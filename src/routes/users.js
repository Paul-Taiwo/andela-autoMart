import express from 'express';
import validateSignUp from '../middlewares/validateSignUp';
import userController from '../controllers/users';

const Route = express.Router();

Route.post('/auth/signup', validateSignUp, userController.createUser);
Route.post('/auth/admin/signup', validateSignUp, userController.createUser);
Route.post('/auth/signin', userController.login);

export default Route;
