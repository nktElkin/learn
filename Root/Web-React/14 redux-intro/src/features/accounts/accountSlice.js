import { createSlice } from "@reduxjs/toolkit";

const initialStateAccount = {
    balance: 0,
    loan: 0,
    loadPorpuse: '',
    isLoading: false
};


const accountSlice = createSlice({
    name: 'account',
    initialState: initialStateAccount,
    reducers: {
        deposit: (state, action) => {
            if(action.payload < 0) return;
            state.balance += +action.payload;
            state.isLoading = false;
        },
        withdraw: (state, action) => {
            if(action.payload > state.balance) return;
            state.balance -= action.payload;
        },
        requesetLoan: {
            // allo to prepare data before reducer
            prepare(amount, purpose){
                return {
                    payload: {amount, purpose}
                };
            },
            reducer(state, action){
            if(state.loan > 0) return;
            state.loan = +action.payload.amount;
            state.loadPorpuse = action.payload.purpose;
            state.balance += +action.payload.amount
            },
        },
        payLoan: (state) => {
            if(state.balance < state.loan) return;
            state.balance -= state.loan
            state.loan = 0;
            state.loadPorpuse = '';
        },
        convertingCurrency: (state) => {
            state.isLoading = true
        }
    }
});

console.log(accountSlice);
export const { withdraw, requesetLoan, payLoan } = accountSlice.actions;
export default accountSlice.reducer;



export function deposit(amount, currency = 'USD'){
    if(currency === 'USD') return {type: 'account/deposit', payload: amount};


    return async function(dispatch){
        dispatch({type: 'account/convertingCurrency'});
        //API call to convert
        const host = 'api.frankfurter.app';
        const res =  await fetch(`https://${host}/latest?amount=${amount}&from=${currency}&to=USD`)
        const data = await res.json();
        const convertedAmount = data.rates.USD;
        console.log(convertedAmount);
        // return
        dispatch({type: 'account/deposit', payload: convertedAmount});
    };
}