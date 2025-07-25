import { combineReducers } from 'redux';
import booksReducer from './booksReducer';
import inventoryReducer from './inventoryReducer';
import ordersReducer from './ordersReducer';

const rootReducer = combineReducers({
  books: booksReducer,
  inventory: inventoryReducer,
  orders: ordersReducer,
});

export default rootReducer;