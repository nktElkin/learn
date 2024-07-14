const initialStateCustomer = {
    name: 'Peter',
    Id: '34kj3',
    createdAt: null,
};

export default function customerReduser(state = initialStateCustomer, action){
    switch(action.type){
        case 'customer/createAccount':
            return {...state, name: action.payload.name, createdAt: action.payload.createdAt, Id: action.payload.Id};
        case 'customer/upadateName':
            return {...state, name: action.payload.name};
        default:
            return state;
    }
}



// store.dispatch(createCustomer('Pieter', '98249H8NK'))
// console.log(store.getState())
// store.dispatch(updateName('Peter'))
// console.log(store.getState())


//customer

export function createCustomer(fullName, nationalID){
    return {type: 'customer/createAccount', payload: {name: fullName, Id: nationalID, createdAt: new Date().toISOString()}}
}
export function updateName(fullName){
    return {type: 'customer/upadateName', payload: {name: fullName}}
}