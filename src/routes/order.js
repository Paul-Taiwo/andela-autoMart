import express from 'express';
import orderController from '../controllers/order';
import checkAuth from '../middlewares/auth';

const Route = express.Router();

Route.post('/order', checkAuth, orderController.makeOrder);

export default Route;
