import {combineReducers, createStore} from 'redux';

const initialStateAccount = {
    balance: 0,
    loan: 0,
    loadPorpuse: '',
};
const initialStateCustomer = {
    name: '',
    Id: '',
    createdAt: null,
};

function accountReduser(state = initialStateAccount, action) {
    switch(action.type){
        case 'account/desposit':
            return {...state, balance: state.balance + action.payload};
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

function customerReduser(state = initialStateCustomer, action){
    switch(action.type){
        case 'customer/createAccount':
            return {...state, name: action.payload.name, createdAt: action.payload.createdAt, Id: action.payload.Id};
        case 'customer/upadateName':
            return {...state, name: action.payload.name};
        default:
            return state;
    }
}


const rootReduser = combineReducers({
    account: accountReduser,
    customer: customerReduser
})

const store = createStore(rootReduser);




store.dispatch(createCustomer('Pieter', '98249H8NK'))
console.log(store.getState())
store.dispatch(updateName('Peter'))
console.log(store.getState())

console.log(store.getState())
// store.dispatch({type: 'account/desposit', payload: 500})
store.dispatch(deposit(500));
console.log(store.getState())
// store.dispatch({type: 'account/requestLoan', payload: {amount: 1000, purpose: 'car'}});
store.dispatch(requesetLoan(1000, 'car repair'));
console.log(store.getState())
// store.dispatch({type: 'account/payLoan'})
store.dispatch(payLoan());
console.log(store.getState())
store.dispatch(withdraw(300));
console.log(store.getState())


//account

function deposit(amount){
    return {type: 'account/desposit', payload: amount};
}
function requesetLoan(amount, purpose){
    return {type: 'account/requestLoan', payload: {amount: amount, purpose: purpose}};
}
function payLoan(){
    return {type: 'account/payLoan'};
}
function withdraw(amount){
    return {type: 'account/withdraw', payload: amount};
}

//customer

function createCustomer(fullName, nationalID){
    return {type: 'customer/createAccount', payload: {name: fullName, Id: nationalID, createdAt: new Date().toISOString()}}
}
function updateName(fullName){
    return {type: 'customer/upadateName', payload: {name: fullName}}
}