import { combineReducers } from '@reduxjs/toolkit';
import ingredients from './slices/ingredientsSlice';
import user from './slices/userSlice';
import feeds from './slices/feedsSlice';
import burgerConstructor from './slices/burgerConstructorSlice';
import order from './slices/orderSlice';
import userOrders from './slices/userOrdersSlice';
import orderDetails from './slices/orderDetailsSlice';

const rootReducer = combineReducers({
  ingredients,
  user,
  feeds,
  burgerConstructor,
  order,
  userOrders,
  orderDetails
});

export default rootReducer;
