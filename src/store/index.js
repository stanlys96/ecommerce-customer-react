import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './reducers/user';
import productReducer from './reducers/product';

const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;