import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import booksReducer from './reducers/booksReducer';
import inventoryReducer from './reducers/inventoryReducer';

const rootReducer = combineReducers({
  books: booksReducer,
  inventory: inventoryReducer,
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;