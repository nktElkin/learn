import { createSlice } from "@reduxjs/toolkit";

const initialStateCustomer = {
    name: '',
    Id: '',
    createdAt: null,
};


const customerSlice = createSlice({
    name: 'customer',
    initialState: initialStateCustomer,
    reducers: {
        createAccount: {
            prepare(name, nationalID){
                return {payload: {name, Id: nationalID}};
            },
            reducer(state, action){
                if(!action.payload.name || !action.payload.Id) return;
                state.name = action.payload.name.trim().charAt(0).toUpperCase() + action.payload.name.trim().toLowerCase().slice(1);
                state.Id = action.payload.Id.trim().toLowerCase();
                state.createdAt = new Date().toISOString();
            },
        },
        updateName: (state, action) => {
            state.name = action.payload.trim().charAt(0).toUpperCase() + action.payload.trim().toLowerCase().slice(1);
        }
    },
});

export const {updateName, createAccount} = customerSlice.actions;
export default customerSlice.reducer;






// export default function customerReduser(state = initialStateCustomer, action){
//     switch(action.type){
//         case 'customer/createAccount':
//             return {...state, name: action.payload.name, createdAt: action.payload.createdAt, Id: action.payload.Id};
//         case 'customer/upadateName':
//             return {...state, name: action.payload.name};
//         default:
//             return state;
//     }
// }



// store.dispatch(createCustomer('Pieter', '98249H8NK'))
// console.log(store.getState())
// store.dispatch(updateName('Peter'))
// console.log(store.getState())


//customer

// export function createCustomer(fullName, nationalID){
//     return {type: 'customer/createAccount', payload: {name: fullName, Id: nationalID, createdAt: new Date().toISOString()}}
// }
// export function updateName(fullName){
//     return {type: 'customer/upadateName', payload: {name: fullName}}
// }