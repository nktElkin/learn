import {applyMiddleware, combineReducers, createStore} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import accountReduser from './features/accounts/accountSlice.js';
import customerReduser from './features/customers/customerSlice.js';



const rootReduser = combineReducers({
    account: accountReduser,
    customer: customerReduser
})

const store = createStore(rootReduser, composeWithDevTools(applyMiddleware(thunk)));




export default store;
