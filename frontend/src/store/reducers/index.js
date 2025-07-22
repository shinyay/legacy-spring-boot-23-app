import { combineReducers } from 'redux';
import booksReducer from './booksReducer';
import inventoryReducer from './inventoryReducer';

const rootReducer = combineReducers({
  books: booksReducer,
  inventory: inventoryReducer,
});

export default rootReducer;