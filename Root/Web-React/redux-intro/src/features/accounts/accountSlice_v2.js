const initialStateAccount = {
    balance: 0,
    loan: 0,
    loadPorpuse: '',
    isLoading: false
};


export default function accountReduser(state = initialStateAccount, action) {
    switch(action.type){
        case 'account/deposit':
            return {...state, balance: state.balance + action.payload, isLoading: false};
        case 'account/convertingCurrency':
            return {...state, isLoading: true};
        case 'account/withdraw':
            return {...state, balance: state.balance - action.payload};
        case 'account/requestLoan':
            if(state.loan > 0) return state;
            return {...state, loan: action.payload.amount, loadPorpuse: action.payload.purpose, balance: state.balance + action.payload.amount};
        case 'account/payLoan':
            return {...state, loadPorpuse: '', balance: state.balance - state.loan, loan: 0};
        default:
            return state;
    }
}

//account

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
export function requesetLoan(amount, purpose){
    return {type: 'account/requestLoan', payload: {amount: amount, purpose: purpose}};
}
export function payLoan(){
    return {type: 'account/payLoan'};
}
export function withdraw(amount){
    return {type: 'account/withdraw', payload: amount};
}
