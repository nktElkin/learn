import {configureStore} from '@reduxjs/toolkit';
import accountReduser from './features/accounts/accountSlice.js';
import customerReduser from './features/customers/customerSlice.js';



const store = configureStore({
    reducer: {
        account: accountReduser,
        customer: customerReduser
    }
})



export default store;
