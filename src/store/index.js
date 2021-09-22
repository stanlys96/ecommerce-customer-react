import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './reducers/user';
import productReducer from './reducers/product';
import cartReducer from './reducers/cart';
import historyReducer from './reducers/transactionHistory';

const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
  cart: cartReducer,
  history: historyReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;